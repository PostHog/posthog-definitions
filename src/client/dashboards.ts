import type { ClientConfig } from "./config.js";
import { paginate, request } from "./http.js";

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

function dashboardsPath(projectId: string, suffix = ""): string {
  return `/api/projects/${projectId}/dashboards/${suffix}`;
}

export async function listManagedDashboards(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard[]> {
  const all = await paginate<ServerDashboard>(config, dashboardsPath(config.projectId), {
    query: { limit: 100 },
    verbose: options.verbose,
  });
  return all.filter((d) => d.tags?.some((tag) => tag.startsWith("iac:dashboards:")));
}

export async function getDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  return request<ServerDashboard>(config, dashboardsPath(config.projectId, `${id}/`), {
    verbose: options.verbose,
  });
}

export async function createDashboard(
  config: ClientConfig,
  payload: DashboardCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  return request<ServerDashboard>(config, dashboardsPath(config.projectId), {
    method: "POST",
    body: payload,
    verbose: options.verbose,
  });
}

export async function updateDashboard(
  config: ClientConfig,
  id: number,
  payload: DashboardUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboard> {
  return request<ServerDashboard>(config, dashboardsPath(config.projectId, `${id}/`), {
    method: "PATCH",
    body: payload,
    verbose: options.verbose,
  });
}

export async function deleteDashboard(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await request<void>(config, dashboardsPath(config.projectId, `${id}/`), {
    method: "DELETE",
    verbose: options.verbose,
  });
}
