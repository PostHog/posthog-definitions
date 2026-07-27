import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:experiments:";

export const ServerExperimentSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().default(""),
    feature_flag_key: z.string(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    archived: z.boolean().default(false),
    type: z.enum(["web", "product"]).nullable().optional(),
    parameters: z.unknown().optional(),
    metrics: z.array(z.unknown()).nullable().default([]),
    metrics_secondary: z.array(z.unknown()).nullable().default([]),
    exposure_criteria: z.unknown().optional(),
    conclusion: z
      .enum(["won", "lost", "inconclusive", "stopped_early", "invalid"])
      .nullable()
      .optional(),
    conclusion_comment: z.string().nullable().optional(),
    holdout_id: z.number().nullable().optional(),
    saved_metrics: z.array(z.unknown()).default([]),
    status: z.enum(["draft", "running", "paused", "stopped"]).optional(),
    feature_flag: z
      .object({ id: z.number(), key: z.string(), active: z.boolean() })
      .loose()
      .optional()
      .nullable(),
  })
  .loose();

export type ServerExperiment = z.infer<typeof ServerExperimentSchema>;

export type SavedMetricRef = { id: number; metadata: { type: "primary" | "secondary" } };

export type ExperimentCreate = {
  name: string;
  description: string;
  feature_flag_key: string;
  type?: "web" | "product";
  parameters?: Record<string, unknown>;
  metrics?: unknown[];
  metrics_secondary?: unknown[];
  exposure_criteria?: Record<string, unknown>;
  holdout_id?: number | null;
  saved_metrics_ids?: SavedMetricRef[];
  archived?: boolean;
  conclusion?: "won" | "lost" | "inconclusive" | "stopped_early" | "invalid";
  conclusion_comment?: string | null;
};

export type ExperimentUpdate = Partial<Omit<ExperimentCreate, "feature_flag_key">>;

// Upstream renamed the experiment write body to ExperimentWrite /
// PatchedExperimentWrite and the list payload to PaginatedExperimentBasicList.
type ExperimentBody = components["schemas"]["ExperimentWrite"];
type PatchedBody = components["schemas"]["PatchedExperimentWrite"];
type GeneratedPaginatedList = components["schemas"]["PaginatedExperimentBasicList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedExperiments(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment[]> {
  const all = await listExperiments(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every experiment in the project; used by pull. */
export async function listExperiments(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiments/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerExperimentSchema.parse(row));
}

export async function getExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/experiments/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}

export async function createExperiment(
  config: ClientConfig,
  payload: ExperimentCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as ExperimentBody,
  });
  return ServerExperimentSchema.parse(data);
}

export async function updateExperiment(
  config: ClientConfig,
  id: number,
  payload: ExperimentUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/experiments/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedBody,
  });
  return ServerExperimentSchema.parse(data);
}

export async function deleteExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  // The experiment viewset uses ForbidDestroyModel — hard DELETE returns 405.
  // Soft-delete via `PATCH {deleted: true}` like feature flags.
  await api.PATCH("/api/projects/{project_id}/experiments/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true } as unknown as PatchedBody,
  });
}

// ---------------------------------------------------------------------------
// Lifecycle action endpoints. None take a request body except `end` (optional
// conclusion). All return the updated Experiment row.
// ---------------------------------------------------------------------------

export async function launchExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/launch/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}

export async function endExperiment(
  config: ClientConfig,
  id: number,
  body: { conclusion?: string } = {},
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/end/", {
    params: { path: { project_id: config.projectId, id } },
    body: body as unknown as components["schemas"]["EndExperiment"],
  });
  return ServerExperimentSchema.parse(data);
}

export async function pauseExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/pause/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}

export async function resumeExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/resume/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}

export async function archiveExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/archive/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}

export async function unarchiveExperiment(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerExperiment> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/experiments/{id}/unarchive/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerExperimentSchema.parse(data);
}
