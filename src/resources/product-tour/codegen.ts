import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerProductTour, updateProductTour } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { ProductTour } from "./sdk.js";

const MARKER_PREFIX = "iac:product-tours:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerProductTour,
): { kept: true } | { kept: false; reason: string } {
  if ((server as { deleted?: boolean }).deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerProductTour): { primary: string; secondary?: string } {
  const status = server.end_date ? "stopped" : server.start_date ? "live" : "draft";
  return { primary: server.name, secondary: `[${status}]` };
}

export function serverIdOf(server: ServerProductTour): string {
  return server.id;
}

export function renderToFile(
  server: ServerProductTour,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `product-tour-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.content = renderRawLiteral(server.content ?? {}, 2);
  if (server.auto_launch) fields.autoLaunch = "true";
  if (server.start_date) fields.startDate = stringLiteral(server.start_date);
  if (server.end_date) fields.endDate = stringLiteral(server.end_date);
  if (server.archived) fields.archived = "true";

  const contents = [
    `import { productTour } from "@posthog/definitions";`,
    "",
    `export default productTour(${renderObject(fields, 2)});`,
    "",
  ].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerProductTour,
  spec: ProductTour,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateProductTour(config, server.id, { description: newDescription }, options);
}
