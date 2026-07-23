import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerHogFlow, updateHogFlow } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { HogFlow } from "./sdk.js";

const MARKER_PREFIX = "iac:hog-flows:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(server: ServerHogFlow): { kept: true } | { kept: false; reason: string } {
  if ((server as { deleted?: boolean }).deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerHogFlow): { primary: string; secondary?: string } {
  return { primary: server.name ?? server.id, secondary: `[${server.status ?? "draft"}]` };
}

export function serverIdOf(server: ServerHogFlow): string {
  return server.id;
}

function cleanAction(action: Record<string, unknown>): Record<string, unknown> {
  const { created_at: _c, updated_at: _u, ...rest } = action;
  void _c;
  void _u;
  return rest;
}

export function renderToFile(
  server: ServerHogFlow,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name ?? "") || `hog-flow-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name ?? ""),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  if (server.status && server.status !== "draft") fields.status = stringLiteral(server.status);
  if (server.exit_condition && server.exit_condition !== "exit_only_at_end") {
    fields.exitCondition = stringLiteral(server.exit_condition);
  }
  fields.actions = renderRawLiteral((server.actions ?? []).map(cleanAction), 2);
  fields.edges = renderRawLiteral(server.edges ?? [], 2);
  if (server.trigger_masking != null) fields.triggerMasking = renderRawLiteral(server.trigger_masking, 2);
  if (server.conversion != null) fields.conversion = renderRawLiteral(server.conversion, 2);
  if (server.variables != null) fields.variables = renderRawLiteral(server.variables, 2);

  const contents = [
    `import { hogFlow } from "@posthog/definitions";`,
    "",
    `export default hogFlow(${renderObject(fields, 2)});`,
    "",
  ].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerHogFlow,
  spec: HogFlow,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateHogFlow(config, server.id, { description: newDescription }, options);
}
