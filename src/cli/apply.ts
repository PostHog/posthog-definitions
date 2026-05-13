import { listManagedDashboards } from "../client/dashboards.js";
import { listManagedInsights } from "../client/insights.js";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/http.js";
import { diff, type DiffResult } from "../apply/diff.js";
import { execute, SafetyViolationError } from "../apply/execute.js";
import { LoadError, loadDefinitions } from "../apply/load.js";
import { ValidationError, validate } from "../apply/validate.js";
import type { ApplyArgs } from "./args.js";

export async function runApply(args: ApplyArgs): Promise<number> {
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;

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

  try {
    validate(desired);
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  console.error(
    `Loaded ${desired.dashboards.length} dashboard(s) and ${desired.insights.length} insight(s) from ${args.dir}/`,
  );

  if (args.dryRun && desired.dashboards.length === 0 && desired.insights.length === 0) {
    console.log("Nothing to do.");
    return 0;
  }

  let current;
  try {
    const [insights, dashboards] = await Promise.all([
      listManagedInsights(config, { verbose: args.verbose }),
      listManagedDashboards(config, { verbose: args.verbose }),
    ]);
    current = { insights, dashboards };
  } catch (err) {
    return reportApiError(err, "while fetching current state");
  }

  const diffResult = diff(
    { dashboards: desired.dashboards.map((d) => d.spec), insights: desired.insights.map((i) => i.spec) },
    current,
  );

  printPlan(diffResult);

  if (args.dryRun) {
    console.log("\nDry run — no changes applied.");
    return 0;
  }

  try {
    const summary = await execute(config, diffResult, { verbose: args.verbose });
    console.log(
      `\nApplied: ${summary.insightsCreated + summary.dashboardsCreated} created, ` +
        `${summary.insightsUpdated + summary.dashboardsUpdated} updated, ` +
        `${summary.insightsUnchanged + summary.dashboardsUnchanged} unchanged.`,
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

function printPlan(result: DiffResult): void {
  const ins = countOps(result.insightOps);
  const dash = countOps(result.dashboardOps);
  console.log(`\nPlan:`);
  console.log(
    `  insights:   ${ins.create} to create, ${ins.update} to update, ${ins.unchanged} unchanged`,
  );
  console.log(
    `  dashboards: ${dash.create} to create, ${dash.update} to update, ${dash.unchanged} unchanged`,
  );
  if (result.orphanInsights.length > 0 || result.orphanDashboards.length > 0) {
    console.log(
      `  orphans:    ${result.orphanInsights.length} insight(s), ${result.orphanDashboards.length} dashboard(s) ` +
        `tagged iac:* with no matching source file (MVP leaves these alone)`,
    );
  }
  for (const op of result.insightOps) {
    if (op.kind !== "unchanged") console.log(`  ${op.kind} insight   ${op.key}`);
  }
  for (const op of result.dashboardOps) {
    if (op.kind !== "unchanged") console.log(`  ${op.kind} dashboard ${op.key}`);
  }
}

function countOps(
  ops: Array<{ kind: "create" | "update" | "unchanged" }>,
): { create: number; update: number; unchanged: number } {
  return ops.reduce(
    (acc, op) => {
      acc[op.kind]++;
      return acc;
    },
    { create: 0, update: 0, unchanged: 0 },
  );
}

function reportApiError(err: unknown, context: string): number {
  if (err instanceof ApiError) {
    console.error(`error: PostHog API ${context}: ${err.message}`);
    return 2;
  }
  throw err;
}
