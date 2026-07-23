import { markResourceKind } from "../types.js";

/**
 * A session recording playlist — the "saved filter" view in the recordings
 * product. posthog-definitions manages **filter-based (dynamic)** playlists
 * only: the `filters` object defines which recordings match, and membership is
 * computed at query time.
 *
 * Manually-curated **collection** playlists (pinned recordings) are runtime
 * data, not declarative state — same treatment as static-cohort membership.
 * There is no field to declare pinned recordings here, and validation rejects
 * an empty `filters`.
 */
export type SessionRecordingPlaylistFilters = Record<string, unknown>;

export type SessionRecordingPlaylist = {
  key: string;
  /** Human-readable name shown in the recordings sidebar. */
  name: string;
  /** Optional description — also the identity-marker carrier. */
  description?: string;
  /**
   * Recording filter criteria (date range, duration, events, person
   * properties, …). Required and non-empty: a filter-based playlist without
   * filters is a collection, which this resource does not manage.
   */
  filters: SessionRecordingPlaylistFilters;
};

export function sessionRecordingPlaylist(
  spec: SessionRecordingPlaylist,
): SessionRecordingPlaylist {
  return markResourceKind(spec, "session-recording-playlist");
}
