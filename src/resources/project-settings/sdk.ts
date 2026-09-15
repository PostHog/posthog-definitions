import { markResourceKind } from "../types.js";

/**
 * Managed project-settings (environment) fields.
 *
 * These previously came straight from the OpenAPI `PatchedTeam` schema. As of
 * the 2026-09-15 schema refresh PostHog removed the `Team`/`PatchedTeam`
 * schemas from the public spec (the environment CRUD endpoints are no longer
 * documented there), so we can no longer derive the type from generated code.
 * The runtime call still targets `/api/environments/{id}/` (see client.ts).
 *
 * This is the curated set of fields the resource manages — it mirrors the
 * `PULLED_FIELDS` list in codegen.ts, which is what teams actually declare in
 * code. Server-managed identifiers, tokens, and computed fields are
 * deliberately absent so they can't be PATCHed.
 */
export interface ProjectSettingsFields {
  name: string;
  timezone: string;
  week_start_day: number | null;
  anonymize_ips: boolean;
  completed_snippet_onboarding: boolean;
  test_account_filters_default_checked: boolean | null;
  is_demo: boolean;
  autocapture_opt_out: boolean | null;
  autocapture_exceptions_opt_in: boolean | null;
  autocapture_web_vitals_opt_in: boolean | null;
  capture_console_log_opt_in: boolean | null;
  capture_performance_opt_in: boolean | null;
  capture_dead_clicks: boolean | null;
  session_recording_opt_in: boolean;
  /** Decimal serialized as a string, e.g. "0.10". */
  session_recording_sample_rate: string | null;
  session_recording_minimum_duration_milliseconds: number | null;
  session_recording_retention_period: string;
  surveys_opt_in: boolean | null;
  heatmaps_opt_in: boolean | null;
  flags_persistence_default: boolean | null;
  feature_flag_confirmation_enabled: boolean | null;
  feature_flag_confirmation_message: string | null;
  default_evaluation_contexts_enabled: boolean | null;
  require_evaluation_contexts: boolean | null;
  human_friendly_comparison_periods: boolean | null;
  inject_web_apps: boolean | null;
  person_display_name_properties: string[] | null;
  recording_domains: (string | null)[] | null;
  live_events_columns: string[] | null;
  app_urls: (string | null)[];
  base_currency: string;
  business_model: string | null;
}

/**
 * Spec for the per-project (environment) settings singleton.
 *
 * Every key is optional: the field-scoping invariant is that we only PATCH the
 * keys the user explicitly declares, and never touch the rest.
 *
 * If you previously set a field and want to stop managing it, simply remove
 * the key from the spec — the server value will persist (we don't have
 * before-state to roll back to). To reset a field, declare it with the value
 * you want.
 *
 * `null` and "missing" are distinct: `field: null` PATCHes the field to null;
 * omitting the key entirely leaves the server value alone.
 */
export type ProjectSettings = Partial<ProjectSettingsFields>;

export function projectSettings(spec: ProjectSettings): ProjectSettings {
  return markResourceKind(spec, "project-settings");
}
