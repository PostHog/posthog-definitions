import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { ExperimentSavedMetric } from "./sdk.js";
import {
  createExperimentSavedMetric,
  deleteExperimentSavedMetric,
  type ExperimentSavedMetricCreate,
  getExperimentSavedMetric,
  type ServerExperimentSavedMetric,
  updateExperimentSavedMetric,
} from "./client.js";

export const EXPERIMENT_SAVED_METRIC_IDENTITY_PREFIX = "iac:experiment-saved-metrics:";

const MARKER_REGEX = /\n*<!--\s*iac:experiment-saved-metrics:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:experiment-saved-metrics:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function experimentSavedMetricKeyFromServer(
  server: ServerExperimentSavedMetric,
): string | undefined {
  return parseMarker(server.description)?.key;
}

export function experimentSavedMetricHashFromServer(
  server: ServerExperimentSavedMetric,
): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: ExperimentSavedMetric): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    query: spec.query,
  };
}

export function experimentSavedMetricHash(spec: ExperimentSavedMetric): string {
  return specHash(specForHash(spec));
}

export function experimentSavedMetricPayload(
  spec: ExperimentSavedMetric,
  hash: string,
): ExperimentSavedMetricCreate {
  return {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    query: spec.query,
  };
}

export function looksLikeExperimentSavedMetric(value: unknown): value is ExperimentSavedMetric {
  return getResourceKind(value) === "experiment-saved-metric";
}

export function validateExperimentSavedMetrics(specs: ExperimentSavedMetric[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) {
      issues.push("experimentSavedMetric.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(
        `experiment saved metric "${spec.key}" key must match ${KEY_PATTERN.source}`,
      );
    }
    if (seenKeys.has(spec.key)) {
      issues.push(`Duplicate experiment saved metric key "${spec.key}"`);
    }
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`experiment saved metric "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate experiment saved metric name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }
    if (!spec.query || typeof spec.query !== "object") {
      issues.push(`experiment saved metric "${spec.key}" must define a query object`);
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
  const current = await getExperimentSavedMetric(config, id, options);
  if (experimentSavedMetricKeyFromServer(current) !== key) {
    throw new SafetyViolationError("experiment saved metric", id, key);
  }
}

export async function runExperimentSavedMetricOp(
  config: ClientConfig,
  op: ResourceOp<ExperimentSavedMetric, ServerExperimentSavedMetric>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") {
    ctx.experimentSavedMetricIdByKey.set(op.key, op.serverId as number);
    return;
  }

  const payload = experimentSavedMetricPayload(op.spec, op.hash);

  if (op.kind === "create") {
    const created = await createExperimentSavedMetric(config, payload, options);
    ctx.experimentSavedMetricIdByKey.set(op.key, created.id);
    return;
  }

  await assertManaged(config, op.serverId as number, op.key, options);
  const updated = await updateExperimentSavedMetric(
    config,
    op.serverId as number,
    payload,
    options,
  );
  ctx.experimentSavedMetricIdByKey.set(op.key, updated.id);
}

export async function pruneExperimentSavedMetric(
  config: ClientConfig,
  orphan: ServerExperimentSavedMetric,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = experimentSavedMetricKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteExperimentSavedMetric(config, orphan.id, options);
  return true;
}

export function displayExperimentSavedMetric(spec: ExperimentSavedMetric): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["query", displayJson(spec.query)],
  ]);
}

export function displayExperimentSavedMetricFromServer(
  server: ServerExperimentSavedMetric,
): DisplayValue {
  return obj([
    ["key", scalar(experimentSavedMetricKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["query", displayJson(server.query)],
  ]);
}
