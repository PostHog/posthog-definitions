import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerMessageTemplate, updateMessageTemplate } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { MessageTemplate } from "./sdk.js";

const MARKER_PREFIX = "iac:messaging-templates:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerMessageTemplate,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerMessageTemplate): { primary: string; secondary?: string } {
  return { primary: server.name, secondary: `[${server.type ?? "email"}]` };
}

export function serverIdOf(server: ServerMessageTemplate): string {
  return server.id;
}

export function renderToFile(
  server: ServerMessageTemplate,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `messaging-template-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.email = renderRawLiteral(server.content?.email ?? {}, 2);
  if (server.content?.templating && server.content.templating !== "liquid") {
    fields.templating = stringLiteral(server.content.templating);
  }
  if (server.message_category) fields.messageCategory = stringLiteral(server.message_category);

  const contents = [
    `import { messageTemplate } from "@posthog/definitions";`,
    "",
    `export default messageTemplate(${renderObject(fields, 2)});`,
    "",
  ].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerMessageTemplate,
  spec: MessageTemplate,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateMessageTemplate(config, server.id, { description: newDescription }, options);
}
