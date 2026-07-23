import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { SessionRecordingPlaylist } from "./sdk.js";
import type { ServerSessionRecordingPlaylist } from "./client.js";
import { playlistHash, validateSessionRecordingPlaylists } from "./pipeline.js";

function spec(
  key: string,
  overrides: Partial<SessionRecordingPlaylist> = {},
): SessionRecordingPlaylist {
  return {
    key,
    name: `Playlist ${key}`,
    filters: { date_from: "-7d", filter_test_accounts: true },
    ...overrides,
  };
}

function serverRow(
  shortId: string,
  key: string,
  hash: string,
  extraDescription = "",
): ServerSessionRecordingPlaylist {
  const marker = `<!-- iac:session-recording-playlists:${key} iac:hash:${hash} -->`;
  return {
    id: Math.floor(Math.random() * 100000),
    short_id: shortId,
    name: `Playlist ${key}`,
    description: extraDescription ? `${extraDescription}\n\n${marker}` : marker,
    type: "filters",
    filters: { date_from: "-7d", filter_test_accounts: true },
  };
}

function desiredFor(specs: SessionRecordingPlaylist[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "session-recording-playlists",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerSessionRecordingPlaylist[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["session-recording-playlists", rows]]);
}

describe("session-recording-playlist pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("rage")]), currentFor([]));
    const slice = result.get("session-recording-playlists")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("rage");
    const server = serverRow("AbCdEfGh", "rage", playlistHash(desired));
    const op = diff(desiredFor([desired]), currentFor([server])).get(
      "session-recording-playlists",
    )!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged")
      expect((op.server as { short_id: string }).short_id).toBe("AbCdEfGh");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("rage");
    const server = serverRow("AbCdEfGh", "rage", "stalehash00000000");
    const op = diff(desiredFor([desired]), currentFor([server])).get(
      "session-recording-playlists",
    )!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("classifies a server-only managed playlist as an orphan", () => {
    const server = serverRow("Ghost123", "ghost", "any");
    const slice = diff(desiredFor([]), currentFor([server])).get("session-recording-playlists")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerSessionRecordingPlaylist).short_id).toBe("Ghost123");
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerSessionRecordingPlaylist = {
      id: 999,
      short_id: "Handmade1",
      name: "Hand-built",
      description: "Just a saved filter someone made in the UI",
      type: "filters",
      filters: { date_from: "-30d" },
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get(
      "session-recording-playlists",
    )!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("hash is stable when a user description precedes the marker", () => {
    const desired = spec("rage", { description: "Frustrated users" });
    const server = serverRow("AbCdEfGh", "rage", playlistHash(desired), "Frustrated users");
    const op = diff(desiredFor([desired]), currentFor([server])).get(
      "session-recording-playlists",
    )!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });
});

describe("session-recording-playlist validation", () => {
  it("rejects keys that don't match the allowed pattern", () => {
    const issues = validateSessionRecordingPlaylists([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateSessionRecordingPlaylists([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("requires a non-empty name", () => {
    const issues = validateSessionRecordingPlaylists([spec("ok", { name: "" })]);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("rejects empty filters (collection/pinned playlists are runtime data)", () => {
    const issues = validateSessionRecordingPlaylists([spec("empty", { filters: {} })]);
    expect(issues.some((m) => m.includes("non-empty `filters`"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    const issues = validateSessionRecordingPlaylists([spec("ok")]);
    expect(issues).toEqual([]);
  });
});
