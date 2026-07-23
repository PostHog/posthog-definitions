import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { HogFlow, HogFlowAction } from "./sdk.js";
import {
  createHogFlow,
  deleteHogFlow,
  getHogFlow,
  type HogFlowCreate,
  type ServerHogFlow,
  updateHogFlow,
} from "./client.js";

/**
 * Hog flows have no `tags` field. Identity sits in a trailing HTML-comment
 * marker on `description` (surveys / endpoints pattern).
 */
export const HOG_FLOW_IDENTITY_PREFIX = "iac:hog-flows:";

const MARKER_REGEX = /\n*<!--\s*iac:hog-flows:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:hog-flows:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function hogFlowKeyFromServer(server: ServerHogFlow): string | undefined {
  return parseMarker(server.description)?.key;
}

export function hogFlowHashFromServer(server: ServerHogFlow): string | undefined {
  return parseMarker(server.description)?.hash;
}

/**
 * Strip server-set bookkeeping (`created_at` / `updated_at`) off each action so
 * they never enter the hash or a re-sent payload. The action `id` is
 * author-controlled — kept — and edges reference it, so ordering of `actions`
 * and `edges` is preserved (not sorted): the graph is meaningful and stable as
 * authored.
 */
function cleanAction(action: HogFlowAction): Record<string, unknown> {
  const { created_at: _c, updated_at: _u, ...rest } = action as Record<string, unknown>;
  void _c;
  void _u;
  return rest;
}

function specForHash(spec: HogFlow): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    status: spec.status ?? "draft",
    exit_condition: spec.exitCondition ?? "exit_only_at_end",
    actions: (spec.actions ?? []).map(cleanAction),
    edges: spec.edges ?? [],
    trigger_masking: spec.triggerMasking ?? null,
    conversion: spec.conversion ?? null,
    variables: spec.variables ?? null,
  };
}

export function hogFlowHash(spec: HogFlow): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: HogFlow, hash: string): HogFlowCreate {
  const payload: HogFlowCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    status: spec.status ?? "draft",
    exit_condition: spec.exitCondition ?? "exit_only_at_end",
    actions: (spec.actions ?? []).map(cleanAction),
    edges: spec.edges ?? [],
  };
  if (spec.triggerMasking !== undefined) payload.trigger_masking = spec.triggerMasking;
  if (spec.conversion !== undefined) payload.conversion = spec.conversion;
  if (spec.variables !== undefined) payload.variables = spec.variables;
  return payload;
}

export function looksLikeHogFlow(value: unknown): value is HogFlow {
  return getResourceKind(value) === "hog-flow";
}

function actionType(action: HogFlowAction): string | undefined {
  const t = (action as { type?: unknown }).type;
  return typeof t === "string" ? t : undefined;
}

function actionId(action: HogFlowAction): string | undefined {
  const id = (action as { id?: unknown }).id;
  return typeof id === "string" ? id : undefined;
}

export function validateHogFlows(specs: HogFlow[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("hog-flow.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`hog flow "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate hog flow key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`hog flow "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate hog flow name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    const actions = spec.actions ?? [];
    if (actions.length === 0) {
      issues.push(`hog flow "${spec.key}" must have at least one action`);
      continue;
    }
    const ids = new Set<string>();
    let triggerCount = 0;
    for (const [i, action] of actions.entries()) {
      const id = actionId(action);
      if (!id) {
        issues.push(`hog flow "${spec.key}" action[${i}] is missing an "id"`);
      } else {
        if (ids.has(id)) issues.push(`hog flow "${spec.key}" has duplicate action id "${id}"`);
        ids.add(id);
      }
      if (!actionType(action)) issues.push(`hog flow "${spec.key}" action[${i}] is missing a "type"`);
      if (actionType(action) === "trigger") triggerCount++;
    }
    if (triggerCount !== 1) {
      issues.push(
        `hog flow "${spec.key}" must have exactly one action with type "trigger" (found ${triggerCount})`,
      );
    }

    for (const [i, edge] of (spec.edges ?? []).entries()) {
      const from = (edge as { from?: unknown }).from;
      const to = (edge as { to?: unknown }).to;
      if (typeof from !== "string" || !ids.has(from)) {
        issues.push(`hog flow "${spec.key}" edge[${i}] "from" does not reference a known action id`);
      }
      if (typeof to !== "string" || !ids.has(to)) {
        issues.push(`hog flow "${spec.key}" edge[${i}] "to" does not reference a known action id`);
      }
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
  const current = await getHogFlow(config, id, options);
  if (hogFlowKeyFromServer(current) !== key) {
    throw new SafetyViolationError("hog-flow", id, key);
  }
}

export async function runHogFlowOp(
  config: ClientConfig,
  op: ResourceOp<HogFlow, ServerHogFlow>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = hogFlowHash(op.spec);

  if (op.kind === "create") {
    await createHogFlow(config, buildPayload(op.spec, hash), options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateHogFlow(config, op.server.id, buildPayload(op.spec, hash), options);
}

export async function pruneHogFlow(
  config: ClientConfig,
  orphan: ServerHogFlow,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = hogFlowKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteHogFlow(config, orphan.id, options);
  return true;
}

export function displayHogFlow(spec: HogFlow): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["status", scalar(spec.status ?? "draft")],
    ["exit_condition", scalar(spec.exitCondition ?? "exit_only_at_end")],
    ["actions", displayJson((spec.actions ?? []).map(cleanAction))],
    ["edges", displayJson(spec.edges ?? [])],
  ]);
}

export function displayHogFlowFromServer(server: ServerHogFlow): DisplayValue {
  return obj([
    ["key", scalar(hogFlowKeyFromServer(server) ?? null)],
    ["name", scalar(server.name ?? "")],
    ["description", scalar(stripMarker(server.description))],
    ["status", scalar(server.status ?? "draft")],
    ["exit_condition", scalar(server.exit_condition ?? "exit_only_at_end")],
    ["actions", displayJson((server.actions ?? []).map((a) => cleanAction(a as HogFlowAction)))],
    ["edges", displayJson(server.edges ?? [])],
  ]);
}
