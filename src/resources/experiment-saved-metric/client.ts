import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:experiment-saved-metrics:";

export const ServerExperimentSavedMetricSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().default(""),
    query: z.record(z.string(), z.unknown()).default({}),
  })
  .loose();

export type ServerExperimentSavedMetric = z.infer<typeof ServerExperimentSavedMetricSchema>;

export type ExperimentSavedMetricCreate = {
  name: string;
  description: string;
  query: Record<string, unknown>;
};

export type ExperimentSavedMetricUpdate = Partial<ExperimentSavedMetricCreate>;

type ExperimentSavedMetricBody = components["schemas"]["ExperimentSavedMetric"];
type PatchedBody = components["schemas"]["PatchedExperimentSavedMetric"];
type GeneratedPaginatedList = components["schemas"]["PaginatedExperimentSavedMetricList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedExperimentSavedMetrics(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentSavedMetric[]> {
  const all = await listExperimentSavedMetrics(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every experiment saved metric in the project; used by pull. */
export async function listExperimentSavedMetrics(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentSavedMetric[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiment_saved_metrics/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerExperimentSavedMetricSchema.parse(row));
}

export async function getExperimentSavedMetric(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentSavedMetric> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiment_saved_metrics/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSavedMetricSchema.parse(data);
}

export async function createExperimentSavedMetric(
  config: ClientConfig,
  payload: ExperimentSavedMetricCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentSavedMetric> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiment_saved_metrics/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as ExperimentSavedMetricBody,
  });
  return ServerExperimentSavedMetricSchema.parse(data);
}

export async function updateExperimentSavedMetric(
  config: ClientConfig,
  id: number,
  payload: ExperimentSavedMetricUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperimentSavedMetric> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/experiment_saved_metrics/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedBody,
  });
  return ServerExperimentSavedMetricSchema.parse(data);
}

export async function deleteExperimentSavedMetric(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/experiment_saved_metrics/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
