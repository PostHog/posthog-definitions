import path from "node:path";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/typed.js";
import { RESOURCES } from "../resources/index.js";
import type { CollectionResourceModule, ResourceModule } from "../resources/types.js";
import { PickAbortedError, pickServerIds } from "../pull/picker.js";
import { runPull, type PullRunResult } from "../pull/run.js";
import type { PullArgs } from "./args.js";

export async function runPullCli(args: PullArgs): Promise<number> {
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;

  let config;
  try {
    config = loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      if (args.json) emitJson({ ok: false, error: err.message });
      else console.error(`error: ${err.message}`);
      return 3;
    }
    throw err;
  }

  // --- Resolve which resources to target -----------------------------------
  const pullable = RESOURCES.filter(isPullable);
  let targets: ReadonlyArray<ResourceModule<unknown, unknown>>;
  if (args.all || args.kinds.length === 0) {
    targets = pullable;
  } else {
    const byName = new Map(pullable.map((r) => [r.name, r]));
    const resolved: ResourceModule<unknown, unknown>[] = [];
    for (const kind of args.kinds) {
      const r = byName.get(kind);
      if (!r) {
        const message = `--kind "${kind}" is not a pullable resource. Pullable: ${[...byName.keys()].join(", ")}.`;
        if (args.json) emitJson({ ok: false, error: message });
        else console.error(`error: ${message}`);
        return 3;
      }
      resolved.push(r);
    }
    targets = resolved;
  }
  if (targets.length === 0) {
    if (args.json) emitJson({ ok: true, pulled: 0, byResource: {} });
    else console.log("Nothing to pull (no pullable resources matched).");
    return 0;
  }

  // --- Interactive selection per collection resource -----------------------
  // Singletons skip the picker — there's nothing to pick.
  const selectionByResource = new Map<string, Set<number | string>>();
  if (!args.allRows) {
    if (!process.stdin.isTTY) {
      const message =
        "pull is interactive by default. Pass --all-rows to import every row, or run from a terminal.";
      if (args.json) emitJson({ ok: false, error: message });
      else console.error(`error: ${message}`);
      return 3;
    }
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
          console.error("Aborted.");
          return 0;
        }
        if (err instanceof ApiError) {
          console.error(`error: PostHog API while listing ${resource.name}: ${err.message}`);
          return 2;
        }
        throw err;
      }
    }
    if (selectionByResource.size === 0 && !hasSingletonTarget(targets)) {
      console.log("No rows selected. Nothing to do.");
      return 0;
    }
  }

  try {
    const result = await runPull(config, {
      outDir: args.dir,
      resources: targets,
      selectionByResource,
      noCascade: args.noCascade,
      dryRun: args.dryRun,
      verbose: args.verbose,
    });
    if (args.json) emitJsonReport(result, args.dir, args.dryRun);
    else report(result, args.dir, args.dryRun);
    return 0;
  } catch (err) {
    if (err instanceof ApiError) {
      const message = `PostHog API while pulling: ${err.message}`;
      if (args.json) emitJson({ ok: false, error: message });
      else console.error(`error: ${message}`);
      return 2;
    }
    throw err;
  }
}

function emitJson(payload: unknown): void {
  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
}

function emitJsonReport(result: PullRunResult, dir: string, dryRun: boolean): void {
  const byResource: Record<
    string,
    {
      written: string[];
      tagged: number;
      skipped: Array<{ id: number | string; reason: string }>;
      filteredOut: Array<{ id: number | string; reason: string }>;
      warnings: string[];
    }
  > = {};
  let totalWritten = 0;
  let totalTagged = 0;
  for (const [name, rep] of result.byResource) {
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
  emitJson({
    ok: true,
    dryRun,
    dir: path.resolve(dir),
    totals: {
      written: dryRun ? 0 : totalWritten,
      tagged: dryRun ? 0 : totalTagged,
      dryRunPlanned: dryRun ? result.dryRunSkipped.length : 0,
    },
    dryRunPlanned: result.dryRunSkipped,
    byResource,
  });
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

function report(result: PullRunResult, dir: string, dryRun: boolean): void {
  const outDir = path.resolve(dir);
  if (dryRun) {
    console.log(`Dry run — ${result.dryRunSkipped.length} file(s) would be written under ${outDir}/`);
    for (const f of result.dryRunSkipped) console.log(`  would write ${path.relative(process.cwd(), f)}`);
    console.log("Server tags would not change (dry run).");
  } else {
    const totalWritten = [...result.byResource.values()].reduce(
      (acc, r) => acc + r.written.length,
      0,
    );
    console.log(`Wrote ${totalWritten} file(s) under ${outDir}/`);
    for (const rep of result.byResource.values()) {
      for (const f of rep.written) console.log(`  ${path.relative(process.cwd(), f)}`);
    }
    const totalTagged = [...result.byResource.values()].reduce((acc, r) => acc + r.tagged, 0);
    if (totalTagged > 0) {
      const parts: string[] = [];
      for (const rep of result.byResource.values()) {
        if (rep.tagged > 0) parts.push(`${rep.tagged} ${rep.name}`);
      }
      console.log(`Tagged on server: ${parts.join(", ")}.`);
    }
  }

  const allWarnings: string[] = [];
  for (const rep of result.byResource.values()) {
    for (const w of rep.warnings) allWarnings.push(`[${rep.name}] ${w}`);
    for (const s of rep.skippedReasons) allWarnings.push(`[${rep.name}] skipped ${s.id}: ${s.reason}`);
  }
  if (allWarnings.length > 0) {
    console.error(`\n${allWarnings.length} warning(s):`);
    for (const w of allWarnings) console.error(`  ${w}`);
  }
}
