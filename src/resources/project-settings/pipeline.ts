import type { ClientConfig } from "../../client/config.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, type DisplayValue } from "../../apply/display.js";
import {
  type ApplyContext,
  type FieldChange,
  getResourceKind,
  type ResourceOp,
} from "../types.js";
import type { ProjectSettings } from "./sdk.js";
import {
  patchProjectSettings,
  type ProjectSettingsPayload,
  type ServerProjectSettings,
} from "./client.js";

export function looksLikeProjectSettings(value: unknown): value is ProjectSettings {
  return getResourceKind(value) === "project-settings";
}

/**
 * Per-field diff for the singleton. Only iterates keys present in `spec` —
 * undeclared keys are invisible to the pipeline, even if the server's value
 * diverges from PostHog's default. That's the safety invariant: we patch only
 * what the user has explicitly opted into managing.
 */
export function diffProjectSettings(
  spec: ProjectSettings,
  server: ServerProjectSettings,
): FieldChange[] {
  const changes: FieldChange[] = [];
  for (const field of Object.keys(spec) as Array<keyof ProjectSettings>) {
    const before = (server as Record<string, unknown>)[field];
    const after = spec[field];
    if (!valuesEqual(before, after)) {
      changes.push({ field, before, after });
    }
  }
  return changes;
}

/**
 * Deep equality via canonical hashing. Mirrors what `specHash` does, so the
 * diff result matches what the user would expect from inspecting either side.
 * Cheap enough for per-field comparison in a single-row resource.
 */
function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return false;
  return specHash(a) === specHash(b);
}

export function validateProjectSettings(specs: ProjectSettings[]): string[] {
  // Loader+driver already enforce at-most-one declared spec for a singleton;
  // this validator only needs to surface per-field constraints. For now there
  // are none beyond what the API itself rejects on PATCH — extra typing on
  // the spec catches the common errors at compile time. Surface API rejects
  // unchanged: they'll come back as ApiError when the executor runs.
  if (specs.length > 1) {
    return [`projectSettings is a singleton; declared ${specs.length} times`];
  }
  return [];
}

/**
 * Build the PATCH body. Only the declared keys are included — the field-
 * scoping invariant is enforced at the request shape itself, not by the
 * server.
 */
function buildPayload(spec: ProjectSettings): ProjectSettingsPayload {
  const payload: ProjectSettingsPayload = {};
  for (const field of Object.keys(spec) as Array<keyof ProjectSettings>) {
    (payload as Record<string, unknown>)[field] = spec[field];
  }
  return payload;
}

export async function runProjectSettingsOp(
  config: ClientConfig,
  op: ResourceOp<ProjectSettings, ServerProjectSettings>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;
  if (op.kind === "create") {
    // Singletons never produce "create" — the row always exists. Treat any
    // create that slips through as a bug (the driver should have routed it
    // as "update").
    throw new Error(
      "project-settings: received a create op, but the singleton row always exists",
    );
  }
  await patchProjectSettings(config, buildPayload(op.spec), options);
}

export function displayProjectSettings(spec: ProjectSettings): DisplayValue {
  return obj(
    (Object.keys(spec) as Array<keyof ProjectSettings>).map(
      (field) => [field as string, scalarOrJson(spec[field])] as [string, DisplayValue],
    ),
  );
}

export function displayProjectSettingsFromServer(server: ServerProjectSettings): DisplayValue {
  // Showing the entire server row would be 60+ noisy fields. Mirror the
  // spec-only display by listing nothing — the per-field diff renderer is
  // where the user sees server vs. desired side-by-side.
  return obj([["name", scalar(server.name)]]);
}

function scalarOrJson(value: unknown): DisplayValue {
  if (value === null || typeof value !== "object") return scalar(value);
  return scalar(JSON.stringify(value));
}
