import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { ExperimentHoldout } from "./sdk.js";
import {
  createExperimentHoldout,
  deleteExperimentHoldout,
  getExperimentHoldout,
  type ExperimentHoldoutCreate,
  type ServerExperimentHoldout,
  updateExperimentHoldout,
} from "./client.js";

/**
 * ExperimentHoldout has no `tags` field on the server, so identity is in a
 * trailing HTML-comment marker on `description` — same pattern as endpoints.
 */
export const EXPERIMENT_HOLDOUT_IDENTITY_PREFIX = "iac:experiment-holdouts:";

const MARKER_REGEX = /\n*<!--\s*iac:experiment-holdouts:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

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

function withMarker(userDescription: string | undefined, key: string, hash: string): string {
  const trailer = `<!-- iac:experiment-holdouts:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function experimentHoldoutKeyFromServer(
  server: ServerExperimentHoldout,
): string | undefined {
  return parseMarker(server.description)?.key;
}

export function experimentHoldoutHashFromServer(
  server: ServerExperimentHoldout,
): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: ExperimentHoldout): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    filters: spec.filters,
  };
}

export function experimentHoldoutHash(spec: ExperimentHoldout): string {
  return specHash(specForHash(spec));
}

export function experimentHoldoutPayload(
  spec: ExperimentHoldout,
  hash: string,
): ExperimentHoldoutCreate {
  return {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    filters: spec.filters,
  };
}

export function looksLikeExperimentHoldout(value: unknown): value is ExperimentHoldout {
  return getResourceKind(value) === "experiment-holdout";
}

export function validateExperimentHoldouts(specs: ExperimentHoldout[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) {
      issues.push("experimentHoldout.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`experiment holdout "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) {
      issues.push(`Duplicate experiment holdout key "${spec.key}"`);
    }
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`experiment holdout "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate experiment holdout name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }
    if (!Array.isArray(spec.filters) || spec.filters.length === 0) {
      issues.push(`experiment holdout "${spec.key}" must define at least one filter group`);
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getExperimentHoldout(config, id, options);
  if (experimentHoldoutKeyFromServer(current) !== key) {
    throw new SafetyViolationError("experiment holdout", id, key);
  }
}

export async function runExperimentHoldoutOp(
  config: ClientConfig,
  op: ResourceOp<ExperimentHoldout, ServerExperimentHoldout>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") {
    ctx.experimentHoldoutIdByKey.set(op.key, op.serverId as number);
    return;
  }

  const payload = experimentHoldoutPayload(op.spec, op.hash);

  if (op.kind === "create") {
    const created = await createExperimentHoldout(config, payload, options);
    ctx.experimentHoldoutIdByKey.set(op.key, created.id);
    return;
  }

  await assertManaged(config, op.serverId as number, op.key, options);
  const updated = await updateExperimentHoldout(config, op.serverId as number, payload, options);
  ctx.experimentHoldoutIdByKey.set(op.key, updated.id);
}

export async function pruneExperimentHoldout(
  config: ClientConfig,
  orphan: ServerExperimentHoldout,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = experimentHoldoutKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteExperimentHoldout(config, orphan.id, options);
  return true;
}

export function displayExperimentHoldout(spec: ExperimentHoldout): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["filters", arr(spec.filters.map((f) => displayJson(f)))],
  ]);
}

export function displayExperimentHoldoutFromServer(
  server: ServerExperimentHoldout,
): DisplayValue {
  return obj([
    ["key", scalar(experimentHoldoutKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["filters", arr((server.filters ?? []).map((f) => displayJson(f)))],
  ]);
}
