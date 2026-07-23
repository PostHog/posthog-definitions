import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:hog-functions:";

export const ServerHogFunctionSchema = z
  .object({
    id: z.string(),
    type: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().default(""),
    enabled: z.boolean().nullable().optional(),
    deleted: z.boolean().nullable().optional(),
    // Present on the full retrieve, absent on the minimal list. Passthrough:
    // each value is `{ value, bytecode, order }` or `{ secret: true }`.
    inputs: z.record(z.string(), z.record(z.string(), z.unknown())).nullable().optional(),
    filters: z.record(z.string(), z.unknown()).nullable().optional(),
    // Read-only snapshot of the source template — `template.id` lets us detect
    // templateId drift on update.
    template: z
      .object({ id: z.string().nullable().optional() })
      .loose()
      .nullable()
      .optional(),
    template_id: z.string().nullable().optional(),
  })
  .loose();

export type ServerHogFunction = z.infer<typeof ServerHogFunctionSchema>;

export type HogFunctionInputWire = { value: unknown } | { secret: true };

export type HogFunctionCreate = {
  type: string;
  name: string;
  description: string;
  template_id: string;
  enabled?: boolean;
  inputs?: Record<string, HogFunctionInputWire>;
  filters?: Record<string, unknown>;
};

export type HogFunctionUpdate = {
  name?: string;
  description?: string;
  enabled?: boolean;
  inputs?: Record<string, HogFunctionInputWire>;
  filters?: Record<string, unknown>;
  deleted?: boolean;
};

type HogFunctionBody = components["schemas"]["HogFunction"];
type PatchedHogFunctionBody = components["schemas"]["PatchedHogFunction"];
type GeneratedPaginatedList = components["schemas"]["PaginatedHogFunctionMinimalList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

/** Unfiltered list (minimal shape — has description, no inputs); used by pull. */
export async function listHogFunctions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/hog_functions/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerHogFunctionSchema.parse(row));
}

export async function listManagedHogFunctions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction[]> {
  const all = await listHogFunctions(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Full retrieve (includes inputs + template). */
export async function getHogFunction(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/hog_functions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerHogFunctionSchema.parse(data);
}

export async function createHogFunction(
  config: ClientConfig,
  payload: HogFunctionCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/hog_functions/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as HogFunctionBody,
  });
  return ServerHogFunctionSchema.parse(data);
}

export async function updateHogFunction(
  config: ClientConfig,
  id: string,
  payload: HogFunctionUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/hog_functions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedHogFunctionBody,
  });
  return ServerHogFunctionSchema.parse(data);
}

/**
 * Delete a hog function. The DELETE verb is 403; functions soft-delete via
 * PATCH { deleted: true }.
 */
export async function deleteHogFunction(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateHogFunction(config, id, { deleted: true }, options);
}
