import { markResourceKind } from "../types.js";

/**
 * The kinds of hog function. `destination` and `transformation` are the common
 * IaC targets; the rest are supported as pass-through `type` values.
 */
export type HogFunctionType =
  | "destination"
  | "transformation"
  | "site_destination"
  | "internal_destination"
  | "site_app"
  | "source_webhook"
  | "warehouse_source_webhook";

/**
 * A secret input value, sourced from an environment variable at apply time.
 *
 * Secret handling — the campaign's secrets convention, established here:
 *  - The definition file stores only the env var NAME, never the value. The
 *    value is read from `process.env` when the function is created (or rotated)
 *    and is never written to disk or into the hash.
 *  - PostHog masks secret inputs on read (`{ secret: true }`), so on update the
 *    secret is left untouched by default — omitting it preserves the stored
 *    value. That keeps a masked read-back from ever showing up as a diff.
 *  - To rotate, set `rotate` to a new token (any string — a date, a version).
 *    The token is part of the hash, so bumping it triggers an update that
 *    re-reads `process.env[env]` and sends the fresh value.
 */
export type SecretInput = {
  readonly __hogSecret: true;
  readonly env: string;
  readonly rotate?: string;
};

/**
 * Declare a secret input backed by an environment variable. Optionally pass a
 * `rotate` token; change it to force the secret to be re-sent from the
 * environment on the next apply.
 */
export function secret(env: string, opts?: { rotate?: string }): SecretInput {
  return { __hogSecret: true, env, ...(opts?.rotate ? { rotate: opts.rotate } : {}) };
}

export function isSecretInput(value: unknown): value is SecretInput {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { __hogSecret?: unknown }).__hogSecret === true
  );
}

/** A plain (non-secret) input literal, or a secret reference. */
export type HogFunctionInputValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[]
  | SecretInput;

export type HogFunction = {
  key: string;
  type: HogFunctionType;
  name: string;
  description?: string;
  /**
   * The template to build this function from (e.g. "template-activecampaign",
   * "template-geoip"). The template's code and input schema are inlined into a
   * standalone function at create time; changing `templateId` afterwards is not
   * supported (delete and recreate — apply errors rather than silently keeping
   * the old code).
   */
  templateId: string;
  enabled?: boolean;
  /**
   * Values for the template's inputs, keyed by input name. Plain literals for
   * ordinary fields; `secret("ENV_VAR")` for secret fields.
   */
  inputs?: Record<string, HogFunctionInputValue>;
  /** Event filters controlling which events trigger the function. */
  filters?: Record<string, unknown>;
};

export function hogFunction(spec: HogFunction): HogFunction {
  return markResourceKind(spec, "hog-function");
}
