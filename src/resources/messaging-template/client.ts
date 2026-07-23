import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:messaging-templates:";

export const ServerMessageTemplateSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(""),
    type: z.string().nullable().optional(),
    message_category: z.string().nullable().optional(),
    content: z
      .object({
        templating: z.string().nullable().optional(),
        email: z.record(z.string(), z.unknown()).nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
    deleted: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerMessageTemplate = z.infer<typeof ServerMessageTemplateSchema>;

export type MessageTemplateCreate = {
  name: string;
  description: string;
  type: string;
  content: { templating: string; email: Record<string, unknown> };
  message_category?: string | null;
};

export type MessageTemplateUpdate = Partial<MessageTemplateCreate> & { deleted?: boolean };

type MessageTemplateBody = components["schemas"]["MessageTemplate"];
type PatchedMessageTemplateBody = components["schemas"]["PatchedMessageTemplate"];
type GeneratedPaginatedList = components["schemas"]["PaginatedMessageTemplateList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listMessageTemplates(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerMessageTemplate[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/messaging_templates/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerMessageTemplateSchema.parse(row));
}

export async function listManagedMessageTemplates(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerMessageTemplate[]> {
  const all = await listMessageTemplates(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getMessageTemplate(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerMessageTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/messaging_templates/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerMessageTemplateSchema.parse(data);
}

export async function createMessageTemplate(
  config: ClientConfig,
  payload: MessageTemplateCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerMessageTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/messaging_templates/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as MessageTemplateBody,
  });
  return ServerMessageTemplateSchema.parse(data);
}

export async function updateMessageTemplate(
  config: ClientConfig,
  id: string,
  payload: MessageTemplateUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerMessageTemplate> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/messaging_templates/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedMessageTemplateBody,
  });
  return ServerMessageTemplateSchema.parse(data);
}

/**
 * Delete a template. The DELETE verb is 405; templates soft-delete via
 * PATCH { deleted: true }.
 */
export async function deleteMessageTemplate(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateMessageTemplate(config, id, { deleted: true }, options);
}
