import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_CONTENT_PREFIX = "<!-- iac:annotations:";

export const ServerAnnotationSchema = z
  .object({
    id: z.number(),
    content: z.string().nullable().default(""),
    date_marker: z.string().nullable().optional(),
    scope: z.enum(["dashboard_item", "dashboard", "project", "organization", "recording"]).optional(),
    dashboard_item: z.number().nullable().optional(),
    dashboard_id: z.number().nullable().optional(),
    emoji: z.string().nullable().optional(),
    hidden_in_user_interface: z.boolean().nullable().optional(),
    creation_type: z.string().nullable().optional(),
    deleted: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerAnnotation = z.infer<typeof ServerAnnotationSchema>;

export type AnnotationCreate = {
  content: string;
  date_marker: string;
  scope: string;
  dashboard_item?: number | null;
  dashboard_id?: number | null;
  emoji?: string | null;
  hidden_in_user_interface?: boolean | null;
  creation_type?: string;
};

export type AnnotationUpdate = Partial<AnnotationCreate> & { deleted?: boolean };

type AnnotationBody = components["schemas"]["Annotation"];
type PatchedAnnotationBody = components["schemas"]["PatchedAnnotation"];
type GeneratedPaginatedList = components["schemas"]["PaginatedAnnotationList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listAnnotations(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerAnnotation[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/annotations/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerAnnotationSchema.parse(row));
}

export async function listManagedAnnotations(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerAnnotation[]> {
  const all = await listAnnotations(config, options);
  return all.filter((row) => (row.content ?? "").includes(MANAGED_CONTENT_PREFIX));
}

export async function getAnnotation(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerAnnotation> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/annotations/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerAnnotationSchema.parse(data);
}

export async function createAnnotation(
  config: ClientConfig,
  payload: AnnotationCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerAnnotation> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/annotations/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as AnnotationBody,
  });
  return ServerAnnotationSchema.parse(data);
}

export async function updateAnnotation(
  config: ClientConfig,
  id: number,
  payload: AnnotationUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerAnnotation> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/annotations/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedAnnotationBody,
  });
  return ServerAnnotationSchema.parse(data);
}

/**
 * Delete an annotation. The DELETE verb is 405; annotations soft-delete via
 * PATCH { deleted: true }.
 */
export async function deleteAnnotation(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateAnnotation(config, id, { deleted: true }, options);
}
