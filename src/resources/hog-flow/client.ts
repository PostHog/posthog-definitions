import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:hog-flows:";

export const ServerHogFlowSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().default(""),
    status: z.enum(["draft", "active", "archived"]).nullable().optional(),
    exit_condition: z.string().nullable().optional(),
    actions: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    edges: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    trigger_masking: z.record(z.string(), z.unknown()).nullable().optional(),
    conversion: z.record(z.string(), z.unknown()).nullable().optional(),
    variables: z.array(z.unknown()).nullable().optional(),
  })
  .loose();

export type ServerHogFlow = z.infer<typeof ServerHogFlowSchema>;

export type HogFlowCreate = {
  name: string;
  description: string;
  status?: string;
  exit_condition?: string;
  actions: unknown[];
  edges: unknown[];
  trigger_masking?: Record<string, unknown>;
  conversion?: Record<string, unknown>;
  variables?: unknown[];
};

export type HogFlowUpdate = Partial<HogFlowCreate>;

type HogFlowBody = components["schemas"]["HogFlow"];
type PatchedHogFlowBody = components["schemas"]["PatchedHogFlow"];
type GeneratedPaginatedList = components["schemas"]["PaginatedHogFlowMinimalList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listHogFlows(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFlow[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/hog_flows/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerHogFlowSchema.parse(row));
}

export async function listManagedHogFlows(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFlow[]> {
  const all = await listHogFlows(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getHogFlow(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFlow> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/hog_flows/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerHogFlowSchema.parse(data);
}

export async function createHogFlow(
  config: ClientConfig,
  payload: HogFlowCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFlow> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/hog_flows/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as HogFlowBody,
  });
  return ServerHogFlowSchema.parse(data);
}

export async function updateHogFlow(
  config: ClientConfig,
  id: string,
  payload: HogFlowUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFlow> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/hog_flows/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedHogFlowBody,
  });
  return ServerHogFlowSchema.parse(data);
}

/** Hog flows support a real DELETE (204). */
export async function deleteHogFlow(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/hog_flows/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
