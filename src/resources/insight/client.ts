import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

export type ServerInsight = {
  id: number;
  short_id: string;
  name: string;
  description?: string | null;
  query?: unknown;
  tags: string[];
};

export type InsightCreate = {
  name: string;
  description?: string | null;
  query: unknown;
  tags?: string[];
};

export type InsightUpdate = Partial<InsightCreate>;

type GeneratedInsight = components["schemas"]["Insight"];
type InsightBody = components["schemas"]["Insight"];
type PatchedInsightBody = components["schemas"]["PatchedInsight"];

/**
 * Narrow PostHog's wide `Insight` response shape down to the fields we use.
 * Acts as the runtime/type boundary — beyond this, code uses `ServerInsight`.
 */
function toServerInsight(raw: GeneratedInsight): ServerInsight {
  return {
    id: raw.id,
    short_id: raw.short_id,
    name: raw.name ?? "",
    description: raw.description ?? null,
    query: raw.query ?? undefined,
    tags: (raw.tags ?? []).filter((t): t is string => typeof t === "string"),
  };
}

type GeneratedPaginatedInsightList = components["schemas"]["PaginatedInsightList"];

function paginatedFrom(raw: GeneratedPaginatedInsightList): Paginated<GeneratedInsight> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedInsights(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight[]> {
  const all = await listInsights(config, options);
  return all.filter((i) => i.tags.some((tag) => tag.startsWith("iac:insights:")));
}

/**
 * Unfiltered list of every insight in the project. Used by `pull` (which
 * needs to see rows it doesn't yet manage). The apply pipeline uses
 * `listManagedInsights` instead — it filters for the iac:* identity tag.
 */
export async function listInsights(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/insights/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = paginatedFrom(data!);
  const all = await followPagination<GeneratedInsight>(config, firstPage, {
    verbose: options.verbose,
  });
  return all.map(toServerInsight);
}

export async function getInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return toServerInsight(data!);
}

export async function createInsight(
  config: ClientConfig,
  payload: InsightCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  // PostHog's OpenAPI schema marks ~25 readonly response fields (id, short_id,
  // dashboard_tiles, last_refresh, …) as required on `Insight` — the server
  // generates them and ignores them on input. So a strict body type rejects
  // anything a client could realistically POST. Cast to InsightBody to
  // bypass the schema overreach; this is a known upstream issue.
  const { data } = await api.POST("/api/projects/{project_id}/insights/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as InsightBody,
  });
  return toServerInsight(data!);
}

export async function updateInsight(
  config: ClientConfig,
  id: number,
  payload: InsightUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: {
      ...payload,
      query: payload.query as PatchedInsightBody["query"],
    },
  });
  return toServerInsight(data!);
}

/**
 * Read the set of dashboard ids this insight is a tile on. The `dashboards`
 * field is deprecated and omitted from token-auth responses unless
 * `include_dashboards=true` is passed, so we request it explicitly.
 */
export async function getInsightDashboardIds(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<number[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/insights/{id}/", {
    params: {
      path: { project_id: config.projectId, id },
      query: { include_dashboards: true },
    },
  });
  const raw = (data as { dashboards?: unknown })?.dashboards;
  return Array.isArray(raw) ? raw.filter((x): x is number => typeof x === "number") : [];
}

/**
 * Set the insight's dashboard membership. This is a REPLACE (set semantics):
 * PostHog adds tiles for newly-listed dashboards and removes tiles for
 * dropped ones. The dashboard executor reads the current set first, then adds
 * or removes only its own id so it never clobbers other dashboards' tiles.
 *
 * Rides the deprecated `dashboards` write field: its designated replacement
 * `dashboard_tiles` is read-only on the current API, so this is the only path
 * that persists insight-tile membership. Revisit when tile writes open up.
 */
export async function setInsightDashboardIds(
  config: ClientConfig,
  id: number,
  dashboardIds: number[],
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { dashboards: dashboardIds } as unknown as PatchedInsightBody,
  });
}

export async function deleteInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true },
  });
}
