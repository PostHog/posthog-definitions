import path from "node:path";
import type { ClientConfig } from "../client/config.js";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/typed.js";
import { RESOURCES } from "../resources/index.js";
import type { CollectionResourceModule, ResourceModule } from "../resources/types.js";
import { PickAbortedError, pickServerIds } from "../pull/picker.js";
import { runPull, type PullRunResult } from "../pull/run.js";
import type { PullArgs } from "./args.js";
import { exitCodeForError, type PullErr, type PullResult } from "./result.js";

/**
 * Top-level CLI entry. Splits responsibilities like apply.ts: the build
 * function returns a typed result for tests; this wrapper handles
 * interactive picking (TTY only), output formatting, and process exit.
 */
export async function runPullCli(args: PullArgs): Promise<number> {
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;

  let config: ClientConfig;
  try {
    config = loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      return emitAndExit(args, { ok: false, stage: "config", error: err.message });
    }
    throw err;
  }

  // Resolve targets up front so we can surface invalid-kind errors before
  // any API calls.
  const targetsResult = resolveTargets(args);
  if (!targetsResult.ok) return emitAndExit(args, targetsResult);
  const targets = targetsResult.value;

  // Build the selection map — either via picker (TTY) or by selecting
  // every filtered row when --all-rows is set.
  let selectionByResource: Map<string, Set<number | string>>;
  if (args.allRows) {
    selectionByResource = new Map();
  } else {
    if (!process.stdin.isTTY) {
      return emitAndExit(args, {
        ok: false,
        stage: "tty",
        error:
          "pull is interactive by default. Pass --all-rows to import every row, or run from a terminal.",
      });
    }
    const pickResult = await runInteractivePicker(config, targets, args);
    if (!pickResult.ok) return emitAndExit(args, pickResult);
    selectionByResource = pickResult.value;
    if (selectionByResource.size === 0 && !hasSingletonTarget(targets)) {
      if (args.json) {
        process.stdout.write(
          JSON.stringify(emptyPullResult(args.dir, args.dryRun), null, 2) + "\n",
        );
      } else {
        console.log("No rows selected. Nothing to do.");
      }
      return 0;
    }
  }

  const result = await buildPullResult(config, args, targets, selectionByResource);
  if (!result.ok) return emitAndExit(args, result);

  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return 0;
  }
  emitPullProse(result);
  return 0;
}

/**
 * Pure pipeline. Tests call this directly with a known config + targets.
 * No TTY interaction; callers must pre-select rows via `selectionByResource`
 * or pass an empty map (paired with allRows in the caller — runPull
 * treats an empty selection as "all filtered rows of each target").
 */
export async function buildPullResult(
  config: ClientConfig,
  args: PullArgs,
  targets: ReadonlyArray<ResourceModule<unknown, unknown>>,
  selectionByResource: Map<string, Set<number | string>>,
): Promise<PullResult> {
  try {
    const runResult = await runPull(config, {
      outDir: args.dir,
      resources: targets,
      selectionByResource,
      noCascade: args.noCascade,
      dryRun: args.dryRun,
      verbose: args.verbose,
    });
    return pullResultFromRun(runResult, args.dir, args.dryRun);
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        ok: false,
        stage: "pull",
        error: `PostHog API while pulling: ${err.message}`,
      };
    }
    throw err;
  }
}

/** Returns the pullable subset of RESOURCES, exposed for tests. */
export function listPullableResources(): ReadonlyArray<ResourceModule<unknown, unknown>> {
  return RESOURCES.filter(isPullable);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Resolved<T> = { ok: true; value: T } | PullErr;

function resolveTargets(
  args: PullArgs,
): Resolved<ReadonlyArray<ResourceModule<unknown, unknown>>> {
  const pullable = listPullableResources();
  if (args.all || args.kinds.length === 0) {
    return { ok: true, value: pullable };
  }
  const byName = new Map(pullable.map((r) => [r.name, r]));
  const resolved: ResourceModule<unknown, unknown>[] = [];
  for (const kind of args.kinds) {
    const r = byName.get(kind);
    if (!r) {
      return {
        ok: false,
        stage: "args",
        error: `--kind "${kind}" is not a pullable resource. Pullable: ${[...byName.keys()].join(", ")}.`,
      };
    }
    resolved.push(r);
  }
  return { ok: true, value: resolved };
}

async function runInteractivePicker(
  config: ClientConfig,
  targets: ReadonlyArray<ResourceModule<unknown, unknown>>,
  args: PullArgs,
): Promise<Resolved<Map<string, Set<number | string>>>> {
  const selectionByResource = new Map<string, Set<number | string>>();
  for (const resource of targets) {
    if (resource.kind !== "collection") continue;
    const cr = resource as CollectionResourceModule<unknown, unknown>;
    if (!cr.listAll) continue;
    try {
      const allRows = await cr.listAll(config, { verbose: args.verbose });
      const kept = allRows.filter((row) => (cr.pullFilter ? cr.pullFilter(row).kept : true));
      if (kept.length === 0) {
        console.log(`No importable ${cr.displayName}s in this project.`);
        continue;
      }
      const ids = await pickServerIds(cr, kept);
      if (ids.size > 0) selectionByResource.set(resource.name, ids);
    } catch (err) {
      if (err instanceof PickAbortedError) {
        return { ok: false, stage: "args", error: "Aborted." };
      }
      if (err instanceof ApiError) {
        return {
          ok: false,
          stage: "pull",
          error: `PostHog API while listing ${resource.name}: ${err.message}`,
        };
      }
      throw err;
    }
  }
  return { ok: true, value: selectionByResource };
}

type PullByResource = Extract<PullResult, { ok: true }>["byResource"];

function pullResultFromRun(
  runResult: PullRunResult,
  dir: string,
  dryRun: boolean,
): PullResult {
  const byResource: PullByResource = {};
  let totalWritten = 0;
  let totalTagged = 0;
  for (const [name, rep] of runResult.byResource) {
    byResource[name] = {
      written: rep.written,
      tagged: rep.tagged,
      skipped: rep.skippedReasons,
      filteredOut: rep.filteredOut,
      warnings: rep.warnings,
    };
    totalWritten += rep.written.length;
    totalTagged += rep.tagged;
  }
  return {
    ok: true,
    dryRun,
    dir: path.resolve(dir),
    totals: {
      written: dryRun ? 0 : totalWritten,
      tagged: dryRun ? 0 : totalTagged,
      dryRunPlanned: dryRun ? runResult.dryRunSkipped.length : 0,
    },
    dryRunPlanned: runResult.dryRunSkipped,
    byResource,
  };
}

function emptyPullResult(dir: string, dryRun: boolean): PullResult {
  return {
    ok: true,
    dryRun,
    dir: path.resolve(dir),
    totals: { written: 0, tagged: 0, dryRunPlanned: 0 },
    dryRunPlanned: [],
    byResource: {},
  };
}

function emitAndExit(args: PullArgs, result: PullErr): number {
  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    console.error(`error: ${result.error}`);
  }
  return exitCodeForError(result);
}

function emitPullProse(result: Extract<PullResult, { ok: true }>): void {
  if (result.dryRun) {
    console.log(`Dry run — ${result.totals.dryRunPlanned} file(s) would be written under ${result.dir}/`);
    for (const f of result.dryRunPlanned) console.log(`  would write ${path.relative(process.cwd(), f)}`);
    console.log("Server tags would not change (dry run).");
  } else {
    console.log(`Wrote ${result.totals.written} file(s) under ${result.dir}/`);
    for (const [, rep] of Object.entries(result.byResource)) {
      for (const f of rep.written) console.log(`  ${path.relative(process.cwd(), f)}`);
    }
    if (result.totals.tagged > 0) {
      const parts: string[] = [];
      for (const [name, rep] of Object.entries(result.byResource)) {
        if (rep.tagged > 0) parts.push(`${rep.tagged} ${name}`);
      }
      console.log(`Tagged on server: ${parts.join(", ")}.`);
    }
  }
  const allWarnings: string[] = [];
  for (const [name, rep] of Object.entries(result.byResource)) {
    for (const w of rep.warnings) allWarnings.push(`[${name}] ${w}`);
    for (const s of rep.skipped) allWarnings.push(`[${name}] skipped ${s.id}: ${s.reason}`);
  }
  if (allWarnings.length > 0) {
    console.error(`\n${allWarnings.length} warning(s):`);
    for (const w of allWarnings) console.error(`  ${w}`);
  }
}

function isPullable(resource: ResourceModule<unknown, unknown>): boolean {
  if (resource.kind === "collection") {
    return Boolean(resource.renderToFile && resource.listAll);
  }
  return Boolean(resource.renderToFile);
}

function hasSingletonTarget(
  targets: ReadonlyArray<ResourceModule<unknown, unknown>>,
): boolean {
  return targets.some((r) => r.kind === "singleton");
}
