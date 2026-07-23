import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { SessionRecordingPlaylist } from "./sdk.js";
import {
  displaySessionRecordingPlaylist,
  displaySessionRecordingPlaylistFromServer,
  looksLikeSessionRecordingPlaylist,
  playlistHash,
  playlistHashFromServer,
  playlistKeyFromServer,
  pruneSessionRecordingPlaylist,
  runSessionRecordingPlaylistOp,
  SESSION_RECORDING_PLAYLIST_IDENTITY_PREFIX,
  validateSessionRecordingPlaylists,
} from "./pipeline.js";
import {
  getSessionRecordingPlaylist,
  listManagedSessionRecordingPlaylists,
  listSessionRecordingPlaylists,
  type ServerSessionRecordingPlaylist,
} from "./client.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf, tagOnServer } from "./codegen.js";

export { sessionRecordingPlaylist } from "./sdk.js";
export type {
  SessionRecordingPlaylist,
  SessionRecordingPlaylistFilters,
} from "./sdk.js";

export const sessionRecordingPlaylistResource: CollectionResourceModule<
  SessionRecordingPlaylist,
  ServerSessionRecordingPlaylist
> = {
  kind: "collection",
  name: "session-recording-playlists",
  displayName: "session recording playlist",
  identityPrefix: SESSION_RECORDING_PLAYLIST_IDENTITY_PREFIX,

  isSpec: looksLikeSessionRecordingPlaylist,
  specKey: (spec) => spec.key,

  list: listManagedSessionRecordingPlaylists,
  keyFromServer: (server) => playlistKeyFromServer(server),
  hashFromServer: (server) => playlistHashFromServer(server),

  hash: playlistHash,
  validate: (specs) => validateSessionRecordingPlaylists(specs),
  executeOp: runSessionRecordingPlaylistOp,
  prune: pruneSessionRecordingPlaylist,

  displaySpec: (spec, _ctx: ApplyContext) => displaySessionRecordingPlaylist(spec),
  displayServer: (server, _ctx: ApplyContext) => displaySessionRecordingPlaylistFromServer(server),

  listAll: listSessionRecordingPlaylists,
  getById: (config, id, options) => getSessionRecordingPlaylist(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
