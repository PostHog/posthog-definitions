import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

export const ServerFeatureFlagSchema = z
  .object({
    id: z.number(),
    key: z.string(),
    name: z.string().nullable().optional(),
    filters: z.record(z.string(), z.unknown()).default({}),
    active: z.boolean(),
    deleted: z.boolean().optional(),
    tags: z.array(z.string()).default([]),
    version: z.number().nullable().optional(),
    ensure_experience_continuity: z.boolean().nullable().optional(),
    is_remote_configuration: z.boolean().nullable().optional(),
    has_encrypted_payloads: z.boolean().nullable().optional(),
    evaluation_runtime: z.enum(["server", "client", "all"]).nullable().optional(),
    bucketing_identifier: z.enum(["distinct_id", "device_id"]).nullable().optional(),
  })
  .loose();

export type ServerFeatureFlag = z.infer<typeof ServerFeatureFlagSchema>;

export type FeatureFlagCreate = {
  key: string;
  name?: string | null;
  filters: Record<string, unknown>;
  active?: boolean;
  tags?: string[];
  ensure_experience_continuity?: boolean;
  is_remote_configuration?: boolean;
  has_encrypted_payloads?: boolean;
  evaluation_runtime?: "server" | "client" | "all";
  bucketing_identifier?: "distinct_id" | "device_id";
};

export type FeatureFlagUpdate = Partial<FeatureFlagCreate> & { version?: number };

export async function listManagedFeatureFlags(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/feature_flags/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = data as unknown as Paginated<unknown>;
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw
    .map((row) => ServerFeatureFlagSchema.parse(row))
    .filter((row) => row.tags?.some((tag) => tag.startsWith("iac:feature-flags:")));
}

export async function getFeatureFlag(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/feature_flags/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerFeatureFlagSchema.parse(data);
}

export async function createFeatureFlag(
  config: ClientConfig,
  payload: FeatureFlagCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/feature_flags/", {
    params: { path: { project_id: config.projectId } },
    body: payload as never,
  });
  return ServerFeatureFlagSchema.parse(data);
}

export async function updateFeatureFlag(
  config: ClientConfig,
  id: number,
  payload: FeatureFlagUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/feature_flags/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { ...payload, version: -1 } as never,
  });
  return ServerFeatureFlagSchema.parse(data);
}

export async function deleteFeatureFlag(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/feature_flags/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true, version: -1 } as never,
  });
}
