import type { components } from "../../generated/api.js";
import { markResourceKind } from "../types.js";

/**
 * Spec for the per-project error-tracking settings singleton — the ingestion
 * rate limits for exception events.
 *
 * Every field is optional: the field-scoping invariant is that apply only
 * PATCHes the keys the user explicitly declares, and never touches the rest.
 * To stop managing a field, remove the key (the server value persists — there
 * is no before-state to roll back to). To reset a limit, declare it: a `null`
 * removes the limit, an integer sets it. Omitting the key entirely leaves the
 * server value alone — `null` and "missing" are distinct.
 *
 * Note: error-tracking *spike detection config* is a sibling singleton but is
 * NOT managed here — its `update_config` endpoint rejects personal API key
 * access, so the CLI can't write it. See docs/resources.md.
 */
export type ErrorTrackingSettings = Partial<components["schemas"]["ErrorTrackingSettings"]>;

export function errorTrackingSettings(spec: ErrorTrackingSettings): ErrorTrackingSettings {
  return markResourceKind(spec, "error-tracking-settings");
}
