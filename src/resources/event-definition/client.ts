import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_TAG_PREFIX = "iac:event-definitions:";

export const ServerEventDefinitionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).default([]),
    enforcement_mode: z.enum(["allow", "reject"]).optional(),
    primary_property: z.string().nullable().optional(),
    verified: z.boolean().optional(),
    hidden: z.boolean().nullable().optional(),
    post_to_slack: z.boolean().optional(),
  })
  .loose();

export type ServerEventDefinition = z.infer<typeof ServerEventDefinitionSchema>;

export type EventDefinitionCreate = {
  name: string;
  description?: string | null;
  tags: string[];
  enforcement_mode?: "allow" | "reject";
  primary_property?: string | null;
};

export type EventDefinitionUpdate = Partial<EventDefinitionCreate>;

type EnterpriseEventDefinitionBody = components["schemas"]["EnterpriseEventDefinition"];
type PatchedEnterpriseEventDefinitionBody =
  components["schemas"]["PatchedEnterpriseEventDefinition"];
type GeneratedPaginatedEventDefinitionList =
  components["schemas"]["PaginatedEnterpriseEventDefinitionList"];

function paginatedFrom(raw: GeneratedPaginatedEventDefinitionList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

function eventDefinitionsHasManagedTag(tags: string[] | undefined): boolean {
  return (tags ?? []).some((t) => t.startsWith(MANAGED_TAG_PREFIX));
}

export async function listManagedEventDefinitions(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEventDefinition[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/event_definitions/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw
    .map((row) => ServerEventDefinitionSchema.parse(row))
    .filter((row) => eventDefinitionsHasManagedTag(row.tags));
}

export async function getEventDefinition(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEventDefinition> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/event_definitions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerEventDefinitionSchema.parse(data);
}

export async function createEventDefinition(
  config: ClientConfig,
  payload: EventDefinitionCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerEventDefinition> {
  const api = createApiClient(config, { verbose: options.verbose });
  // EnterpriseEventDefinition lists many fields as required (created_at, etc.)
  // that the server fills in. Cast to bypass the schema gap on writes.
  const { data } = await api.POST("/api/projects/{project_id}/event_definitions/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as EnterpriseEventDefinitionBody,
  });
  return ServerEventDefinitionSchema.parse(data);
}

export async function updateEventDefinition(
  config: ClientConfig,
  id: string,
  payload: EventDefinitionUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerEventDefinition> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/event_definitions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedEnterpriseEventDefinitionBody,
  });
  return ServerEventDefinitionSchema.parse(data);
}

export async function deleteEventDefinition(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/event_definitions/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}

// ---------------------------------------------------------------------------
// EventSchema link reconciliation
// ---------------------------------------------------------------------------
//
// EventSchema is a many-to-many table linking event_definition ↔
// schema_property_group. Identity is the pair (event_definition, property_group);
// there's no user-facing key. The event-definition module reconciles links
// per-event after ensuring the EventDefinition row exists.

export const ServerEventSchemaSchema = z
  .object({
    id: z.string(),
    event_definition: z.string(),
    property_group: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .loose(),
  })
  .loose();

export type ServerEventSchema = z.infer<typeof ServerEventSchemaSchema>;

type EventSchemaBody = components["schemas"]["EventSchema"];
type GeneratedPaginatedEventSchemaList = components["schemas"]["PaginatedEventSchemaList"];

function paginatedEventSchemasFrom(raw: GeneratedPaginatedEventSchemaList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

/**
 * Returns every event_schemas row in the project. The upstream API accepts a
 * `?event_definition=<id>` filter but the OpenAPI schema doesn't expose it, so
 * we list all and filter client-side. Reconcile callers pass a single
 * eventDefinitionId and discard the rest.
 */
export async function listEventSchemas(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerEventSchema[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/event_schemas/", {
    params: { path: { project_id: config.projectId } },
  });
  const firstPage = paginatedEventSchemasFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, {
    verbose: options.verbose,
  });
  return allRaw.map((row) => ServerEventSchemaSchema.parse(row));
}

export async function createEventSchema(
  config: ClientConfig,
  eventDefinitionId: string,
  propertyGroupId: string,
  options: { verbose?: boolean } = {},
): Promise<ServerEventSchema> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/event_schemas/", {
    params: { path: { project_id: config.projectId } },
    body: {
      event_definition: eventDefinitionId,
      property_group_id: propertyGroupId,
    } as unknown as EventSchemaBody,
  });
  return ServerEventSchemaSchema.parse(data);
}

export async function deleteEventSchema(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/event_schemas/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
