import { refreshAccessToken } from "../auth/oauth.js";
import { readStore, writeStore, type StoredAuth } from "../auth/store.js";

export type AuthHandler = {
  /** Returns the value for the `Authorization` header on each request. */
  getHeader(): Promise<string> | string;
  /** Called when the server returns 401. Returns true if the handler refreshed and the caller should retry once. */
  refreshOnUnauthorized?(): Promise<boolean>;
};

export type ClientConfig = {
  host: string;
  projectId: string;
  auth: AuthHandler;
};

export type ConfigOverrides = {
  host?: string;
  projectId?: string;
};

const DEFAULT_HOST = "https://us.posthog.com";
// Refresh OAuth tokens this many seconds before they expire to avoid races.
const REFRESH_LEEWAY_SECONDS = 60;

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export async function loadConfig(overrides: ConfigOverrides = {}): Promise<ClientConfig> {
  const envApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const envProjectId = process.env.POSTHOG_PROJECT_ID;
  const envHost = process.env.POSTHOG_HOST;

  const store = readStore();

  // Host: CLI override > env var > store > default.
  const host = normalizeHost(overrides.host ?? envHost ?? store?.host ?? DEFAULT_HOST);

  // Project: CLI override > env var > store.
  const projectId = overrides.projectId ?? envProjectId ?? store?.projectId;
  if (!projectId) {
    throw new ConfigError(
      "No project selected. Run `posthog-definitions login`, pass --project <id>, or set POSTHOG_PROJECT_ID.",
    );
  }

  // Auth: personal API key from env beats stored OAuth (so CI overrides work).
  if (envApiKey) {
    return { host, projectId, auth: personalKeyAuth(envApiKey) };
  }

  if (store) {
    return { host, projectId, auth: oauthAuth(store) };
  }

  throw new ConfigError(
    "No credentials found. Run `posthog-definitions login`, or set POSTHOG_PERSONAL_API_KEY.",
  );
}

function normalizeHost(host: string): string {
  return host.replace(/\/$/, "");
}

export function personalKeyAuth(apiKey: string): AuthHandler {
  return {
    getHeader: () => `Bearer ${apiKey}`,
  };
}

export function oauthAuth(initial: StoredAuth): AuthHandler {
  // Mutate in-place so retries after refresh see the new token without
  // re-reading the file from disk.
  let current = initial;

  const ensureFresh = async (): Promise<void> => {
    const now = Math.floor(Date.now() / 1000);
    if (current.expiresAt - REFRESH_LEEWAY_SECONDS > now) return;
    const next = await refreshAccessToken(current.refreshToken, current.host, current.clientId);
    current = {
      ...current,
      accessToken: next.accessToken,
      refreshToken: next.refreshToken,
      expiresAt: next.expiresAt,
    };
    writeStore(current);
  };

  return {
    async getHeader() {
      await ensureFresh();
      return `Bearer ${current.accessToken}`;
    },
    async refreshOnUnauthorized() {
      const next = await refreshAccessToken(current.refreshToken, current.host, current.clientId);
      current = {
        ...current,
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
        expiresAt: next.expiresAt,
      };
      writeStore(current);
      return true;
    },
  };
}
