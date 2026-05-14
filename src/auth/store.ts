import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export type StoredAuth = {
  host: string;
  projectId: string;
  accessToken: string;
  refreshToken: string;
  // Unix seconds when the access token expires.
  expiresAt: number;
  clientId: string;
};

export class StoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreError";
  }
}

export function storePath(): string {
  const override = process.env.POSTHOG_DEFINITIONS_CONFIG_DIR;
  if (override) return path.join(override, "config.json");
  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg && xdg.length > 0 ? xdg : path.join(homedir(), ".config");
  return path.join(base, "posthog-definitions", "config.json");
}

export function readStore(): StoredAuth | undefined {
  const file = storePath();
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw new StoreError(`Failed to read ${file}: ${(err as Error).message}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new StoreError(`Failed to parse ${file}: ${(err as Error).message}`);
  }
  if (!isStoredAuth(parsed)) {
    throw new StoreError(`${file} is not a valid posthog-definitions config.`);
  }
  return parsed;
}

export function writeStore(auth: StoredAuth): void {
  const file = storePath();
  const dir = path.dirname(file);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeFileSync(file, JSON.stringify(auth, null, 2), { mode: 0o600 });
  // writeFileSync only sets the mode on file creation; force it for overwrites.
  chmodSync(file, 0o600);
}

export function clearStore(): boolean {
  const file = storePath();
  try {
    rmSync(file);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw new StoreError(`Failed to delete ${file}: ${(err as Error).message}`);
  }
}

function isStoredAuth(value: unknown): value is StoredAuth {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.host === "string" &&
    typeof v.projectId === "string" &&
    typeof v.accessToken === "string" &&
    typeof v.refreshToken === "string" &&
    typeof v.expiresAt === "number" &&
    typeof v.clientId === "string"
  );
}
