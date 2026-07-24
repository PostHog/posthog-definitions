import type { ClientConfig } from "../../client/config.js";
import { renderObject, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerWarehouseSavedQuery, updateWarehouseSavedQuery } from "./client.js";
import { stripMarker, withMarker } from "./pipeline.js";
import type { WarehouseSavedQuery } from "./sdk.js";

export function pullFilter(
  server: ServerWarehouseSavedQuery,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerWarehouseSavedQuery): { primary: string; secondary?: string } {
  return { primary: server.name, secondary: "[saved query]" };
}

export function serverIdOf(server: ServerWarehouseSavedQuery): string {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  _server: ServerWarehouseSavedQuery,
): Promise<PullDependency[]> {
  return [];
}

export function renderToFile(
  server: ServerWarehouseSavedQuery,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `warehouse-saved-query-${server.id.slice(0, 8)}`;
  const slug = ctx.uniqueSlug(baseSlug);
  const userDescription = stripMarker(server.description);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
    query: stringLiteral(server.query?.query ?? ""),
  };
  if (userDescription) fields.description = stringLiteral(userDescription);
  if (server.folder_id) fields.folderId = stringLiteral(server.folder_id);

  const parts: string[] = [
    `import { warehouseSavedQuery } from "@posthog/definitions";`,
    "",
    `export default warehouseSavedQuery(${renderObject(fields, 2)});`,
    "",
  ];

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerWarehouseSavedQuery,
  spec: WarehouseSavedQuery,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description) ?? "";
  const newDescription = withMarker(userDescription, spec.key, hash);
  // Description-only PATCH — no `query`, so no optimistic-concurrency token needed.
  await updateWarehouseSavedQuery(config, server.id, { description: newDescription }, options);
}
