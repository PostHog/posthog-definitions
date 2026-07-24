import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, displayJson, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { LogsSamplingRule, LogsSamplingRuleType } from "./sdk.js";
import {
  createLogsSamplingRule,
  deleteLogsSamplingRule,
  getLogsSamplingRule,
  type LogsSamplingRuleCreate,
  type ServerLogsSamplingRule,
  updateLogsSamplingRule,
} from "./client.js";

export const LOGS_SAMPLING_RULE_IDENTITY_PREFIX = "iac:logs-sampling-rules:";

/** Server caps `name` at 255 chars; the name also carries the identity marker. */
const NAME_MAX = 255;
const RULE_TYPES: LogsSamplingRuleType[] = ["severity_sampling", "path_drop", "rate_limit"];

const MARKER_REGEX = /\n*<!--\s*iac:logs-sampling-rules:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:logs-sampling-rules:${key} iac:hash:${hash} -->`;
  const trimmed = userName.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(name: string | null | undefined): string | null {
  if (!name) return null;
  const parsed = parseMarker(name);
  return parsed ? parsed.userName || null : name;
}

export function logsSamplingRuleKeyFromServer(server: ServerLogsSamplingRule): string | undefined {
  return parseMarker(server.name)?.key;
}

export function logsSamplingRuleHashFromServer(server: ServerLogsSamplingRule): string | undefined {
  return parseMarker(server.name)?.hash;
}

function specForHash(spec: LogsSamplingRule): unknown {
  return {
    key: spec.key,
    name: spec.name,
    rule_type: spec.ruleType,
    config: spec.config ?? null,
    enabled: spec.enabled ?? false,
    // Order is part of identity for this collection: a priority change is a
    // real, pushable diff. `null` when the user leaves ordering to the server.
    priority: spec.priority ?? null,
    scope_service: spec.scopeService ?? null,
    scope_path_pattern: spec.scopePathPattern ?? null,
    scope_attribute_filters: spec.scopeAttributeFilters ?? null,
  };
}

export function logsSamplingRuleHash(spec: LogsSamplingRule): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: LogsSamplingRule, hash: string): LogsSamplingRuleCreate {
  const payload: LogsSamplingRuleCreate = {
    name: withMarker(spec.name, spec.key, hash),
    rule_type: spec.ruleType,
    config: spec.config,
    enabled: spec.enabled ?? false,
  };
  if (spec.priority !== undefined) payload.priority = spec.priority;
  if (spec.scopeService !== undefined) payload.scope_service = spec.scopeService;
  if (spec.scopePathPattern !== undefined) payload.scope_path_pattern = spec.scopePathPattern;
  if (spec.scopeAttributeFilters !== undefined)
    payload.scope_attribute_filters = spec.scopeAttributeFilters;
  return payload;
}

export function looksLikeLogsSamplingRule(value: unknown): value is LogsSamplingRule {
  return getResourceKind(value) === "logs-sampling-rule";
}

export function validateLogsSamplingRules(specs: LogsSamplingRule[], _state: DesiredState): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("logsSamplingRule.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`logsSamplingRule "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate logsSamplingRule key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`logsSamplingRule "${spec.key}" name is required (it carries the identity marker)`);
    } else {
      const withMarkerLen = withMarker(spec.name, spec.key, logsSamplingRuleHash(spec)).length;
      if (withMarkerLen > NAME_MAX) {
        issues.push(
          `logsSamplingRule "${spec.key}" name is too long: name + identity marker is ${withMarkerLen} chars but the server caps \`name\` at ${NAME_MAX}. Shorten the name (or key).`,
        );
      }
    }

    if (!spec.ruleType) {
      issues.push(`logsSamplingRule "${spec.key}" ruleType is required`);
    } else if (!RULE_TYPES.includes(spec.ruleType)) {
      issues.push(
        `logsSamplingRule "${spec.key}" ruleType must be one of ${RULE_TYPES.join(", ")}`,
      );
    }

    if (spec.config === undefined || spec.config === null) {
      issues.push(`logsSamplingRule "${spec.key}" config is required`);
    }

    if (spec.priority !== undefined && (!Number.isInteger(spec.priority) || spec.priority < 0)) {
      issues.push(`logsSamplingRule "${spec.key}" priority must be a non-negative integer`);
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
  const current = await getLogsSamplingRule(config, id, options);
  if (logsSamplingRuleKeyFromServer(current) !== key) {
    throw new SafetyViolationError("logs-sampling-rule", id, key);
  }
}

export async function runLogsSamplingRuleOp(
  config: ClientConfig,
  op: ResourceOp<LogsSamplingRule, ServerLogsSamplingRule>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = buildPayload(op.spec, logsSamplingRuleHash(op.spec));

  if (op.kind === "create") {
    await createLogsSamplingRule(config, payload, options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateLogsSamplingRule(config, op.server.id, payload, options);
}

export async function pruneLogsSamplingRule(
  config: ClientConfig,
  orphan: ServerLogsSamplingRule,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = logsSamplingRuleKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteLogsSamplingRule(config, orphan.id, options);
  return true;
}

export function displayLogsSamplingRule(spec: LogsSamplingRule): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["rule_type", scalar(spec.ruleType)],
    ["priority", scalar(spec.priority ?? null)],
    ["enabled", scalar(spec.enabled ?? false)],
    ["config", displayJson(spec.config ?? null)],
    ["scope_service", scalar(spec.scopeService ?? null)],
    ["scope_path_pattern", scalar(spec.scopePathPattern ?? null)],
    ["scope_attribute_filters", displayJson(spec.scopeAttributeFilters ?? null)],
  ]);
}

export function displayLogsSamplingRuleFromServer(server: ServerLogsSamplingRule): DisplayValue {
  return obj([
    ["key", scalar(logsSamplingRuleKeyFromServer(server) ?? null)],
    ["name", scalar(stripMarker(server.name))],
    ["rule_type", scalar(server.rule_type ?? null)],
    ["priority", scalar(server.priority ?? null)],
    ["enabled", scalar(server.enabled ?? false)],
    ["config", displayJson(server.config ?? null)],
    ["scope_service", scalar(server.scope_service ?? null)],
    ["scope_path_pattern", scalar(server.scope_path_pattern ?? null)],
    ["scope_attribute_filters", displayJson(server.scope_attribute_filters ?? null)],
  ]);
}
