import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { PropertyDef, PropertyGroup, PropertyMap } from "./sdk.js";
import {
  createPropertyGroup,
  deletePropertyGroup,
  getPropertyGroup,
  type PropertyGroupCreate,
  type PropertyGroupPropertyPayload,
  type ServerPropertyGroup,
  type ServerPropertyGroupProperty,
  updatePropertyGroup,
} from "./client.js";

/**
 * Property groups have no `tags` field on the server, so identity and hash are
 * embedded in the `description` as a trailing HTML comment — same scheme as
 * endpoints:
 *
 *     <user description>
 *
 *     <!-- iac:property-groups:<key> iac:hash:<hex> -->
 *
 * A group without the marker is invisible to the CLI (safety invariant).
 */
export const PROPERTY_GROUP_IDENTITY_PREFIX = "iac:property-groups:";

const MARKER_REGEX = /\n*<!--\s*iac:property-groups:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = {
  userDescription: string;
  key: string;
  hash: string;
};

function parseMarker(description: string | null | undefined): ParsedMarker | undefined {
  if (!description) return undefined;
  const match = description.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userDescription: description.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userDescription: string | undefined, key: string, hash: string): string {
  const trailer = `<!-- iac:property-groups:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function propertyGroupKeyFromServer(server: ServerPropertyGroup): string | undefined {
  return parseMarker(server.description)?.key;
}

export function propertyGroupHashFromServer(server: ServerPropertyGroup): string | undefined {
  return parseMarker(server.description)?.hash;
}

function normalizeProperty(name: string, def: PropertyDef): PropertyGroupPropertyPayload {
  return {
    name,
    property_type: def.type,
    is_required: def.required ?? false,
    is_optional_in_types: def.is_optional_in_types ?? false,
    description: def.description ?? "",
  };
}

function propertiesForPayload(properties: PropertyMap): PropertyGroupPropertyPayload[] {
  return Object.keys(properties)
    .sort()
    .map((name) => normalizeProperty(name, properties[name]!));
}

function propertyGroupSpecForHash(spec: PropertyGroup): unknown {
  return {
    key: spec.key,
    description: spec.description ?? "",
    properties: propertiesForPayload(spec.properties),
  };
}

export function propertyGroupHash(spec: PropertyGroup): string {
  return specHash(propertyGroupSpecForHash(spec));
}

export function propertyGroupPayload(spec: PropertyGroup, hash: string): PropertyGroupCreate {
  return {
    name: spec.key,
    description: withMarker(spec.description, spec.key, hash),
    properties: propertiesForPayload(spec.properties),
  };
}

export function looksLikePropertyGroup(value: unknown): value is PropertyGroup {
  return getResourceKind(value) === "property-group";
}

export function validatePropertyGroups(specs: PropertyGroup[]): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) {
      issues.push("propertyGroup.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(
        `property group "${spec.key}" key must match ${KEY_PATTERN.source}`,
      );
    }
    if (seen.has(spec.key)) {
      issues.push(`Duplicate property group key "${spec.key}"`);
    }
    seen.add(spec.key);

    const propNames = Object.keys(spec.properties ?? {});
    if (propNames.length === 0) {
      issues.push(`property group "${spec.key}" must define at least one property`);
    }
    for (const name of propNames) {
      if (!name) {
        issues.push(`property group "${spec.key}" has a property with an empty name`);
        continue;
      }
      const def = spec.properties[name]!;
      if (!def.type) {
        issues.push(`property group "${spec.key}" property "${name}" is missing type`);
      }
    }
  }
  return issues;
}

async function assertManagedPropertyGroup(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getPropertyGroup(config, id, options);
  if (propertyGroupKeyFromServer(current) !== key) {
    throw new SafetyViolationError("property group", id, key);
  }
}

export async function runPropertyGroupOp(
  config: ClientConfig,
  op: ResourceOp<PropertyGroup, ServerPropertyGroup>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") {
    ctx.propertyGroupIdByKey.set(op.spec.key, op.server.id);
    return;
  }

  const payload = propertyGroupPayload(op.spec, propertyGroupHash(op.spec));

  if (op.kind === "create") {
    const created = await createPropertyGroup(config, payload, options);
    ctx.propertyGroupIdByKey.set(op.spec.key, created.id);
    return;
  }

  await assertManagedPropertyGroup(config, op.server.id, op.spec.key, options);
  const updated = await updatePropertyGroup(config, op.server.id, payload, options);
  ctx.propertyGroupIdByKey.set(op.spec.key, updated.id);
}

export async function prunePropertyGroup(
  config: ClientConfig,
  orphan: ServerPropertyGroup,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = propertyGroupKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManagedPropertyGroup(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deletePropertyGroup(config, orphan.id, options);
  return true;
}

function displayProperty(prop: ServerPropertyGroupProperty | PropertyGroupPropertyPayload): DisplayValue {
  return obj([
    ["name", scalar(prop.name)],
    ["type", scalar(prop.property_type)],
    ["required", scalar(prop.is_required ?? false)],
    ["is_optional_in_types", scalar(prop.is_optional_in_types ?? false)],
    ["description", scalar(prop.description ?? "")],
  ]);
}

export function displayPropertyGroup(spec: PropertyGroup): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["description", scalar(spec.description ?? null)],
    ["properties", arr(propertiesForPayload(spec.properties).map(displayProperty))],
  ]);
}

export function displayPropertyGroupFromServer(server: ServerPropertyGroup): DisplayValue {
  return obj([
    ["key", scalar(propertyGroupKeyFromServer(server) ?? null)],
    ["description", scalar(stripMarker(server.description))],
    [
      "properties",
      arr(
        [...(server.properties ?? [])]
          .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
          .map(displayProperty),
      ),
    ],
  ]);
}

// Re-exported so the typed-posthog wrapper can borrow the shape util.
export { propertiesForPayload };
// `displayJson` may be useful when richer property descriptions land later.
export { displayJson };
