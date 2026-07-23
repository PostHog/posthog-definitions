import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

/**
 * The DashboardTemplate serializer schema upstream omits `tiles`, `variables`,
 * and `dashboard_filters` — yet the live API round-trips all three. We schema
 * them explicitly (passthrough on the root keeps the rest) so the fields we
 * actually read are validated.
 */
export const ServerDashboardTemplateSchema = z
  .object({
    id: z.string(),
    template_name: z.string().nullable().default(""),
    dashboard_description: z.string().nullable().optional(),
    tags: z
      .array(z.string())
      .nullish()
      .transform((v) => v ?? []),
    tiles: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    variables: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    dashboard_filters: z.record(z.string(), z.unknown()).nullable().optional(),
    scope: z.string().nullable().optional(),
    is_featured: z.boolean().nullable().optional(),
    deleted: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerDashboardTemplate = z.infer<typeof ServerDashboardTemplateSchema>;

export type DashboardTemplateCreate = {
  template_name: string;
  dashboard_description?: string;
  tags?: string[];
  tiles: unknown[];
  variables?: unknown[] | null;
  dashboard_filters?: Record<string, unknown>;
  is_featured?: boolean;
};

export type DashboardTemplateUpdate = Partial<DashboardTemplateCreate> & { deleted?: boolean };

type DashboardTemplateBody = components["schemas"]["DashboardTemplate"];
type PatchedDashboardTemplateBody = components["schemas"]["PatchedDashboardTemplate"];
type GeneratedPaginatedList = components["schemas"]["PaginatedDashboardTemplateList"];

const MANAGED_TAG_PREFIX = "iac:dashboard-templates:";

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

/** Unfiltered list of every dashboard template in the project; used by pull. */
export async function listDashboardTemplates(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboardTemplate[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboard_templates/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerDashboardTemplateSchema.parse(row));
}

export async function listManagedDashboardTemplates(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboardTemplate[]> {
  const all = await listDashboardTemplates(config, options);
  return all.filter((row) => row.tags?.some((tag) => tag.startsWith(MANAGED_TAG_PREFIX)));
}

export async function getDashboardTemplate(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboardTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/dashboard_templates/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerDashboardTemplateSchema.parse(data);
}

export async function createDashboardTemplate(
  config: ClientConfig,
  payload: DashboardTemplateCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboardTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/dashboard_templates/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as DashboardTemplateBody,
  });
  return ServerDashboardTemplateSchema.parse(data);
}

export async function updateDashboardTemplate(
  config: ClientConfig,
  id: string,
  payload: DashboardTemplateUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerDashboardTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/dashboard_templates/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedDashboardTemplateBody,
  });
  return ServerDashboardTemplateSchema.parse(data);
}

/**
 * Delete a template. The `DELETE` verb is a no-op upstream (it does not remove
 * the row); templates soft-delete via `PATCH { deleted: true }`, same as
 * dashboards and insights.
 */
export async function deleteDashboardTemplate(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateDashboardTemplate(config, id, { deleted: true }, options);
}
