import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerDashboardTemplate, updateDashboardTemplate } from "./client.js";
import { dashboardTemplateTag, HASH_TAG_PREFIX } from "./pipeline.js";
import type { DashboardTemplate } from "./sdk.js";

export function pullFilter(
  server: ServerDashboardTemplate,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  // Only project-scoped (`team`) templates are manageable; global / org /
  // feature-flag templates are read-only surface owned elsewhere.
  if (server.scope && server.scope !== "team") {
    return { kept: false, reason: `${server.scope}-scoped (read-only)` };
  }
  return { kept: true };
}

export function pullLabel(server: ServerDashboardTemplate): { primary: string; secondary?: string } {
  const tileCount = server.tiles?.length ?? 0;
  return { primary: server.template_name ?? "(unnamed)", secondary: `[${tileCount} tiles]` };
}

export function serverIdOf(server: ServerDashboardTemplate): string {
  return server.id;
}

export function renderToFile(
  server: ServerDashboardTemplate,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.template_name ?? "") || `dashboard-template-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.template_name ?? ""),
  };
  if (server.dashboard_description) fields.description = stringLiteral(server.dashboard_description);
  fields.tiles = renderRawLiteral(server.tiles ?? [], 2);
  if (server.dashboard_filters && Object.keys(server.dashboard_filters).length > 0) {
    fields.filters = renderRawLiteral(server.dashboard_filters, 2);
  }
  if (server.variables != null) fields.variables = renderRawLiteral(server.variables, 2);
  if (server.is_featured) fields.featured = "true";

  const userTags = (server.tags ?? []).filter((t) => !t.startsWith("iac:"));
  if (userTags.length > 0) fields.tags = renderRawLiteral(userTags, 2);

  const contents = [
    `import { dashboardTemplate } from "@posthog/definitions";`,
    "",
    `export default dashboardTemplate(${renderObject(fields, 2)});`,
    "",
  ].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerDashboardTemplate,
  spec: DashboardTemplate,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = (server.tags ?? []).filter((t) => !t.startsWith("iac:"));
  const tags = [dashboardTemplateTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags];
  await updateDashboardTemplate(config, server.id, { tags }, options);
}
