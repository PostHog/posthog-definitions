import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  deleteExperimentSavedMetric,
  getExperimentSavedMetric,
  listManagedExperimentSavedMetrics,
  type ServerExperimentSavedMetric,
} from "./client.js";
import {
  experimentSavedMetricHash,
  experimentSavedMetricHashFromServer,
  experimentSavedMetricKeyFromServer,
  pruneExperimentSavedMetric,
  runExperimentSavedMetricOp,
} from "./pipeline.js";
import { experimentSavedMetric, type ExperimentSavedMetric } from "./sdk.js";

function build(key: string, event: string): ExperimentSavedMetric {
  return experimentSavedMetric({
    key,
    name: `Acceptance metric ${key}`,
    description: "Created by pipeline.acceptance.test.ts",
    query: {
      kind: "ExperimentMetric",
      metric_type: "mean",
      source: { kind: "EventsNode", event },
    },
  });
}

function desiredFor(metrics: ExperimentSavedMetric[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "feature-flags",
    "endpoints",
    "property-groups",
    "event-definitions",
    "experiment-holdouts",
  ]) {
    state.set(k, []);
  }
  state.set(
    "experiment-saved-metrics",
    metrics.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("experiment-saved-metric pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real saved metric", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperimentSavedMetric, number>(
      config,
      listManagedExperimentSavedMetrics,
      deleteExperimentSavedMetric,
      (row) => row.id,
      (row) => experimentSavedMetricKeyFromServer(row),
      "acceptance-savedmetric-",
    );

    const key = uniqueKey("acceptance-savedmetric");
    const initial = build(key, "user_signed_up");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runExperimentSavedMetricOp(config, { kind: "create", spec: initial }, ctx);
      const serverId = ctx.experimentSavedMetricIdByKey.get(key);
      expect(serverId).toBeDefined();
      registerCleanup(async () => {
        await deleteExperimentSavedMetric(config, serverId!).catch(() => undefined);
      });

      const afterCreate = await getExperimentSavedMetric(config, serverId!);
      expect(experimentSavedMetricKeyFromServer(afterCreate)).toBe(key);
      expect(experimentSavedMetricHashFromServer(afterCreate)).toBe(
        experimentSavedMetricHash(initial),
      );

      const managed = await listManagedExperimentSavedMetrics(config);
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["property-groups", []],
          ["event-definitions", []],
          ["experiment-holdouts", []],
          ["experiment-saved-metrics", managed],
        ]),
      );
      const op1 = result1
        .get("experiment-saved-metrics")!
        .ops.find((o) => (o.spec as ExperimentSavedMetric).key === key);
      expect(op1?.kind).toBe("unchanged");

      const updated = build(key, "user_logged_in");
      const updateOp: ResourceOp<ExperimentSavedMetric, ServerExperimentSavedMetric> = {
        kind: "update",
        spec: updated,
        server: afterCreate,
      };
      await runExperimentSavedMetricOp(config, updateOp, ctx);

      const afterUpdate = await getExperimentSavedMetric(config, serverId!);
      expect(experimentSavedMetricHashFromServer(afterUpdate)).toBe(
        experimentSavedMetricHash(updated),
      );

      const pruned = await pruneExperimentSavedMetric(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedExperimentSavedMetrics(config);
      expect(afterPrune.find((row) => experimentSavedMetricKeyFromServer(row) === key)).toBe(
        undefined,
      );
    });
  });
});
