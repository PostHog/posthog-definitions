import { randomBytes } from "node:crypto";
import { type ClientConfig, ConfigError, loadConfig } from "../client/config.js";

export function loadAcceptanceConfig(): ClientConfig {
  try {
    return loadConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      throw new Error(
        `Acceptance tests require POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID ` +
          `(optionally POSTHOG_HOST) to be set, same as the apply/pull CLIs.`,
        { cause: err },
      );
    }
    throw err;
  }
}

export function uniqueKey(prefix: string): string {
  // 8 bytes / 16 hex chars of randomness — enough that two test runs in the
  // same millisecond essentially never collide. The earlier 3-byte version
  // was tight (~5/16M per-test) and bit us on the event-definition integration
  // suite when a previous run's residue had the same suffix.
  return `${prefix}-${Date.now()}-${randomBytes(8).toString("hex")}`;
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

/**
 * Variant of `purgeStale` that takes a key-from-row function instead of
 * key-from-tags, and parameterises the id type. Use for resources whose
 * identity sits in a description marker (no `tags` field) or whose server
 * id isn't a `number`.
 */
export async function purgeStaleByRow<T, TId extends number | string>(
  config: ClientConfig,
  list: (config: ClientConfig) => Promise<T[]>,
  remove: (config: ClientConfig, id: TId) => Promise<void>,
  idOf: (row: T) => TId,
  keyFromRow: (row: T) => string | undefined,
  keyPrefix: string,
): Promise<void> {
  const rows = await list(config);
  for (const row of rows) {
    const key = keyFromRow(row);
    if (!key || !key.startsWith(keyPrefix)) continue;
    const id = idOf(row);
    try {
      await remove(config, id);
    } catch (err) {
      console.error(`Failed to purge stale row ${String(id)} (key=${key}):`, err);
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
