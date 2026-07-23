import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const ActionStepPropertySchema = z
  .object({
    key: z.string(),
    value: z.unknown().optional(),
    operator: z.string().optional(),
    type: z.string().optional(),
  })
  .loose();

const ActionStepSchema = z
  .object({
    event: z.string().nullable().optional(),
    properties: z.array(ActionStepPropertySchema).nullable().optional(),
    selector: z.string().nullable().optional(),
    tag_name: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    text_matching: z.enum(["contains", "regex", "exact"]).nullable().optional(),
    href: z.string().nullable().optional(),
    href_matching: z.enum(["contains", "regex", "exact"]).nullable().optional(),
    url: z.string().nullable().optional(),
    url_matching: z.enum(["contains", "regex", "exact"]).nullable().optional(),
  })
  .loose();

export const ServerActionSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).default([]),
    post_to_slack: z.boolean().nullable().optional(),
    slack_message_format: z.string().nullable().optional(),
    steps: z.array(ActionStepSchema).nullable().optional(),
    pinned_at: z.string().nullable().optional(),
    deleted: z.boolean().optional(),
  })
  .loose();

export type ServerAction = z.infer<typeof ServerActionSchema>;

export type ActionCreate = {
  name: string;
  description?: string;
  tags?: string[];
  post_to_slack?: boolean;
  slack_message_format?: string;
  steps?: unknown[];
  pinned_at?: string | null;
};

export type ActionUpdate = Partial<ActionCreate> & { deleted?: boolean };

type ActionBody = components["schemas"]["Action"];
type PatchedActionBody = components["schemas"]["PatchedAction"];
type GeneratedPaginatedActionList = components["schemas"]["PaginatedActionList"];

function paginatedFrom(raw: GeneratedPaginatedActionList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedActions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerAction[]> {
  const all = await listActions(config, options);
  return all.filter((row) => row.tags?.some((tag) => tag.startsWith("iac:actions:")));
}

/** Unfiltered list of every action in the project; used by pull. */
export async function listActions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerAction[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/actions/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 100 },
    },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw.map((row) => ServerActionSchema.parse(row));
}

export async function getAction(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerAction> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/actions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerActionSchema.parse(data);
}

export async function createAction(
  config: ClientConfig,
  payload: ActionCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerAction> {
  const api = createApiClient(config, { verbose: options.verbose });
  // The Action schema marks readonly response fields (id, created_at,
  // created_by, is_calculating, team_id, is_action, bytecode_error,
  // creation_context, user_access_level) as required on the body type, even
  // though the server generates them. Cast to bypass — same upstream issue
  // as insights/feature-flags.
  const { data } = await api.POST("/api/projects/{project_id}/actions/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as ActionBody,
  });
  return ServerActionSchema.parse(data);
}

export async function updateAction(
  config: ClientConfig,
  id: number,
  payload: ActionUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerAction> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/actions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedActionBody,
  });
  return ServerActionSchema.parse(data);
}

export async function deleteAction(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  // PostHog soft-deletes actions via PATCH {deleted: true}; the DELETE verb
  // returns 405 ("Hard delete of this model is not allowed").
  await api.PATCH("/api/projects/{project_id}/actions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: { deleted: true } as unknown as PatchedActionBody,
  });
}
