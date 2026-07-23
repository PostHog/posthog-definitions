import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import {
  arr,
  displayJson,
  filterUserTags,
  obj,
  scalar,
  type DisplayValue,
} from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
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
  isButtonTile,
  isInsightTile,
  isTextTile,
  type Layout,
  type TextTile,
  type Tile,
} from "./sdk.js";
import {
  createDashboard,
  createTextTile,
  deleteDashboard,
  deleteTile,
  getDashboard,
  reorderTiles,
  type ServerDashboard,
  type ServerTile,
  updateDashboard,
} from "./client.js";
import { getInsightDashboardIds, setInsightDashboardIds } from "../insight/client.js";

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

export function insightLayoutOf(spec: Dashboard): "preserve" | "two_column" | "full_width" {
  return spec.insightLayout ?? "preserve";
}

/** Markdown encoding for a button tile's body (round-trips via parseMarkdownButton). */
function buttonBody(tile: ButtonTile): string {
  return `[${tile.text}](${tile.url})`;
}

/**
 * Hash only what the API can actually persist:
 *  - dashboard fields (name/description/pinned/restriction/tags),
 *  - insight-tile MEMBERSHIP by key (sorted — the API doesn't preserve a
 *    stable insight-tile order we can set),
 *  - text/button tile content + color (always) and layout (ONLY under
 *    `preserve`; a non-preserve `insightLayout` repacks every tile via
 *    `reorder_tiles`, so the declared text layout wouldn't survive and must
 *    not enter the hash),
 *  - `insightLayout`.
 * Insight-tile layout/color are absent from the SDK entirely — the API can't
 * set them — so they never reach the hash.
 */
function dashboardSpecForHash(spec: Dashboard): unknown {
  const layoutMode = insightLayoutOf(spec);
  const keepLayout = layoutMode === "preserve";
  const insightKeys = spec.tiles
    .filter(isInsightTile)
    .map((t) => t.insight.key)
    .sort();
  const textTiles = spec.tiles.filter((t) => !isInsightTile(t)).map((tile) => {
    if (isTextTile(tile)) {
      return {
        kind: "text",
        body: tile.body,
        color: tile.color ?? null,
        ...(keepLayout && { layout: tile.layout }),
      };
    }
    const btn = tile as ButtonTile;
    return {
      kind: "button",
      body: buttonBody(btn),
      color: btn.color ?? null,
      ...(keepLayout && { layout: btn.layout }),
    };
  });
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? null,
    pinned: spec.pinned ?? false,
    restriction: spec.restriction,
    tags: filterUserTags(spec.tags),
    insightLayout: layoutMode,
    insightKeys,
    textTiles,
  };
}

export function dashboardHash(spec: Dashboard): string {
  return specHash(dashboardSpecForHash(spec));
}

export function dashboardPayload(
  spec: Dashboard,
  hash: string,
): {
  name: string;
  description?: string;
  pinned: boolean;
  tags: string[];
  restriction_level?: number;
} {
  return {
    name: spec.name,
    // Omit when undefined — the API 400s on an explicit `description: null`.
    ...(spec.description !== undefined && { description: spec.description }),
    pinned: spec.pinned ?? false,
    tags: mergeTags(spec.tags, [dashboardTag(spec.key), hashTag(hash)]),
    ...(spec.restriction !== undefined && {
      restriction_level: RESTRICTION_TO_LEVEL[spec.restriction],
    }),
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
    // Insight tiles have no layout — the API can't set one (see sdk.ts).
    if (!tile.insight) issues.push(`${where}: missing insight`);
    else if (!knownInsightKeys.has(tile.insight.key)) {
      issues.push(`${where}: references unknown insight "${tile.insight.key}"`);
    }
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

  const payload = dashboardPayload(op.spec, dashboardHash(op.spec));

  let dashboardId: number;
  let currentTiles: ServerTile[];
  if (op.kind === "create") {
    const created = await createDashboard(config, payload, options);
    dashboardId = created.id;
    currentTiles = [];
  } else {
    await assertManagedDashboard(config, op.server.id, op.spec.key, options);
    const updated = await updateDashboard(config, op.server.id, payload, options);
    dashboardId = updated.id;
    // Re-fetch full tiles to converge from actual server state.
    currentTiles = (await getDashboard(config, dashboardId, options)).tiles ?? [];
  }

  await syncTiles(config, dashboardId, op.spec, ctx, currentTiles, options);
}

/**
 * Converge a managed dashboard's tiles to `spec`. Insight tiles are (un)linked
 * via the insight's `dashboards` membership; text/button tiles are
 * delete-then-recreate (bounded churn — this only runs on create or a
 * hash-changing update); a non-preserve `insightLayout` repacks via
 * `reorder_tiles` last.
 */
async function syncTiles(
  config: ClientConfig,
  dashboardId: number,
  spec: Dashboard,
  ctx: ApplyContext,
  currentTiles: ServerTile[],
  options: { verbose?: boolean },
): Promise<void> {
  // --- Insight-tile membership (add missing, drop no-longer-desired) ---
  const desiredInsightIds = new Set<number>();
  for (const tile of spec.tiles) {
    if (!isInsightTile(tile)) continue;
    const id = ctx.insightIdByKey.get(tile.insight.key);
    if (id === undefined) {
      throw new Error(
        `Insight "${tile.insight.key}" was not created before its dashboard tile. This is a bug in the executor ordering.`,
      );
    }
    desiredInsightIds.add(id);
  }
  const currentInsightIds = new Set<number>();
  for (const t of currentTiles) {
    if (t.insight && typeof t.insight.id === "number") currentInsightIds.add(t.insight.id);
  }
  for (const insightId of desiredInsightIds) {
    if (!currentInsightIds.has(insightId)) {
      await setInsightMembership(config, insightId, dashboardId, true, options);
    }
  }
  for (const insightId of currentInsightIds) {
    if (!desiredInsightIds.has(insightId)) {
      await setInsightMembership(config, insightId, dashboardId, false, options);
    }
  }

  // --- Text/button tiles: delete existing, recreate desired ---
  for (const t of currentTiles) {
    if (t.text && typeof t.id === "number") await deleteTile(config, dashboardId, t.id, options);
  }
  for (const tile of spec.tiles) {
    if (isTextTile(tile)) {
      await createTextTile(config, dashboardId, tile.body, tile.layout, tile.color, options);
    } else if (isButtonTile(tile)) {
      await createTextTile(config, dashboardId, buttonBody(tile), tile.layout, tile.color, options);
    }
  }

  // --- insightLayout packing (repacks ALL tiles; only on non-preserve) ---
  const mode = insightLayoutOf(spec);
  if (mode !== "preserve") {
    const fresh = await getDashboard(config, dashboardId, options);
    const order = (fresh.tiles ?? [])
      .map((t) => t.id)
      .filter((x): x is number => typeof x === "number");
    if (order.length > 0) await reorderTiles(config, dashboardId, order, mode, options);
  }
}

/**
 * Add or remove `dashboardId` from an insight's dashboard membership without
 * disturbing its other memberships. Reads the current set first, so it never
 * clobbers tiles this dashboard doesn't own.
 */
async function setInsightMembership(
  config: ClientConfig,
  insightId: number,
  dashboardId: number,
  add: boolean,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getInsightDashboardIds(config, insightId, options);
  const set = new Set(current);
  const had = set.has(dashboardId);
  if (add) set.add(dashboardId);
  else set.delete(dashboardId);
  if (set.has(dashboardId) !== had) {
    await setInsightDashboardIds(config, insightId, [...set], options);
  }
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

function displayTextTileSpec(tile: TextTile | ButtonTile, keepLayout: boolean): DisplayValue {
  const rows: Array<[string, DisplayValue]> = isTextTile(tile)
    ? [
        ["kind", scalar("text")],
        ["body", scalar(tile.body)],
      ]
    : [
        ["kind", scalar("button")],
        ["text", scalar(tile.text)],
        ["url", scalar(tile.url)],
      ];
  if (tile.color !== undefined) rows.push(["color", scalar(tile.color)]);
  if (keepLayout) rows.push(["layout", displayJson(tile.layout)]);
  return obj(rows);
}

export function displayDashboard(spec: Dashboard): DisplayValue {
  const keepLayout = insightLayoutOf(spec) === "preserve";
  const insightKeys = spec.tiles
    .filter(isInsightTile)
    .map((t) => t.insight.key)
    .sort();
  const textTiles = spec.tiles.filter((t): t is TextTile | ButtonTile => !isInsightTile(t));
  return obj([
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["pinned", scalar(spec.pinned ?? false)],
    ["restriction", scalar(spec.restriction ?? null)],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
    ["insightLayout", scalar(insightLayoutOf(spec))],
    ["insightTiles", arr(insightKeys.map(scalar))],
    ["textTiles", arr(textTiles.map((t) => displayTextTileSpec(t, keepLayout)))],
  ]);
}

function displayServerTextTile(tile: ServerTile, keepLayout: boolean): DisplayValue {
  const body = tile.text?.body ?? "";
  const button = parseMarkdownButton(body);
  const rows: Array<[string, DisplayValue]> = button
    ? [
        ["kind", scalar("button")],
        ["text", scalar(button.text)],
        ["url", scalar(button.url)],
      ]
    : [
        ["kind", scalar("text")],
        ["body", scalar(body)],
      ];
  if (tile.color != null) rows.push(["color", scalar(tile.color)]);
  if (keepLayout) rows.push(["layout", displayJson(pickLayout(tile.layouts))]);
  return obj(rows);
}

export function displayDashboardFromServer(
  server: ServerDashboard,
  insightKeyByServerId: Map<number, string>,
): DisplayValue {
  const tiles = server.tiles ?? [];
  const insightKeys = tiles
    .filter((t) => t.insight && typeof t.insight.id === "number")
    .map((t) => insightKeyByServerId.get(t.insight!.id) ?? `id:${t.insight!.id}`)
    .sort();
  const textTiles = tiles.filter((t) => t.text && typeof t.text.body === "string");
  // insightLayout isn't a persisted server field; the diff engine only reaches
  // here for a hash-changed op, so mirror the "preserve" projection (text
  // layout shown) — server rows are always displayed as their concrete layout.
  return obj([
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["pinned", scalar(server.pinned ?? false)],
    ["restriction", scalar(restrictionFromLevel(server.restriction_level))],
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
    ["insightLayout", scalar("preserve")],
    ["insightTiles", arr(insightKeys.map(scalar))],
    ["textTiles", arr(textTiles.map((t) => displayServerTextTile(t, true)))],
  ]);
}
