/**
 * Smoke-test cleanup: delete every smoke-created server row. Each kind has
 * an optional `--<kind>=<key>` flag; missing flags are skipped.
 *
 *   pnpm tsx scripts/smoke-cleanup.ts \
 *     --experiment=<k> --feature-flag=<k> --experiment-holdout=<k> \
 *     --experiment-saved-metric=<k> --dashboard=<k> --insight=<k> \
 *     --event-definition=<k> --property-group=<k> --cohort=<k> \
 *     --endpoint=<k>
 *
 * Order matters: experiments must drop before their referenced flag/
 * holdout/saved-metric, dashboards before their tile-insights, event-
 * definitions before their property-groups. Each delete goes through the
 * resource's pipeline `prune*` helper, which does an identity check
 * before issuing the DELETE — so a misclicked key can't take out
 * something unrelated.
 */
import { loadConfig } from "../src/client/config.js";

// --- Imports per resource ---------------------------------------------------

import { listManagedExperiments } from "../src/resources/experiment/client.js";
import {
  experimentKeyFromServer,
  pruneExperiment,
} from "../src/resources/experiment/pipeline.js";

import { listManagedFeatureFlags } from "../src/resources/feature-flag/client.js";
import {
  featureFlagKeyFromTags,
  pruneFeatureFlag,
} from "../src/resources/feature-flag/pipeline.js";

import { listManagedExperimentHoldouts } from "../src/resources/experiment-holdout/client.js";
import {
  experimentHoldoutKeyFromServer,
  pruneExperimentHoldout,
} from "../src/resources/experiment-holdout/pipeline.js";

import { listManagedExperimentSavedMetrics } from "../src/resources/experiment-saved-metric/client.js";
import {
  experimentSavedMetricKeyFromServer,
  pruneExperimentSavedMetric,
} from "../src/resources/experiment-saved-metric/pipeline.js";

import { listManagedDashboards } from "../src/resources/dashboard/client.js";
import {
  dashboardKeyFromTags,
  pruneDashboard,
} from "../src/resources/dashboard/pipeline.js";

import { listManagedInsights } from "../src/resources/insight/client.js";
import {
  insightKeyFromTags,
  pruneInsight,
} from "../src/resources/insight/pipeline.js";

import { listManagedEventDefinitions } from "../src/resources/event-definition/client.js";
import {
  eventDefinitionKeyFromTags,
  pruneEventDefinition,
} from "../src/resources/event-definition/pipeline.js";

import { listManagedPropertyGroups } from "../src/resources/property-group/client.js";
import {
  propertyGroupKeyFromServer,
  prunePropertyGroup,
} from "../src/resources/property-group/pipeline.js";

import { listManagedCohorts } from "../src/resources/cohort/client.js";
import { cohortKeyFromServer, pruneCohort } from "../src/resources/cohort/pipeline.js";

import { listManagedEndpoints } from "../src/resources/endpoint/client.js";
import {
  endpointKeyFromServer,
  pruneEndpoint,
} from "../src/resources/endpoint/pipeline.js";

import { listManagedActions } from "../src/resources/action/client.js";
import {
  actionKeyFromTags,
  pruneAction,
} from "../src/resources/action/pipeline.js";

import { listManagedWarehouseSavedQueries } from "../src/resources/warehouse-saved-query/client.js";
import {
  warehouseSavedQueryKeyFromServer,
  pruneWarehouseSavedQuery,
} from "../src/resources/warehouse-saved-query/pipeline.js";

import type { ClientConfig } from "../src/client/config.js";

type Args = {
  experiment?: string;
  "feature-flag"?: string;
  "experiment-holdout"?: string;
  "experiment-saved-metric"?: string;
  dashboard?: string;
  insight?: string;
  "event-definition"?: string;
  action?: string;
  "property-group"?: string;
  cohort?: string;
  endpoint?: string;
  "warehouse-saved-query"?: string;
};

const ARG_KEYS: Array<keyof Args> = [
  "experiment",
  "feature-flag",
  "experiment-holdout",
  "experiment-saved-metric",
  "dashboard",
  "insight",
  "event-definition",
  "action",
  "property-group",
  "cohort",
  "endpoint",
  "warehouse-saved-query",
];

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  for (const a of argv) {
    const eq = a.indexOf("=");
    if (eq < 0 || !a.startsWith("--")) continue;
    const k = a.slice(2, eq) as keyof Args;
    const v = a.slice(eq + 1);
    if (!v) continue;
    if (ARG_KEYS.includes(k)) out[k] = v;
  }
  return out;
}

async function deleteByKey<T>(
  label: string,
  key: string,
  config: ClientConfig,
  list: (config: ClientConfig) => Promise<T[]>,
  keyOf: (row: T) => string | undefined,
  prune: (config: ClientConfig, row: T) => Promise<boolean>,
): Promise<void> {
  let rows: T[];
  try {
    rows = await list(config);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.log(`${label} ${key}: list failed (${reason.split("\n")[0]})`);
    return;
  }
  const target = rows.find((r) => keyOf(r) === key);
  if (!target) {
    console.log(`${label} ${key}: not found`);
    return;
  }
  try {
    const ok = await prune(config, target);
    console.log(`${label} ${key}: ${ok ? "deleted" : "skipped"}`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.log(`${label} ${key}: delete blocked (${reason.split("\n")[0]})`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig();

  // Order matters — dependents before their deps.
  if (args["experiment"]) {
    await deleteByKey(
      "experiment",
      args["experiment"],
      config,
      listManagedExperiments,
      (row) => experimentKeyFromServer(row),
      (c, row) => pruneExperiment(c, row),
    );
  }
  if (args["feature-flag"]) {
    await deleteByKey(
      "feature-flag",
      args["feature-flag"],
      config,
      listManagedFeatureFlags,
      (row) => featureFlagKeyFromTags(row.tags),
      (c, row) => pruneFeatureFlag(c, row),
    );
  }
  if (args["experiment-holdout"]) {
    await deleteByKey(
      "experiment-holdout",
      args["experiment-holdout"],
      config,
      listManagedExperimentHoldouts,
      (row) => experimentHoldoutKeyFromServer(row),
      (c, row) => pruneExperimentHoldout(c, row),
    );
  }
  if (args["experiment-saved-metric"]) {
    await deleteByKey(
      "experiment-saved-metric",
      args["experiment-saved-metric"],
      config,
      listManagedExperimentSavedMetrics,
      (row) => experimentSavedMetricKeyFromServer(row),
      (c, row) => pruneExperimentSavedMetric(c, row),
    );
  }
  if (args["dashboard"]) {
    await deleteByKey(
      "dashboard",
      args["dashboard"],
      config,
      listManagedDashboards,
      (row) => dashboardKeyFromTags(row.tags),
      (c, row) => pruneDashboard(c, row),
    );
  }
  if (args["insight"]) {
    await deleteByKey(
      "insight",
      args["insight"],
      config,
      listManagedInsights,
      (row) => insightKeyFromTags(row.tags),
      (c, row) => pruneInsight(c, row),
    );
  }
  if (args["event-definition"]) {
    await deleteByKey(
      "event-definition",
      args["event-definition"],
      config,
      listManagedEventDefinitions,
      (row) => eventDefinitionKeyFromTags(row.tags),
      (c, row) => pruneEventDefinition(c, row),
    );
  }
  if (args["action"]) {
    await deleteByKey(
      "action",
      args["action"],
      config,
      listManagedActions,
      (row) => actionKeyFromTags(row.tags),
      (c, row) => pruneAction(c, row),
    );
  }
  if (args["property-group"]) {
    await deleteByKey(
      "property-group",
      args["property-group"],
      config,
      listManagedPropertyGroups,
      (row) => propertyGroupKeyFromServer(row),
      (c, row) => prunePropertyGroup(c, row),
    );
  }
  if (args["cohort"]) {
    await deleteByKey(
      "cohort",
      args["cohort"],
      config,
      listManagedCohorts,
      (row) => cohortKeyFromServer(row),
      (c, row) => pruneCohort(c, row),
    );
  }
  if (args["endpoint"]) {
    await deleteByKey(
      "endpoint",
      args["endpoint"],
      config,
      listManagedEndpoints,
      (row) => endpointKeyFromServer(row),
      (c, row) => pruneEndpoint(c, row),
    );
  }
  if (args["warehouse-saved-query"]) {
    await deleteByKey(
      "warehouse-saved-query",
      args["warehouse-saved-query"],
      config,
      listManagedWarehouseSavedQueries,
      (row) => warehouseSavedQueryKeyFromServer(row),
      (c, row) => pruneWarehouseSavedQuery(c, row),
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
