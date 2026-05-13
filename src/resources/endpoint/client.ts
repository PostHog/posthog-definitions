import type { ClientConfig } from "../../client/config.js";
import { paginate, request } from "../../client/http.js";

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

function endpointsPath(projectId: string, suffix = ""): string {
  return `/api/environments/${projectId}/endpoints/${suffix}`;
}

export async function listManagedEndpoints(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint[]> {
  const all = await paginate<ServerEndpoint>(config, endpointsPath(config.projectId), {
    query: { limit: 100 },
    verbose: options.verbose,
  });
  return all.filter((e) => (e.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  return request<ServerEndpoint>(
    config,
    endpointsPath(config.projectId, `${encodeURIComponent(name)}/`),
    {
      verbose: options.verbose,
    },
  );
}

export async function createEndpoint(
  config: ClientConfig,
  payload: EndpointCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  return request<ServerEndpoint>(config, endpointsPath(config.projectId), {
    method: "POST",
    body: payload,
    verbose: options.verbose,
  });
}

export async function updateEndpoint(
  config: ClientConfig,
  name: string,
  payload: EndpointUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerEndpoint> {
  return request<ServerEndpoint>(
    config,
    endpointsPath(config.projectId, `${encodeURIComponent(name)}/`),
    {
      method: "PATCH",
      body: payload,
      verbose: options.verbose,
    },
  );
}

export async function deleteEndpoint(
  config: ClientConfig,
  name: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await request<void>(config, endpointsPath(config.projectId, `${encodeURIComponent(name)}/`), {
    method: "DELETE",
    verbose: options.verbose,
  });
}
