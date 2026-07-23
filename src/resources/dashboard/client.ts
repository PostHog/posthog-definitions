import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

export type ServerTile = {
  id?: number;
  insight?: { id: number; short_id?: string } | null;
  text?: { body: string } | null;
  layouts?: Record<string, { x: number; y: number; w: number; h: number }>;
  color?: string | null;
};

export type ServerDashboard = {
  id: number;
  name: string;
  description?: string | null;
  pinned?: boolean;
  tags: string[];
  restriction_level?: number;
  creation_mode?: string;
  deleted?: boolean;
  tiles?: ServerTile[];
};

export type DashboardCreate = {
  name: string;
  description?: string | null;
  pinned?: boolean;
  tags?: string[];
  restriction_level?: number;
  // NB: no `tiles` — `Dashboard.tiles` is read-only on the API. Tiles are
  // written via the tile endpoints below (text/button) and via the insight's
  // `dashboards` membership (insight tiles).
};

export type DashboardUpdate = Partial<DashboardCreate>;

export type TileLayout = { x: number; y: number; w: number; h: number };

type GeneratedDashboard = components["schemas"]["Dashboard"];
type GeneratedDashboardBasic = components["schemas"]["DashboardBasic"];
type DashboardBody = components["schemas"]["Dashboard"];
// 2026-07-23 spec renamed the dashboard PATCH request body from
// `PatchedDashboard` to `PatchedPatchedDashboardOpenApi`.
type PatchedDashboardBody = components["schemas"]["PatchedPatchedDashboardOpenApi"];

/**
 * Narrow PostHog's wide `Dashboard`/`DashboardBasic` response shape down to
 * the fields we use. `DashboardBasic` (the list response) has no `tiles`.
 */
function toServerDashboard(raw: GeneratedDashboard | GeneratedDashboardBasic): ServerDashboard {
  const tiles =
    "tiles" in raw && Array.isArray(raw.tiles)
      ? (raw.tiles as ServerTile[])
      : undefined;
  return {
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? null,
    pinned: raw.pinned,
    tags: (raw.tags ?? []).filter((t): t is string => typeof t === "string"),
    restriction_level: raw.restriction_level,
    creation_mode: raw.creation_mode,
    deleted: raw.deleted,
    tiles,
  };
}

type GeneratedPaginatedDashboardBasicList = components["schemas"]["PaginatedDashboardBasicList"];

function paginatedFrom(
  raw: GeneratedPaginatedDashboardBasicList,
): Paginated<GeneratedDashboardBasic> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listDashboards(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboards/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = paginatedFrom(data!);
  const all = await followPagination<GeneratedDashboardBasic>(config, firstPage, {
    verbose: options.verbose,
  });
  return all.map(toServerDashboard);
}

export async function listManagedDashboards(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard[]> {
  const all = await listDashboards(config, options);
  return all.filter((d) => d.tags.some((tag) => tag.startsWith("iac:dashboards:")));
}

export async function getDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return toServerDashboard(data!);
}

export async function createDashboard(
  config: ClientConfig,
  payload: DashboardCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  // PostHog's OpenAPI schema marks many readonly response fields as required
  // on `Dashboard` — the server generates them and ignores them on input.
  // Cast to DashboardBody to bypass the schema overreach.
  const { data } = await api.POST("/api/projects/{project_id}/dashboards/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as DashboardBody,
  });
  return toServerDashboard(data!);
}

export async function updateDashboard(
  config: ClientConfig,
  id: number,
  payload: DashboardUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  // PatchedPatchedDashboardOpenApi marks `delete_insights` as required — an
  // upstream schema bug. Pass the `delete_insights: false` default the server
  // applies for non-delete PATCHes anyway. Tiles are not sent here (read-only).
  const { data } = await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: {
      ...payload,
      description: payload.description ?? undefined,
      restriction_level: payload.restriction_level as PatchedDashboardBody["restriction_level"],
      delete_insights: false,
    },
  });
  return toServerDashboard(data!);
}

// ---------------------------------------------------------------------------
// Tile endpoints. `Dashboard.tiles` is read-only, so text/button tiles are
// created and mutated through these dedicated routes. Insight tiles are
// managed via the insight's `dashboards` membership (see insight/client.ts).
// ---------------------------------------------------------------------------

type CreateTextTileBody = components["schemas"]["CreateTextTileRequest"];
type ReorderLayout = components["schemas"]["LayoutEnum"];

/** Both TileLayouts breakpoints get the same box; pull reads `sm` back. */
function tileLayouts(layout: TileLayout): CreateTextTileBody["layouts"] {
  return { sm: layout, xs: layout } as CreateTextTileBody["layouts"];
}

export async function createTextTile(
  config: ClientConfig,
  dashboardId: number,
  body: string,
  layout: TileLayout,
  color: string | undefined,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.POST("/api/projects/{project_id}/dashboards/{id}/create_text_tile/", {
    params: { path: { project_id: config.projectId, id: dashboardId } },
    body: { body, layouts: tileLayouts(layout), ...(color !== undefined && { color }) },
  });
}

export async function deleteTile(
  config: ClientConfig,
  dashboardId: number,
  tileId: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.POST("/api/projects/{project_id}/dashboards/{id}/delete_tile/", {
    params: { path: { project_id: config.projectId, id: dashboardId } },
    body: { tile_id: tileId },
  });
}

export async function reorderTiles(
  config: ClientConfig,
  dashboardId: number,
  tileOrder: number[],
  layout: "preserve" | "two_column" | "full_width",
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.POST("/api/projects/{project_id}/dashboards/{id}/reorder_tiles/", {
    params: { path: { project_id: config.projectId, id: dashboardId } },
    body: { tile_order: tileOrder, layout: layout as ReorderLayout },
  });
}

export async function deleteDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true, delete_insights: false },
  });
}
