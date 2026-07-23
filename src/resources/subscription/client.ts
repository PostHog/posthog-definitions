import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_TITLE_PREFIX = "<!-- iac:subscriptions:";

export const ServerSubscriptionSchema = z
  .object({
    id: z.number(),
    title: z.string().nullable().default(""),
    insight: z.number().nullable().optional(),
    dashboard: z.number().nullable().optional(),
    target_type: z.enum(["email", "slack"]).optional(),
    target_value: z.string().optional(),
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    interval: z.number().nullable().optional(),
    start_date: z.string().nullable().optional(),
    byweekday: z.array(z.string()).nullable().optional(),
    bysetpos: z.number().nullable().optional(),
    count: z.number().nullable().optional(),
    until_date: z.string().nullable().optional(),
    enabled: z.boolean().nullable().optional(),
    integration_id: z.number().nullable().optional(),
    summary_enabled: z.boolean().nullable().optional(),
    summary_prompt_guide: z.string().nullable().optional(),
    prompt: z.string().nullable().optional(),
    deleted: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerSubscription = z.infer<typeof ServerSubscriptionSchema>;

export type SubscriptionCreate = {
  title: string;
  insight?: number | null;
  dashboard?: number | null;
  target_type: string;
  target_value: string;
  frequency: string;
  interval?: number;
  start_date: string;
  byweekday?: string[] | null;
  bysetpos?: number | null;
  count?: number | null;
  until_date?: string | null;
  enabled?: boolean;
  integration_id?: number | null;
  summary_enabled?: boolean;
  summary_prompt_guide?: string;
  prompt?: string | null;
  /**
   * Always false from posthog-definitions: `send_test_now` defaults to TRUE on
   * create (and fires on qualifying updates), which would deliver the
   * subscription immediately. IaC must never trigger a delivery as a side
   * effect of apply.
   */
  send_test_now: boolean;
};

export type SubscriptionUpdate = Partial<SubscriptionCreate> & { deleted?: boolean };

type SubscriptionBody = components["schemas"]["Subscription"];
type PatchedSubscriptionBody = components["schemas"]["PatchedSubscription"];
type GeneratedPaginatedList = components["schemas"]["PaginatedSubscriptionList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listSubscriptions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSubscription[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/subscriptions/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerSubscriptionSchema.parse(row));
}

export async function listManagedSubscriptions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSubscription[]> {
  const all = await listSubscriptions(config, options);
  return all.filter((row) => (row.title ?? "").includes(MANAGED_TITLE_PREFIX));
}

export async function getSubscription(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<ServerSubscription> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/subscriptions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerSubscriptionSchema.parse(data);
}

export async function createSubscription(
  config: ClientConfig,
  payload: SubscriptionCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerSubscription> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/subscriptions/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as SubscriptionBody,
  });
  return ServerSubscriptionSchema.parse(data);
}

export async function updateSubscription(
  config: ClientConfig,
  id: number,
  payload: SubscriptionUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerSubscription> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/subscriptions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedSubscriptionBody,
  });
  return ServerSubscriptionSchema.parse(data);
}

/**
 * Delete a subscription. The DELETE verb is 405; subscriptions soft-delete via
 * PATCH { deleted: true }.
 */
export async function deleteSubscription(
  config: ClientConfig,
  id: number,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateSubscription(config, id, { deleted: true }, options);
}
