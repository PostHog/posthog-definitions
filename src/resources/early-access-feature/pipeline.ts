import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";
import type { EarlyAccessFeature } from "./sdk.js";
import {
  createEarlyAccessFeature,
  deleteEarlyAccessFeature,
  type EarlyAccessFeatureCreate,
  type EarlyAccessFeatureUpdate,
  getEarlyAccessFeature,
  type ServerEarlyAccessFeature,
  updateEarlyAccessFeature,
} from "./client.js";

/**
 * Early-access features have no `tags` field. Identity sits in a trailing
 * HTML-comment marker on `description` (endpoints / surveys pattern).
 */
export const EARLY_ACCESS_FEATURE_IDENTITY_PREFIX = "iac:early-access-features:";

const MARKER_REGEX = /\n*<!--\s*iac:early-access-features:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

function parseMarker(
  description: string | null | undefined,
): { userDescription: string; key: string; hash: string } | undefined {
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
  const trailer = `<!-- iac:early-access-features:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function earlyAccessFeatureKeyFromServer(server: ServerEarlyAccessFeature): string | undefined {
  return parseMarker(server.description)?.key;
}

export function earlyAccessFeatureHashFromServer(server: ServerEarlyAccessFeature): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: EarlyAccessFeature): unknown {
  // Everything that round-trips, EXCLUDING the server-resolved flag id and the
  // managed marker. The flag is hashed by KEY so the hash is environment-portable.
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    stage: spec.stage,
    documentation_url: spec.documentationUrl ?? null,
    payload: spec.payload ?? null,
    feature_flag_key: spec.featureFlag.key,
  };
}

export function earlyAccessFeatureHash(spec: EarlyAccessFeature): string {
  return specHash(specForHash(spec));
}

function resolveFlagId(spec: EarlyAccessFeature, ctx: ApplyContext): number {
  const id = ctx.featureFlagIdByKey.get(spec.featureFlag.key);
  if (id === undefined) {
    throw new Error(
      `early access feature "${spec.key}" references flag "${spec.featureFlag.key}" but no server id is known. Feature flags must run before early access features.`,
    );
  }
  return id;
}

function buildCreatePayload(
  spec: EarlyAccessFeature,
  hash: string,
  ctx: ApplyContext,
): EarlyAccessFeatureCreate {
  const payload: EarlyAccessFeatureCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    stage: spec.stage,
    feature_flag_id: resolveFlagId(spec, ctx),
  };
  if (spec.documentationUrl !== undefined) payload.documentation_url = spec.documentationUrl;
  if (spec.payload !== undefined) payload.payload = spec.payload;
  return payload;
}

function buildUpdatePayload(
  spec: EarlyAccessFeature,
  hash: string,
): EarlyAccessFeatureUpdate {
  // feature_flag_id is immutable post-create on the API, so it's omitted here.
  const payload: EarlyAccessFeatureUpdate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    stage: spec.stage,
    documentation_url: spec.documentationUrl ?? "",
  };
  if (spec.payload !== undefined) payload.payload = spec.payload;
  return payload;
}

export function looksLikeEarlyAccessFeature(value: unknown): value is EarlyAccessFeature {
  return getResourceKind(value) === "early-access-feature";
}

export function validateEarlyAccessFeatures(
  specs: EarlyAccessFeature[],
  state: DesiredState,
): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  const knownFlagKeys = new Set<string>();
  const multivariateFlagKeys = new Set<string>();
  for (const loaded of state.get("feature-flags") ?? []) {
    const flag = loaded.spec as FeatureFlag;
    if (!flag?.key) continue;
    knownFlagKeys.add(flag.key);
    const variants = (flag.filters as { multivariate?: { variants?: unknown[] } } | undefined)
      ?.multivariate?.variants;
    if (Array.isArray(variants) && variants.length > 0) multivariateFlagKeys.add(flag.key);
  }

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("earlyAccessFeature.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`early access feature "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate early access feature key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`early access feature "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate early access feature name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (!spec.stage) issues.push(`early access feature "${spec.key}" stage is required`);

    if (!spec.featureFlag?.key) {
      issues.push(
        `early access feature "${spec.key}" must reference a featureFlag (auto-flag creation is not supported — link an existing flag)`,
      );
    } else if (!knownFlagKeys.has(spec.featureFlag.key)) {
      issues.push(
        `early access feature "${spec.key}" references unknown feature flag "${spec.featureFlag.key}" — declare it with featureFlag({ key: "${spec.featureFlag.key}", … }) in the same run`,
      );
    } else if (multivariateFlagKeys.has(spec.featureFlag.key)) {
      issues.push(
        `early access feature "${spec.key}" references multivariate flag "${spec.featureFlag.key}" — the API only accepts a boolean flag for early access features`,
      );
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
  const current = await getEarlyAccessFeature(config, id, options);
  if (earlyAccessFeatureKeyFromServer(current) !== key) {
    throw new SafetyViolationError("early-access-feature", id, key);
  }
}

export async function runEarlyAccessFeatureOp(
  config: ClientConfig,
  op: ResourceOp<EarlyAccessFeature, ServerEarlyAccessFeature>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = earlyAccessFeatureHash(op.spec);

  if (op.kind === "create") {
    await createEarlyAccessFeature(config, buildCreatePayload(op.spec, hash, ctx), options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateEarlyAccessFeature(config, op.server.id, buildUpdatePayload(op.spec, hash), options);
}

export async function pruneEarlyAccessFeature(
  config: ClientConfig,
  orphan: ServerEarlyAccessFeature,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = earlyAccessFeatureKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteEarlyAccessFeature(config, orphan.id, options);
  return true;
}

export function displayEarlyAccessFeature(spec: EarlyAccessFeature): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["stage", scalar(spec.stage)],
    ["documentation_url", scalar(spec.documentationUrl ?? null)],
    ["payload", displayJson(spec.payload ?? null)],
    ["feature_flag", scalar(spec.featureFlag.key)],
  ]);
}

export function displayEarlyAccessFeatureFromServer(
  server: ServerEarlyAccessFeature,
  flagKeyByServerId: Map<number, string>,
): DisplayValue {
  const flagId = server.feature_flag?.id;
  return obj([
    ["key", scalar(earlyAccessFeatureKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["stage", scalar(server.stage)],
    ["documentation_url", scalar(server.documentation_url ?? null)],
    ["payload", displayJson(server.payload ?? null)],
    [
      "feature_flag",
      scalar(
        flagId != null
          ? (flagKeyByServerId.get(flagId) ?? server.feature_flag?.key ?? `id:${flagId}`)
          : null,
      ),
    ],
  ]);
}
