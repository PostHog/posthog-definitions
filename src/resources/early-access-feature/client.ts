import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:early-access-features:";

export const ServerEarlyAccessFeatureSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(""),
    stage: z.enum(["draft", "concept", "alpha", "beta", "general-availability", "archived"]),
    documentation_url: z.string().nullable().optional(),
    payload: z.record(z.string(), z.unknown()).nullable().optional(),
    feature_flag: z.object({ id: z.number(), key: z.string() }).loose().nullable().optional(),
  })
  .loose();

export type ServerEarlyAccessFeature = z.infer<typeof ServerEarlyAccessFeatureSchema>;

export type EarlyAccessFeatureCreate = {
  name: string;
  description: string;
  stage: "draft" | "concept" | "alpha" | "beta" | "general-availability" | "archived";
  documentation_url?: string;
  payload?: Record<string, unknown>;
  feature_flag_id: number;
};

export type EarlyAccessFeatureUpdate = Partial<EarlyAccessFeatureCreate>;

type EarlyAccessFeatureBody = components["schemas"]["EarlyAccessFeatureSerializerCreateOnly"];
type PatchedEarlyAccessFeatureBody = components["schemas"]["PatchedEarlyAccessFeature"];
type GeneratedPaginatedList = components["schemas"]["PaginatedEarlyAccessFeatureList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedEarlyAccessFeatures(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEarlyAccessFeature[]> {
  const all = await listEarlyAccessFeatures(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every early-access feature in the project; used by pull. */
export async function listEarlyAccessFeatures(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEarlyAccessFeature[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/early_access_feature/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerEarlyAccessFeatureSchema.parse(row));
}

export async function getEarlyAccessFeature(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEarlyAccessFeature> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/early_access_feature/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerEarlyAccessFeatureSchema.parse(data);
}

export async function createEarlyAccessFeature(
  config: ClientConfig,
  payload: EarlyAccessFeatureCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerEarlyAccessFeature> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/early_access_feature/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as EarlyAccessFeatureBody,
  });
  return ServerEarlyAccessFeatureSchema.parse(data);
}

export async function updateEarlyAccessFeature(
  config: ClientConfig,
  id: string,
  payload: EarlyAccessFeatureUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerEarlyAccessFeature> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/early_access_feature/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedEarlyAccessFeatureBody,
  });
  return ServerEarlyAccessFeatureSchema.parse(data);
}

export async function deleteEarlyAccessFeature(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/early_access_feature/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
