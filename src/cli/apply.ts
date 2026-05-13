import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/http.js";
import { RESOURCES } from "../resources/index.js";
import { diff } from "../apply/diff.js";
import { execute, fetchCurrentState, SafetyViolationError } from "../apply/execute.js";
import { formatPlan } from "../apply/format-plan.js";
import { LoadError, loadDefinitions } from "../apply/load.js";
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
      console.error(`error: ${err.message}`);
      return 3;
    }
    throw err;
  }
  debug("config loaded", { host: config.host, projectId: config.projectId });

  debug("loading definitions", { dir: args.dir });
  let desired;
  try {
    desired = await loadDefinitions(args.dir);
  } catch (err) {
    if (err instanceof LoadError) {
      console.error(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const loadedCounts = describeCounts(desired);
  debug("definitions loaded", Object.fromEntries(loadedCounts));

  debug("validating definitions");
  const validation = validate(desired);
  if (!validation.ok) {
    const lines = validation.error.issues.map((i) => `${i.resource}: ${i.message}`);
    console.error(`error: Validation failed:\n - ${lines.join("\n - ")}`);
    return 1;
  }
  debug("validation passed");

  const summarySegments = RESOURCES.map(
    (r) => `${desired.get(r.name)?.length ?? 0} ${r.displayName}(s)`,
  );
  console.error(`Loaded ${summarySegments.join(" and ")} from ${args.dir}/`);

  const totalDesired = RESOURCES.reduce((sum, r) => sum + (desired.get(r.name)?.length ?? 0), 0);
  if (args.dryRun && totalDesired === 0) {
    console.log("Nothing to do.");
    return 0;
  }

  debug("fetching current server state");
  let current;
  try {
    current = await fetchCurrentState(config, { verbose: args.verbose });
  } catch (err) {
    return reportApiError(err, "while fetching current state");
  }
  debug(
    "current state fetched",
    Object.fromEntries(Array.from(current.entries()).map(([k, v]) => [k, v.length])),
  );

  debug("diffing");
  const diffResult = diff(desired, current);

  console.log(formatPlan(diffResult, { serverState: current, prune: args.prune }));

  if (args.dryRun) {
    console.log("\nDry run — no changes applied.");
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
    const prunedSegment = args.prune ? `, ${totalPruned} deleted` : "";
    console.log(
      `\nApplied: ${totalCreated} created, ${totalUpdated} updated, ${totalUnchanged} unchanged${prunedSegment}.`,
    );
    return 0;
  } catch (err) {
    if (err instanceof SafetyViolationError) {
      console.error(`error: ${err.message}`);
      return 2;
    }
    return reportApiError(err, "during apply");
  }
}

function describeCounts(desired: Map<string, Array<unknown>>): Array<[string, number]> {
  return Array.from(desired.entries()).map(([k, v]) => [k, v.length]);
}

function summaryToObject(summary: Map<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(summary.entries());
}

function reportApiError(err: unknown, context: string): number {
  if (err instanceof ApiError) {
    console.error(`error: PostHog API ${context}: ${err.message}`);
    return 2;
  }
  throw err;
}
