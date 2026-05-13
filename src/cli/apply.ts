import { listManagedDashboards } from "../client/dashboards.js";
import { listManagedInsights } from "../client/insights.js";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/http.js";
import { diff } from "../apply/diff.js";
import { execute, SafetyViolationError } from "../apply/execute.js";
import { formatPlan } from "../apply/format-plan.js";
import { LoadError, loadDefinitions } from "../apply/load.js";
import { ValidationError, validate } from "../apply/validate.js";
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
  debug("definitions loaded", {
    dashboards: desired.dashboards.length,
    insights: desired.insights.length,
  });

  debug("validating definitions");
  try {
    validate(desired);
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  debug("validation passed");

  console.error(
    `Loaded ${desired.dashboards.length} dashboard(s) and ${desired.insights.length} insight(s) from ${args.dir}/`,
  );

  if (args.dryRun && desired.dashboards.length === 0 && desired.insights.length === 0) {
    console.log("Nothing to do.");
    return 0;
  }

  debug("fetching current server state");
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
  debug("current state fetched", {
    serverInsights: current.insights.length,
    serverDashboards: current.dashboards.length,
  });

  debug("diffing");
  const diffResult = diff(
    { dashboards: desired.dashboards.map((d) => d.spec), insights: desired.insights.map((i) => i.spec) },
    current,
  );
  debug("diff complete", {
    insightOps: diffResult.insightOps.length,
    dashboardOps: diffResult.dashboardOps.length,
    orphanInsights: diffResult.orphanInsights.length,
    orphanDashboards: diffResult.orphanDashboards.length,
  });

  console.log(formatPlan(diffResult, { serverInsights: current.insights }));

  if (args.dryRun) {
    console.log("\nDry run — no changes applied.");
    return 0;
  }

  debug("executing apply");
  try {
    const summary = await execute(config, diffResult, { verbose: args.verbose });
    debug("apply complete", { ...summary });
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

function reportApiError(err: unknown, context: string): number {
  if (err instanceof ApiError) {
    console.error(`error: PostHog API ${context}: ${err.message}`);
    return 2;
  }
  throw err;
}
