import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerSessionRecordingPlaylist, updateSessionRecordingPlaylist } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { SessionRecordingPlaylist } from "./sdk.js";

const MARKER_PREFIX = "iac:session-recording-playlists:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerSessionRecordingPlaylist,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  if (server.is_synthetic) return { kept: false, reason: "synthetic" };
  // Only filter-based (dynamic) playlists are declarative; collection
  // (manually-pinned) playlists are runtime membership data.
  if (server.type && server.type !== "filters") {
    return { kept: false, reason: `${server.type} (pinned-recording membership)` };
  }
  return { kept: true };
}

export function pullLabel(
  server: ServerSessionRecordingPlaylist,
): { primary: string; secondary?: string } {
  return { primary: server.name ?? server.short_id, secondary: "[filters]" };
}

export function serverIdOf(server: ServerSessionRecordingPlaylist): string {
  return server.short_id;
}

export function renderToFile(
  server: ServerSessionRecordingPlaylist,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name ?? "") || `playlist-${server.short_id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name ?? ""),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.filters = renderRawLiteral(server.filters ?? {}, 2);

  const contents = [
    `import { sessionRecordingPlaylist } from "@posthog/definitions";`,
    "",
    `export default sessionRecordingPlaylist(${renderObject(fields, 2)});`,
    "",
  ].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerSessionRecordingPlaylist,
  spec: SessionRecordingPlaylist,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  // Filters must ride along — the API rejects a filters-type update that omits
  // them.
  await updateSessionRecordingPlaylist(
    config,
    server.short_id,
    { description: newDescription, filters: server.filters ?? {} },
    options,
  );
}
