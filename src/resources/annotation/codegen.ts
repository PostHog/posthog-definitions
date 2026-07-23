import type { ClientConfig } from "../../client/config.js";
import { renderObject, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerAnnotation, updateAnnotation } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { Annotation } from "./sdk.js";

const MARKER_PREFIX = "iac:annotations:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerAnnotation,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerAnnotation): { primary: string; secondary?: string } {
  const text = stripMarker(server.content) ?? "(no text)";
  return { primary: text.slice(0, 48), secondary: `[${server.scope ?? "project"}]` };
}

export function serverIdOf(server: ServerAnnotation): number {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  server: ServerAnnotation,
): Promise<PullDependency[]> {
  const deps: PullDependency[] = [];
  if (server.dashboard_item != null) {
    deps.push({ resourceName: "insights", serverId: server.dashboard_item });
  }
  if (server.dashboard_id != null) {
    deps.push({ resourceName: "dashboards", serverId: server.dashboard_id });
  }
  return deps;
}

export function renderToFile(
  server: ServerAnnotation,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const text = stripMarker(server.content) ?? "";
  const baseSlug = slugify(text) || `annotation-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const insightImport =
    server.dashboard_item != null
      ? ctx.importForServerIdOptional("insights", server.dashboard_item)
      : undefined;
  const dashboardImport =
    server.dashboard_id != null
      ? ctx.importForServerIdOptional("dashboards", server.dashboard_id)
      : undefined;

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    content: stringLiteral(text),
  };
  if (server.date_marker) fields.dateMarker = stringLiteral(server.date_marker);
  if (server.scope && server.scope !== "project") fields.scope = stringLiteral(server.scope);
  if (insightImport) fields.insight = insightImport.varName;
  if (dashboardImport) fields.dashboard = dashboardImport.varName;
  if (server.emoji) fields.emoji = stringLiteral(server.emoji);
  if (server.hidden_in_user_interface) fields.hidden = "true";
  if (server.creation_type) fields.creationType = stringLiteral(server.creation_type);

  const parts: string[] = [`import { annotation } from "@posthog/definitions";`];
  if (insightImport) {
    parts.push(`import ${insightImport.varName} from "../insights/${insightImport.filename.replace(/\.ts$/, ".js")}";`);
  }
  if (dashboardImport) {
    parts.push(`import ${dashboardImport.varName} from "../dashboards/${dashboardImport.filename.replace(/\.ts$/, ".js")}";`);
  }
  parts.push("");
  parts.push(`export default annotation(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerAnnotation,
  spec: Annotation,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userContent = stripMarker(server.content) ?? "";
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newContent = userContent ? `${userContent}\n\n${marker}` : marker;
  await updateAnnotation(config, server.id, { content: newContent }, options);
}
