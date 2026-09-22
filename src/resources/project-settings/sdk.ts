import { markResourceKind } from "../types.js";

/**
 * Spec for the per-project (environment) settings singleton.
 *
 * This resource PATCHes the flat `/api/environments/{id}/` route, which the
 * generated OpenAPI types do not cover (see `client.ts`). The field types used
 * to be borrowed from the `PatchedTeam` schema, but PostHog removed `Team` /
 * `PatchedTeam` from the published spec (2026-09-22), so there is no schema to
 * derive them from. Until a typed replacement lands, settings are an open
 * key/value map. Every key is optional: the field-scoping invariant is that we
 * only PATCH the keys the user explicitly declares, and never touch the rest.
 *
 * If you previously set a field and want to stop managing it, simply remove
 * the key from the spec — the server value will persist (we don't have
 * before-state to roll back to). To reset a field, declare it with the value
 * you want.
 *
 * `null` and "missing" are distinct: `field: null` PATCHes the field to null;
 * omitting the key entirely leaves the server value alone.
 */
export type ProjectSettings = Record<string, unknown>;

export function projectSettings(spec: ProjectSettings): ProjectSettings {
  return markResourceKind(spec, "project-settings");
}
