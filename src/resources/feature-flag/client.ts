import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { ApiError, createApiClient, followPagination, type Paginated } from "../../client/typed.js";

/**
 * Raised when PostHog rejects a flag create because the `key` is already taken.
 * Distinct from the generic ApiError because the most common cause is a
 * previously-soft-deleted flag with the same key — PostHog enforces uniqueness
 * across both active and soft-deleted rows, so soft-deleted keys are reserved
 * permanently. Callers (and tests) need to know about that explicitly.
 */
export class FeatureFlagKeyTakenError extends Error {
  constructor(public readonly key: string, public override readonly cause: ApiError) {
    super(
      `Feature flag key "${key}" is already taken on PostHog. ` +
        `Note: PostHog reserves keys of soft-deleted flags permanently — ` +
        `if a previous run deleted a flag with this key, the key cannot be reused. ` +
        `Pick a different key.`,
    );
    this.name = "FeatureFlagKeyTakenError";
  }
}

function isKeyCollision(err: unknown): err is ApiError {
  if (!(err instanceof ApiError)) return false;
  if (err.status !== 400) return false;
  // Body is a JSON string from DRF; match defensively rather than parsing.
  return err.body.includes('"code":"unique"') && err.body.includes('"attr":"key"');
}

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

type FeatureFlagBody = components["schemas"]["FeatureFlagCreateRequestSchema"];
type PatchedFeatureFlagBody = components["schemas"]["PatchedFeatureFlagPartialUpdateRequestSchema"];
type GeneratedPaginatedFeatureFlagList = components["schemas"]["PaginatedFeatureFlagList"];

function paginatedFrom(raw: GeneratedPaginatedFeatureFlagList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedFeatureFlags(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag[]> {
  const all = await listFeatureFlags(config, options);
  return all.filter((row) => row.tags?.some((tag) => tag.startsWith("iac:feature-flags:")));
}

/** Unfiltered list of every feature flag in the project; used by pull. */
export async function listFeatureFlags(
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
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw.map((row) => ServerFeatureFlagSchema.parse(row));
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
  try {
    // FeatureFlagCreateRequestSchema only lists 6 fields; the API accepts more
    // (ensure_experience_continuity, is_remote_configuration, evaluation_runtime,
    // bucketing_identifier, has_encrypted_payloads). Cast to bypass the schema
    // gap — known upstream issue.
    const { data } = await api.POST("/api/projects/{project_id}/feature_flags/", {
      params: { path: { project_id: config.projectId } },
      body: payload as unknown as FeatureFlagBody,
    });
    return ServerFeatureFlagSchema.parse(data);
  } catch (err) {
    if (isKeyCollision(err)) throw new FeatureFlagKeyTakenError(payload.key, err);
    throw err;
  }
}

export async function updateFeatureFlag(
  config: ClientConfig,
  id: number,
  payload: FeatureFlagUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerFeatureFlag> {
  const api = createApiClient(config, { verbose: options.verbose });
  // PatchedFeatureFlagPartialUpdateRequestSchema doesn't list `version`,
  // `deleted`, or several optional config fields the API accepts. Cast to
  // bypass the schema gap.
  const { data } = await api.PATCH("/api/projects/{project_id}/feature_flags/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { ...payload, version: -1 } as unknown as PatchedFeatureFlagBody,
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
    // Same body-schema gap as updateFeatureFlag.
    body: { deleted: true, version: -1 } as unknown as PatchedFeatureFlagBody,
  });
}
