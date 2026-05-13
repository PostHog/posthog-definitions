import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "tinyglobby";
import { tsImport } from "tsx/esm/api";
import type { Dashboard, Insight, Tile } from "../sdk/types.js";
import { isInsightTile } from "../sdk/types.js";

export type LoadedSpec = {
  path: string;
  spec: Dashboard | Insight;
};

export type DesiredState = {
  dashboards: Array<{ path: string; spec: Dashboard }>;
  insights: Array<{ path: string; spec: Insight }>;
};

export class LoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoadError";
  }
}

function looksLikeDashboard(value: unknown): value is Dashboard {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.key === "string" && typeof v.name === "string" && Array.isArray(v.tiles);
}

function looksLikeInsight(value: unknown): value is Insight {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.name === "string" &&
    !!v.query &&
    typeof v.query === "object" &&
    !Array.isArray((value as { tiles?: unknown }).tiles)
  );
}

export async function loadDefinitions(dir: string): Promise<DesiredState> {
  const absDir = path.resolve(dir);
  const files = await glob("**/*.ts", { cwd: absDir, absolute: true });

  const dashboards: Array<{ path: string; spec: Dashboard }> = [];
  const insights: Array<{ path: string; spec: Insight }> = [];

  for (const file of files.sort()) {
    const module = await tsImport(pathToFileURL(file).href, import.meta.url);
    const exported = (module as { default?: unknown }).default;
    if (exported === undefined) {
      continue;
    }
    if (looksLikeDashboard(exported)) {
      dashboards.push({ path: file, spec: exported });
    } else if (looksLikeInsight(exported)) {
      insights.push({ path: file, spec: exported });
    } else {
      throw new LoadError(
        `${file}: default export is not a Dashboard or Insight. Got: ${JSON.stringify(exported).slice(0, 200)}`,
      );
    }
  }

  for (const { spec } of dashboards) {
    for (const tile of spec.tiles) {
      collectInlineInsight(tile, insights);
    }
  }

  return dedupeInsights(dashboards, insights);
}

function collectInlineInsight(
  tile: Tile,
  insights: Array<{ path: string; spec: Insight }>,
): void {
  if (!isInsightTile(tile)) return;
  const insight = tile.insight;
  if (!insights.some((i) => i.spec === insight || i.spec.key === insight.key)) {
    insights.push({ path: "<inline>", spec: insight });
  }
}

function dedupeInsights(
  dashboards: Array<{ path: string; spec: Dashboard }>,
  insights: Array<{ path: string; spec: Insight }>,
): DesiredState {
  const byKey = new Map<string, { path: string; spec: Insight }>();
  for (const entry of insights) {
    const existing = byKey.get(entry.spec.key);
    if (existing && existing.spec !== entry.spec) {
      throw new LoadError(
        `Insight key "${entry.spec.key}" is defined in multiple places (${existing.path} and ${entry.path}). Keys must be unique.`,
      );
    }
    byKey.set(entry.spec.key, entry);
  }
  return { dashboards, insights: [...byKey.values()] };
}
