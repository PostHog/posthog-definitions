import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerLogsSamplingRule, updateLogsSamplingRule } from "./client.js";
import { stripMarker, withMarker } from "./pipeline.js";
import type { LogsSamplingRule } from "./sdk.js";

export function pullFilter(
  _server: ServerLogsSamplingRule,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(server: ServerLogsSamplingRule): { primary: string; secondary?: string } {
  const name = stripMarker(server.name) ?? "(unnamed)";
  return { primary: name.slice(0, 48), secondary: `[${server.rule_type}]` };
}

export function serverIdOf(server: ServerLogsSamplingRule): string {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  _server: ServerLogsSamplingRule,
): Promise<PullDependency[]> {
  return [];
}

export function renderToFile(
  server: ServerLogsSamplingRule,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const name = stripMarker(server.name) ?? "";
  const baseSlug = slugify(name) || `logs-sampling-rule-${server.id.slice(0, 8)}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(name),
    ruleType: stringLiteral(server.rule_type),
  };
  if (server.config !== undefined && server.config !== null) {
    fields.config = renderRawLiteral(server.config, 4);
  }
  if (server.enabled) fields.enabled = "true";
  if (server.priority != null) fields.priority = String(server.priority);
  if (server.scope_service) fields.scopeService = stringLiteral(server.scope_service);
  if (server.scope_path_pattern) fields.scopePathPattern = stringLiteral(server.scope_path_pattern);
  if (server.scope_attribute_filters && server.scope_attribute_filters.length > 0) {
    fields.scopeAttributeFilters = renderRawLiteral(server.scope_attribute_filters, 4);
  }

  const parts: string[] = [
    `import { logsSamplingRule } from "@posthog/definitions";`,
    "",
    `export default logsSamplingRule(${renderObject(fields, 2)});`,
    "",
  ];

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerLogsSamplingRule,
  spec: LogsSamplingRule,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userName = stripMarker(server.name) ?? "";
  const newName = withMarker(userName, spec.key, hash);
  await updateLogsSamplingRule(config, server.id, { name: newName }, options);
}
