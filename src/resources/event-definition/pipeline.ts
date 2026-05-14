import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, filterUserTags, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import type { ApplyContext, ResourceOp } from "../types.js";
import type { PropertyGroup, PropertyMap } from "../property-group/sdk.js";
import type { EventDefinition } from "./sdk.js";
import {
  createEventDefinition,
  createEventSchema,
  deleteEventDefinition,
  deleteEventSchema,
  type EventDefinitionCreate,
  getEventDefinition,
  listEventSchemas,
  type ServerEventDefinition,
  updateEventDefinition,
} from "./client.js";

export const EVENT_DEFINITION_TAG_PREFIX = "iac:event-definitions:";
export const HASH_TAG_PREFIX = "iac:hash:";

const KEY_PATTERN = /^[a-zA-Z0-9_$.:-]+$/;

export function eventDefinitionTag(key: string): string {
  return `${EVENT_DEFINITION_TAG_PREFIX}${key}`;
}

export function eventDefinitionKeyFromTags(
  tags: string[] | undefined,
): string | undefined {
  const tag = tags?.find((t) => t.startsWith(EVENT_DEFINITION_TAG_PREFIX));
  return tag?.slice(EVENT_DEFINITION_TAG_PREFIX.length);
}

export function eventDefinitionHashFromTags(
  tags: string[] | undefined,
): string | undefined {
  return tags
    ?.find((t) => t.startsWith(HASH_TAG_PREFIX))
    ?.slice(HASH_TAG_PREFIX.length);
}

function hashTag(hex: string): string {
  return `${HASH_TAG_PREFIX}${hex}`;
}

function mergeTags(userTags: string[] | undefined, managedTags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of managedTags) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  for (const tag of userTags ?? []) {
    if (tag.startsWith("iac:")) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
}

function propertyGroupKeys(spec: EventDefinition): string[] {
  return (spec.propertyGroups ?? []).map((g) => g.key).sort();
}

function eventDefinitionSpecForHash(spec: EventDefinition): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    enforcement_mode: spec.enforcementMode ?? "allow",
    primary_property: spec.primaryProperty ?? null,
    property_group_keys: propertyGroupKeys(spec),
    tags: filterUserTags(spec.tags),
  };
}

export function eventDefinitionHash(spec: EventDefinition): string {
  return specHash(eventDefinitionSpecForHash(spec));
}

export function eventDefinitionPayload(
  spec: EventDefinition,
  hash: string,
): EventDefinitionCreate {
  const payload: EventDefinitionCreate = {
    name: spec.name,
    description: spec.description ?? null,
    tags: mergeTags(spec.tags, [eventDefinitionTag(spec.key), hashTag(hash)]),
  };
  if (spec.enforcementMode !== undefined) payload.enforcement_mode = spec.enforcementMode;
  if (spec.primaryProperty !== undefined) payload.primary_property = spec.primaryProperty;
  return payload;
}

export function looksLikeEventDefinition(value: unknown): value is EventDefinition {
  // No structural fallback: events are factory-marked. Structural overlap with
  // other resources (`{ key, name }`) makes a shape check unsafe.
  return (
    (
      (value as { [k: symbol]: unknown })?.[
        Symbol.for("posthog-definitions/resource-kind")
      ] as string | undefined
    ) === "event-definition"
  );
}

export function validateEventDefinitions(
  specs: EventDefinition[],
  state: import("../types.js").DesiredState,
): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  const knownGroupKeys = new Set<string>();
  for (const loaded of state.get("property-groups") ?? []) {
    const group = loaded.spec as PropertyGroup<PropertyMap>;
    if (group?.key) knownGroupKeys.add(group.key);
  }

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("eventDefinition.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`event definition "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) {
      issues.push(`Duplicate event definition key "${spec.key}"`);
    }
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`event definition "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate event definition name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    for (const group of spec.propertyGroups ?? []) {
      if (!group?.key) {
        issues.push(
          `event definition "${spec.key}" references a property group without a key`,
        );
        continue;
      }
      if (!knownGroupKeys.has(group.key)) {
        issues.push(
          `event definition "${spec.key}" references unknown property group "${group.key}" — declare it with propertyGroup({ key: "${group.key}", … })`,
        );
      }
    }
  }
  return issues;
}

async function assertManagedEventDefinition(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getEventDefinition(config, id, options);
  if (!current.tags?.includes(eventDefinitionTag(key))) {
    throw new SafetyViolationError("event definition", id, key);
  }
}

/**
 * Diff existing event_schemas links for an event against the desired set, and
 * apply create/delete to reach the desired state. Pure side-effect helper —
 * relies on the caller having ensured the event definition itself exists.
 */
async function reconcileLinks(
  config: ClientConfig,
  eventDefinitionId: string,
  desiredGroupIds: ReadonlySet<string>,
  options: { verbose?: boolean },
): Promise<void> {
  const existing = (await listEventSchemas(config, options)).filter(
    (row) => row.event_definition === eventDefinitionId,
  );
  const existingByGroupId = new Map<string, string>();
  for (const link of existing) {
    existingByGroupId.set(link.property_group.id, link.id);
  }

  for (const groupId of desiredGroupIds) {
    if (!existingByGroupId.has(groupId)) {
      await createEventSchema(config, eventDefinitionId, groupId, options);
    }
  }
  for (const [groupId, linkId] of existingByGroupId) {
    if (!desiredGroupIds.has(groupId)) {
      await deleteEventSchema(config, linkId, options);
    }
  }
}

function resolveDesiredGroupIds(
  spec: EventDefinition,
  ctx: ApplyContext,
): Set<string> {
  const ids = new Set<string>();
  for (const group of spec.propertyGroups ?? []) {
    const id = ctx.propertyGroupIdByKey.get(group.key);
    if (!id) {
      throw new Error(
        `event definition "${spec.key}" references property group "${group.key}" but no server id is known for it. The property-group resource must run before event-definitions.`,
      );
    }
    ids.add(id);
  }
  return ids;
}

export async function runEventDefinitionOp(
  config: ClientConfig,
  op: ResourceOp<EventDefinition, ServerEventDefinition>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = eventDefinitionPayload(op.spec, eventDefinitionHash(op.spec));
  const desiredGroupIds = resolveDesiredGroupIds(op.spec, ctx);

  let serverId: string;
  if (op.kind === "create") {
    const created = await createEventDefinition(config, payload, options);
    serverId = created.id;
  } else {
    await assertManagedEventDefinition(config, op.server.id, op.spec.key, options);
    const updated = await updateEventDefinition(config, op.server.id, payload, options);
    serverId = updated.id;
  }

  await reconcileLinks(config, serverId, desiredGroupIds, options);
}

export async function pruneEventDefinition(
  config: ClientConfig,
  orphan: ServerEventDefinition,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = eventDefinitionKeyFromTags(orphan.tags) ?? `id:${orphan.id}`;
  try {
    await assertManagedEventDefinition(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteEventDefinition(config, orphan.id, options);
  return true;
}

export function displayEventDefinition(spec: EventDefinition): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["enforcement_mode", scalar(spec.enforcementMode ?? "allow")],
    ["primary_property", scalar(spec.primaryProperty ?? null)],
    ["property_groups", arr(propertyGroupKeys(spec).map(scalar))],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
  ]);
}

export function displayEventDefinitionFromServer(
  server: ServerEventDefinition,
): DisplayValue {
  return obj([
    ["key", scalar(eventDefinitionKeyFromTags(server.tags) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["enforcement_mode", scalar(server.enforcement_mode ?? "allow")],
    ["primary_property", scalar(server.primary_property ?? null)],
    // Server-side property groups are reconciled per-apply, not embedded in the
    // EventDefinition payload. Diff display omits them until we plumb the
    // current-state lookup through; users can see them in the UI for now.
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
  ]);
}
