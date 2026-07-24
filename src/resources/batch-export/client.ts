import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_NAME_PREFIX = "<!-- iac:batch-exports:";

const ServerDestinationSchema = z
  .object({
    type: z.string(),
    config: z.record(z.string(), z.unknown()).nullable().optional(),
    integration: z.number().nullable().optional(),
  })
  .loose();

export const ServerBatchExportSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().default(""),
    model: z.string().nullable().optional(),
    interval: z.string().nullable().optional(),
    paused: z.boolean().nullable().optional(),
    destination: ServerDestinationSchema.nullable().optional(),
    hogql_query: z.string().nullable().optional(),
    filters: z.unknown().optional(),
    timezone: z.string().nullable().optional(),
  })
  .loose();

export type ServerBatchExport = z.infer<typeof ServerBatchExportSchema>;

export type BatchExportPayload = {
  name: string;
  interval: string;
  destination: { type: string; config: Record<string, unknown> };
  model?: string;
  paused?: boolean;
  hogql_query?: string;
  filters?: unknown;
  timezone?: string;
};

type BatchExportBody = components["schemas"]["BatchExportRequest"];
type PatchedBatchExportBody = components["schemas"]["PatchedBatchExportRequest"];
type GeneratedPaginatedList = components["schemas"]["PaginatedBatchExportList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listBatchExports(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerBatchExport[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/batch_exports/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerBatchExportSchema.parse(row));
}

export async function listManagedBatchExports(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerBatchExport[]> {
  const all = await listBatchExports(config, options);
  return all.filter((row) => (row.name ?? "").includes(MANAGED_NAME_PREFIX));
}

export async function getBatchExport(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerBatchExport> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/batch_exports/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerBatchExportSchema.parse(data);
}

export async function createBatchExport(
  config: ClientConfig,
  payload: BatchExportPayload,
  options: { verbose?: boolean } = {},
): Promise<ServerBatchExport> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/batch_exports/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as BatchExportBody,
  });
  return ServerBatchExportSchema.parse(data);
}

export async function updateBatchExport(
  config: ClientConfig,
  id: string,
  payload: Partial<BatchExportPayload>,
  options: { verbose?: boolean } = {},
): Promise<ServerBatchExport> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/batch_exports/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedBatchExportBody,
  });
  return ServerBatchExportSchema.parse(data);
}

/** Delete a batch export. DELETE → 204 (real delete, verified live). */
export async function deleteBatchExport(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/batch_exports/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
