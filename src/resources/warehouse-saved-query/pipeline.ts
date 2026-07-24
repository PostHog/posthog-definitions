import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { WarehouseSavedQuery } from "./sdk.js";
import {
  createWarehouseSavedQuery,
  deleteWarehouseSavedQuery,
  getWarehouseSavedQuery,
  type ServerWarehouseSavedQuery,
  updateWarehouseSavedQuery,
  type WarehouseSavedQueryPayload,
} from "./client.js";

export const WAREHOUSE_SAVED_QUERY_IDENTITY_PREFIX = "iac:warehouse-saved-queries:";

/** Server caps `name` (the HogQL table name) at 128 chars. */
const NAME_MAX = 128;

const MARKER_REGEX = /\n*<!--\s*iac:warehouse-saved-queries:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

type ParsedMarker = { userDescription: string; key: string; hash: string };

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

export function withMarker(userDescription: string, key: string, hash: string): string {
  const trailer = `<!-- iac:warehouse-saved-queries:${key} iac:hash:${hash} -->`;
  const trimmed = userDescription.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function warehouseSavedQueryKeyFromServer(server: ServerWarehouseSavedQuery): string | undefined {
  return parseMarker(server.description)?.key;
}

export function warehouseSavedQueryHashFromServer(server: ServerWarehouseSavedQuery): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: WarehouseSavedQuery): unknown {
  return {
    key: spec.key,
    name: spec.name,
    query: spec.query,
    description: spec.description ?? null,
    folder_id: spec.folderId ?? null,
  };
}

export function warehouseSavedQueryHash(spec: WarehouseSavedQuery): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: WarehouseSavedQuery, hash: string): WarehouseSavedQueryPayload {
  const payload: WarehouseSavedQueryPayload = {
    name: spec.name,
    query: { kind: "HogQLQuery", query: spec.query },
    description: withMarker(spec.description ?? "", spec.key, hash),
  };
  if (spec.folderId !== undefined) payload.folder_id = spec.folderId;
  return payload;
}

export function looksLikeWarehouseSavedQuery(value: unknown): value is WarehouseSavedQuery {
  return getResourceKind(value) === "warehouse-saved-query";
}

export function validateWarehouseSavedQueries(
  specs: WarehouseSavedQuery[],
  _state: DesiredState,
): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("warehouseSavedQuery.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`warehouseSavedQuery "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate warehouseSavedQuery key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`warehouseSavedQuery "${spec.key}" name is required (it is the HogQL table name)`);
    } else {
      if (!NAME_PATTERN.test(spec.name)) {
        issues.push(
          `warehouseSavedQuery "${spec.key}" name "${spec.name}" must be a valid HogQL identifier (${NAME_PATTERN.source})`,
        );
      }
      if (spec.name.length > NAME_MAX) {
        issues.push(`warehouseSavedQuery "${spec.key}" name exceeds the ${NAME_MAX}-char server cap`);
      }
      if (seenNames.has(spec.name)) {
        issues.push(`Duplicate warehouseSavedQuery name "${spec.name}" — the table name must be unique`);
      }
      seenNames.add(spec.name);
    }

    if (!spec.query || spec.query.trim() === "") {
      issues.push(`warehouseSavedQuery "${spec.key}" query is required`);
    }
  }
  return issues;
}

async function assertManagedAndFetch(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<ServerWarehouseSavedQuery> {
  const current = await getWarehouseSavedQuery(config, id, options);
  if (warehouseSavedQueryKeyFromServer(current) !== key) {
    throw new SafetyViolationError("warehouse-saved-query", id, key);
  }
  return current;
}

export async function runWarehouseSavedQueryOp(
  config: ClientConfig,
  op: ResourceOp<WarehouseSavedQuery, ServerWarehouseSavedQuery>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = buildPayload(op.spec, warehouseSavedQueryHash(op.spec));

  if (op.kind === "create") {
    await createWarehouseSavedQuery(config, payload, options);
    return;
  }

  // Update carries a `query`, which the server guards with optimistic
  // concurrency — refetch to (a) re-assert the identity marker and (b) grab the
  // current `latest_history_id` to echo as `edited_history_id`, or the write is
  // rejected as a conflicting edit.
  const current = await assertManagedAndFetch(config, op.server.id, op.spec.key, options);
  if (current.latest_history_id != null) {
    payload.edited_history_id = String(current.latest_history_id);
  }
  await updateWarehouseSavedQuery(config, op.server.id, payload, options);
}

export async function pruneWarehouseSavedQuery(
  config: ClientConfig,
  orphan: ServerWarehouseSavedQuery,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = warehouseSavedQueryKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManagedAndFetch(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteWarehouseSavedQuery(config, orphan.id, options);
  return true;
}

export function displayWarehouseSavedQuery(spec: WarehouseSavedQuery): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["query", scalar(spec.query)],
    ["description", scalar(spec.description ?? null)],
    ["folder_id", scalar(spec.folderId ?? null)],
  ]);
}

export function displayWarehouseSavedQueryFromServer(server: ServerWarehouseSavedQuery): DisplayValue {
  return obj([
    ["key", scalar(warehouseSavedQueryKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["query", scalar(server.query?.query ?? null)],
    ["description", scalar(stripMarker(server.description))],
    ["folder_id", scalar(server.folder_id ?? null)],
  ]);
}
