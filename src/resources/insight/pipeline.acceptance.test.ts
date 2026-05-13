import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import { loadAcceptanceConfig, uniqueKey, withCleanup } from "../../test-helpers/acceptance.js";
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
  state.set("insights", insights.map((spec) => ({ path: "<acceptance>", spec })));
  state.set("dashboards", []);
  return state;
}

describe("insight pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real insight", async () => {
    const config = loadAcceptanceConfig();
    const key = uniqueKey("acceptance-insight");
    const initial = buildInsight(key, "user signed up");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      const createOp: ResourceOp<Insight, never> = {
        kind: "create",
        key,
        spec: initial,
        hash: insightHash(initial),
      };
      await runInsightOp(config, createOp, ctx);

      const serverId = ctx.insightIdByKey.get(key);
      assert.ok(serverId, "executor should record server id after create");
      registerCleanup(async () => {
        await deleteInsight(config, serverId).catch(() => undefined);
      });

      const afterCreate = await getInsight(config, serverId);
      assert.ok(
        afterCreate.tags?.includes(insightTag(key)),
        `created insight should carry ${insightTag(key)} tag`,
      );
      assert.equal(insightKeyFromTags(afterCreate.tags), key);
      assert.equal(insightHashFromTags(afterCreate.tags), insightHash(initial));

      const managed = await listManagedInsights(config);
      const listed = managed.find((row) => insightKeyFromTags(row.tags) === key);
      assert.ok(listed, "listManagedInsights should include the new insight");
      assert.equal(listed.id, serverId);

      const updated = buildInsight(key, "user logged in");
      const updateOp: ResourceOp<Insight, typeof afterCreate> = {
        kind: "update",
        key,
        spec: updated,
        hash: insightHash(updated),
        serverId,
        server: afterCreate,
      };
      await runInsightOp(config, updateOp, ctx);

      const afterUpdate = await getInsight(config, serverId);
      assert.equal(insightHashFromTags(afterUpdate.tags), insightHash(updated));
      assert.notEqual(insightHashFromTags(afterUpdate.tags), insightHash(initial));

      const managedAgain = await listManagedInsights(config);
      const result = diff(
        desiredFor([updated]),
        new Map<string, unknown[]>([
          ["insights", managedAgain],
          ["dashboards", []],
        ]),
      );
      const reDiffOp = result.get("insights")!.ops.find((o) => o.key === key);
      assert.ok(reDiffOp, "re-diff should include the managed insight");
      assert.equal(reDiffOp.kind, "unchanged");

      const pruned = await pruneInsight(config, afterUpdate);
      assert.equal(pruned, true);

      const afterPrune = await listManagedInsights(config);
      assert.equal(
        afterPrune.find((row) => insightKeyFromTags(row.tags) === key),
        undefined,
        "insight should no longer appear in listManagedInsights after prune",
      );
    });
  });
});
