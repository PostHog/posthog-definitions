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
