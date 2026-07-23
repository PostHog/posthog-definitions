import type { ClientConfig } from "../../client/config.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, type DisplayValue } from "../../apply/display.js";
import {
  type ApplyContext,
  type FieldChange,
  getResourceKind,
  type ResourceOp,
} from "../types.js";
import type { ErrorTrackingSettings } from "./sdk.js";
import {
  patchErrorTrackingSettings,
  type ErrorTrackingSettingsPayload,
  type ServerErrorTrackingSettings,
} from "./client.js";

export function looksLikeErrorTrackingSettings(value: unknown): value is ErrorTrackingSettings {
  return getResourceKind(value) === "error-tracking-settings";
}

/**
 * Per-field diff. Only iterates keys present in `spec` — undeclared keys are
 * invisible to the pipeline. That's the field-scoping safety invariant: apply
 * PATCHes only what the user has explicitly opted into managing.
 */
export function diffErrorTrackingSettings(
  spec: ErrorTrackingSettings,
  server: ServerErrorTrackingSettings,
): FieldChange[] {
  const changes: FieldChange[] = [];
  for (const field of Object.keys(spec) as Array<keyof ErrorTrackingSettings>) {
    const before = (server as Record<string, unknown>)[field];
    const after = spec[field];
    if (!valuesEqual(before, after)) {
      changes.push({ field, before, after });
    }
  }
  return changes;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return false;
  return specHash(a) === specHash(b);
}

const FIELDS: ReadonlyArray<keyof ErrorTrackingSettings> = [
  "project_rate_limit_value",
  "project_rate_limit_bucket_size_minutes",
  "per_issue_rate_limit_value",
  "per_issue_rate_limit_bucket_size_minutes",
];

export function validateErrorTrackingSettings(specs: ErrorTrackingSettings[]): string[] {
  if (specs.length > 1) {
    return [`errorTrackingSettings is a singleton; declared ${specs.length} times`];
  }
  const issues: string[] = [];
  const spec = specs[0];
  if (!spec) return issues;
  for (const field of FIELDS) {
    if (!(field in spec)) continue;
    const value = spec[field];
    if (value === null) continue; // null = "remove the limit" — valid.
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
      issues.push(`error tracking settings: ${field} must be a positive integer or null`);
    }
  }
  return issues;
}

function buildPayload(spec: ErrorTrackingSettings): ErrorTrackingSettingsPayload {
  const payload: ErrorTrackingSettingsPayload = {};
  for (const field of Object.keys(spec) as Array<keyof ErrorTrackingSettings>) {
    (payload as Record<string, unknown>)[field] = spec[field];
  }
  return payload;
}

export async function runErrorTrackingSettingsOp(
  config: ClientConfig,
  op: ResourceOp<ErrorTrackingSettings, ServerErrorTrackingSettings>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;
  if (op.kind === "create") {
    throw new Error(
      "error-tracking-settings: received a create op, but the singleton row always exists",
    );
  }
  await patchErrorTrackingSettings(config, buildPayload(op.spec), options);
}

export function displayErrorTrackingSettings(spec: ErrorTrackingSettings): DisplayValue {
  return obj(
    (Object.keys(spec) as Array<keyof ErrorTrackingSettings>).map(
      (field) => [field as string, scalar(spec[field] ?? null)] as [string, DisplayValue],
    ),
  );
}

export function displayErrorTrackingSettingsFromServer(
  server: ServerErrorTrackingSettings,
): DisplayValue {
  return obj(
    FIELDS.map(
      (field) =>
        [field as string, scalar((server as Record<string, unknown>)[field] ?? null)] as [
          string,
          DisplayValue,
        ],
    ),
  );
}
