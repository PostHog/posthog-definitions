import type { ClientConfig } from "../../client/config.js";
import { isManagedTag } from "../../apply/display.js";
import { renderArray, renderObject, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import {
  listEventSchemas,
  type ServerEventDefinition,
  updateEventDefinition,
} from "./client.js";
import { eventDefinitionTag } from "./pipeline.js";
import type { EventDefinition } from "./sdk.js";

const HASH_TAG_PREFIX = "iac:hash:";

/**
 * Side channel for the property-group ids linked to each event definition
 * via EventSchema. Populated by `pullDependencies` (which calls the
 * EventSchema list endpoint) and consumed by `renderToFile`. Keyed by the
 * server row object so multiple event definitions don't trample each other.
 */
const linkedGroupIdsByServer = new WeakMap<ServerEventDefinition, string[]>();

/**
 * Per-config memoization of the EventSchema list call. Without this, every
 * event-definition's `pullDependencies` re-fetches the entire join table —
 * O(N) round-trips for N event definitions in one pull. With the cache it
 * collapses to one. Keyed by ClientConfig (one orchestrator run = one
 * config object); WeakMap lets the cache GC after the run.
 */
const eventSchemasByConfig = new WeakMap<
  ClientConfig,
  Promise<Awaited<ReturnType<typeof listEventSchemas>>>
>();

export function pullFilter(
  _server: ServerEventDefinition,
): { kept: true } | { kept: false; reason: string } {
  // Heuristic: PostHog auto-creates event definitions on first ingest, so
  // pulling unconditionally would dump the whole event catalog. We rely on
  // the picker selection to scope.
  return { kept: true };
}

export function pullLabel(
  server: ServerEventDefinition,
): { primary: string; secondary?: string } {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  const secondary = userTags.length > 0 ? `[${userTags.join(", ")}]` : undefined;
  return { primary: server.name, secondary };
}

export function serverIdOf(server: ServerEventDefinition): string {
  return server.id;
}

/**
 * Discover linked property groups via the EventSchema join table. Stashes the
 * id list on a module-scope WeakMap so `renderToFile` can later render the
 * import lines without re-fetching.
 */
export async function pullDependencies(
  config: ClientConfig,
  server: ServerEventDefinition,
  options: { verbose?: boolean } = {},
): Promise<PullDependency[]> {
  let pending = eventSchemasByConfig.get(config);
  if (!pending) {
    pending = listEventSchemas(config, options);
    eventSchemasByConfig.set(config, pending);
  }
  const schemas = await pending;
  const groupIds: string[] = [];
  for (const link of schemas) {
    if (link.event_definition === server.id) {
      groupIds.push(link.property_group.id);
    }
  }
  linkedGroupIdsByServer.set(server, groupIds);
  return groupIds.map((id) => ({ resourceName: "property-groups", serverId: id }));
}

export function renderToFile(
  server: ServerEventDefinition,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `event-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const groupIds = linkedGroupIdsByServer.get(server) ?? [];
  const groupImports: Array<{ varName: string; filename: string }> = [];
  const groupVarNames: string[] = [];
  for (const groupId of groupIds) {
    const entry = ctx.importForServerIdOptional("property-groups", groupId);
    if (!entry) {
      ctx.warn(
        `Event definition "${server.name}" links to property group ${groupId}, but it wasn't pulled. Re-run with cascade on.`,
      );
      continue;
    }
    groupImports.push({ varName: entry.varName, filename: entry.filename });
    groupVarNames.push(entry.varName);
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  if (server.description) fields.description = stringLiteral(server.description);
  if (server.enforcement_mode && server.enforcement_mode !== "allow") {
    fields.enforcementMode = stringLiteral(server.enforcement_mode);
  }
  if (server.primary_property) fields.primaryProperty = stringLiteral(server.primary_property);
  if (groupVarNames.length > 0) {
    fields.propertyGroups = renderArray(groupVarNames, 4);
  }
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  if (userTags.length > 0) fields.tags = `[${userTags.map(stringLiteral).join(", ")}]`;

  const parts: string[] = [`import { eventDefinition } from "@posthog/definitions";`];
  for (const { varName, filename } of groupImports) {
    parts.push(`import ${varName} from "../property-groups/${filename.replace(/\.ts$/, ".js")}";`);
  }
  parts.push("");
  parts.push(`export default eventDefinition(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerEventDefinition,
  spec: EventDefinition,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  await updateEventDefinition(
    config,
    server.id,
    { tags: [eventDefinitionTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags] },
    options,
  );
}

/** Test seam: lets unit tests preload the linked-group cache without an API. */
export const _testHooks = {
  setLinkedGroupIds(server: ServerEventDefinition, ids: string[]): void {
    linkedGroupIdsByServer.set(server, ids);
  },
};
