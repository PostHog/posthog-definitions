import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import { request } from "../../client/http.js";

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

const PaginatedFeatureFlagSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ServerFeatureFlagSchema),
});

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

function featureFlagsPath(projectId: string, suffix = ""): string {
  return `/api/projects/${projectId}/feature_flags/${suffix}`;
}

export async function listManagedFeatureFlags(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag[]> {
  const collected: ServerFeatureFlag[] = [];
  let nextPath: string | null = `${featureFlagsPath(config.projectId)}?limit=100`;
  while (nextPath) {
    const raw: unknown = await request<unknown>(config, nextPath, {
      verbose: options.verbose,
    });
    const page = PaginatedFeatureFlagSchema.parse(raw);
    for (const row of page.results) {
      if (row.tags?.some((tag) => tag.startsWith("iac:feature-flags:"))) {
        collected.push(row);
      }
    }
    if (page.next) {
      const url = new URL(page.next);
      nextPath = `${url.pathname}${url.search}`;
    } else {
      nextPath = null;
    }
  }
  return collected;
}

export async function getFeatureFlag(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const raw: unknown = await request<unknown>(
    config,
    featureFlagsPath(config.projectId, `${id}/`),
    { verbose: options.verbose },
  );
  return ServerFeatureFlagSchema.parse(raw);
}

export async function createFeatureFlag(
  config: ClientConfig,
  payload: FeatureFlagCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const raw: unknown = await request<unknown>(config, featureFlagsPath(config.projectId), {
    method: "POST",
    body: payload,
    verbose: options.verbose,
  });
  return ServerFeatureFlagSchema.parse(raw);
}

export async function updateFeatureFlag(
  config: ClientConfig,
  id: number,
  payload: FeatureFlagUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const raw: unknown = await request<unknown>(
    config,
    featureFlagsPath(config.projectId, `${id}/`),
    {
      method: "PATCH",
      body: { ...payload, version: -1 },
      verbose: options.verbose,
    },
  );
  return ServerFeatureFlagSchema.parse(raw);
}

export async function deleteFeatureFlag(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await request<void>(config, featureFlagsPath(config.projectId, `${id}/`), {
    method: "PATCH",
    body: { deleted: true, version: -1 },
    verbose: options.verbose,
  });
}
