import { randomBytes } from "node:crypto";
import { type ClientConfig, ConfigError, loadConfig } from "../client/config.js";

export function loadAcceptanceConfig(): ClientConfig {
  try {
    return loadConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      throw new Error(
        `Acceptance tests require POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID ` +
          `(optionally POSTHOG_HOST) to be set, same as the apply/pull CLIs. ` +
          `Underlying error: ${err.message}`,
      );
    }
    throw err;
  }
}

export function uniqueKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${randomBytes(3).toString("hex")}`;
}

export async function purgeStale<T extends { id: number; tags?: string[] }>(
  config: ClientConfig,
  list: (config: ClientConfig) => Promise<T[]>,
  remove: (config: ClientConfig, id: number) => Promise<void>,
  keyFromTags: (tags: string[] | undefined) => string | undefined,
  keyPrefix: string,
): Promise<void> {
  const rows = await list(config);
  for (const row of rows) {
    const key = keyFromTags(row.tags);
    if (!key || !key.startsWith(keyPrefix)) continue;
    try {
      await remove(config, row.id);
    } catch (err) {
      console.error(`Failed to purge stale row ${row.id} (key=${key}):`, err);
    }
  }
}

type Cleanup = () => Promise<void> | void;

export async function withCleanup<T>(
  fn: (registerCleanup: (cleanup: Cleanup) => void) => Promise<T>,
): Promise<T> {
  const cleanups: Cleanup[] = [];
  const register = (cleanup: Cleanup): void => {
    cleanups.push(cleanup);
  };
  try {
    return await fn(register);
  } finally {
    for (const cleanup of cleanups.reverse()) {
      try {
        await cleanup();
      } catch (err) {
        console.error("Acceptance cleanup failed:", err);
      }
    }
  }
}
