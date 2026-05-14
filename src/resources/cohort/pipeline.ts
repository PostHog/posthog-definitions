import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { Cohort } from "./sdk.js";
import {
  type CohortCreate,
  createCohort,
  deleteCohort,
  getCohort,
  type ServerCohort,
  updateCohort,
} from "./client.js";

/**
 * Cohorts have no `tags` field, so identity rides in a trailing HTML-comment
 * marker on `description` — same pattern as endpoints / property groups /
 * experiment-* / experiments themselves.
 */
export const COHORT_IDENTITY_PREFIX = "iac:cohorts:";

const MARKER_REGEX = /\n*<!--\s*iac:cohorts:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
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
  const trailer = `<!-- iac:cohorts:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function cohortKeyFromServer(server: ServerCohort): string | undefined {
  return parseMarker(server.description)?.key;
}

export function cohortHashFromServer(server: ServerCohort): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: Cohort): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    is_static: spec.is_static ?? false,
    cohort_type: spec.cohort_type ?? null,
    filters: spec.filters ?? null,
    query: spec.query ?? null,
  };
}

export function cohortHash(spec: Cohort): string {
  return specHash(specForHash(spec));
}

export function cohortPayload(spec: Cohort, hash: string): CohortCreate {
  const payload: CohortCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
  };
  if (spec.is_static !== undefined) payload.is_static = spec.is_static;
  if (spec.filters !== undefined) payload.filters = spec.filters;
  if (spec.query !== undefined) payload.query = spec.query;
  if (spec.cohort_type !== undefined) payload.cohort_type = spec.cohort_type;
  return payload;
}

export function looksLikeCohort(value: unknown): value is Cohort {
  return getResourceKind(value) === "cohort";
}

export function validateCohorts(specs: Cohort[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) {
      issues.push("cohort.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`cohort "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) {
      issues.push(`Duplicate cohort key "${spec.key}"`);
    }
    seenKeys.add(spec.key);

    if (!spec.name) {
      issues.push(`cohort "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate cohort name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    // Source-of-membership invariant: exactly one of (filters, query, is_static).
    const hasFilters = spec.filters !== undefined;
    const hasQuery = spec.query !== undefined;
    const isStatic = spec.is_static === true;
    const sources = [hasFilters, hasQuery, isStatic].filter(Boolean).length;
    if (sources === 0) {
      issues.push(
        `cohort "${spec.key}" must declare one source: \`filters\` (behavioral), \`query\` (HogQL), or \`is_static: true\` (manually populated)`,
      );
    } else if (sources > 1) {
      issues.push(
        `cohort "${spec.key}" declares more than one source — pick exactly one of \`filters\`, \`query\`, \`is_static\``,
      );
    }
  }
  return issues;
}

async function assertManagedCohort(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getCohort(config, id, options);
  if (cohortKeyFromServer(current) !== key) {
    throw new SafetyViolationError("cohort", id, key);
  }
}

export async function runCohortOp(
  config: ClientConfig,
  op: ResourceOp<Cohort, ServerCohort>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = cohortPayload(op.spec, cohortHash(op.spec));

  if (op.kind === "create") {
    await createCohort(config, payload, options);
    return;
  }

  await assertManagedCohort(config, op.server.id, op.spec.key, options);
  await updateCohort(config, op.server.id, payload, options);
}

export async function pruneCohort(
  config: ClientConfig,
  orphan: ServerCohort,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = cohortKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManagedCohort(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteCohort(config, orphan.id, options);
  return true;
}

export function displayCohort(spec: Cohort): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["is_static", scalar(spec.is_static ?? false)],
    ["cohort_type", scalar(spec.cohort_type ?? null)],
    ["filters", displayJson(spec.filters ?? null)],
    ["query", displayJson(spec.query ?? null)],
  ]);
}

export function displayCohortFromServer(server: ServerCohort): DisplayValue {
  return obj([
    ["key", scalar(cohortKeyFromServer(server) ?? null)],
    ["name", scalar(server.name ?? null)],
    ["description", scalar(stripMarker(server.description))],
    ["is_static", scalar(server.is_static ?? false)],
    ["cohort_type", scalar(server.cohort_type ?? null)],
    ["filters", displayJson(server.filters ?? null)],
  ]);
}
