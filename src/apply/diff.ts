import type { Dashboard, Insight } from "../sdk/types.js";
import type { ServerDashboard } from "../client/dashboards.js";
import type { ServerInsight } from "../client/insights.js";
import { specHash } from "./hash.js";
import {
  dashboardKeyFromTags,
  dashboardPayload,
  extractHash,
  insightKeyFromTags,
  insightPayload,
} from "./serialize.js";

export type InsightOp =
  | { kind: "create"; key: string; spec: Insight; hash: string }
  | { kind: "update"; key: string; spec: Insight; hash: string; serverId: number }
  | { kind: "unchanged"; key: string; spec: Insight; serverId: number };

export type DashboardOp =
  | { kind: "create"; key: string; spec: Dashboard; hash: string }
  | { kind: "update"; key: string; spec: Dashboard; hash: string; serverId: number }
  | { kind: "unchanged"; key: string; spec: Dashboard; serverId: number };

export type DiffResult = {
  insightOps: InsightOp[];
  dashboardOps: DashboardOp[];
  orphanInsights: ServerInsight[];
  orphanDashboards: ServerDashboard[];
};

export function diff(
  desired: { dashboards: Dashboard[]; insights: Insight[] },
  current: { dashboards: ServerDashboard[]; insights: ServerInsight[] },
): DiffResult {
  const insightOps: InsightOp[] = [];
  const dashboardOps: DashboardOp[] = [];

  const currentInsightByKey = new Map<string, ServerInsight>();
  for (const ci of current.insights) {
    const key = insightKeyFromTags(ci.tags);
    if (key) currentInsightByKey.set(key, ci);
  }

  for (const spec of desired.insights) {
    const hash = specHash(insightPayload(spec, ""));
    const server = currentInsightByKey.get(spec.key);
    if (!server) {
      insightOps.push({ kind: "create", key: spec.key, spec, hash });
    } else if (extractHash(server.tags) === hash) {
      insightOps.push({ kind: "unchanged", key: spec.key, spec, serverId: server.id });
    } else {
      insightOps.push({ kind: "update", key: spec.key, spec, hash, serverId: server.id });
    }
  }

  const desiredInsightKeys = new Set(desired.insights.map((i) => i.key));
  const orphanInsights = current.insights.filter((ci) => {
    const key = insightKeyFromTags(ci.tags);
    return key !== undefined && !desiredInsightKeys.has(key);
  });

  const currentDashboardByKey = new Map<string, ServerDashboard>();
  for (const cd of current.dashboards) {
    const key = dashboardKeyFromTags(cd.tags);
    if (key) currentDashboardByKey.set(key, cd);
  }

  for (const spec of desired.dashboards) {
    const hash = specHash(dashboardSpecForHash(spec));
    const server = currentDashboardByKey.get(spec.key);
    if (!server) {
      dashboardOps.push({ kind: "create", key: spec.key, spec, hash });
    } else if (extractHash(server.tags) === hash) {
      dashboardOps.push({ kind: "unchanged", key: spec.key, spec, serverId: server.id });
    } else {
      dashboardOps.push({ kind: "update", key: spec.key, spec, hash, serverId: server.id });
    }
  }

  const desiredDashboardKeys = new Set(desired.dashboards.map((d) => d.key));
  const orphanDashboards = current.dashboards.filter((cd) => {
    const key = dashboardKeyFromTags(cd.tags);
    return key !== undefined && !desiredDashboardKeys.has(key);
  });

  return { insightOps, dashboardOps, orphanInsights, orphanDashboards };
}

function dashboardSpecForHash(spec: Dashboard): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? null,
    pinned: spec.pinned ?? false,
    restriction: spec.restriction,
    tags: spec.tags ?? [],
    tiles: spec.tiles.map((tile) => {
      if ("insight" in tile) {
        return {
          kind: "insight",
          insightKey: tile.insight.key,
          layout: tile.layout,
          color: tile.color,
          filtersOverride: tile.filtersOverride,
        };
      }
      return tile;
    }),
  };
}

export function dashboardPayloadHash(spec: Dashboard): string {
  return specHash(dashboardSpecForHash(spec));
}

export function insightPayloadHash(spec: Insight): string {
  return specHash(insightPayload(spec, ""));
}

export function buildDashboardCreatePayload(
  spec: Dashboard,
  hash: string,
  insightIdByKey: Map<string, number>,
): ReturnType<typeof dashboardPayload> {
  return dashboardPayload(spec, hash, insightIdByKey);
}

export function buildInsightCreatePayload(
  spec: Insight,
  hash: string,
): ReturnType<typeof insightPayload> {
  return insightPayload(spec, hash);
}
