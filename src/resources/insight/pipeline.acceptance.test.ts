import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import { deleteInsight, getInsight, listManagedInsights } from "./client.js";
import {
  insightHash,
  insightHashFromTags,
  insightKeyFromTags,
  insightTag,
  pruneInsight,
  runInsightOp,
} from "./pipeline.js";
import { type Insight } from "./sdk.js";

function buildInsight(key: string, event: string): Insight {
  return {
    key,
    name: `Acceptance insight ${key}`,
    description: "Created by pipeline.acceptance.test.ts",
    query: { kind: "TrendsQuery", series: [{ kind: "EventsNode", event }] },
  };
}

function desiredFor(insights: Insight[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "insights",
    insights.map((spec) => ({ path: "<acceptance>", spec })),
  );
  state.set("dashboards", []);
  return state;
}

describe("insight pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real insight", async () => {
    const config = loadAcceptanceConfig();
    await purgeStale(
      config,
      listManagedInsights,
      deleteInsight,
      insightKeyFromTags,
      "acceptance-insight-",
    );

    const key = uniqueKey("acceptance-insight");
    const initial = buildInsight(key, "user signed up");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      const createOp: ResourceOp<Insight, never> = { kind: "create", spec: initial };
      await runInsightOp(config, createOp, ctx);

      const serverId = ctx.insightIdByKey.get(key);
      expect(serverId).toBeDefined();
      registerCleanup(async () => {
        await deleteInsight(config, serverId!).catch((err) => console.error("cleanup failed:", err));
      });

      const afterCreate = await getInsight(config, serverId!);
      expect(afterCreate.tags?.includes(insightTag(key))).toBeTruthy();
      expect(insightKeyFromTags(afterCreate.tags)).toBe(key);
      expect(insightHashFromTags(afterCreate.tags)).toBe(insightHash(initial));

      const managed = await listManagedInsights(config);
      const listed = managed.find((row) => insightKeyFromTags(row.tags) === key);
      expect(listed).toBeDefined();
      expect(listed!.id).toBe(serverId);

      const updated = buildInsight(key, "user logged in");
      const updateOp: ResourceOp<Insight, typeof afterCreate> = {
        kind: "update",
        spec: updated,
        server: afterCreate,
      };
      await runInsightOp(config, updateOp, ctx);

      const afterUpdate = await getInsight(config, serverId!);
      expect(insightHashFromTags(afterUpdate.tags)).toBe(insightHash(updated));
      expect(insightHashFromTags(afterUpdate.tags)).not.toBe(insightHash(initial));

      const managedAgain = await listManagedInsights(config);
      const result = diff(
        desiredFor([updated]),
        new Map<string, unknown[]>([
          ["insights", managedAgain],
          ["dashboards", []],
        ]),
      );
      const reDiffOp = result.get("insights")!.ops.find((o) => (o.spec as Insight).key === key);
      expect(reDiffOp).toBeDefined();
      expect(reDiffOp!.kind).toBe("unchanged");

      const pruned = await pruneInsight(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedInsights(config);
      expect(afterPrune.find((row) => insightKeyFromTags(row.tags) === key)).toBe(undefined);
    });
  });
});
