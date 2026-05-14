import type { ClientConfig } from "../../client/config.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

export type ServerTile = {
  id?: number;
  insight?: { id: number; short_id?: string } | null;
  text?: { body: string } | null;
  layouts?: Record<string, { x: number; y: number; w: number; h: number }>;
  color?: string | null;
};

export type ServerDashboard = {
  id: number;
  name: string;
  description?: string | null;
  pinned?: boolean;
  tags: string[];
  restriction_level?: number;
  creation_mode?: string;
  deleted?: boolean;
  tiles?: ServerTile[];
};

export type DashboardCreate = {
  name: string;
  description?: string | null;
  pinned?: boolean;
  tags?: string[];
  restriction_level?: number;
  tiles?: unknown[];
};

export type DashboardUpdate = Partial<DashboardCreate>;

export async function listDashboards(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboards/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = data as unknown as Paginated<ServerDashboard>;
  return followPagination(config, firstPage, { verbose: options.verbose });
}

export async function listManagedDashboards(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard[]> {
  const all = await listDashboards(config, options);
  return all.filter((d) => d.tags?.some((tag) => tag.startsWith("iac:dashboards:")));
}

export async function getDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return data as unknown as ServerDashboard;
}

export async function createDashboard(
  config: ClientConfig,
  payload: DashboardCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/dashboards/", {
    params: { path: { project_id: config.projectId } },
    body: payload as never,
  });
  return data as unknown as ServerDashboard;
}

export async function updateDashboard(
  config: ClientConfig,
  id: number,
  payload: DashboardUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as never,
  });
  return data as unknown as ServerDashboard;
}

export async function deleteDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/dashboards/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true } as never,
  });
}
