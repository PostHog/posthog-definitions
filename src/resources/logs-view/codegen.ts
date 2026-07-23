import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerLogsView, updateLogsView } from "./client.js";
import { stripMarker, withMarker } from "./pipeline.js";
import type { LogsView } from "./sdk.js";

export function pullFilter(_server: ServerLogsView): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(server: ServerLogsView): { primary: string; secondary?: string } {
  const name = stripMarker(server.name) ?? "(unnamed)";
  return { primary: name.slice(0, 48), secondary: `[${server.short_id}]` };
}

export function serverIdOf(server: ServerLogsView): string {
  return server.short_id;
}

export async function pullDependencies(
  _config: ClientConfig,
  _server: ServerLogsView,
): Promise<PullDependency[]> {
  return [];
}

export function renderToFile(
  server: ServerLogsView,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const name = stripMarker(server.name) ?? "";
  const baseSlug = slugify(name) || `logs-view-${server.short_id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(name),
  };
  if (server.filters && Object.keys(server.filters).length > 0) {
    fields.filters = renderRawLiteral(server.filters, 4);
  }
  if (server.columns && server.columns.length > 0) {
    fields.columns = renderRawLiteral(server.columns, 4);
  }
  if (server.pinned) fields.pinned = "true";

  const parts: string[] = [
    `import { logsView } from "@posthog/definitions";`,
    "",
    `export default logsView(${renderObject(fields, 2)});`,
    "",
  ];

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerLogsView,
  spec: LogsView,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userName = stripMarker(server.name) ?? "";
  const newName = withMarker(userName, spec.key, hash);
  await updateLogsView(config, server.short_id, { name: newName }, options);
}
