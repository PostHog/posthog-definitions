import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_NAME_PREFIX = "<!-- iac:logs-sampling-rules:";

export const ServerLogsSamplingRuleSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().default(""),
    enabled: z.boolean().nullable().optional(),
    priority: z.number().nullable().optional(),
    rule_type: z.string(),
    scope_service: z.string().nullable().optional(),
    scope_path_pattern: z.string().nullable().optional(),
    scope_attribute_filters: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    config: z.unknown(),
  })
  .loose();

export type ServerLogsSamplingRule = z.infer<typeof ServerLogsSamplingRuleSchema>;

export type LogsSamplingRuleCreate = {
  name: string;
  rule_type: string;
  config: unknown;
  enabled?: boolean;
  priority?: number | null;
  scope_service?: string | null;
  scope_path_pattern?: string | null;
  scope_attribute_filters?: Record<string, unknown>[];
};

export type LogsSamplingRuleUpdate = Partial<LogsSamplingRuleCreate>;

type SamplingBody = components["schemas"]["LogsSamplingRule"];
type PatchedSamplingBody = components["schemas"]["PatchedLogsSamplingRule"];
type GeneratedPaginatedList = components["schemas"]["PaginatedLogsSamplingRuleList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listLogsSamplingRules(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsSamplingRule[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/logs/sampling_rules/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerLogsSamplingRuleSchema.parse(row));
}

export async function listManagedLogsSamplingRules(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsSamplingRule[]> {
  const all = await listLogsSamplingRules(config, options);
  return all.filter((row) => (row.name ?? "").includes(MANAGED_NAME_PREFIX));
}

export async function getLogsSamplingRule(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsSamplingRule> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/logs/sampling_rules/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerLogsSamplingRuleSchema.parse(data);
}

export async function createLogsSamplingRule(
  config: ClientConfig,
  payload: LogsSamplingRuleCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsSamplingRule> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/logs/sampling_rules/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as SamplingBody,
  });
  return ServerLogsSamplingRuleSchema.parse(data);
}

export async function updateLogsSamplingRule(
  config: ClientConfig,
  id: string,
  payload: LogsSamplingRuleUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerLogsSamplingRule> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/logs/sampling_rules/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedSamplingBody,
  });
  return ServerLogsSamplingRuleSchema.parse(data);
}

/** Delete a sampling rule. DELETE → 204 (real delete, verified live). */
export async function deleteLogsSamplingRule(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/logs/sampling_rules/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
