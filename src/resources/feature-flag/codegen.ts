import type { ClientConfig } from "../../client/config.js";
import { isManagedTag } from "../../apply/display.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerFeatureFlag, updateFeatureFlag } from "./client.js";
import { featureFlagTag } from "./pipeline.js";
import type { FeatureFlag } from "./sdk.js";

const HASH_TAG_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerFeatureFlag,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerFeatureFlag): { primary: string; secondary?: string } {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  const secondary = userTags.length > 0 ? `[${userTags.join(", ")}]` : undefined;
  return { primary: server.name?.trim() || server.key, secondary };
}

export function serverIdOf(server: ServerFeatureFlag): number {
  return server.id;
}

export function renderToFile(
  server: ServerFeatureFlag,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.key) || slugify(server.name ?? "") || `flag-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(server.key),
  };
  if (server.name) fields.name = stringLiteral(server.name);
  if (typeof server.active === "boolean") fields.active = String(server.active);

  fields.filters = renderRawLiteral(server.filters, 2);

  if (server.ensure_experience_continuity)
    fields.ensure_experience_continuity = "true";
  if (server.is_remote_configuration)
    fields.is_remote_configuration = "true";
  if (server.evaluation_runtime && server.evaluation_runtime !== "all")
    fields.evaluation_runtime = stringLiteral(server.evaluation_runtime);
  if (server.bucketing_identifier && server.bucketing_identifier !== "distinct_id")
    fields.bucketing_identifier = stringLiteral(server.bucketing_identifier);

  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  if (userTags.length > 0) fields.tags = `[${userTags.map(stringLiteral).join(", ")}]`;

  if (server.has_encrypted_payloads) {
    ctx.warn(
      `Feature flag "${server.key}" has has_encrypted_payloads=true. posthog-definitions doesn't manage encrypted payloads — review and edit manually.`,
    );
  }

  const body = renderObject(fields, 2);
  const contents =
    `import { featureFlag } from "@posthog/definitions";\n\n` +
    `export default featureFlag(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: server.key };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerFeatureFlag,
  spec: FeatureFlag,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = (server.tags ?? []).filter((t) => !isManagedTag(t));
  await updateFeatureFlag(
    config,
    server.id,
    { tags: [featureFlagTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags] },
    options,
  );
}
