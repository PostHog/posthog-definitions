import type { ClientConfig } from "../../client/config.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

export type ServerInsight = {
  id: number;
  short_id: string;
  name: string;
  description?: string | null;
  query?: unknown;
  tags: string[];
};

export type InsightCreate = {
  name: string;
  description?: string | null;
  query: unknown;
  tags?: string[];
};

export type InsightUpdate = Partial<InsightCreate>;

export async function listManagedInsights(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/insights/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = data as unknown as Paginated<ServerInsight>;
  const all = await followPagination(config, firstPage, { verbose: options.verbose });
  return all.filter((i) => i.tags?.some((tag) => tag.startsWith("iac:insights:")));
}

export async function getInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return data as unknown as ServerInsight;
}

export async function createInsight(
  config: ClientConfig,
  payload: InsightCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/insights/", {
    params: { path: { project_id: config.projectId } },
    body: payload as never,
  });
  return data as unknown as ServerInsight;
}

export async function updateInsight(
  config: ClientConfig,
  id: number,
  payload: InsightUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as never,
  });
  return data as unknown as ServerInsight;
}

export async function deleteInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.PATCH("/api/projects/{project_id}/insights/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true } as never,
  });
}
