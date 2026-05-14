import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  deleteFeatureFlag,
  getFeatureFlag,
  listManagedFeatureFlags,
  type ServerFeatureFlag,
} from "./client.js";
import {
  featureFlagHash,
  featureFlagHashFromTags,
  featureFlagKeyFromTags,
  featureFlagTag,
  pruneFeatureFlag,
  runFeatureFlagOp,
} from "./pipeline.js";
import type { FeatureFlag } from "./sdk.js";

function build(key: string, rollout: number): FeatureFlag {
  return {
    key,
    name: `Acceptance flag ${key}`,
    active: true,
    filters: { groups: [{ properties: [], rollout_percentage: rollout }] },
  };
}

function desiredFor(flags: FeatureFlag[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set(
    "feature-flags",
    flags.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("feature-flag pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real flag", async () => {
    const config = loadAcceptanceConfig();
    await purgeStale(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      featureFlagKeyFromTags,
      "acceptance-flag-",
    );

    const key = uniqueKey("acceptance-flag");
    const initial = build(key, 100);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runFeatureFlagOp(config, { kind: "create", spec: initial }, ctx);

      const managed = await listManagedFeatureFlags(config);
      const created = managed.find((row) => featureFlagKeyFromTags(row.tags) === key);
      if (!created) throw new Error(`flag ${key} not visible after create`);
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      expect(created.tags?.includes(featureFlagTag(key))).toBeTruthy();
      expect(featureFlagHashFromTags(created.tags)).toBe(featureFlagHash(initial));

      // Re-diff against fresh server state — should be unchanged.
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", managed],
        ]),
      );
      const op1 = result1
        .get("feature-flags")!
        .ops.find((o) => (o.spec as FeatureFlag).key === key);
      expect(op1?.kind).toBe("unchanged");

      // Update rollout from 100 → 50.
      const updated = build(key, 50);
      const updateOp: ResourceOp<FeatureFlag, ServerFeatureFlag> = {
        kind: "update",
        spec: updated,
        server: created,
      };
      await runFeatureFlagOp(config, updateOp, ctx);

      const afterUpdate = await getFeatureFlag(config, created.id);
      expect(featureFlagHashFromTags(afterUpdate.tags)).toBe(featureFlagHash(updated));
      expect(featureFlagHashFromTags(afterUpdate.tags)).not.toBe(featureFlagHash(initial));

      // Re-diff against the updated server — should be unchanged again.
      const managedAgain = await listManagedFeatureFlags(config);
      const result2 = diff(
        desiredFor([updated]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", managedAgain],
        ]),
      );
      const op2 = result2
        .get("feature-flags")!
        .ops.find((o) => (o.spec as FeatureFlag).key === key);
      expect(op2?.kind).toBe("unchanged");

      const pruned = await pruneFeatureFlag(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedFeatureFlags(config);
      expect(afterPrune.find((row) => featureFlagKeyFromTags(row.tags) === key)).toBe(undefined);
    });
  });
});
