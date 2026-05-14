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

export async function runApply(args: ApplyArgs): Promise<number> {
  const debug = createDebug(debugEnabled(args.verbose));

  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;

  debug("loading config", { host: overrides.host, project: overrides.projectId });
  let config;
  try {
    config = loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      return reportError(args, err.message, 3);
    }
    throw err;
  }
  debug("config loaded", { host: config.host, projectId: config.projectId });

  debug("loading definitions", { dir: args.dir });
  const loaded = await loadDefinitions(args.dir);
  if (!loaded.ok) {
    return reportError(args, describeLoadFailure(loaded.error), 1);
  }
  const desired = loaded.value;
  const loadedCounts = describeCounts(desired);
  debug("definitions loaded", Object.fromEntries(loadedCounts));

  debug("validating definitions");
  const validation = validate(desired);
  if (!validation.ok) {
    const lines = validation.error.issues.map((i) => `${i.resource}: ${i.message}`);
    if (args.json) {
      emitJson({ ok: false, stage: "validate", issues: validation.error.issues });
    } else {
      console.error(`error: Validation failed:\n - ${lines.join("\n - ")}`);
    }
    return 1;
  }
  debug("validation passed");

  if (!args.json) {
    const summarySegments = RESOURCES.map(
      (r) => `${desired.get(r.name)?.length ?? 0} ${r.displayName}(s)`,
    );
    console.error(`Loaded ${summarySegments.join(" and ")} from ${args.dir}/`);
  }

  const totalDesired = RESOURCES.reduce((sum, r) => sum + (desired.get(r.name)?.length ?? 0), 0);
  if (args.dryRun && totalDesired === 0) {
    if (args.json) {
      emitJson({
        ok: true,
        dryRun: true,
        applied: false,
        plan: { totalOps: 0, byResource: [] },
      });
    } else {
      console.log("Nothing to do.");
    }
    return 0;
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
    return reportApiError(args, err, "while fetching current state");
  }
  debug(
    "current state fetched",
    Object.fromEntries(Array.from(current.entries()).map(([k, v]) => [k, v.length])),
  );

  debug("diffing");
  const diffResult = diff(desired, current);

  if (!args.json) {
    console.log(formatPlan(diffResult, { serverState: current, prune: args.prune }));
  }

  if (args.dryRun) {
    if (args.json) {
      emitJson({
        ok: true,
        dryRun: true,
        applied: false,
        plan: planToJson(diffResult, args.prune),
      });
    } else {
      console.log("\nDry run — no changes applied.");
    }
    return 0;
  }

  debug("executing apply", { prune: args.prune });
  try {
    const summary = await execute(config, diffResult, {
      verbose: args.verbose,
      prune: args.prune,
    });
    debug("apply complete", summaryToObject(summary));
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalUnchanged = 0;
    let totalPruned = 0;
    for (const counts of summary.values()) {
      totalCreated += counts.created;
      totalUpdated += counts.updated;
      totalUnchanged += counts.unchanged;
      totalPruned += counts.pruned;
    }
    if (args.json) {
      emitJson({
        ok: true,
        dryRun: false,
        applied: true,
        totals: {
          created: totalCreated,
          updated: totalUpdated,
          unchanged: totalUnchanged,
          pruned: totalPruned,
        },
        byResource: Object.fromEntries(summary.entries()),
      });
    } else {
      const prunedSegment = args.prune ? `, ${totalPruned} deleted` : "";
      console.log(
        `\nApplied: ${totalCreated} created, ${totalUpdated} updated, ${totalUnchanged} unchanged${prunedSegment}.`,
      );
    }
    return 0;
  } catch (err) {
    if (err instanceof SafetyViolationError) {
      return reportError(args, err.message, 2);
    }
    return reportApiError(args, err, "during apply");
  }
}

function emitJson(payload: unknown): void {
  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
}

function reportError(args: ApplyArgs, message: string, code: number): number {
  if (args.json) {
    emitJson({ ok: false, error: message });
  } else {
    console.error(`error: ${message}`);
  }
  return code;
}

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

function describeCounts(desired: Map<string, Array<unknown>>): Array<[string, number]> {
  return Array.from(desired.entries()).map(([k, v]) => [k, v.length]);
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

function summaryToObject(summary: Map<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(summary.entries());
}

function reportApiError(args: ApplyArgs, err: unknown, context: string): number {
  if (err instanceof ApiError) {
    return reportError(args, `PostHog API ${context}: ${err.message}`, 2);
  }
  throw err;
}
