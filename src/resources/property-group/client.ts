import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

/**
 * Server-side filter for managed property groups. Mirrored from the description
 * marker emitted by `pipeline.ts`; if you change one, change the other.
 */
const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:property-groups:";

export const ServerPropertyGroupPropertySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    property_type: z.enum(["String", "Numeric", "Boolean", "DateTime", "Object"]),
    is_required: z.boolean().default(false),
    is_optional_in_types: z.boolean().default(false),
    description: z.string().default(""),
  })
  .loose();

export const ServerPropertyGroupSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(""),
    properties: z.array(ServerPropertyGroupPropertySchema).default([]),
  })
  .loose();

export type ServerPropertyGroup = z.infer<typeof ServerPropertyGroupSchema>;
export type ServerPropertyGroupProperty = z.infer<typeof ServerPropertyGroupPropertySchema>;

export type PropertyGroupPropertyPayload = {
  name: string;
  property_type: "String" | "Numeric" | "Boolean" | "DateTime" | "Object";
  is_required: boolean;
  is_optional_in_types: boolean;
  description: string;
};

export type PropertyGroupCreate = {
  name: string;
  description: string;
  properties: PropertyGroupPropertyPayload[];
};

export type PropertyGroupUpdate = Partial<PropertyGroupCreate>;

type SchemaPropertyGroupBody = components["schemas"]["SchemaPropertyGroup"];
type PatchedSchemaPropertyGroupBody = components["schemas"]["PatchedSchemaPropertyGroup"];
type GeneratedPaginatedPropertyGroupList =
  components["schemas"]["PaginatedSchemaPropertyGroupList"];

function paginatedFrom(raw: GeneratedPaginatedPropertyGroupList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listManagedPropertyGroups(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerPropertyGroup[]> {
  const all = await listPropertyGroups(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

/** Unfiltered list of every property group in the project; used by pull. */
export async function listPropertyGroups(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerPropertyGroup[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/schema_property_groups/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw.map((row) => ServerPropertyGroupSchema.parse(row));
}

export async function getPropertyGroup(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerPropertyGroup> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/schema_property_groups/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerPropertyGroupSchema.parse(data);
}

export async function createPropertyGroup(
  config: ClientConfig,
  payload: PropertyGroupCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerPropertyGroup> {
  const api = createApiClient(config, { verbose: options.verbose });
  // SchemaPropertyGroup body lists `events` as read-only and `created_by` as
  // read-only; we only send the writable fields, so cast through the schema.
  const { data } = await api.POST("/api/projects/{project_id}/schema_property_groups/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as SchemaPropertyGroupBody,
  });
  return ServerPropertyGroupSchema.parse(data);
}

export async function updatePropertyGroup(
  config: ClientConfig,
  id: string,
  payload: PropertyGroupUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerPropertyGroup> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/schema_property_groups/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedSchemaPropertyGroupBody,
  });
  return ServerPropertyGroupSchema.parse(data);
}

export async function deletePropertyGroup(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/schema_property_groups/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
