import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, displayJson, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import { projectSecretsForHash, resolveSecrets } from "../secret.js";
import type { BatchExport, BatchExportDestinationType } from "./sdk.js";
import {
  createBatchExport,
  deleteBatchExport,
  getBatchExport,
  type BatchExportPayload,
  type ServerBatchExport,
  updateBatchExport,
} from "./client.js";

export const BATCH_EXPORT_IDENTITY_PREFIX = "iac:batch-exports:";

const SUPPORTED_DESTINATIONS: BatchExportDestinationType[] = ["AwsS3", "S3Compatible", "Snowflake"];
const INTERVALS = ["hour", "day", "week", "every 5 minutes", "every 15 minutes"];
const MODELS = ["events", "persons", "sessions"];

const MARKER_REGEX = /\n*<!--\s*iac:batch-exports:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:batch-exports:${key} iac:hash:${hash} -->`;
  const trimmed = userName.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(name: string | null | undefined): string | null {
  if (!name) return null;
  const parsed = parseMarker(name);
  return parsed ? parsed.userName || null : name;
}

export function batchExportKeyFromServer(server: ServerBatchExport): string | undefined {
  return parseMarker(server.name)?.key;
}

export function batchExportHashFromServer(server: ServerBatchExport): string | undefined {
  return parseMarker(server.name)?.hash;
}

function specForHash(spec: BatchExport): unknown {
  return {
    key: spec.key,
    name: spec.name,
    interval: spec.interval,
    model: spec.model ?? "events",
    paused: spec.paused ?? false,
    hogql_query: spec.hogqlQuery ?? null,
    filters: spec.filters ?? null,
    timezone: spec.timezone ?? null,
    destination: {
      type: spec.destination.type,
      // Secret values never enter the hash — only their env-var name + rotate token.
      config: projectSecretsForHash(spec.destination.config),
    },
  };
}

export function batchExportHash(spec: BatchExport): string {
  return specHash(specForHash(spec));
}

/**
 * Build the create/update payload. Secret refs in `destination.config` are
 * resolved from `process.env` here (throwing on a missing var) — the value is
 * re-sent on every write since PostHog masks it on read and the environment is
 * the source of truth.
 */
function buildPayload(spec: BatchExport, hash: string): BatchExportPayload {
  const payload: BatchExportPayload = {
    name: withMarker(spec.name, spec.key, hash),
    interval: spec.interval,
    destination: {
      type: spec.destination.type,
      config: resolveSecrets(spec.destination.config) as Record<string, unknown>,
    },
    paused: spec.paused ?? false,
  };
  if (spec.model !== undefined) payload.model = spec.model;
  if (spec.hogqlQuery !== undefined) payload.hogql_query = spec.hogqlQuery;
  if (spec.filters !== undefined) payload.filters = spec.filters;
  if (spec.timezone !== undefined) payload.timezone = spec.timezone;
  return payload;
}

export function looksLikeBatchExport(value: unknown): value is BatchExport {
  return getResourceKind(value) === "batch-export";
}

export function validateBatchExports(specs: BatchExport[], _state: DesiredState): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("batchExport.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`batchExport "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate batchExport key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`batchExport "${spec.key}" name is required (it carries the identity marker)`);
    }
    if (!spec.interval || !INTERVALS.includes(spec.interval)) {
      issues.push(`batchExport "${spec.key}" interval must be one of ${INTERVALS.join(", ")}`);
    }
    if (spec.model !== undefined && !MODELS.includes(spec.model)) {
      issues.push(`batchExport "${spec.key}" model must be one of ${MODELS.join(", ")}`);
    }
    if (!spec.destination || !spec.destination.type) {
      issues.push(`batchExport "${spec.key}" destination.type is required`);
    } else if (!SUPPORTED_DESTINATIONS.includes(spec.destination.type)) {
      issues.push(
        `batchExport "${spec.key}" destination type "${spec.destination.type}" is not supported yet. ` +
          `Only inline-credential destinations are supported (${SUPPORTED_DESTINATIONS.join(", ")}); ` +
          `integration-backed destinations (Databricks, AzureBlob, BigQuery, Postgres, Redshift) require a ` +
          `project-specific integration_id that does not port across projects.`,
      );
    } else if (!spec.destination.config || typeof spec.destination.config !== "object") {
      issues.push(`batchExport "${spec.key}" destination.config is required`);
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getBatchExport(config, id, options);
  if (batchExportKeyFromServer(current) !== key) {
    throw new SafetyViolationError("batch-export", id, key);
  }
}

export async function runBatchExportOp(
  config: ClientConfig,
  op: ResourceOp<BatchExport, ServerBatchExport>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  // buildPayload resolves secrets from env — do it before any network call so a
  // missing env var fails loud without a partial write.
  const payload = buildPayload(op.spec, batchExportHash(op.spec));

  if (op.kind === "create") {
    await createBatchExport(config, payload, options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateBatchExport(config, op.server.id, payload, options);
}

export async function pruneBatchExport(
  config: ClientConfig,
  orphan: ServerBatchExport,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = batchExportKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteBatchExport(config, orphan.id, options);
  return true;
}

export function displayBatchExport(spec: BatchExport): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["interval", scalar(spec.interval)],
    ["model", scalar(spec.model ?? "events")],
    ["paused", scalar(spec.paused ?? false)],
    ["destination_type", scalar(spec.destination.type)],
    ["destination_config", displayJson(projectSecretsForHash(spec.destination.config))],
    ["timezone", scalar(spec.timezone ?? null)],
  ]);
}

export function displayBatchExportFromServer(server: ServerBatchExport): DisplayValue {
  return obj([
    ["key", scalar(batchExportKeyFromServer(server) ?? null)],
    ["name", scalar(stripMarker(server.name))],
    ["interval", scalar(server.interval ?? null)],
    ["model", scalar(server.model ?? "events")],
    ["paused", scalar(server.paused ?? false)],
    ["destination_type", scalar(server.destination?.type ?? null)],
    ["destination_config", displayJson(server.destination?.config ?? null)],
    ["timezone", scalar(server.timezone ?? null)],
  ]);
}
