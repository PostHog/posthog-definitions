import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import { deleteInsight, listManagedInsights } from "../insight/client.js";
import { insightHash, insightKeyFromTags, runInsightOp } from "../insight/pipeline.js";
import { type Insight } from "../insight/sdk.js";
import { deleteDashboard, getDashboard, listManagedDashboards } from "./client.js";
import {
  dashboardHash,
  dashboardHashFromTags,
  dashboardKeyFromTags,
  dashboardTag,
  extractInlineInsights,
  pruneDashboard,
  runDashboardOp,
} from "./pipeline.js";
import { type Dashboard } from "./sdk.js";

function buildInsight(key: string): Insight {
  return {
    key,
    name: `Acceptance insight ${key}`,
    query: { kind: "TrendsQuery", series: [{ kind: "EventsNode", event: "$pageview" }] },
  };
}

function buildDashboard(key: string, name: string, insight: Insight): Dashboard {
  return {
    key,
    name,
    description: "Created by pipeline.acceptance.test.ts",
    tiles: [
      {
        insight,
        layout: { x: 0, y: 0, w: 6, h: 5 },
      },
    ],
  };
}

function desiredFor(insights: Insight[], dashboards: Dashboard[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "insights",
    insights.map((spec) => ({ path: "<acceptance>", spec })),
  );
  state.set(
    "dashboards",
    dashboards.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("dashboard pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real dashboard", async () => {
    const config = loadAcceptanceConfig();
    await purgeStale(
      config,
      listManagedDashboards,
      deleteDashboard,
      dashboardKeyFromTags,
      "acceptance-dashboard-",
    );
    await purgeStale(
      config,
      listManagedInsights,
      deleteInsight,
      insightKeyFromTags,
      "acceptance-insight-",
    );

    const insightKey = uniqueKey("acceptance-insight");
    const dashboardKey = uniqueKey("acceptance-dashboard");
    const insightSpec = buildInsight(insightKey);
    const initial = buildDashboard(dashboardKey, "Acceptance dashboard v1", insightSpec);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      const insightOp: ResourceOp<Insight, never> = {
        kind: "create",
        key: insightKey,
        spec: insightSpec,
        hash: insightHash(insightSpec),
      };
      await runInsightOp(config, insightOp, ctx);
      const insightId = ctx.insightIdByKey.get(insightKey);
      assert.ok(insightId, "insight executor should record server id");
      registerCleanup(async () => {
        await deleteInsight(config, insightId).catch(() => undefined);
      });

      const createOp: ResourceOp<Dashboard, never> = {
        kind: "create",
        key: dashboardKey,
        spec: initial,
        hash: dashboardHash(initial),
      };
      await runDashboardOp(config, createOp, ctx);

      const managed = await listManagedDashboards(config);
      const listed = managed.find((row) => dashboardKeyFromTags(row.tags) === dashboardKey);
      assert.ok(listed, "listManagedDashboards should include the new dashboard");
      assert.ok(
        listed.tags?.includes(dashboardTag(dashboardKey)),
        `dashboard should carry ${dashboardTag(dashboardKey)} tag`,
      );
      assert.equal(dashboardHashFromTags(listed.tags), dashboardHash(initial));

      const dashboardId = listed.id;
      registerCleanup(async () => {
        await deleteDashboard(config, dashboardId).catch(() => undefined);
      });

      const inline = extractInlineInsights(initial);
      assert.equal(inline.length, 1);
      assert.equal(inline[0]!.resourceName, "insights");
      assert.equal((inline[0]!.spec as Insight).key, insightKey);

      const updated = buildDashboard(dashboardKey, "Acceptance dashboard v2", insightSpec);
      const updateOp: ResourceOp<Dashboard, typeof listed> = {
        kind: "update",
        key: dashboardKey,
        spec: updated,
        hash: dashboardHash(updated),
        serverId: dashboardId,
        server: listed,
      };
      await runDashboardOp(config, updateOp, ctx);

      const afterUpdate = await getDashboard(config, dashboardId);
      assert.equal(afterUpdate.name, "Acceptance dashboard v2");
      assert.equal(dashboardHashFromTags(afterUpdate.tags), dashboardHash(updated));

      const managedAgain = await listManagedDashboards(config);
      const result = diff(
        desiredFor([insightSpec], [updated]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", managedAgain],
        ]),
      );
      const reDiffOp = result.get("dashboards")!.ops.find((o) => o.key === dashboardKey);
      assert.ok(reDiffOp, "re-diff should include the managed dashboard");
      assert.equal(reDiffOp.kind, "unchanged");

      const pruned = await pruneDashboard(config, afterUpdate);
      assert.equal(pruned, true);

      const afterPrune = await listManagedDashboards(config);
      assert.equal(
        afterPrune.find((row) => dashboardKeyFromTags(row.tags) === dashboardKey),
        undefined,
        "dashboard should no longer appear in listManagedDashboards after prune",
      );
    });
  });
});
