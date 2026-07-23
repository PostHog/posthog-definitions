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

import type { ClientConfig } from "../src/client/config.js";

// --- Cleanup registry -------------------------------------------------------
//
// One entry per resource: the `--<flag>=<key>` argument it reads, plus the
// list / key-extraction / prune wrappers `deleteByKey` needs. Adding a
// resource is one import group above + one `entry(...)` row below.
//
// Order is dependents-first: an entry that references another resource must
// appear before it, so the reference is gone before the referent is deleted
// (experiments before their flag / holdout / saved-metric, dashboards before
// their tile-insights, event-definitions before their property-groups). Each
// delete goes through the resource's pipeline `prune*` helper, which does an
// identity check before issuing the DELETE — so a misclicked key can't take
// out something unrelated.

type CleanupEntry = {
  flag: string;
  run: (key: string, config: ClientConfig) => Promise<void>;
};

function entry<T>(
  flag: string,
  list: (config: ClientConfig) => Promise<T[]>,
  keyOf: (row: T) => string | undefined,
  prune: (config: ClientConfig, row: T) => Promise<boolean>,
): CleanupEntry {
  return {
    flag,
    run: (key, config) => deleteByKey(flag, key, config, list, keyOf, prune),
  };
}

const CLEANUP_REGISTRY: CleanupEntry[] = [
  entry(
    "experiment",
    listManagedExperiments,
    (row) => experimentKeyFromServer(row),
    (c, row) => pruneExperiment(c, row),
  ),
  entry(
    "feature-flag",
    listManagedFeatureFlags,
    (row) => featureFlagKeyFromTags(row.tags),
    (c, row) => pruneFeatureFlag(c, row),
  ),
  entry(
    "experiment-holdout",
    listManagedExperimentHoldouts,
    (row) => experimentHoldoutKeyFromServer(row),
    (c, row) => pruneExperimentHoldout(c, row),
  ),
  entry(
    "experiment-saved-metric",
    listManagedExperimentSavedMetrics,
    (row) => experimentSavedMetricKeyFromServer(row),
    (c, row) => pruneExperimentSavedMetric(c, row),
  ),
  entry(
    "dashboard",
    listManagedDashboards,
    (row) => dashboardKeyFromTags(row.tags),
    (c, row) => pruneDashboard(c, row),
  ),
  entry(
    "insight",
    listManagedInsights,
    (row) => insightKeyFromTags(row.tags),
    (c, row) => pruneInsight(c, row),
  ),
  entry(
    "event-definition",
    listManagedEventDefinitions,
    (row) => eventDefinitionKeyFromTags(row.tags),
    (c, row) => pruneEventDefinition(c, row),
  ),
  entry(
    "action",
    listManagedActions,
    (row) => actionKeyFromTags(row.tags),
    (c, row) => pruneAction(c, row),
  ),
  entry(
    "property-group",
    listManagedPropertyGroups,
    (row) => propertyGroupKeyFromServer(row),
    (c, row) => prunePropertyGroup(c, row),
  ),
  entry(
    "cohort",
    listManagedCohorts,
    (row) => cohortKeyFromServer(row),
    (c, row) => pruneCohort(c, row),
  ),
  entry(
    "endpoint",
    listManagedEndpoints,
    (row) => endpointKeyFromServer(row),
    (c, row) => pruneEndpoint(c, row),
  ),
];

const CLEANUP_FLAGS = new Set(CLEANUP_REGISTRY.map((e) => e.flag));

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of argv) {
    const eq = a.indexOf("=");
    if (eq < 0 || !a.startsWith("--")) continue;
    const k = a.slice(2, eq);
    const v = a.slice(eq + 1);
    if (!v) continue;
    if (CLEANUP_FLAGS.has(k)) out[k] = v;
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

  // Registry order is dependents-first, so this loop deletes in a safe order.
  for (const { flag, run } of CLEANUP_REGISTRY) {
    const key = args[flag];
    if (key) await run(key, config);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
