import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:warehouse-saved-queries:";

export const ServerWarehouseSavedQuerySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    query: z.object({ query: z.string() }).loose().nullable().optional(),
    description: z.string().nullable().optional(),
    folder_id: z.string().nullable().optional(),
    sync_frequency: z.string().nullable().optional(),
    // Schema claims `number`, but the API returns a UUID string (floor, not
    // contract). Accept both; it's the optimistic-concurrency token for updates.
    latest_history_id: z.union([z.string(), z.number()]).nullable().optional(),
    deleted: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerWarehouseSavedQuery = z.infer<typeof ServerWarehouseSavedQuerySchema>;

export type WarehouseSavedQueryPayload = {
  name: string;
  query: { kind: "HogQLQuery"; query: string };
  description?: string;
  folder_id?: string;
  /** Optimistic-concurrency token echoed on update so a query write isn't rejected as a conflicting edit. */
  edited_history_id?: string;
};

type SavedQueryBody = components["schemas"]["DataWarehouseSavedQuery"];
type PatchedSavedQueryBody = components["schemas"]["PatchedDataWarehouseSavedQuery"];
type GeneratedPaginatedList = components["schemas"]["PaginatedDataWarehouseSavedQueryMinimalList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listWarehouseSavedQueries(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerWarehouseSavedQuery[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/warehouse_saved_queries/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerWarehouseSavedQuerySchema.parse(row));
}

export async function listManagedWarehouseSavedQueries(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerWarehouseSavedQuery[]> {
  const all = await listWarehouseSavedQueries(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getWarehouseSavedQuery(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerWarehouseSavedQuery> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/warehouse_saved_queries/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerWarehouseSavedQuerySchema.parse(data);
}

export async function createWarehouseSavedQuery(
  config: ClientConfig,
  payload: WarehouseSavedQueryPayload,
  options: { verbose?: boolean } = {},
): Promise<ServerWarehouseSavedQuery> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/warehouse_saved_queries/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as SavedQueryBody,
  });
  return ServerWarehouseSavedQuerySchema.parse(data);
}

export async function updateWarehouseSavedQuery(
  config: ClientConfig,
  id: string,
  payload: Partial<WarehouseSavedQueryPayload>,
  options: { verbose?: boolean } = {},
): Promise<ServerWarehouseSavedQuery> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/warehouse_saved_queries/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedSavedQueryBody,
  });
  return ServerWarehouseSavedQuerySchema.parse(data);
}

/** Delete a saved query. DELETE → 204 (real delete, verified live). */
export async function deleteWarehouseSavedQuery(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/warehouse_saved_queries/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
