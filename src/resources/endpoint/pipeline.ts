import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { Endpoint } from "./sdk.js";
import {
  createEndpoint,
  deleteEndpoint,
  type EndpointCreate,
  getEndpoint,
  type ServerEndpoint,
  updateEndpoint,
} from "./client.js";

/**
 * Endpoints don't have a `tags` field, so identity and hash are embedded in the
 * `description` as a trailing HTML comment:
 *
 *     <user description>
 *
 *     <!-- iac:endpoints:<key> iac:hash:<hex> -->
 *
 * The marker must be the last non-whitespace content in the description.
 * A description without this marker is invisible to the CLI (safety invariant).
 */
export const ENDPOINT_IDENTITY_PREFIX = "iac:endpoints:";

const MARKER_REGEX = /\n*<!--\s*iac:endpoints:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;

type ParsedMarker = {
  /** Description with the trailing marker (and its leading blank lines) removed. */
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
  const trailer = `<!-- iac:endpoints:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function endpointKeyFromServer(server: ServerEndpoint): string | undefined {
  return parseMarker(server.description)?.key;
}

export function endpointHashFromServer(server: ServerEndpoint): string | undefined {
  return parseMarker(server.description)?.hash;
}

function endpointSpecForHash(spec: Endpoint): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? null,
    query: spec.query,
    is_active: spec.is_active ?? true,
    is_materialized: spec.is_materialized ?? false,
    derived_from_insight: spec.derived_from_insight ?? null,
    data_freshness_seconds: spec.data_freshness_seconds ?? null,
    bucket_overrides: spec.bucket_overrides ?? null,
  };
}

export function endpointHash(spec: Endpoint): string {
  return specHash(endpointSpecForHash(spec));
}

export function endpointPayload(spec: Endpoint, hash: string): EndpointCreate {
  const description = withMarker(spec.description, spec.key, hash);
  const payload: EndpointCreate = {
    name: spec.name,
    description,
    query: spec.query,
  };
  if (spec.is_active !== undefined) payload.is_active = spec.is_active;
  if (spec.is_materialized !== undefined) payload.is_materialized = spec.is_materialized;
  if (spec.derived_from_insight !== undefined)
    payload.derived_from_insight = spec.derived_from_insight;
  if (spec.data_freshness_seconds !== undefined)
    payload.data_freshness_seconds = spec.data_freshness_seconds;
  if (spec.bucket_overrides !== undefined) payload.bucket_overrides = spec.bucket_overrides;
  return payload;
}

export function looksLikeEndpoint(value: unknown): value is Endpoint {
  return getResourceKind(value) === "endpoint";
}

const NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const VALID_FRESHNESS = new Set([900, 1800, 3600, 21600, 43200, 86400, 604800]);

export function validateEndpoints(specs: Endpoint[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) issues.push("endpoint.key is required");
    if (!spec.name) issues.push(`endpoint "${spec.key}" name is required`);
    if (!spec.query) issues.push(`endpoint "${spec.key}" is missing query`);
    if (spec.name && !NAME_PATTERN.test(spec.name)) {
      issues.push(`endpoint "${spec.key}" name "${spec.name}" must match ${NAME_PATTERN.source}`);
    }
    if (spec.name && spec.name.length > 128) {
      issues.push(`endpoint "${spec.key}" name exceeds 128 characters`);
    }
    if (
      spec.data_freshness_seconds !== undefined &&
      !VALID_FRESHNESS.has(spec.data_freshness_seconds)
    ) {
      issues.push(
        `endpoint "${spec.key}" data_freshness_seconds must be one of ${[...VALID_FRESHNESS].join(", ")}`,
      );
    }
    if (spec.key) {
      if (seenKeys.has(spec.key)) issues.push(`Duplicate endpoint key "${spec.key}"`);
      seenKeys.add(spec.key);
    }
    if (spec.name) {
      if (seenNames.has(spec.name)) issues.push(`Duplicate endpoint name "${spec.name}"`);
      seenNames.add(spec.name);
    }
  }
  return issues;
}

async function assertManagedEndpoint(
  config: ClientConfig,
  name: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getEndpoint(config, name, options);
  if (endpointKeyFromServer(current) !== key) {
    throw new SafetyViolationError("endpoint", name, key);
  }
}

export async function runEndpointOp(
  config: ClientConfig,
  op: ResourceOp<Endpoint, ServerEndpoint>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = endpointPayload(op.spec, op.hash);

  if (op.kind === "create") {
    await createEndpoint(config, payload, options);
    return;
  }

  await assertManagedEndpoint(config, op.server.name, op.key, options);
  await updateEndpoint(config, op.server.name, payload, options);
}

export async function pruneEndpoint(
  config: ClientConfig,
  orphan: ServerEndpoint,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = endpointKeyFromServer(orphan) ?? `name:${orphan.name}`;
  try {
    await assertManagedEndpoint(config, orphan.name, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteEndpoint(config, orphan.name, options);
  return true;
}

function endpointDisplayFields(values: {
  name: string;
  description: string | null;
  query: unknown;
  is_active: boolean;
  is_materialized: boolean;
  derived_from_insight: string | null;
  data_freshness_seconds: number | null;
}): DisplayValue {
  return obj([
    ["name", scalar(values.name)],
    ["description", scalar(values.description)],
    ["query", displayJson(values.query)],
    ["is_active", scalar(values.is_active)],
    ["is_materialized", scalar(values.is_materialized)],
    ["derived_from_insight", scalar(values.derived_from_insight)],
    ["data_freshness_seconds", scalar(values.data_freshness_seconds)],
  ]);
}

export function displayEndpoint(spec: Endpoint): DisplayValue {
  return endpointDisplayFields({
    name: spec.name,
    description: spec.description ?? null,
    query: spec.query,
    is_active: spec.is_active ?? true,
    is_materialized: spec.is_materialized ?? false,
    derived_from_insight: spec.derived_from_insight ?? null,
    data_freshness_seconds: spec.data_freshness_seconds ?? null,
  });
}

export function displayEndpointFromServer(server: ServerEndpoint): DisplayValue {
  return endpointDisplayFields({
    name: server.name,
    description: stripMarker(server.description),
    query: server.query,
    is_active: server.is_active ?? true,
    is_materialized: server.is_materialized ?? false,
    derived_from_insight: server.derived_from_insight ?? null,
    data_freshness_seconds: server.data_freshness_seconds ?? null,
  });
}
