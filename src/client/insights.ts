import type { ClientConfig } from "./config.js";
import { paginate, request } from "./http.js";

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

function insightsPath(projectId: string, suffix = ""): string {
  return `/api/projects/${projectId}/insights/${suffix}`;
}

export async function listManagedInsights(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight[]> {
  const all = await paginate<ServerInsight>(config, insightsPath(config.projectId), {
    query: { limit: 100 },
    verbose: options.verbose,
  });
  return all.filter((i) => i.tags?.some((tag) => tag.startsWith("iac:insights:")));
}

export async function getInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  return request<ServerInsight>(config, insightsPath(config.projectId, `${id}/`), {
    verbose: options.verbose,
  });
}

export async function createInsight(
  config: ClientConfig,
  payload: InsightCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  return request<ServerInsight>(config, insightsPath(config.projectId), {
    method: "POST",
    body: payload,
    verbose: options.verbose,
  });
}

export async function updateInsight(
  config: ClientConfig,
  id: number,
  payload: InsightUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerInsight> {
  return request<ServerInsight>(config, insightsPath(config.projectId, `${id}/`), {
    method: "PATCH",
    body: payload,
    verbose: options.verbose,
  });
}

export async function deleteInsight(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await request<void>(config, insightsPath(config.projectId, `${id}/`), {
    method: "DELETE",
    verbose: options.verbose,
  });
}
