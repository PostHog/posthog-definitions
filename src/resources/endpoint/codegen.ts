import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerEndpoint, updateEndpoint } from "./client.js";
import type { Endpoint } from "./sdk.js";

const MARKER_PREFIX = "iac:endpoints:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:endpoints:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerEndpoint,
): { kept: true } | { kept: false; reason: string } {
  // Endpoints are always user-created; no auto-generated rows to drop.
  return { kept: true };
}

export function pullLabel(server: ServerEndpoint): { primary: string; secondary?: string } {
  return { primary: server.name, secondary: server.is_active === false ? "[inactive]" : undefined };
}

export function serverIdOf(server: ServerEndpoint): string {
  // Endpoints are addressed by name in their URL.
  return server.name;
}

export function renderToFile(
  server: ServerEndpoint,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `endpoint-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.query = renderRawLiteral(server.query, 2);
  if (server.is_active === false) fields.is_active = "false";
  if (server.is_materialized) fields.is_materialized = "true";
  if (server.derived_from_insight) {
    fields.derived_from_insight = stringLiteral(server.derived_from_insight);
  }
  if (server.data_freshness_seconds != null) {
    fields.data_freshness_seconds = String(server.data_freshness_seconds);
  }
  if (server.bucket_overrides) {
    fields.bucket_overrides = renderRawLiteral(server.bucket_overrides, 2);
  }

  const body = renderObject(fields, 2);
  const contents =
    `import { endpoint } from "@posthog/definitions";\n\n` +
    `export default endpoint(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerEndpoint,
  spec: Endpoint,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateEndpoint(config, server.name, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
