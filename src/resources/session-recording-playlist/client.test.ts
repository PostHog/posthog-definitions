import { describe, expect, it } from "vitest";
import { ServerSessionRecordingPlaylistSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/projects/{id}/session_recording_playlists/{short_id}/ response (806).
const realPlaylist = {
  id: 12689,
  short_id: "UvdSUJbr",
  name: "Rage-click sessions",
  derived_name: null,
  description:
    "Frustrated users\n\n<!-- iac:session-recording-playlists:rage iac:hash:abcd1234 -->",
  type: "filters",
  filters: {
    date_from: "-7d",
    duration: [{ type: "recording", key: "duration", value: 60, operator: "gt" }],
    filter_test_accounts: true,
  },
  deleted: false,
  is_synthetic: false,
  recordings_counts: { collection: { count: null } },
  created_at: "2026-07-23T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
};

describe("ServerSessionRecordingPlaylistSchema", () => {
  it("parses a real playlist payload", () => {
    const parsed = ServerSessionRecordingPlaylistSchema.parse(realPlaylist);
    expect(parsed.short_id).toBe("UvdSUJbr");
    expect(parsed.type).toBe("filters");
    expect(parsed.filters).toHaveProperty("date_from", "-7d");
  });

  it("throws when short_id is missing", () => {
    const { short_id: _omit, ...withoutShortId } = realPlaylist;
    void _omit;
    expect(() => ServerSessionRecordingPlaylistSchema.parse(withoutShortId)).toThrow();
  });

  it("throws on an unknown playlist type", () => {
    expect(() =>
      ServerSessionRecordingPlaylistSchema.parse({ ...realPlaylist, type: "album" }),
    ).toThrow();
  });
});
