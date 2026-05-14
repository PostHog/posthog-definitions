import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import {
  arr,
  displayJson,
  filterUserTags,
  obj,
  scalar,
  type DisplayValue,
} from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { Action, ActionStep } from "./sdk.js";
import {
  createAction,
  deleteAction,
  type ActionCreate,
  getAction,
  type ServerAction,
  updateAction,
} from "./client.js";

export const ACTION_TAG_PREFIX = "iac:actions:";
export const HASH_TAG_PREFIX = "iac:hash:";

const KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function actionTag(key: string): string {
  return `${ACTION_TAG_PREFIX}${key}`;
}

export function actionKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith(ACTION_TAG_PREFIX));
  return tag?.slice(ACTION_TAG_PREFIX.length);
}

export function actionHashFromTags(tags: string[] | undefined): string | undefined {
  return tags?.find((t) => t.startsWith(HASH_TAG_PREFIX))?.slice(HASH_TAG_PREFIX.length);
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

function normalizeStep(step: ActionStep): Record<string, unknown> {
  const out: Record<string, unknown> = {
    event: step.event ?? null,
    properties: step.properties ?? null,
    selector: step.selector ?? null,
    tag_name: step.tag_name ?? null,
    text: step.text ?? null,
    text_matching: step.text_matching ?? null,
    href: step.href ?? null,
    href_matching: step.href_matching ?? null,
    url: step.url ?? null,
    url_matching: step.url_matching ?? null,
  };
  return out;
}

export function actionPayload(spec: Action, hash: string): ActionCreate {
  const payload: ActionCreate = {
    name: spec.name,
    description: spec.description ?? "",
    steps: spec.steps.map((s) => normalizeStep(s)),
    tags: mergeTags(spec.tags, [actionTag(spec.key), hashTag(hash)]),
  };
  if (spec.post_to_slack !== undefined) {
    payload.post_to_slack = spec.post_to_slack;
  }
  if (spec.slack_message_format !== undefined) {
    payload.slack_message_format = spec.slack_message_format;
  }
  if (spec.pinned_at !== undefined) {
    payload.pinned_at = spec.pinned_at;
  }
  return payload;
}

function actionSpecForHash(spec: Action): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    steps: spec.steps.map((s) => normalizeStep(s)),
    post_to_slack: spec.post_to_slack ?? false,
    slack_message_format: spec.slack_message_format ?? "",
    pinned_at: spec.pinned_at ?? null,
    tags: filterUserTags(spec.tags),
  };
}

export function actionHash(spec: Action): string {
  return specHash(actionSpecForHash(spec));
}

export function looksLikeAction(value: unknown): value is Action {
  return getResourceKind(value) === "action";
}

export function validateActions(specs: Action[]): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) {
      issues.push("action.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`action "${spec.key}" key must match /^[a-zA-Z0-9_-]+$/`);
    }
    if (seen.has(spec.key)) {
      issues.push(`Duplicate action key "${spec.key}"`);
    }
    seen.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`action "${spec.key}" name is required`);
    }

    if (!Array.isArray(spec.steps) || spec.steps.length === 0) {
      issues.push(`action "${spec.key}" must have at least one step`);
    }
  }
  return issues;
}

async function assertManagedAction(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getAction(config, id, options);
  if (!current.tags?.includes(actionTag(key))) {
    throw new SafetyViolationError("action", id, key);
  }
}

export async function runActionOp(
  config: ClientConfig,
  op: ResourceOp<Action, ServerAction>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = actionPayload(op.spec, actionHash(op.spec));

  if (op.kind === "create") {
    await createAction(config, payload, options);
    return;
  }

  await assertManagedAction(config, op.server.id, op.spec.key, options);
  await updateAction(config, op.server.id, payload, options);
}

export async function pruneAction(
  config: ClientConfig,
  orphan: ServerAction,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = actionKeyFromTags(orphan.tags) ?? `id:${orphan.id}`;
  try {
    await assertManagedAction(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteAction(config, orphan.id, options);
  return true;
}

export function displayAction(spec: Action): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? "")],
    ["steps", displayJson(spec.steps.map((s) => normalizeStep(s)))],
    ["post_to_slack", scalar(spec.post_to_slack ?? false)],
    ["slack_message_format", scalar(spec.slack_message_format ?? "")],
    ["pinned_at", scalar(spec.pinned_at ?? null)],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
  ]);
}

export function displayActionFromServer(server: ServerAction): DisplayValue {
  return obj([
    ["key", scalar(actionKeyFromTags(server.tags) ?? "")],
    ["name", scalar(server.name ?? "")],
    ["description", scalar(server.description ?? "")],
    ["steps", displayJson((server.steps ?? []).map((s) => normalizeStep(s as ActionStep)))],
    ["post_to_slack", scalar(server.post_to_slack ?? false)],
    ["slack_message_format", scalar(server.slack_message_format ?? "")],
    ["pinned_at", scalar(server.pinned_at ?? null)],
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
  ]);
}
