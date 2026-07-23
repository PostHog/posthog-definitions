import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { SessionRecordingPlaylist } from "./sdk.js";
import {
  createSessionRecordingPlaylist,
  deleteSessionRecordingPlaylist,
  getSessionRecordingPlaylist,
  type ServerSessionRecordingPlaylist,
  type SessionRecordingPlaylistCreate,
  type SessionRecordingPlaylistUpdate,
  updateSessionRecordingPlaylist,
} from "./client.js";

/**
 * Session recording playlists have no `tags` field. Identity sits in a
 * trailing HTML-comment marker on `description` (endpoints / surveys pattern).
 */
export const SESSION_RECORDING_PLAYLIST_IDENTITY_PREFIX = "iac:session-recording-playlists:";

const MARKER_REGEX =
  /\n*<!--\s*iac:session-recording-playlists:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userDescription: string; key: string; hash: string };

function parseMarker(description: string | null | undefined): ParsedMarker | undefined {
  if (!description) return undefined;
  const match = description.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userDescription: description.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userDescription: string | undefined, key: string, hash: string): string {
  const trailer = `<!-- iac:session-recording-playlists:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function playlistKeyFromServer(server: ServerSessionRecordingPlaylist): string | undefined {
  return parseMarker(server.description)?.key;
}

export function playlistHashFromServer(server: ServerSessionRecordingPlaylist): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: SessionRecordingPlaylist): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    filters: spec.filters ?? {},
  };
}

export function playlistHash(spec: SessionRecordingPlaylist): string {
  return specHash(specForHash(spec));
}

function buildCreatePayload(
  spec: SessionRecordingPlaylist,
  hash: string,
): SessionRecordingPlaylistCreate {
  return {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    type: "filters",
    filters: spec.filters ?? {},
  };
}

function buildUpdatePayload(
  spec: SessionRecordingPlaylist,
  hash: string,
): SessionRecordingPlaylistUpdate {
  return {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    filters: spec.filters ?? {},
  };
}

export function looksLikeSessionRecordingPlaylist(
  value: unknown,
): value is SessionRecordingPlaylist {
  return getResourceKind(value) === "session-recording-playlist";
}

function isEmptyFilters(filters: unknown): boolean {
  return !filters || typeof filters !== "object" || Object.keys(filters as object).length === 0;
}

export function validateSessionRecordingPlaylists(specs: SessionRecordingPlaylist[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("session-recording-playlist.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`session recording playlist "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate session recording playlist key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`session recording playlist "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate session recording playlist name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (isEmptyFilters(spec.filters)) {
      issues.push(
        `session recording playlist "${spec.key}" must declare non-empty \`filters\` — only filter-based (dynamic) playlists are managed; manually-pinned collection playlists are runtime data`,
      );
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  shortId: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getSessionRecordingPlaylist(config, shortId, options);
  if (playlistKeyFromServer(current) !== key) {
    throw new SafetyViolationError("session-recording-playlist", shortId, key);
  }
}

export async function runSessionRecordingPlaylistOp(
  config: ClientConfig,
  op: ResourceOp<SessionRecordingPlaylist, ServerSessionRecordingPlaylist>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = playlistHash(op.spec);

  if (op.kind === "create") {
    await createSessionRecordingPlaylist(config, buildCreatePayload(op.spec, hash), options);
    return;
  }

  await assertManaged(config, op.server.short_id, op.spec.key, options);
  await updateSessionRecordingPlaylist(
    config,
    op.server.short_id,
    buildUpdatePayload(op.spec, hash),
    options,
  );
}

export async function pruneSessionRecordingPlaylist(
  config: ClientConfig,
  orphan: ServerSessionRecordingPlaylist,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = playlistKeyFromServer(orphan) ?? `short_id:${orphan.short_id}`;
  try {
    await assertManaged(config, orphan.short_id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteSessionRecordingPlaylist(config, orphan.short_id, orphan.filters ?? {}, options);
  return true;
}

export function displaySessionRecordingPlaylist(spec: SessionRecordingPlaylist): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["filters", displayJson(spec.filters ?? {})],
  ]);
}

export function displaySessionRecordingPlaylistFromServer(
  server: ServerSessionRecordingPlaylist,
): DisplayValue {
  return obj([
    ["key", scalar(playlistKeyFromServer(server) ?? null)],
    ["name", scalar(server.name ?? "")],
    ["description", scalar(stripMarker(server.description))],
    ["filters", displayJson(server.filters ?? {})],
  ]);
}
