import { renderObject } from "../../pull/render.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import type { ServerErrorTrackingSettings } from "./client.js";

const PULLED_FIELDS: ReadonlyArray<string> = [
  "project_rate_limit_value",
  "project_rate_limit_bucket_size_minutes",
  "per_issue_rate_limit_value",
  "per_issue_rate_limit_bucket_size_minutes",
];

export function renderToFile(
  server: ServerErrorTrackingSettings,
  _ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const fields: Record<string, string> = {};
  for (const key of PULLED_FIELDS) {
    const value = (server as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    if (typeof value === "number" && Number.isFinite(value)) fields[key] = String(value);
  }

  if (Object.keys(fields).length === 0) {
    return { skipped: true, reason: "error tracking settings: all rate limits are unset (null)" };
  }

  const contents =
    `import { errorTrackingSettings } from "@posthog/definitions";\n\n` +
    `export default errorTrackingSettings(${renderObject(fields, 2)});\n`;
  // Singletons have no key; reuse the resource name so the tag-back step (which
  // only runs for collections) is a natural no-op.
  return { filename: "error-tracking-settings.ts", contents, specKey: "error-tracking-settings" };
}
