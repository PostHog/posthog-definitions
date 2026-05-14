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
    await remove(config, row.id);
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
    await remove(config, idOf(row));
  }
}

type Cleanup = () => Promise<void> | void;

/**
 * Run a test body with deferred cleanups. Every registered cleanup is
 * attempted regardless of whether earlier ones failed; if any throws, the
 * collected errors are surfaced as an `AggregateError` once the body returns.
 *
 * The previous implementation swallowed cleanup failures via console.error,
 * which let leaky tests silently leave server-side residue (e.g. soft-deleted
 * feature flags reserving their keys). Failing loudly forces the responsible
 * test author to fix the leak.
 *
 * If the test body itself throws, that error takes precedence — but cleanup
 * still runs, and any cleanup errors are reported alongside the body error.
 */
export async function withCleanup<T>(
  fn: (registerCleanup: (cleanup: Cleanup) => void) => Promise<T>,
): Promise<T> {
  const cleanups: Cleanup[] = [];
  const register = (cleanup: Cleanup): void => {
    cleanups.push(cleanup);
  };

  let bodyError: unknown;
  let result: T | undefined;
  try {
    result = await fn(register);
  } catch (err) {
    bodyError = err;
  }

  const cleanupErrors: unknown[] = [];
  for (const cleanup of cleanups.reverse()) {
    try {
      await cleanup();
    } catch (err) {
      cleanupErrors.push(err);
    }
  }

  if (bodyError !== undefined) {
    if (cleanupErrors.length > 0) {
      throw new AggregateError(
        [bodyError, ...cleanupErrors],
        "Test body threw; cleanup also failed",
      );
    }
    throw bodyError;
  }
  if (cleanupErrors.length > 0) {
    throw new AggregateError(cleanupErrors, "Test cleanup failed");
  }
  return result as T;
}
