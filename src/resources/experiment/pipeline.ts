import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { ExperimentHoldout } from "../experiment-holdout/sdk.js";
import type { ExperimentSavedMetric } from "../experiment-saved-metric/sdk.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";
import type { Experiment, ExperimentLifecycle } from "./sdk.js";
import {
  archiveExperiment,
  createExperiment,
  deleteExperiment,
  endExperiment,
  type ExperimentCreate,
  type ExperimentUpdate,
  getExperiment,
  launchExperiment,
  pauseExperiment,
  resumeExperiment,
  type SavedMetricRef,
  type ServerExperiment,
  unarchiveExperiment,
  updateExperiment,
} from "./client.js";

/**
 * Experiment has no `tags` field. Identity sits in a trailing HTML-comment
 * marker on `description` (same pattern as endpoints / holdouts / saved metrics).
 */
export const EXPERIMENT_IDENTITY_PREFIX = "iac:experiments:";

const MARKER_REGEX = /\n*<!--\s*iac:experiments:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:experiments:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function experimentKeyFromServer(server: ServerExperiment): string | undefined {
  return parseMarker(server.description)?.key;
}

export function experimentHashFromServer(server: ServerExperiment): string | undefined {
  return parseMarker(server.description)?.hash;
}

function desiredLifecycle(spec: Experiment): ExperimentLifecycle {
  return spec.lifecycle ?? "draft";
}

function currentLifecycle(server: ServerExperiment): ExperimentLifecycle {
  // The server returns `status` as the computed lifecycle; we trust it.
  return server.status ?? "draft";
}

function specForHash(spec: Experiment): unknown {
  // Everything that round-trips, EXCLUDING server-resolved ids and managed marker.
  // Cross-resource references are hashed by KEY, not server id, so the hash is
  // environment-portable.
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    type: spec.type ?? null,
    lifecycle: desiredLifecycle(spec),
    archived: spec.archived ?? false,
    feature_flag_key: spec.featureFlag.key,
    holdout_key: spec.holdout?.key ?? null,
    parameters: spec.parameters ?? null,
    metrics: spec.metrics ?? [],
    metrics_secondary: spec.metrics_secondary ?? [],
    exposure_criteria: spec.exposure_criteria ?? null,
    primary_saved_metric_keys: (spec.primarySavedMetrics ?? []).map((m) => m.key),
    secondary_saved_metric_keys: (spec.secondarySavedMetrics ?? []).map((m) => m.key),
    conclusion: spec.conclusion ?? null,
    conclusion_comment: spec.conclusionComment ?? null,
  };
}

export function experimentHash(spec: Experiment): string {
  return specHash(specForHash(spec));
}

function resolveHoldoutId(spec: Experiment, ctx: ApplyContext): number | null | undefined {
  if (!spec.holdout) return null;
  const id = ctx.experimentHoldoutIdByKey.get(spec.holdout.key);
  if (id === undefined) {
    throw new Error(
      `experiment "${spec.key}" references holdout "${spec.holdout.key}" but no server id is known. Holdouts must run before experiments.`,
    );
  }
  return id;
}

function resolveSavedMetricIds(spec: Experiment, ctx: ApplyContext): SavedMetricRef[] {
  const refs: SavedMetricRef[] = [];
  for (const metric of spec.primarySavedMetrics ?? []) {
    const id = ctx.experimentSavedMetricIdByKey.get(metric.key);
    if (id === undefined) {
      throw new Error(
        `experiment "${spec.key}" references saved metric "${metric.key}" but no server id is known. Saved metrics must run before experiments.`,
      );
    }
    refs.push({ id, metadata: { type: "primary" } });
  }
  for (const metric of spec.secondarySavedMetrics ?? []) {
    const id = ctx.experimentSavedMetricIdByKey.get(metric.key);
    if (id === undefined) {
      throw new Error(
        `experiment "${spec.key}" references saved metric "${metric.key}" but no server id is known. Saved metrics must run before experiments.`,
      );
    }
    refs.push({ id, metadata: { type: "secondary" } });
  }
  return refs;
}

/** Build the create payload (used only for the initial POST). */
function buildCreatePayload(spec: Experiment, hash: string, ctx: ApplyContext): ExperimentCreate {
  const holdoutId = resolveHoldoutId(spec, ctx);
  const savedMetrics = resolveSavedMetricIds(spec, ctx);
  const payload: ExperimentCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    feature_flag_key: spec.featureFlag.key,
  };
  if (spec.type !== undefined) payload.type = spec.type;
  if (spec.parameters !== undefined) payload.parameters = spec.parameters as Record<string, unknown>;
  if (spec.metrics !== undefined) payload.metrics = spec.metrics;
  if (spec.metrics_secondary !== undefined) payload.metrics_secondary = spec.metrics_secondary;
  if (spec.exposure_criteria !== undefined) payload.exposure_criteria = spec.exposure_criteria;
  if (holdoutId !== undefined) payload.holdout_id = holdoutId;
  if (savedMetrics.length > 0) payload.saved_metrics_ids = savedMetrics;
  if (spec.conclusion !== undefined) payload.conclusion = spec.conclusion;
  if (spec.conclusionComment !== undefined) payload.conclusion_comment = spec.conclusionComment;
  // `archived` is reached via the archive/unarchive actions, not the PATCH body.
  return payload;
}

/** Build the patch payload — feature_flag_key is omitted (immutable post-create). */
function buildUpdatePayload(spec: Experiment, hash: string, ctx: ApplyContext): ExperimentUpdate {
  const holdoutId = resolveHoldoutId(spec, ctx);
  const savedMetrics = resolveSavedMetricIds(spec, ctx);
  const payload: ExperimentUpdate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
  };
  if (spec.type !== undefined) payload.type = spec.type;
  if (spec.parameters !== undefined) payload.parameters = spec.parameters as Record<string, unknown>;
  if (spec.metrics !== undefined) payload.metrics = spec.metrics;
  if (spec.metrics_secondary !== undefined) payload.metrics_secondary = spec.metrics_secondary;
  if (spec.exposure_criteria !== undefined) payload.exposure_criteria = spec.exposure_criteria;
  if (holdoutId !== undefined) payload.holdout_id = holdoutId;
  payload.saved_metrics_ids = savedMetrics;
  if (spec.conclusion !== undefined) payload.conclusion = spec.conclusion;
  if (spec.conclusionComment !== undefined) payload.conclusion_comment = spec.conclusionComment;
  return payload;
}

export function looksLikeExperiment(value: unknown): value is Experiment {
  return getResourceKind(value) === "experiment";
}

/**
 * Allowed lifecycle transitions, applied AFTER the create/update of the
 * experiment row. Keyed by current state. Anything not listed is a no-op or
 * rejected at validate.
 */
const ALLOWED_TRANSITIONS: Record<ExperimentLifecycle, readonly ExperimentLifecycle[]> = {
  draft: ["draft", "running", "paused"],
  running: ["running", "paused", "stopped"],
  paused: ["running", "paused", "stopped"],
  stopped: ["stopped"],
};

export function validateExperiments(
  specs: Experiment[],
  state: DesiredState,
): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  const knownFlagKeys = new Set<string>();
  for (const loaded of state.get("feature-flags") ?? []) {
    const flag = loaded.spec as FeatureFlag;
    if (flag?.key) knownFlagKeys.add(flag.key);
  }
  const knownHoldoutKeys = new Set<string>();
  for (const loaded of state.get("experiment-holdouts") ?? []) {
    const h = loaded.spec as ExperimentHoldout;
    if (h?.key) knownHoldoutKeys.add(h.key);
  }
  const knownSavedMetricKeys = new Set<string>();
  for (const loaded of state.get("experiment-saved-metrics") ?? []) {
    const m = loaded.spec as ExperimentSavedMetric;
    if (m?.key) knownSavedMetricKeys.add(m.key);
  }

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("experiment.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`experiment "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) {
      issues.push(`Duplicate experiment key "${spec.key}"`);
    }
    seenKeys.add(spec.key);
    if (!spec.name) {
      issues.push(`experiment "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate experiment name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }
    if (!spec.featureFlag?.key) {
      issues.push(`experiment "${spec.key}" must reference a featureFlag`);
    } else if (!knownFlagKeys.has(spec.featureFlag.key)) {
      issues.push(
        `experiment "${spec.key}" references unknown feature flag "${spec.featureFlag.key}" — declare it with featureFlag({ key: "${spec.featureFlag.key}", … })`,
      );
    }
    if (spec.holdout && !knownHoldoutKeys.has(spec.holdout.key)) {
      issues.push(
        `experiment "${spec.key}" references unknown experiment holdout "${spec.holdout.key}"`,
      );
    }
    for (const m of spec.primarySavedMetrics ?? []) {
      if (!knownSavedMetricKeys.has(m.key)) {
        issues.push(
          `experiment "${spec.key}" references unknown experiment saved metric "${m.key}"`,
        );
      }
    }
    for (const m of spec.secondarySavedMetrics ?? []) {
      if (!knownSavedMetricKeys.has(m.key)) {
        issues.push(
          `experiment "${spec.key}" references unknown experiment saved metric "${m.key}"`,
        );
      }
    }

    const lifecycle = desiredLifecycle(spec);
    if (lifecycle === "stopped" && !spec.conclusion) {
      issues.push(
        `experiment "${spec.key}" lifecycle "stopped" requires a conclusion (won/lost/inconclusive/stopped_early/invalid)`,
      );
    }
    if (spec.archived && lifecycle !== "stopped") {
      issues.push(`experiment "${spec.key}" can only be archived once lifecycle is "stopped"`);
    }

    // Multivariate split check, if variants are declared.
    const variants = spec.parameters?.feature_flag_variants;
    if (variants && variants.length > 0) {
      if (variants.length < 2) {
        issues.push(`experiment "${spec.key}" must declare at least 2 variants`);
      }
      const total = variants.reduce((sum, v) => sum + (v.rollout_percentage ?? 0), 0);
      if (total !== 100) {
        issues.push(
          `experiment "${spec.key}" variant rollout percentages sum to ${total}, must be 100`,
        );
      }
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
  const current = await getExperiment(config, id, options);
  if (experimentKeyFromServer(current) !== key) {
    throw new SafetyViolationError("experiment", id, key);
  }
}

async function applyLifecycleTransition(
  config: ClientConfig,
  serverId: number,
  current: ExperimentLifecycle,
  desired: ExperimentLifecycle,
  conclusion: string | undefined,
  options: { verbose?: boolean },
): Promise<ServerExperiment | undefined> {
  if (current === desired) return undefined;
  const allowed = ALLOWED_TRANSITIONS[current];
  if (!allowed.includes(desired)) {
    throw new Error(
      `experiment ${serverId}: cannot transition from "${current}" to "${desired}". Allowed: ${allowed.join(", ")}.`,
    );
  }
  if (current === "draft" && desired === "running") {
    return launchExperiment(config, serverId, options);
  }
  if (current === "draft" && desired === "paused") {
    // launch, then pause
    await launchExperiment(config, serverId, options);
    return pauseExperiment(config, serverId, options);
  }
  if (current === "running" && desired === "paused") {
    return pauseExperiment(config, serverId, options);
  }
  if (current === "paused" && desired === "running") {
    return resumeExperiment(config, serverId, options);
  }
  if ((current === "running" || current === "paused") && desired === "stopped") {
    return endExperiment(config, serverId, conclusion ? { conclusion } : {}, options);
  }
  // Should be unreachable given ALLOWED_TRANSITIONS, but defend explicitly.
  throw new Error(
    `experiment ${serverId}: unhandled transition "${current}" → "${desired}".`,
  );
}

async function applyArchivedState(
  config: ClientConfig,
  serverId: number,
  currentArchived: boolean,
  desiredArchived: boolean,
  options: { verbose?: boolean },
): Promise<void> {
  if (currentArchived === desiredArchived) return;
  if (desiredArchived) await archiveExperiment(config, serverId, options);
  else await unarchiveExperiment(config, serverId, options);
}

export async function runExperimentOp(
  config: ClientConfig,
  op: ResourceOp<Experiment, ServerExperiment>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const desiredLc = desiredLifecycle(op.spec);
  const desiredArchived = op.spec.archived ?? false;

  if (op.kind === "create") {
    // Always create as draft. Lifecycle transitions happen afterwards.
    const created = await createExperiment(
      config,
      buildCreatePayload(op.spec, op.hash, ctx),
      options,
    );
    await applyLifecycleTransition(
      config,
      created.id,
      "draft",
      desiredLc,
      op.spec.conclusion,
      options,
    );
    await applyArchivedState(config, created.id, false, desiredArchived, options);
    return;
  }

  // Update path.
  await assertManaged(config, op.serverId as number, op.key, options);
  const updated = await updateExperiment(
    config,
    op.serverId as number,
    buildUpdatePayload(op.spec, op.hash, ctx),
    options,
  );
  await applyLifecycleTransition(
    config,
    updated.id,
    currentLifecycle(updated),
    desiredLc,
    op.spec.conclusion,
    options,
  );
  await applyArchivedState(config, updated.id, updated.archived ?? false, desiredArchived, options);
}

export async function pruneExperiment(
  config: ClientConfig,
  orphan: ServerExperiment,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = experimentKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteExperiment(config, orphan.id, options);
  return true;
}

export function displayExperiment(spec: Experiment): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["type", scalar(spec.type ?? null)],
    ["lifecycle", scalar(desiredLifecycle(spec))],
    ["archived", scalar(spec.archived ?? false)],
    ["feature_flag", scalar(spec.featureFlag.key)],
    ["holdout", scalar(spec.holdout?.key ?? null)],
    ["parameters", displayJson(spec.parameters ?? null)],
    ["metrics", arr((spec.metrics ?? []).map(displayJson))],
    ["metrics_secondary", arr((spec.metrics_secondary ?? []).map(displayJson))],
    ["exposure_criteria", displayJson(spec.exposure_criteria ?? null)],
    [
      "primary_saved_metrics",
      arr((spec.primarySavedMetrics ?? []).map((m) => scalar(m.key))),
    ],
    [
      "secondary_saved_metrics",
      arr((spec.secondarySavedMetrics ?? []).map((m) => scalar(m.key))),
    ],
    ["conclusion", scalar(spec.conclusion ?? null)],
    ["conclusion_comment", scalar(spec.conclusionComment ?? null)],
  ]);
}

export function displayExperimentFromServer(server: ServerExperiment): DisplayValue {
  return obj([
    ["key", scalar(experimentKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["type", scalar(server.type ?? null)],
    ["lifecycle", scalar(server.status ?? "draft")],
    ["archived", scalar(server.archived)],
    ["feature_flag", scalar(server.feature_flag_key)],
    ["holdout", scalar(server.holdout_id ?? null)],
    ["parameters", displayJson(server.parameters ?? null)],
    ["metrics", arr((server.metrics ?? []).map((m) => displayJson(m)))],
    ["metrics_secondary", arr((server.metrics_secondary ?? []).map((m) => displayJson(m)))],
    ["exposure_criteria", displayJson(server.exposure_criteria ?? null)],
    [
      "saved_metrics",
      arr((server.saved_metrics ?? []).map((m) => displayJson(m))),
    ],
    ["conclusion", scalar(server.conclusion ?? null)],
    ["conclusion_comment", scalar(server.conclusion_comment ?? null)],
  ]);
}
