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
  deleteExperimentHoldout,
  getExperimentHoldout,
  listManagedExperimentHoldouts,
  type ServerExperimentHoldout,
} from "./client.js";
import {
  experimentHoldoutHash,
  experimentHoldoutHashFromServer,
  experimentHoldoutKeyFromServer,
  pruneExperimentHoldout,
  runExperimentHoldoutOp,
} from "./pipeline.js";
import { experimentHoldout, type ExperimentHoldout } from "./sdk.js";

function build(key: string, rollout: number): ExperimentHoldout {
  return experimentHoldout({
    key,
    name: `Acceptance holdout ${key}`,
    description: "Created by pipeline.acceptance.test.ts",
    filters: [{ properties: [], rollout_percentage: rollout }],
  });
}

function desiredFor(holdouts: ExperimentHoldout[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "feature-flags",
    "endpoints",
    "property-groups",
    "event-definitions",
  ]) {
    state.set(k, []);
  }
  state.set(
    "experiment-holdouts",
    holdouts.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("experiment-holdout pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real holdout", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperimentHoldout, number>(
      config,
      listManagedExperimentHoldouts,
      deleteExperimentHoldout,
      (row) => row.id,
      (row) => experimentHoldoutKeyFromServer(row),
      "acceptance-holdout-",
    );

    const key = uniqueKey("acceptance-holdout");
    const initial = build(key, 10);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runExperimentHoldoutOp(config, { kind: "create", spec: initial }, ctx);
      const serverId = ctx.experimentHoldoutIdByKey.get(key);
      expect(serverId).toBeDefined();
      registerCleanup(async () => {
        await deleteExperimentHoldout(config, serverId!).catch((err) => console.error("cleanup failed:", err));
      });

      const afterCreate = await getExperimentHoldout(config, serverId!);
      expect(experimentHoldoutKeyFromServer(afterCreate)).toBe(key);
      expect(experimentHoldoutHashFromServer(afterCreate)).toBe(experimentHoldoutHash(initial));

      // Re-diff fresh state — unchanged.
      const managed = await listManagedExperimentHoldouts(config);
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["property-groups", []],
          ["event-definitions", []],
          ["experiment-holdouts", managed],
        ]),
      );
      const op1 = result1
        .get("experiment-holdouts")!
        .ops.find((o) => (o.spec as ExperimentHoldout).key === key);
      expect(op1?.kind).toBe("unchanged");

      // Update rollout 10 → 25.
      const updated = build(key, 25);
      const updateOp: ResourceOp<ExperimentHoldout, ServerExperimentHoldout> = {
        kind: "update",
        spec: updated,
        server: afterCreate,
      };
      await runExperimentHoldoutOp(config, updateOp, ctx);

      const afterUpdate = await getExperimentHoldout(config, serverId!);
      expect(experimentHoldoutHashFromServer(afterUpdate)).toBe(experimentHoldoutHash(updated));

      const pruned = await pruneExperimentHoldout(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedExperimentHoldouts(config);
      expect(afterPrune.find((row) => experimentHoldoutKeyFromServer(row) === key)).toBe(undefined);
    });
  });
});
