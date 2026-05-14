import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:experiment-holdouts:";

export const ServerExperimentHoldoutSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().default(""),
    filters: z.array(z.unknown()).default([]),
  })
  .loose();

export type ServerExperimentHoldout = z.infer<typeof ServerExperimentHoldoutSchema>;

export type ExperimentHoldoutCreate = {
  name: string;
  description: string;
  filters: unknown[];
};

export type ExperimentHoldoutUpdate = Partial<ExperimentHoldoutCreate>;

type ExperimentHoldoutBody = components["schemas"]["ExperimentHoldout"];
type PatchedBody = components["schemas"]["PatchedExperimentHoldout"];
type GeneratedPaginatedList = components["schemas"]["PaginatedExperimentHoldoutList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedExperimentHoldouts(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentHoldout[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiment_holdouts/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw
    .map((row) => ServerExperimentHoldoutSchema.parse(row))
    .filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getExperimentHoldout(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentHoldout> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiment_holdouts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentHoldoutSchema.parse(data);
}

export async function createExperimentHoldout(
  config: ClientConfig,
  payload: ExperimentHoldoutCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentHoldout> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiment_holdouts/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as ExperimentHoldoutBody,
  });
  return ServerExperimentHoldoutSchema.parse(data);
}

export async function updateExperimentHoldout(
  config: ClientConfig,
  id: number,
  payload: ExperimentHoldoutUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentHoldout> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/experiment_holdouts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedBody,
  });
  return ServerExperimentHoldoutSchema.parse(data);
}

export async function deleteExperimentHoldout(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/experiment_holdouts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
