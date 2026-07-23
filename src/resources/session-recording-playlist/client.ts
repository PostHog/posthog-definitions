import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:session-recording-playlists:";

export const ServerSessionRecordingPlaylistSchema = z
  .object({
    id: z.number(),
    short_id: z.string(),
    name: z.string().nullable().optional(),
    derived_name: z.string().nullable().optional(),
    description: z.string().nullable().default(""),
    type: z.enum(["collection", "filters"]).nullable().optional(),
    filters: z.record(z.string(), z.unknown()).nullable().optional(),
    deleted: z.boolean().nullable().optional(),
    is_synthetic: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerSessionRecordingPlaylist = z.infer<typeof ServerSessionRecordingPlaylistSchema>;

export type SessionRecordingPlaylistCreate = {
  name: string;
  description: string;
  type: "filters";
  filters: Record<string, unknown>;
};

export type SessionRecordingPlaylistUpdate = {
  name?: string;
  description?: string;
  // Always sent on update — the API rejects a filters-type playlist update
  // that omits filters ("cannot remove all filters when updating a saved
  // filter").
  filters: Record<string, unknown>;
  deleted?: boolean;
};

type PlaylistBody = components["schemas"]["SessionRecordingPlaylist"];
type PatchedPlaylistBody = components["schemas"]["PatchedSessionRecordingPlaylist"];
type GeneratedPaginatedList = components["schemas"]["PaginatedSessionRecordingPlaylistList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

/** Unfiltered list of every playlist in the project; used by pull. */
export async function listSessionRecordingPlaylists(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSessionRecordingPlaylist[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/session_recording_playlists/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerSessionRecordingPlaylistSchema.parse(row));
}

export async function listManagedSessionRecordingPlaylists(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerSessionRecordingPlaylist[]> {
  const all = await listSessionRecordingPlaylists(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getSessionRecordingPlaylist(
  config: ClientConfig,
  shortId: string,
  options: { verbose?: boolean } = {},
): Promise<ServerSessionRecordingPlaylist> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET(
    "/api/projects/{project_id}/session_recording_playlists/{short_id}/",
    { params: { path: { project_id: config.projectId, short_id: shortId } } },
  );
  return ServerSessionRecordingPlaylistSchema.parse(data);
}

export async function createSessionRecordingPlaylist(
  config: ClientConfig,
  payload: SessionRecordingPlaylistCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerSessionRecordingPlaylist> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/session_recording_playlists/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as PlaylistBody,
  });
  return ServerSessionRecordingPlaylistSchema.parse(data);
}

export async function updateSessionRecordingPlaylist(
  config: ClientConfig,
  shortId: string,
  payload: SessionRecordingPlaylistUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerSessionRecordingPlaylist> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH(
    "/api/projects/{project_id}/session_recording_playlists/{short_id}/",
    {
      params: { path: { project_id: config.projectId, short_id: shortId } },
      body: payload as unknown as PatchedPlaylistBody,
    },
  );
  return ServerSessionRecordingPlaylistSchema.parse(data);
}

/**
 * Delete a playlist. The `DELETE` verb returns 405 upstream; playlists
 * soft-delete via `PATCH { deleted: true }`. The existing `filters` must ride
 * along or the update is rejected as "removing all filters".
 */
export async function deleteSessionRecordingPlaylist(
  config: ClientConfig,
  shortId: string,
  filters: Record<string, unknown>,
  options: { verbose?: boolean } = {},
): Promise<void> {
  await updateSessionRecordingPlaylist(config, shortId, { deleted: true, filters }, options);
}
