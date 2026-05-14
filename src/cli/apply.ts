import type { ClientConfig } from "../client/config.js";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/typed.js";
import { RESOURCES } from "../resources/index.js";
import { diff, type DiffResult } from "../apply/diff.js";
import { execute, fetchCurrentState, SafetyViolationError } from "../apply/execute.js";
import { formatPlan } from "../apply/format-plan.js";
import { type LoadFailure, loadDefinitions } from "../apply/load.js";
import { validate } from "../apply/validate.js";
import type { ApplyArgs } from "./args.js";
import { createDebug, debugEnabled } from "./debug.js";
import {
  type ApplyErr,
  type ApplyResult,
  exitCodeForError,
} from "./result.js";

/**
 * Top-level CLI entry: build the result, then emit either prose (default)
 * or JSON. Tests call `buildApplyResult` directly so they can assert on
 * the typed object without going through stdout.
 */
export async function runApply(args: ApplyArgs): Promise<number> {
  const debug = createDebug(debugEnabled(args.verbose));

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

  const result = await buildApplyResult(config, args, { debug });

  if (!result.ok) {
    return emitAndExit(args, result);
  }

  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return 0;
  }
  emitApplyProse(args, result);
  return 0;
}

export type BuildApplyOptions = {
  /** Optional debug logger; defaults to a no-op. */
  debug?: (msg: string, ctx?: Record<string, unknown>) => void;
};

/**
 * Pure pipeline: load → validate → fetch → diff → (optionally execute).
 * Returns a typed result regardless of `args.json`. Throws only on
 * unexpected errors (programmer bugs); operational failures land in the
 * `ApplyErr` branch.
 */
export async function buildApplyResult(
  config: ClientConfig,
  args: ApplyArgs,
  options: BuildApplyOptions = {},
): Promise<ApplyResult> {
  const debug = options.debug ?? (() => {});

  debug("loading definitions", { dir: args.dir });
  const loaded = await loadDefinitions(args.dir);
  if (!loaded.ok) {
    return { ok: false, stage: "load", error: describeLoadFailure(loaded.error) };
  }
  const desired = loaded.value;
  debug(
    "definitions loaded",
    Object.fromEntries(Array.from(desired.entries()).map(([k, v]) => [k, v.length])),
  );

  debug("validating definitions");
  const validation = validate(desired);
  if (!validation.ok) {
    return {
      ok: false,
      stage: "validate",
      error: `Validation failed: ${validation.error.issues
        .map((i) => `${i.resource}: ${i.message}`)
        .join("; ")}`,
      issues: validation.error.issues,
    };
  }
  debug("validation passed");

  const totalDesired = RESOURCES.reduce((sum, r) => sum + (desired.get(r.name)?.length ?? 0), 0);
  if (args.dryRun && totalDesired === 0) {
    return {
      ok: true,
      dryRun: true,
      applied: false,
      plan: { totalOps: 0, byResource: [] },
    };
  }

  debug("fetching current server state");
  let current;
  try {
    current = await fetchCurrentState(
      config,
      { verbose: args.verbose, prune: args.prune },
      undefined,
      desired,
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        ok: false,
        stage: "fetch",
        error: `PostHog API while fetching current state: ${err.message}`,
      };
    }
    throw err;
  }
  debug(
    "current state fetched",
    Object.fromEntries(Array.from(current.entries()).map(([k, v]) => [k, v.length])),
  );

  debug("diffing");
  const diffResult = diff(desired, current);

  if (args.dryRun) {
    return {
      ok: true,
      dryRun: true,
      applied: false,
      plan: planToJson(diffResult, args.prune),
    };
  }

  debug("executing apply", { prune: args.prune });
  try {
    const summary = await execute(config, diffResult, {
      verbose: args.verbose,
      prune: args.prune,
    });
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalUnchanged = 0;
    let totalPruned = 0;
    const byResource: Record<
      string,
      { created: number; updated: number; unchanged: number; pruned: number }
    > = {};
    for (const [name, counts] of summary) {
      totalCreated += counts.created;
      totalUpdated += counts.updated;
      totalUnchanged += counts.unchanged;
      totalPruned += counts.pruned;
      byResource[name] = { ...counts };
    }
    return {
      ok: true,
      dryRun: false,
      applied: true,
      totals: {
        created: totalCreated,
        updated: totalUpdated,
        unchanged: totalUnchanged,
        pruned: totalPruned,
      },
      byResource,
    };
  } catch (err) {
    if (err instanceof SafetyViolationError) {
      return { ok: false, stage: "apply", error: err.message };
    }
    if (err instanceof ApiError) {
      return { ok: false, stage: "apply", error: `PostHog API during apply: ${err.message}` };
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Output rendering
// ---------------------------------------------------------------------------

function emitAndExit(args: ApplyArgs, result: ApplyErr): number {
  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    if (result.stage === "validate" && result.issues) {
      const lines = result.issues.map((i) => `${i.resource}: ${i.message}`);
      console.error(`error: Validation failed:\n - ${lines.join("\n - ")}`);
    } else {
      console.error(`error: ${result.error}`);
    }
  }
  return exitCodeForError(result);
}

function emitApplyProse(
  args: ApplyArgs,
  result: Extract<ApplyResult, { ok: true }>,
): void {
  // Load summary header is built fresh from RESOURCES — it's a UX nicety
  // for the prose path, not part of the structured contract.
  if (result.dryRun) {
    if (result.plan.totalOps === 0) {
      console.log("Nothing to do.");
      return;
    }
    // Re-fetch/diff to reuse formatPlan would double the API work; the
    // structured plan is enough to summarize here.
    for (const r of result.plan.byResource) {
      const segs: string[] = [];
      if (r.create) segs.push(`${r.create} create`);
      if (r.update) segs.push(`${r.update} update`);
      if (r.orphans) segs.push(`${r.orphans} delete`);
      if (segs.length > 0) console.log(`${r.resource}: ${segs.join(", ")}`);
    }
    console.log(`\nDry run — ${result.plan.totalOps} change(s) planned.`);
    return;
  }
  const prunedSegment = args.prune ? `, ${result.totals.pruned} deleted` : "";
  console.log(
    `Applied: ${result.totals.created} created, ${result.totals.updated} updated, ${result.totals.unchanged} unchanged${prunedSegment}.`,
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function planToJson(
  diffResult: DiffResult,
  prune: boolean,
): { totalOps: number; byResource: Array<{ resource: string; create: number; update: number; unchanged: number; orphans: number }> } {
  const byResource: Array<{
    resource: string;
    create: number;
    update: number;
    unchanged: number;
    orphans: number;
  }> = [];
  let totalOps = 0;
  for (const [resourceName, slice] of diffResult) {
    let create = 0;
    let update = 0;
    let unchanged = 0;
    for (const op of slice.ops) {
      if (op.kind === "create") create++;
      else if (op.kind === "update") update++;
      else unchanged++;
    }
    const orphans = prune ? slice.orphans.length : 0;
    totalOps += create + update + orphans;
    byResource.push({ resource: resourceName, create, update, unchanged, orphans });
  }
  return { totalOps, byResource };
}

function describeLoadFailure(failure: LoadFailure): string {
  if (failure.kind === "unknown-shape") {
    return `${failure.file}: default export does not match any known resource shape. Got: ${failure.sample}`;
  }
  if (failure.kind === "inline-collision") {
    return `${failure.resourceDisplayName} key "${failure.key}" is defined in multiple places (${failure.firstPath} and inline in ${failure.secondPath}). Keys must be unique.`;
  }
  return `${failure.resourceDisplayName} is a singleton but was declared in multiple files (${failure.firstPath} and ${failure.secondPath}). Declare it in exactly one place.`;
}

// Exported for the smoke-cleanup script and other callers that want the
// rich plan formatter (used to be the default for non-JSON apply).
export { formatPlan };
