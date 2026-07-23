import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_NAME_PREFIX = "<!-- iac:logs-views:";

const ServerLogsViewColumnSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    name: z.string().optional(),
    expression: z.string().optional(),
    width: z.number().optional(),
  })
  .loose();

export const ServerLogsViewSchema = z
  .object({
    id: z.string(),
    short_id: z.string(),
    name: z.string().nullable().default(""),
    filters: z.record(z.string(), z.unknown()).nullable().optional(),
    columns: z.array(ServerLogsViewColumnSchema).nullable().optional(),
    pinned: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerLogsView = z.infer<typeof ServerLogsViewSchema>;

export type LogsViewCreate = {
  name: string;
  filters?: Record<string, unknown>;
  columns?: components["schemas"]["LogsViewColumn"][] | null;
  pinned?: boolean;
};

export type LogsViewUpdate = Partial<LogsViewCreate>;

type LogsViewBody = components["schemas"]["LogsView"];
type PatchedLogsViewBody = components["schemas"]["PatchedLogsView"];
type GeneratedPaginatedList = components["schemas"]["PaginatedLogsViewList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listLogsViews(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsView[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/logs/views/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerLogsViewSchema.parse(row));
}

export async function listManagedLogsViews(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsView[]> {
  const all = await listLogsViews(config, options);
  return all.filter((row) => (row.name ?? "").includes(MANAGED_NAME_PREFIX));
}

export async function getLogsView(
  config: ClientConfig,
  shortId: string,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsView> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/logs/views/{short_id}/", {
    params: { path: { project_id: config.projectId, short_id: shortId } },
  });
  return ServerLogsViewSchema.parse(data);
}

export async function createLogsView(
  config: ClientConfig,
  payload: LogsViewCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsView> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/logs/views/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as LogsViewBody,
  });
  return ServerLogsViewSchema.parse(data);
}

export async function updateLogsView(
  config: ClientConfig,
  shortId: string,
  payload: LogsViewUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsView> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/logs/views/{short_id}/", {
    params: { path: { project_id: config.projectId, short_id: shortId } },
    body: payload as unknown as PatchedLogsViewBody,
  });
  return ServerLogsViewSchema.parse(data);
}

/** Delete a logs view. DELETE → 204 (real delete, verified live). */
export async function deleteLogsView(
  config: ClientConfig,
  shortId: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/logs/views/{short_id}/", {
    params: { path: { project_id: config.projectId, short_id: shortId } },
  });
}
