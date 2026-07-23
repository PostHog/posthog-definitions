import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";
import type { Survey, SurveyStatus } from "./sdk.js";
import {
  createSurvey,
  deleteSurvey,
  getSurvey,
  launchSurvey,
  type ServerSurvey,
  stopSurvey,
  type SurveyCreate,
  type SurveyUpdate,
  updateSurvey,
} from "./client.js";

/**
 * Surveys have no `tags` field. Identity sits in a trailing HTML-comment
 * marker on `description` (endpoints / experiments pattern).
 */
export const SURVEY_IDENTITY_PREFIX = "iac:surveys:";

const MARKER_REGEX = /\n*<!--\s*iac:surveys:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:surveys:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function surveyKeyFromServer(server: ServerSurvey): string | undefined {
  return parseMarker(server.description)?.key;
}

export function surveyHashFromServer(server: ServerSurvey): string | undefined {
  return parseMarker(server.description)?.hash;
}

function desiredStatus(spec: Survey): SurveyStatus {
  return spec.status ?? "draft";
}

function currentStatus(server: ServerSurvey): SurveyStatus {
  if (server.end_date) return "stopped";
  if (server.start_date) return "running";
  return "draft";
}

function specForHash(spec: Survey): unknown {
  // Everything that round-trips, EXCLUDING server-resolved flag ids and the
  // managed marker. Flag references are hashed by KEY so the hash is
  // environment-portable. Questions are order-sensitive — array order is
  // preserved by specHash.
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    type: spec.type,
    status: desiredStatus(spec),
    archived: spec.archived ?? false,
    questions: spec.questions,
    appearance: spec.appearance ?? null,
    conditions: spec.conditions ?? null,
    linked_flag_key: spec.linkedFlag?.key ?? null,
    targeting_flag_key: spec.targetingFlag?.key ?? null,
    responses_limit: spec.responsesLimit ?? null,
    enable_partial_responses: spec.enablePartialResponses ?? null,
    schedule: spec.schedule ?? null,
  };
}

export function surveyHash(spec: Survey): string {
  return specHash(specForHash(spec));
}

function resolveFlagId(
  spec: Survey,
  ref: FeatureFlag | undefined,
  which: string,
  ctx: ApplyContext,
): number | undefined {
  if (!ref) return undefined;
  const id = ctx.featureFlagIdByKey.get(ref.key);
  if (id === undefined) {
    throw new Error(
      `survey "${spec.key}" references ${which} flag "${ref.key}" but no server id is known. Feature flags must run before surveys.`,
    );
  }
  return id;
}

function buildCreatePayload(spec: Survey, hash: string, ctx: ApplyContext): SurveyCreate {
  const payload: SurveyCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    type: spec.type,
    questions: spec.questions,
  };
  if (spec.appearance !== undefined) payload.appearance = spec.appearance;
  if (spec.conditions !== undefined) payload.conditions = spec.conditions as Record<string, unknown>;
  const linkedId = resolveFlagId(spec, spec.linkedFlag, "linked", ctx);
  if (linkedId !== undefined) payload.linked_flag_id = linkedId;
  const targetingId = resolveFlagId(spec, spec.targetingFlag, "targeting", ctx);
  if (targetingId !== undefined) payload.targeting_flag_id = targetingId;
  if (spec.responsesLimit !== undefined) payload.responses_limit = spec.responsesLimit;
  if (spec.enablePartialResponses !== undefined) {
    payload.enable_partial_responses = spec.enablePartialResponses;
  }
  if (spec.schedule !== undefined) payload.schedule = spec.schedule;
  return payload;
}

function buildUpdatePayload(spec: Survey, hash: string, ctx: ApplyContext): SurveyUpdate {
  // Same as create minus type (type is set on create; surveys keep it stable).
  const payload: SurveyUpdate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    questions: spec.questions,
  };
  if (spec.appearance !== undefined) payload.appearance = spec.appearance;
  if (spec.conditions !== undefined) payload.conditions = spec.conditions as Record<string, unknown>;
  const linkedId = resolveFlagId(spec, spec.linkedFlag, "linked", ctx);
  payload.linked_flag_id = linkedId ?? null;
  const targetingId = resolveFlagId(spec, spec.targetingFlag, "targeting", ctx);
  if (targetingId !== undefined) payload.targeting_flag_id = targetingId;
  payload.responses_limit = spec.responsesLimit ?? null;
  if (spec.enablePartialResponses !== undefined) {
    payload.enable_partial_responses = spec.enablePartialResponses;
  }
  if (spec.schedule !== undefined) payload.schedule = spec.schedule;
  return payload;
}

export function looksLikeSurvey(value: unknown): value is Survey {
  return getResourceKind(value) === "survey";
}

const ALLOWED_TRANSITIONS: Record<SurveyStatus, readonly SurveyStatus[]> = {
  draft: ["draft", "running", "stopped"],
  running: ["running", "stopped"],
  stopped: ["stopped", "running"], // resume by clearing end_date
};

export function validateSurveys(specs: Survey[], state: DesiredState): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  const knownFlagKeys = new Set<string>();
  for (const loaded of state.get("feature-flags") ?? []) {
    const flag = loaded.spec as FeatureFlag;
    if (flag?.key) knownFlagKeys.add(flag.key);
  }

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("survey.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`survey "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate survey key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`survey "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate survey name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (!spec.type) issues.push(`survey "${spec.key}" type is required`);
    if (!Array.isArray(spec.questions) || spec.questions.length === 0) {
      issues.push(`survey "${spec.key}" must have at least one question`);
    } else {
      spec.questions.forEach((q, i) => {
        if (!q || typeof q !== "object") {
          issues.push(`survey "${spec.key}" question[${i}] is not an object`);
          return;
        }
        const question = q as { type?: string; question?: string; choices?: unknown; link?: unknown };
        if (!question.question) issues.push(`survey "${spec.key}" question[${i}] is missing "question" text`);
        if (
          (question.type === "single_choice" || question.type === "multiple_choice") &&
          (!Array.isArray(question.choices) || question.choices.length === 0)
        ) {
          issues.push(`survey "${spec.key}" question[${i}] (${question.type}) needs non-empty choices`);
        }
        if (question.type === "link" && !question.link) {
          issues.push(`survey "${spec.key}" question[${i}] (link) needs a link`);
        }
      });
    }

    for (const [ref, which] of [
      [spec.linkedFlag, "linked"],
      [spec.targetingFlag, "targeting"],
    ] as const) {
      if (ref && !knownFlagKeys.has(ref.key)) {
        issues.push(
          `survey "${spec.key}" references unknown ${which} feature flag "${ref.key}" — declare it with featureFlag({ key: "${ref.key}", … }) in the same run`,
        );
      }
    }

    const from = "draft" as SurveyStatus;
    const to = desiredStatus(spec);
    if (!ALLOWED_TRANSITIONS[from].includes(to)) {
      issues.push(`survey "${spec.key}" has invalid status "${to}"`);
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
  const current = await getSurvey(config, id, options);
  if (surveyKeyFromServer(current) !== key) {
    throw new SafetyViolationError("survey", id, key);
  }
}

async function applyLifecycle(
  config: ClientConfig,
  id: string,
  current: SurveyStatus,
  desired: SurveyStatus,
  options: { verbose?: boolean },
): Promise<void> {
  if (current === desired) return;
  const allowed = ALLOWED_TRANSITIONS[current];
  if (!allowed.includes(desired)) {
    throw new Error(
      `survey ${id}: cannot transition from "${current}" to "${desired}". Allowed: ${allowed.join(", ")}.`,
    );
  }
  if (current === "draft" && desired === "running") {
    await launchSurvey(config, id, options);
    return;
  }
  if (current === "draft" && desired === "stopped") {
    await launchSurvey(config, id, options);
    await stopSurvey(config, id, options);
    return;
  }
  if (current === "running" && desired === "stopped") {
    await stopSurvey(config, id, options);
    return;
  }
  if (current === "stopped" && desired === "running") {
    // No resume endpoint; clear end_date to reactivate.
    await updateSurvey(config, id, { end_date: null }, options);
    return;
  }
  throw new Error(`survey ${id}: unhandled transition "${current}" → "${desired}".`);
}

export async function runSurveyOp(
  config: ClientConfig,
  op: ResourceOp<Survey, ServerSurvey>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = surveyHash(op.spec);
  const desired = desiredStatus(op.spec);

  if (op.kind === "create") {
    const created = await createSurvey(config, buildCreatePayload(op.spec, hash, ctx), options);
    await applyLifecycle(config, created.id, "draft", desired, options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  const updated = await updateSurvey(config, op.server.id, buildUpdatePayload(op.spec, hash, ctx), options);
  await applyLifecycle(config, updated.id, currentStatus(updated), desired, options);
}

export async function pruneSurvey(
  config: ClientConfig,
  orphan: ServerSurvey,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = surveyKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteSurvey(config, orphan.id, options);
  return true;
}

export function displaySurvey(spec: Survey): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["type", scalar(spec.type)],
    ["status", scalar(desiredStatus(spec))],
    ["archived", scalar(spec.archived ?? false)],
    ["questions", arr(spec.questions.map((q) => displayJson(q)))],
    ["appearance", displayJson(spec.appearance ?? null)],
    ["conditions", displayJson(spec.conditions ?? null)],
    ["linked_flag", scalar(spec.linkedFlag?.key ?? null)],
    ["targeting_flag", scalar(spec.targetingFlag?.key ?? null)],
    ["responses_limit", scalar(spec.responsesLimit ?? null)],
    ["enable_partial_responses", scalar(spec.enablePartialResponses ?? null)],
    ["schedule", scalar(spec.schedule ?? null)],
  ]);
}

export function displaySurveyFromServer(
  server: ServerSurvey,
  flagKeyByServerId: Map<number, string>,
): DisplayValue {
  return obj([
    ["key", scalar(surveyKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["type", scalar(server.type)],
    ["status", scalar(currentStatus(server))],
    ["archived", scalar(server.archived)],
    ["questions", arr((server.questions ?? []).map((q) => displayJson(q)))],
    ["appearance", displayJson(server.appearance ?? null)],
    ["conditions", displayJson(server.conditions ?? null)],
    [
      "linked_flag",
      scalar(
        server.linked_flag_id != null
          ? (flagKeyByServerId.get(server.linked_flag_id) ?? `id:${server.linked_flag_id}`)
          : null,
      ),
    ],
    [
      "targeting_flag",
      scalar(
        server.targeting_flag?.id != null
          ? (flagKeyByServerId.get(server.targeting_flag.id) ?? `id:${server.targeting_flag.id}`)
          : null,
      ),
    ],
    ["responses_limit", scalar(server.responses_limit ?? null)],
    ["enable_partial_responses", scalar(server.enable_partial_responses ?? null)],
    ["schedule", scalar(server.schedule ?? null)],
  ]);
}
