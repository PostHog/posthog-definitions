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
  tiles?: unknown[];
};

export type DashboardUpdate = Partial<DashboardCreate>;

type GeneratedDashboard = components["schemas"]["Dashboard"];
type GeneratedDashboardBasic = components["schemas"]["DashboardBasic"];
type DashboardBody = components["schemas"]["Dashboard"];
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
  const { data } = await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    // PatchedDashboard marks `tiles` (which the API accepts) as readonly and
    // `delete_insights` as required — both upstream schema bugs. Cast just
    // `tiles` and pass the schema-required `delete_insights: false` (the
    // default the server applies for non-delete PATCHes anyway).
    body: {
      ...payload,
      description: payload.description ?? undefined,
      restriction_level: payload.restriction_level as PatchedDashboardBody["restriction_level"],
      tiles: payload.tiles as PatchedDashboardBody["tiles"],
      delete_insights: false,
    },
  });
  return toServerDashboard(data!);
}

export async function deleteDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    // `deleted` is a valid soft-delete input the server accepts but the
    // OpenAPI PATCH body schema (PatchedPatchedDashboardOpenApi) omits it,
    // so cast past the schema like the experiment client does.
    body: { deleted: true, delete_insights: false } as unknown as PatchedDashboardBody,
  });
}
