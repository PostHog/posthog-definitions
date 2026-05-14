import type { ClientConfig } from "../../client/config.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

/**
 * Server-side filter for managed endpoints. Mirrored from the description
 * marker emitted by `pipeline.ts`; if you change one, change the other.
 */
const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:endpoints:";

export type ServerEndpoint = {
  id: string;
  name: string;
  description?: string | null;
  query?: unknown;
  is_active?: boolean;
  is_materialized?: boolean;
  derived_from_insight?: string | null;
  data_freshness_seconds?: number | null;
  bucket_overrides?: Record<string, unknown> | null;
};

export type EndpointCreate = {
  name: string;
  description?: string | null;
  query: unknown;
  is_active?: boolean;
  is_materialized?: boolean;
  derived_from_insight?: string | null;
  data_freshness_seconds?: number;
  bucket_overrides?: Record<string, unknown>;
};

export type EndpointUpdate = Partial<EndpointCreate>;

export async function listManagedEndpoints(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/environments/{environment_id}/endpoints/", {
    params: {
      path: { environment_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = data as unknown as Paginated<ServerEndpoint>;
  const all = await followPagination(config, firstPage, { verbose: options.verbose });
  return all.filter((e) => (e.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/environments/{environment_id}/endpoints/{name}/", {
    params: { path: { environment_id: config.projectId, name } },
  });
  return data as unknown as ServerEndpoint;
}

export async function createEndpoint(
  config: ClientConfig,
  payload: EndpointCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/environments/{environment_id}/endpoints/", {
    params: { path: { environment_id: config.projectId } },
    body: payload as never,
  });
  return data as unknown as ServerEndpoint;
}

export async function updateEndpoint(
  config: ClientConfig,
  name: string,
  payload: EndpointUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/environments/{environment_id}/endpoints/{name}/", {
    params: { path: { environment_id: config.projectId, name } },
    body: payload as never,
  });
  return data as unknown as ServerEndpoint;
}

export async function deleteEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/environments/{environment_id}/endpoints/{name}/", {
    params: { path: { environment_id: config.projectId, name } },
  });
}
