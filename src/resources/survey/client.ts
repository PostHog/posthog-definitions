import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:surveys:";

export const ServerSurveySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(""),
    type: z.enum(["popover", "widget", "external_survey", "api"]),
    questions: z.array(z.unknown()).nullable().default([]),
    appearance: z.record(z.string(), z.unknown()).nullable().optional(),
    conditions: z.record(z.string(), z.unknown()).nullable().optional(),
    linked_flag_id: z.number().nullable().optional(),
    targeting_flag: z.object({ id: z.number() }).loose().nullable().optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    archived: z.boolean().default(false),
    responses_limit: z.number().nullable().optional(),
    enable_partial_responses: z.boolean().nullable().optional(),
    schedule: z.string().nullable().optional(),
  })
  .loose();

export type ServerSurvey = z.infer<typeof ServerSurveySchema>;

export type SurveyCreate = {
  name: string;
  description: string;
  type: "popover" | "widget" | "external_survey" | "api";
  questions: unknown[];
  appearance?: Record<string, unknown>;
  conditions?: Record<string, unknown>;
  linked_flag_id?: number | null;
  targeting_flag_id?: number;
  responses_limit?: number | null;
  enable_partial_responses?: boolean;
  schedule?: string;
  archived?: boolean;
};

export type SurveyUpdate = Partial<SurveyCreate> & { end_date?: string | null };

type SurveyBody = components["schemas"]["SurveySerializerCreateUpdateOnlySchema"];
type GeneratedPaginatedList = components["schemas"]["PaginatedSurveyList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedSurveys(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey[]> {
  const all = await listSurveys(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every survey in the project; used by pull. */
export async function listSurveys(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/surveys/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerSurveySchema.parse(row));
}

export async function getSurvey(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/surveys/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerSurveySchema.parse(data);
}

export async function createSurvey(
  config: ClientConfig,
  payload: SurveyCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/surveys/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as SurveyBody,
  });
  return ServerSurveySchema.parse(data);
}

export async function updateSurvey(
  config: ClientConfig,
  id: string,
  payload: SurveyUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/surveys/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as SurveyBody,
  });
  return ServerSurveySchema.parse(data);
}

export async function deleteSurvey(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/surveys/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}

export async function launchSurvey(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/surveys/{id}/launch/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerSurveySchema.parse(data);
}

export async function stopSurvey(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerSurvey> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/surveys/{id}/stop/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerSurveySchema.parse(data);
}
