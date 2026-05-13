import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/http.js";
import { specHash } from "../../apply/hash.js";
import {
  arr,
  displayJson,
  filterUserTags,
  obj,
  scalar,
  type DisplayValue,
} from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/execute.js";
import {
  getResourceKind,
  type ApplyContext,
  type DesiredState,
  type ResourceOp,
} from "../types.js";
import type { Insight } from "../insight/sdk.js";
import {
  type ButtonTile,
  type Dashboard,
  type InsightTile,
  isButtonTile,
  isInsightTile,
  isTextTile,
  type Layout,
  type TextTile,
  type Tile,
} from "./sdk.js";
import {
  createDashboard,
  deleteDashboard,
  getDashboard,
  type ServerDashboard,
  type ServerTile,
  updateDashboard,
} from "./client.js";

export const DASHBOARD_TAG_PREFIX = "iac:dashboards:";
export const HASH_TAG_PREFIX = "iac:hash:";

const RESTRICTION_TO_LEVEL: Record<NonNullable<Dashboard["restriction"]>, number> = {
  everyone: 21,
  collaborators: 37,
};
const GRID_WIDTH = 12;

export function dashboardTag(key: string): string {
  return `${DASHBOARD_TAG_PREFIX}${key}`;
}

export function dashboardKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith(DASHBOARD_TAG_PREFIX));
  return tag?.slice(DASHBOARD_TAG_PREFIX.length);
}

export function dashboardHashFromTags(tags: string[] | undefined): string | undefined {
  return tags?.find((t) => t.startsWith(HASH_TAG_PREFIX))?.slice(HASH_TAG_PREFIX.length);
}

function hashTag(hex: string): string {
  return `${HASH_TAG_PREFIX}${hex}`;
}

function mergeTags(userTags: string[] | undefined, managedTags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of managedTags) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  for (const tag of userTags ?? []) {
    if (tag.startsWith("iac:")) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
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
      if (isInsightTile(tile)) {
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

export function dashboardHash(spec: Dashboard): string {
  return specHash(dashboardSpecForHash(spec));
}

function layoutsFor(layout: Layout): Record<string, Layout> {
  return { sm: layout, lg: layout };
}

function serializeInsightTile(tile: InsightTile, insightIdByKey: Map<string, number>): unknown {
  const id = insightIdByKey.get(tile.insight.key);
  if (id === undefined) {
    throw new Error(
      `Insight "${tile.insight.key}" was not created before its dashboard tile. This is a bug in the executor ordering.`,
    );
  }
  return {
    insight: { id },
    layouts: layoutsFor(tile.layout),
    ...(tile.color !== undefined && { color: tile.color }),
    ...(tile.filtersOverride !== undefined && {
      filters_hash: null,
      filters: tile.filtersOverride,
    }),
  };
}

function serializeTextTile(tile: TextTile): unknown {
  return {
    text: { body: tile.body },
    layouts: layoutsFor(tile.layout),
  };
}

function serializeButtonTile(tile: ButtonTile): unknown {
  return {
    text: { body: `[${tile.text}](${tile.url})` },
    layouts: layoutsFor(tile.layout),
  };
}

function serializeTile(tile: Tile, insightIdByKey: Map<string, number>): unknown {
  if (isInsightTile(tile)) return serializeInsightTile(tile, insightIdByKey);
  if (isTextTile(tile)) return serializeTextTile(tile);
  if (isButtonTile(tile)) return serializeButtonTile(tile);
  throw new Error(`Unknown tile shape: ${JSON.stringify(tile)}`);
}

export function dashboardPayload(
  spec: Dashboard,
  hash: string,
  insightIdByKey: Map<string, number>,
): {
  name: string;
  description: string | null;
  pinned: boolean;
  tags: string[];
  restriction_level?: number;
  tiles: unknown[];
} {
  return {
    name: spec.name,
    description: spec.description ?? null,
    pinned: spec.pinned ?? false,
    tags: mergeTags(spec.tags, [dashboardTag(spec.key), hashTag(hash)]),
    ...(spec.restriction !== undefined && {
      restriction_level: RESTRICTION_TO_LEVEL[spec.restriction],
    }),
    tiles: spec.tiles.map((tile) => serializeTile(tile, insightIdByKey)),
  };
}

export function looksLikeDashboard(value: unknown): value is Dashboard {
  const kind = getResourceKind(value);
  if (kind !== undefined) return kind === "dashboard";
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.key === "string" && typeof v.name === "string" && Array.isArray(v.tiles);
}

function validateLayout(issues: string[], where: string, layout: Layout | undefined): void {
  if (!layout) {
    issues.push(`${where}: layout is required`);
    return;
  }
  if (layout.x < 0 || layout.y < 0) issues.push(`${where}: layout x/y must be >= 0`);
  if (layout.w <= 0 || layout.h <= 0) issues.push(`${where}: layout w/h must be > 0`);
  if (layout.x + layout.w > GRID_WIDTH) {
    issues.push(
      `${where}: layout overflows the ${GRID_WIDTH}-column grid (x=${layout.x}, w=${layout.w})`,
    );
  }
}

function validateTile(
  issues: string[],
  dashboardKey: string,
  index: number,
  tile: Tile,
  knownInsightKeys: Set<string>,
): void {
  const where = `dashboard "${dashboardKey}" tile[${index}]`;
  if (isInsightTile(tile)) {
    if (!tile.insight) issues.push(`${where}: missing insight`);
    else if (!knownInsightKeys.has(tile.insight.key)) {
      issues.push(`${where}: references unknown insight "${tile.insight.key}"`);
    }
    validateLayout(issues, where, tile.layout);
  } else if (isTextTile(tile)) {
    if (!tile.body) issues.push(`${where}: text tile body is empty`);
    validateLayout(issues, where, tile.layout);
  } else if (isButtonTile(tile)) {
    if (!tile.url) issues.push(`${where}: button tile url is empty`);
    if (!tile.text) issues.push(`${where}: button tile text is empty`);
    validateLayout(issues, where, tile.layout);
  } else {
    issues.push(`${where}: unknown tile shape`);
  }
}

export function validateDashboards(specs: Dashboard[], state: DesiredState): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  const knownInsightKeys = new Set<string>();
  for (const loaded of state.get("insights") ?? []) {
    knownInsightKeys.add((loaded.spec as Insight).key);
  }
  for (const spec of specs) {
    if (!spec.key) issues.push("dashboard.key is required");
    if (!spec.name) issues.push(`dashboard "${spec.key}" name is required`);
    if (!spec.tiles || spec.tiles.length === 0) {
      issues.push(`dashboard "${spec.key}" must have at least one tile`);
    } else {
      spec.tiles.forEach((tile, i) => validateTile(issues, spec.key, i, tile, knownInsightKeys));
    }
    if (seen.has(spec.key)) issues.push(`Duplicate dashboard key "${spec.key}"`);
    seen.add(spec.key);
  }
  return issues;
}

export function extractInlineInsights(
  spec: Dashboard,
): Array<{ resourceName: string; spec: unknown }> {
  const out: Array<{ resourceName: string; spec: unknown }> = [];
  for (const tile of spec.tiles) {
    if (isInsightTile(tile)) {
      out.push({ resourceName: "insights", spec: tile.insight });
    }
  }
  return out;
}

async function assertManagedDashboard(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getDashboard(config, id, options);
  if (!current.tags?.includes(dashboardTag(key))) {
    throw new SafetyViolationError("dashboard", id, key);
  }
}

export async function runDashboardOp(
  config: ClientConfig,
  op: ResourceOp<Dashboard, ServerDashboard>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = dashboardPayload(op.spec, op.hash, ctx.insightIdByKey);

  if (op.kind === "create") {
    await createDashboard(config, payload, options);
    return;
  }

  await assertManagedDashboard(config, op.serverId as number, op.key, options);
  await updateDashboard(config, op.serverId as number, payload, options);
}

export async function pruneDashboard(
  config: ClientConfig,
  orphan: ServerDashboard,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = dashboardKeyFromTags(orphan.tags) ?? `id:${orphan.id}`;
  try {
    await assertManagedDashboard(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteDashboard(config, orphan.id, options);
  return true;
}

function pickLayout(layouts: ServerTile["layouts"]): unknown {
  if (!layouts) return null;
  return layouts.sm ?? layouts.lg ?? Object.values(layouts)[0] ?? null;
}

function parseMarkdownButton(body: string): { text: string; url: string } | null {
  const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(body.trim());
  if (!match) return null;
  return { text: match[1]!, url: match[2]! };
}

function restrictionFromLevel(level: number | undefined): string | null {
  if (level === 37) return "collaborators";
  if (level === 21) return "everyone";
  return null;
}

function displayTileSpec(tile: Tile): DisplayValue {
  if (isInsightTile(tile)) {
    return obj([
      ["kind", scalar("insight")],
      ["insightKey", scalar(tile.insight.key)],
      ["layout", displayJson(tile.layout)],
      ...(tile.color !== undefined
        ? ([["color", scalar(tile.color)]] as Array<[string, DisplayValue]>)
        : []),
    ]);
  }
  if (isTextTile(tile)) {
    return obj([
      ["kind", scalar("text")],
      ["body", scalar(tile.body)],
      ["layout", displayJson(tile.layout)],
    ]);
  }
  if (isButtonTile(tile)) {
    return obj([
      ["kind", scalar("button")],
      ["text", scalar(tile.text)],
      ["url", scalar(tile.url)],
      ["layout", displayJson(tile.layout)],
    ]);
  }
  return scalar(JSON.stringify(tile));
}

function displayServerTile(
  tile: ServerTile,
  insightKeyByServerId: Map<number, string>,
): DisplayValue {
  if (tile.insight && typeof tile.insight.id === "number") {
    const key = insightKeyByServerId.get(tile.insight.id) ?? `id:${tile.insight.id}`;
    return obj([
      ["kind", scalar("insight")],
      ["insightKey", scalar(key)],
      ["layout", displayJson(pickLayout(tile.layouts))],
      ...(tile.color != null
        ? ([["color", scalar(tile.color)]] as Array<[string, DisplayValue]>)
        : []),
    ]);
  }
  if (tile.text && typeof tile.text.body === "string") {
    const button = parseMarkdownButton(tile.text.body);
    if (button) {
      return obj([
        ["kind", scalar("button")],
        ["text", scalar(button.text)],
        ["url", scalar(button.url)],
        ["layout", displayJson(pickLayout(tile.layouts))],
      ]);
    }
    return obj([
      ["kind", scalar("text")],
      ["body", scalar(tile.text.body)],
      ["layout", displayJson(pickLayout(tile.layouts))],
    ]);
  }
  return scalar(JSON.stringify(tile));
}

export function displayDashboard(spec: Dashboard): DisplayValue {
  return obj([
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["pinned", scalar(spec.pinned ?? false)],
    ["restriction", scalar(spec.restriction ?? null)],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
    ["tiles", arr(spec.tiles.map(displayTileSpec))],
  ]);
}

export function displayDashboardFromServer(
  server: ServerDashboard,
  insightKeyByServerId: Map<number, string>,
): DisplayValue {
  return obj([
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["pinned", scalar(server.pinned ?? false)],
    ["restriction", scalar(restrictionFromLevel(server.restriction_level))],
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
    ["tiles", arr((server.tiles ?? []).map((t) => displayServerTile(t, insightKeyByServerId)))],
  ]);
}
