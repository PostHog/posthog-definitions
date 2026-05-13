import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import type { Dashboard, Insight, TrendsQuery } from "../sdk/types.js";
import type { ServerDashboard } from "../client/dashboards.js";
import type { ServerInsight } from "../client/insights.js";
import { diff, insightPayloadHash, dashboardPayloadHash } from "./diff.js";

function trends(event: string): TrendsQuery {
  return { kind: "TrendsQuery", series: [{ event }] };
}

function insightSpec(key: string, name = key): Insight {
  return { key, name, query: trends("user signed up") };
}

function dashboardSpec(key: string, insightKey: string): Dashboard {
  return {
    key,
    name: `Dashboard ${key}`,
    tiles: [
      {
        insight: insightSpec(insightKey),
        layout: { x: 0, y: 0, w: 6, h: 4 },
      },
    ],
  };
}

function serverInsight(id: number, key: string, hash: string, extraTags: string[] = []): ServerInsight {
  return {
    id,
    short_id: `s${id}`,
    name: `Insight ${key}`,
    description: null,
    query: {},
    tags: [`iac:insights:${key}`, `iac:hash:${hash}`, ...extraTags],
  };
}

function serverDashboard(id: number, key: string, hash: string, extraTags: string[] = []): ServerDashboard {
  return {
    id,
    name: `Dashboard ${key}`,
    description: null,
    pinned: false,
    tags: [`iac:dashboards:${key}`, `iac:hash:${hash}`, ...extraTags],
    tiles: [],
  };
}

describe("diff — insights", () => {
  it("emits create when desired insight has no matching server row", () => {
    const desired = insightSpec("weekly-signups");
    const result = diff({ dashboards: [], insights: [desired] }, { dashboards: [], insights: [] });
    assert.equal(result.insightOps.length, 1);
    assert.equal(result.insightOps[0]!.kind, "create");
    assert.equal(result.insightOps[0]!.key, "weekly-signups");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = insightSpec("weekly-signups");
    const server = serverInsight(42, "weekly-signups", insightPayloadHash(desired));
    const result = diff({ dashboards: [], insights: [desired] }, { dashboards: [], insights: [server] });
    assert.equal(result.insightOps[0]!.kind, "unchanged");
    if (result.insightOps[0]!.kind === "unchanged") {
      assert.equal(result.insightOps[0]!.serverId, 42);
    }
  });

  it("emits update when server hash differs from the desired spec's hash", () => {
    const desired = insightSpec("weekly-signups");
    const server = serverInsight(42, "weekly-signups", "stalehash00000000");
    const result = diff({ dashboards: [], insights: [desired] }, { dashboards: [], insights: [server] });
    assert.equal(result.insightOps[0]!.kind, "update");
    if (result.insightOps[0]!.kind === "update") {
      assert.equal(result.insightOps[0]!.serverId, 42);
    }
  });

  it("classifies a server-only managed insight as an orphan", () => {
    const server = serverInsight(99, "ghost", "any");
    const result = diff({ dashboards: [], insights: [] }, { dashboards: [], insights: [server] });
    assert.equal(result.orphanInsights.length, 1);
    assert.equal(result.orphanInsights[0]!.id, 99);
  });
});

describe("diff — dashboards", () => {
  it("emits create when desired dashboard has no matching server row", () => {
    const desired = dashboardSpec("growth", "weekly-signups");
    const result = diff({ dashboards: [desired], insights: [] }, { dashboards: [], insights: [] });
    assert.equal(result.dashboardOps.length, 1);
    assert.equal(result.dashboardOps[0]!.kind, "create");
  });

  it("emits unchanged when server dashboard hash matches", () => {
    const desired = dashboardSpec("growth", "weekly-signups");
    const server = serverDashboard(7, "growth", dashboardPayloadHash(desired));
    const result = diff({ dashboards: [desired], insights: [] }, { dashboards: [server], insights: [] });
    assert.equal(result.dashboardOps[0]!.kind, "unchanged");
  });

  it("emits update when server dashboard hash drifted", () => {
    const desired = dashboardSpec("growth", "weekly-signups");
    const server = serverDashboard(7, "growth", "deadbeef12345678");
    const result = diff({ dashboards: [desired], insights: [] }, { dashboards: [server], insights: [] });
    assert.equal(result.dashboardOps[0]!.kind, "update");
  });

  it("classifies a server-only managed dashboard as an orphan", () => {
    const server = serverDashboard(123, "ghost", "any");
    const result = diff({ dashboards: [], insights: [] }, { dashboards: [server], insights: [] });
    assert.equal(result.orphanDashboards.length, 1);
    assert.equal(result.orphanDashboards[0]!.id, 123);
  });
});

describe("diff — safety invariant", () => {
  it("ignores server rows that lack the iac:* identity tag", () => {
    // This is the safety invariant smoke test: a hand-built insight in the same
    // project must not appear as an orphan or anything else the executor would touch.
    const handBuilt: ServerInsight = {
      id: 999,
      short_id: "hb",
      name: "Hand-built",
      description: null,
      query: {},
      tags: ["my-tag"],
    };
    const result = diff({ dashboards: [], insights: [] }, { dashboards: [], insights: [handBuilt] });
    assert.equal(result.insightOps.length, 0);
    assert.equal(result.orphanInsights.length, 0);
  });
});
