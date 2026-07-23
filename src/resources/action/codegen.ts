import type { ClientConfig } from "../../client/config.js";
import { isManagedTag } from "../../apply/display.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerAction, updateAction } from "./client.js";
import { actionTag } from "./pipeline.js";
import type { Action } from "./sdk.js";

const HASH_TAG_PREFIX = "iac:hash:";

// The step fields the SDK's ActionStep round-trips. The server returns every
// one (often as null); we render only the populated ones so the codegen'd
// file stays readable. apply's `normalizeStep` re-fills the nulls, so the
// trimmed render still hashes identically to the server row.
const STEP_FIELDS = [
  "event",
  "properties",
  "selector",
  "tag_name",
  "text",
  "text_matching",
  "href",
  "href_matching",
  "url",
  "url_matching",
] as const;

export function pullFilter(
  server: ServerAction,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerAction): { primary: string; secondary?: string } {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  const secondary = userTags.length > 0 ? `[${userTags.join(", ")}]` : undefined;
  return { primary: server.name?.trim() || `action-${server.id}`, secondary };
}

export function serverIdOf(server: ServerAction): number {
  return server.id;
}

function cleanStep(step: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of STEP_FIELDS) {
    const value = step[field];
    if (value !== null && value !== undefined) out[field] = value;
  }
  return out;
}

export function renderToFile(
  server: ServerAction,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name ?? "") || `action-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const steps = (server.steps ?? []).map((s) => cleanStep(s as Record<string, unknown>));
  if (steps.length === 0) {
    return {
      skipped: true,
      reason: `Action "${slug}" has no steps — nothing to render.`,
    };
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name?.trim() || slug),
  };
  if (server.description) fields.description = stringLiteral(server.description);
  fields.steps = renderRawLiteral(steps, 2);
  if (server.post_to_slack) fields.post_to_slack = "true";
  if (server.slack_message_format) {
    fields.slack_message_format = stringLiteral(server.slack_message_format);
  }
  if (server.pinned_at) fields.pinned_at = stringLiteral(server.pinned_at);
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  if (userTags.length > 0) fields.tags = `[${userTags.map(stringLiteral).join(", ")}]`;

  const contents =
    `import { action } from "@posthog/definitions";\n\n` +
    `export default action(${renderObject(fields, 2)});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerAction,
  spec: Action,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  await updateAction(
    config,
    server.id,
    { tags: [actionTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags] },
    options,
  );
}
