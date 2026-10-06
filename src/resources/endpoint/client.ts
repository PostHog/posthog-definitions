import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

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

type GeneratedEndpoint = components["schemas"]["EndpointResponse"];
type GeneratedPaginatedEndpointList = components["schemas"]["PaginatedEndpointResponseList"];

function toServerEndpoint(raw: GeneratedEndpoint): ServerEndpoint {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    query: raw.query,
    is_active: raw.is_active,
    is_materialized: raw.is_materialized,
    derived_from_insight: raw.derived_from_insight,
    data_freshness_seconds: raw.data_freshness_seconds,
    bucket_overrides: raw.bucket_overrides ?? null,
  };
}

function paginatedFrom(raw: GeneratedPaginatedEndpointList): Paginated<GeneratedEndpoint> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedEndpoints(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint[]> {
  const all = await listEndpoints(config, options);
  return all.filter((e) => (e.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every endpoint in the project; used by pull. */
export async function listEndpoints(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/endpoints/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = paginatedFrom(data!);
  const all = await followPagination<GeneratedEndpoint>(config, firstPage, {
    verbose: options.verbose,
  });
  return all.map(toServerEndpoint);
}

export async function getEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/endpoints/{name}/", {
    params: { path: { project_id: config.projectId, name } },
  });
  return toServerEndpoint(data!);
}

export async function createEndpoint(
  config: ClientConfig,
  payload: EndpointCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/endpoints/", {
    params: { path: { project_id: config.projectId } },
    body: payload,
  });
  return toServerEndpoint(data!);
}

export async function updateEndpoint(
  config: ClientConfig,
  name: string,
  payload: EndpointUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/endpoints/{name}/", {
    params: { path: { project_id: config.projectId, name } },
    body: payload,
  });
  return toServerEndpoint(data!);
}

export async function deleteEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/endpoints/{name}/", {
    params: { path: { project_id: config.projectId, name } },
  });
}
