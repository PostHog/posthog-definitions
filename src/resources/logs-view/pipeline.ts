import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, displayJson, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { LogsView, LogsViewColumn } from "./sdk.js";
import {
  createLogsView,
  deleteLogsView,
  getLogsView,
  type LogsViewCreate,
  type ServerLogsView,
  updateLogsView,
} from "./client.js";

export const LOGS_VIEW_IDENTITY_PREFIX = "iac:logs-views:";

/** Server caps `name` at 400 chars; the name also carries the identity marker. */
const NAME_MAX = 400;

const MARKER_REGEX = /\n*<!--\s*iac:logs-views:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userName: string; key: string; hash: string };

function parseMarker(name: string | null | undefined): ParsedMarker | undefined {
  if (!name) return undefined;
  const match = name.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userName: name.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

export function withMarker(userName: string, key: string, hash: string): string {
  const trailer = `<!-- iac:logs-views:${key} iac:hash:${hash} -->`;
  const trimmed = userName.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(name: string | null | undefined): string | null {
  if (!name) return null;
  const parsed = parseMarker(name);
  return parsed ? parsed.userName || null : name;
}

export function logsViewKeyFromServer(server: ServerLogsView): string | undefined {
  return parseMarker(server.name)?.key;
}

export function logsViewHashFromServer(server: ServerLogsView): string | undefined {
  return parseMarker(server.name)?.hash;
}

function columnsForHash(columns: LogsViewColumn[] | undefined): unknown {
  if (!columns) return null;
  // Order is significant (array index = column order); keep it. Normalise each
  // entry to a stable key set so an omitted optional never flips the hash.
  return columns.map((c) => ({
    id: c.id,
    type: c.type,
    name: c.name ?? null,
    expression: c.expression ?? null,
    width: c.width ?? null,
  }));
}

function specForHash(spec: LogsView): unknown {
  return {
    key: spec.key,
    name: spec.name,
    filters: spec.filters ?? null,
    columns: columnsForHash(spec.columns),
    pinned: spec.pinned ?? false,
  };
}

export function logsViewHash(spec: LogsView): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: LogsView, hash: string): LogsViewCreate {
  const payload: LogsViewCreate = {
    name: withMarker(spec.name, spec.key, hash),
  };
  if (spec.filters !== undefined) payload.filters = spec.filters;
  if (spec.columns !== undefined) payload.columns = spec.columns;
  if (spec.pinned !== undefined) payload.pinned = spec.pinned;
  return payload;
}

export function looksLikeLogsView(value: unknown): value is LogsView {
  return getResourceKind(value) === "logs-view";
}

export function validateLogsViews(specs: LogsView[], _state: DesiredState): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("logsView.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`logsView "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate logsView key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`logsView "${spec.key}" name is required (it carries the identity marker)`);
    } else {
      const withMarkerLen = withMarker(spec.name, spec.key, logsViewHash(spec)).length;
      if (withMarkerLen > NAME_MAX) {
        issues.push(
          `logsView "${spec.key}" name is too long: name + identity marker is ${withMarkerLen} chars but the server caps \`name\` at ${NAME_MAX}. Shorten the name (or key).`,
        );
      }
    }

    for (const [i, col] of (spec.columns ?? []).entries()) {
      if (!col.id) issues.push(`logsView "${spec.key}" column[${i}] requires a stable \`id\``);
      if (!col.type) issues.push(`logsView "${spec.key}" column[${i}] requires a \`type\``);
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  shortId: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getLogsView(config, shortId, options);
  if (logsViewKeyFromServer(current) !== key) {
    throw new SafetyViolationError("logs-view", shortId, key);
  }
}

export async function runLogsViewOp(
  config: ClientConfig,
  op: ResourceOp<LogsView, ServerLogsView>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = buildPayload(op.spec, logsViewHash(op.spec));

  if (op.kind === "create") {
    await createLogsView(config, payload, options);
    return;
  }

  await assertManaged(config, op.server.short_id, op.spec.key, options);
  await updateLogsView(config, op.server.short_id, payload, options);
}

export async function pruneLogsView(
  config: ClientConfig,
  orphan: ServerLogsView,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = logsViewKeyFromServer(orphan) ?? `id:${orphan.short_id}`;
  try {
    await assertManaged(config, orphan.short_id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteLogsView(config, orphan.short_id, options);
  return true;
}

export function displayLogsView(spec: LogsView): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["filters", displayJson(spec.filters ?? null)],
    ["columns", displayJson(columnsForHash(spec.columns))],
    ["pinned", scalar(spec.pinned ?? false)],
  ]);
}

export function displayLogsViewFromServer(server: ServerLogsView): DisplayValue {
  const columns = server.columns
    ? (server.columns as LogsViewColumn[])
    : undefined;
  return obj([
    ["key", scalar(logsViewKeyFromServer(server) ?? null)],
    ["name", scalar(stripMarker(server.name))],
    ["filters", displayJson(server.filters ?? null)],
    ["columns", displayJson(columnsForHash(columns))],
    ["pinned", scalar(server.pinned ?? false)],
  ]);
}
