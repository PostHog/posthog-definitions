import { mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearStore, readStore, storePath, writeStore, type StoredAuth } from "./store.js";

const SAMPLE: StoredAuth = {
  host: "https://us.posthog.com",
  projectId: "42",
  accessToken: "access-xyz",
  refreshToken: "refresh-xyz",
  expiresAt: 1_700_000_000,
  clientId: "client-abc",
};

let dir: string;
let original: string | undefined;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "posthog-defs-store-"));
  original = process.env.POSTHOG_DEFINITIONS_CONFIG_DIR;
  process.env.POSTHOG_DEFINITIONS_CONFIG_DIR = dir;
});

afterEach(() => {
  if (original === undefined) delete process.env.POSTHOG_DEFINITIONS_CONFIG_DIR;
  else process.env.POSTHOG_DEFINITIONS_CONFIG_DIR = original;
  rmSync(dir, { recursive: true, force: true });
});

describe("store", () => {
  it("returns undefined when no config file exists", () => {
    expect(readStore()).toBeUndefined();
  });

  it("round-trips StoredAuth via write+read", () => {
    writeStore(SAMPLE);
    expect(readStore()).toEqual(SAMPLE);
  });

  it("writes the config file with mode 0600", () => {
    writeStore(SAMPLE);
    const mode = statSync(storePath()).mode & 0o777;
    expect(mode).toBe(0o600);
  });

  it("places the file under the override directory", () => {
    expect(storePath()).toBe(path.join(dir, "config.json"));
  });

  it("clearStore deletes an existing file and returns true", () => {
    writeStore(SAMPLE);
    expect(clearStore()).toBe(true);
    expect(readStore()).toBeUndefined();
  });

  it("clearStore returns false when no file exists", () => {
    expect(clearStore()).toBe(false);
  });

  it("rejects a malformed config", () => {
    writeFileSync(storePath(), "not json at all", { mode: 0o600 });
    expect(() => readStore()).toThrow(/Failed to parse/);
  });

  it("rejects a config missing required fields", () => {
    writeFileSync(storePath(), JSON.stringify({ host: "x" }), { mode: 0o600 });
    expect(() => readStore()).toThrow(/not a valid/);
  });
});
