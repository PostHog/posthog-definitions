import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import { type HogFunction, type HogFunctionInputValue, isSecretInput } from "./sdk.js";
import {
  createHogFunction,
  deleteHogFunction,
  getHogFunction,
  type HogFunctionCreate,
  type HogFunctionInputWire,
  type HogFunctionUpdate,
  type ServerHogFunction,
  updateHogFunction,
} from "./client.js";

/**
 * Hog functions have no `tags` field. Identity sits in a trailing HTML-comment
 * marker on `description` (surveys / endpoints pattern).
 */
export const HOG_FUNCTION_IDENTITY_PREFIX = "iac:hog-functions:";

const MARKER_REGEX = /\n*<!--\s*iac:hog-functions:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:hog-functions:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function hogFunctionKeyFromServer(server: ServerHogFunction): string | undefined {
  return parseMarker(server.description)?.key;
}

export function hogFunctionHashFromServer(server: ServerHogFunction): string | undefined {
  return parseMarker(server.description)?.hash;
}

/**
 * Canonical projection for hashing. Secret values are NEVER included — only the
 * env var name and the optional rotate token — so the masked read-back can
 * never produce a spurious diff, and secrets never touch the definition hash.
 */
function inputsForHash(inputs: Record<string, HogFunctionInputValue> | undefined): unknown {
  if (!inputs) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(inputs)) {
    out[key] = isSecretInput(value)
      ? { __secret_env: value.env, rotate: value.rotate ?? null }
      : value;
  }
  return out;
}

function specForHash(spec: HogFunction): unknown {
  return {
    key: spec.key,
    type: spec.type,
    name: spec.name,
    description: spec.description ?? "",
    templateId: spec.templateId,
    enabled: spec.enabled ?? true,
    inputs: inputsForHash(spec.inputs),
    filters: spec.filters ?? null,
  };
}

export function hogFunctionHash(spec: HogFunction): string {
  return specHash(specForHash(spec));
}

function resolveSecret(env: string, specKey: string, inputKey: string): string {
  const value = process.env[env];
  if (value === undefined || value === "") {
    throw new Error(
      `hog function "${specKey}" secret input "${inputKey}" reads env var "${env}", but it is not set. Export it before applying (secrets are never stored in definition files).`,
    );
  }
  return value;
}

function buildCreatePayload(spec: HogFunction, hash: string): HogFunctionCreate {
  const payload: HogFunctionCreate = {
    type: spec.type,
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    template_id: spec.templateId,
    enabled: spec.enabled ?? true,
  };
  const inputs = buildInputs(spec, { includeSecrets: "all" });
  if (Object.keys(inputs).length > 0) payload.inputs = inputs;
  if (spec.filters !== undefined) payload.filters = spec.filters;
  return payload;
}

function buildUpdatePayload(spec: HogFunction, hash: string): HogFunctionUpdate {
  const payload: HogFunctionUpdate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    enabled: spec.enabled ?? true,
  };
  // On update, only secrets flagged for rotation are re-sent; all others are
  // omitted so the server keeps the stored value.
  const inputs = buildInputs(spec, { includeSecrets: "rotating" });
  if (Object.keys(inputs).length > 0) payload.inputs = inputs;
  if (spec.filters !== undefined) payload.filters = spec.filters;
  return payload;
}

/**
 * Build the wire `inputs` map. `includeSecrets: "all"` sends every secret
 * (create); `"rotating"` sends only secrets with a `rotate` token, omitting the
 * rest so the server preserves them (update).
 */
function buildInputs(
  spec: HogFunction,
  opts: { includeSecrets: "all" | "rotating" },
): Record<string, HogFunctionInputWire> {
  const out: Record<string, HogFunctionInputWire> = {};
  for (const [key, value] of Object.entries(spec.inputs ?? {})) {
    if (isSecretInput(value)) {
      const send = opts.includeSecrets === "all" || value.rotate !== undefined;
      if (send) out[key] = { value: resolveSecret(value.env, spec.key, key) };
      // else: omit — preserves the existing secret value on the server.
    } else {
      out[key] = { value };
    }
  }
  return out;
}

export function looksLikeHogFunction(value: unknown): value is HogFunction {
  return getResourceKind(value) === "hog-function";
}

const KNOWN_TYPES = new Set([
  "destination",
  "transformation",
  "site_destination",
  "internal_destination",
  "site_app",
  "source_webhook",
  "warehouse_source_webhook",
]);

export function validateHogFunctions(specs: HogFunction[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("hog-function.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`hog function "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate hog function key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`hog function "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate hog function name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (!spec.type) {
      issues.push(`hog function "${spec.key}" type is required`);
    } else if (!KNOWN_TYPES.has(spec.type)) {
      issues.push(`hog function "${spec.key}" has unknown type "${spec.type}"`);
    }

    if (!spec.templateId) {
      issues.push(
        `hog function "${spec.key}" requires a templateId (e.g. "template-activecampaign") — only template-based functions are managed`,
      );
    }
  }
  return issues;
}

/** Refetch (full) and confirm the marker key still matches. Returns the row so
 * callers can inspect server-side fields like the source template. */
async function assertManaged(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<ServerHogFunction> {
  const current = await getHogFunction(config, id, options);
  if (hogFunctionKeyFromServer(current) !== key) {
    throw new SafetyViolationError("hog-function", id, key);
  }
  return current;
}

export async function runHogFunctionOp(
  config: ClientConfig,
  op: ResourceOp<HogFunction, ServerHogFunction>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = hogFunctionHash(op.spec);

  if (op.kind === "create") {
    await createHogFunction(config, buildCreatePayload(op.spec, hash), options);
    return;
  }

  const current = await assertManaged(config, op.server.id, op.spec.key, options);
  // The template's code is inlined at create time; template_id is write-only
  // and reads back null, but `template.id` echoes the source. If the spec now
  // names a different template, an in-place update would silently keep the old
  // code — refuse rather than diverge.
  const serverTemplateId = current.template?.id ?? null;
  if (serverTemplateId && serverTemplateId !== op.spec.templateId) {
    throw new Error(
      `hog function "${op.spec.key}" changed templateId from "${serverTemplateId}" to "${op.spec.templateId}". The template's code is inlined at create time and cannot be swapped in place — delete the function and re-apply to recreate it.`,
    );
  }
  await updateHogFunction(config, op.server.id, buildUpdatePayload(op.spec, hash), options);
}

export async function pruneHogFunction(
  config: ClientConfig,
  orphan: ServerHogFunction,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = hogFunctionKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteHogFunction(config, orphan.id, options);
  return true;
}

/** Render inputs for display: plain values shown; secrets redacted to their
 * env var reference (never the value). */
function displayInputs(inputs: Record<string, HogFunctionInputValue> | undefined): DisplayValue {
  const shown: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(inputs ?? {})) {
    shown[key] = isSecretInput(value) ? `secret(env:${value.env})` : value;
  }
  return displayJson(shown);
}

export function displayHogFunction(spec: HogFunction): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["type", scalar(spec.type)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["templateId", scalar(spec.templateId)],
    ["enabled", scalar(spec.enabled ?? true)],
    ["inputs", displayInputs(spec.inputs)],
    ["filters", displayJson(spec.filters ?? null)],
  ]);
}

export function displayHogFunctionFromServer(server: ServerHogFunction): DisplayValue {
  // Server input values carry bytecode/order and secrets read back masked;
  // show just the keys (with secret ones flagged) to keep update diffs legible.
  const shown: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(server.inputs ?? {})) {
    shown[key] = (item as { secret?: boolean }).secret ? "secret(masked)" : (item as { value?: unknown }).value;
  }
  return obj([
    ["key", scalar(hogFunctionKeyFromServer(server) ?? null)],
    ["type", scalar(server.type ?? null)],
    ["name", scalar(server.name ?? "")],
    ["description", scalar(stripMarker(server.description))],
    ["templateId", scalar(server.template?.id ?? null)],
    ["enabled", scalar(server.enabled ?? true)],
    ["inputs", displayJson(shown)],
    ["filters", displayJson(server.filters ?? null)],
  ]);
}
