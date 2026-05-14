import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import type { ServerProjectSettings } from "./client.js";

/**
 * Curated set of project-settings fields surfaced by pull. The singleton has
 * ~60 server fields; rendering them all would obscure the few users actually
 * care about. This list mirrors what teams typically declare in code; if a
 * pulled field isn't here, the user can still add it manually — apply only
 * touches declared keys.
 */
const PULLED_FIELDS: ReadonlyArray<string> = [
  "name",
  "timezone",
  "week_start_day",
  "anonymize_ips",
  "completed_snippet_onboarding",
  "test_account_filters_default_checked",
  "is_demo",
  "autocapture_opt_out",
  "autocapture_exceptions_opt_in",
  "autocapture_web_vitals_opt_in",
  "capture_console_log_opt_in",
  "capture_performance_opt_in",
  "capture_dead_clicks",
  "session_recording_opt_in",
  "session_recording_sample_rate",
  "session_recording_minimum_duration_milliseconds",
  "session_recording_retention_period",
  "surveys_opt_in",
  "heatmaps_opt_in",
  "flags_persistence_default",
  "feature_flag_confirmation_enabled",
  "feature_flag_confirmation_message",
  "default_evaluation_contexts_enabled",
  "require_evaluation_contexts",
  "human_friendly_comparison_periods",
  "inject_web_apps",
  "person_display_name_properties",
  "recording_domains",
  "live_events_columns",
  "app_urls",
  "base_currency",
  "business_model",
] as const;

export function renderToFile(
  server: ServerProjectSettings,
  _ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const fields: Record<string, string> = {};
  for (const key of PULLED_FIELDS) {
    const value = (server as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    fields[key] = renderValue(value);
  }

  if (Object.keys(fields).length === 0) {
    return {
      skipped: true,
      reason: "project settings: no curated fields had server values to pull",
    };
  }

  const body = renderObject(fields, 2);
  const contents =
    `import { projectSettings } from "@posthog/definitions";\n\n` +
    `export default projectSettings(${body});\n`;
  // Singletons don't have a key; reuse the resource name for the spec key so
  // the tag-back step (which only runs for collections) is naturally a no-op.
  return { filename: "settings.ts", contents, specKey: "project-settings" };
}

function renderValue(value: unknown): string {
  if (typeof value === "string") return stringLiteral(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  return renderRawLiteral(value, 2);
}
