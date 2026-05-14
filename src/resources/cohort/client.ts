import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:cohorts:";

export const ServerCohortSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable().default(""),
    description: z.string().default(""),
    is_static: z.boolean().default(false),
    filters: z.unknown().nullable().optional(),
    cohort_type: z
      .enum(["static", "person_property", "behavioral", "realtime", "analytical"])
      .nullable()
      .optional(),
    deleted: z.boolean().optional(),
  })
  .loose();

export type ServerCohort = z.infer<typeof ServerCohortSchema>;

export type CohortCreate = {
  name: string;
  description: string;
  is_static?: boolean;
  filters?: unknown;
  query?: Record<string, unknown>;
  cohort_type?: "static" | "person_property" | "behavioral" | "realtime" | "analytical";
};

export type CohortUpdate = Partial<CohortCreate>;

type CohortBody = components["schemas"]["Cohort"];
type PatchedBody = components["schemas"]["PatchedCohort"];
type GeneratedPaginatedList = components["schemas"]["PaginatedCohortList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedCohorts(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerCohort[]> {
  const all = await listCohorts(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every cohort in the project; used by pull. */
export async function listCohorts(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerCohort[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/cohorts/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerCohortSchema.parse(row));
}

export async function getCohort(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerCohort> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/cohorts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerCohortSchema.parse(data);
}

export async function createCohort(
  config: ClientConfig,
  payload: CohortCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerCohort> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/cohorts/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as CohortBody,
  });
  return ServerCohortSchema.parse(data);
}

export async function updateCohort(
  config: ClientConfig,
  id: number,
  payload: CohortUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerCohort> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/cohorts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedBody,
  });
  return ServerCohortSchema.parse(data);
}

export async function deleteCohort(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  // Cohorts use soft-delete via PATCH {deleted: true} — same pattern as
  // feature flags. A real DELETE drops the row immediately and breaks any
  // dashboard / flag that references it.
  await api.PATCH("/api/projects/{project_id}/cohorts/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true } as unknown as PatchedBody,
  });
}
