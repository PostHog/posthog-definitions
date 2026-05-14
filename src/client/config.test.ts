import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writeStore, type StoredAuth } from "../auth/store.js";
import { ConfigError, loadConfig } from "./config.js";

const SAMPLE: StoredAuth = {
  host: "https://eu.posthog.com",
  projectId: "99",
  accessToken: "stored-token",
  refreshToken: "stored-refresh",
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
  clientId: "stored-client",
};

let dir: string;
const ENV_KEYS = [
  "POSTHOG_DEFINITIONS_CONFIG_DIR",
  "POSTHOG_PERSONAL_API_KEY",
  "POSTHOG_PROJECT_ID",
  "POSTHOG_HOST",
] as const;
const originals: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "posthog-defs-config-"));
  for (const k of ENV_KEYS) {
    originals[k] = process.env[k];
    delete process.env[k];
  }
  process.env.POSTHOG_DEFINITIONS_CONFIG_DIR = dir;
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (originals[k] === undefined) delete process.env[k];
    else process.env[k] = originals[k];
  }
  rmSync(dir, { recursive: true, force: true });
});

describe("loadConfig", () => {
  it("uses env-var personal key when set, ignoring any stored OAuth token", async () => {
    writeStore(SAMPLE);
    process.env.POSTHOG_PERSONAL_API_KEY = "env-key";
    process.env.POSTHOG_PROJECT_ID = "7";
    const c = await loadConfig();
    expect(c.projectId).toBe("7");
    expect(await c.auth.getHeader()).toBe("Bearer env-key");
    expect(c.auth.refreshOnUnauthorized).toBeUndefined();
  });

  it("falls back to the stored OAuth token when no env key is set", async () => {
    writeStore(SAMPLE);
    const c = await loadConfig();
    expect(c.host).toBe(SAMPLE.host);
    expect(c.projectId).toBe(SAMPLE.projectId);
    expect(await c.auth.getHeader()).toBe(`Bearer ${SAMPLE.accessToken}`);
    expect(typeof c.auth.refreshOnUnauthorized).toBe("function");
  });

  it("prefers CLI overrides over env vars and store", async () => {
    writeStore(SAMPLE);
    process.env.POSTHOG_PROJECT_ID = "env-project";
    process.env.POSTHOG_HOST = "https://env.posthog.com";
    const c = await loadConfig({ projectId: "cli-project", host: "https://cli.posthog.com" });
    expect(c.projectId).toBe("cli-project");
    expect(c.host).toBe("https://cli.posthog.com");
  });

  it("env vars beat the store but lose to CLI overrides", async () => {
    writeStore(SAMPLE);
    process.env.POSTHOG_PROJECT_ID = "env-project";
    const c = await loadConfig();
    expect(c.projectId).toBe("env-project");
  });

  it("throws ConfigError when no credentials anywhere", async () => {
    await expect(loadConfig({ projectId: "1" })).rejects.toThrow(ConfigError);
    await expect(loadConfig({ projectId: "1" })).rejects.toThrow(/No credentials/);
  });

  it("throws ConfigError when no project anywhere", async () => {
    process.env.POSTHOG_PERSONAL_API_KEY = "env-key";
    await expect(loadConfig()).rejects.toThrow(ConfigError);
    await expect(loadConfig()).rejects.toThrow(/No project/);
  });

  it("strips a trailing slash from the host", async () => {
    process.env.POSTHOG_PERSONAL_API_KEY = "env-key";
    process.env.POSTHOG_PROJECT_ID = "7";
    const c = await loadConfig({ host: "https://cli.posthog.com/" });
    expect(c.host).toBe("https://cli.posthog.com");
  });
});
