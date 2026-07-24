/**
 * Secret-input convention (campaign standard, established in #89 for hog
 * functions and reused by every masked-credential resource).
 *
 * A secret value is never written to a definition file. Instead the file stores
 * a reference to an environment variable; the value is read from `process.env`
 * at apply time (create or rotation), sent to PostHog once, and thereafter
 * masked on read — so it can never round-trip back into a diff.
 *
 * - **Value from env, never the file.** `secret("MY_ENV_VAR")` — resolved from
 *   `process.env` when the resource is created or updated.
 * - **Excluded from the hash.** Only the env-var *name* (and an optional
 *   `rotate` token) participate in the hash; the value never does. A masked
 *   read-back therefore cannot look like a change.
 * - **Rotate on demand.** Change `rotate` to any new token (a date, a version)
 *   to force the value to be re-read from the environment and re-sent.
 * - **Fail loud on a missing env var** at apply time (not at plan time).
 *
 * NOTE: hog functions (`src/resources/hog-function/`) currently ship their own
 * `secret()` under a `__hogSecret` marker on a separate branch. When that lands
 * these should converge on this shared helper — they are the same convention.
 */
export type SecretRef = {
  readonly __iacSecret: true;
  readonly env: string;
  readonly rotate?: string;
};

/**
 * Declare a secret backed by an environment variable. Optionally pass a
 * `rotate` token; changing it forces the value to be re-read and re-sent on the
 * next apply.
 */
export function secret(env: string, opts?: { rotate?: string }): SecretRef {
  return { __iacSecret: true, env, ...(opts?.rotate ? { rotate: opts.rotate } : {}) };
}

export function isSecretRef(value: unknown): value is SecretRef {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { __iacSecret?: unknown }).__iacSecret === true
  );
}

/** Thrown at apply time when a secret's env var is not set. */
export class MissingSecretError extends Error {
  constructor(env: string) {
    super(`Environment variable "${env}" (referenced via secret()) is not set. Set it before applying.`);
    this.name = "MissingSecretError";
  }
}

/** Resolve a secret's value from the environment, failing loud if absent. */
export function resolveSecret(ref: SecretRef): string {
  const value = process.env[ref.env];
  if (value === undefined || value === "") throw new MissingSecretError(ref.env);
  return value;
}

/**
 * Recursively replace every `SecretRef` in `value` with its hash projection
 * (`{ __secretEnv, rotate }`) — the env-var name and rotate token, never the
 * value. Non-secret data passes through unchanged.
 */
export function projectSecretsForHash(value: unknown): unknown {
  if (isSecretRef(value)) return { __secretEnv: value.env, rotate: value.rotate ?? null };
  if (Array.isArray(value)) return value.map(projectSecretsForHash);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = projectSecretsForHash(v);
    }
    return out;
  }
  return value;
}

/**
 * Recursively replace every `SecretRef` in `value` with its resolved env value
 * (for the outgoing payload). Throws `MissingSecretError` on the first unset var.
 */
export function resolveSecrets(value: unknown): unknown {
  if (isSecretRef(value)) return resolveSecret(value);
  if (Array.isArray(value)) return value.map(resolveSecrets);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = resolveSecrets(v);
    }
    return out;
  }
  return value;
}
