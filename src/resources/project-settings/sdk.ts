import type { components } from "../../generated/api.js";
import { markResourceKind } from "../types.js";

/**
 * Spec for the per-project (environment) settings singleton.
 *
 * Field types come straight from the OpenAPI schema (`PatchedProjectBackwardCompat`) with the
 * server-managed identifiers, tokens, and computed fields omitted. Every key
 * is optional: the field-scoping invariant is that we only PATCH the keys the
 * user explicitly declares, and never touch the rest.
 *
 * If you previously set a field and want to stop managing it, simply remove
 * the key from the spec — the server value will persist (we don't have
 * before-state to roll back to). To reset a field, declare it with the value
 * you want.
 *
 * `null` and "missing" are distinct: `field: null` PATCHes the field to null;
 * omitting the key entirely leaves the server value alone.
 */
export type ProjectSettings = Partial<
  Omit<
    components["schemas"]["PatchedProjectBackwardCompat"],
    | "id"
    | "uuid"
    | "organization"
    | "project_id"
    | "api_token"
    | "secret_api_token"
    | "secret_api_token_backup"
    | "created_at"
    | "updated_at"
    | "ingested_event"
    | "default_modifiers"
    | "person_on_events_querying_enabled"
    | "user_access_level"
    | "effective_membership_level"
    | "has_group_types"
  >
>;

export function projectSettings(spec: ProjectSettings): ProjectSettings {
  return markResourceKind(spec, "project-settings");
}
