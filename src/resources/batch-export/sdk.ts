import { markResourceKind } from "../types.js";
import type { SecretRef } from "../secret.js";

/**
 * Destination types that accept **inline credentials** (via `secret()` refs in
 * `config`). Integration-backed types (Databricks, AzureBlob, BigQuery,
 * Postgres, Redshift) require a project-scoped, environment-specific
 * `integration_id` that doesn't port across projects, so they're rejected with
 * a validation error for now.
 */
export type BatchExportDestinationType = "AwsS3" | "S3Compatible" | "Snowflake";

export type BatchExportInterval =
  | "hour"
  | "day"
  | "week"
  | "every 5 minutes"
  | "every 15 minutes";

export type BatchExportModel = "events" | "persons" | "sessions";

export type BatchExportDestination = {
  type: BatchExportDestinationType;
  /**
   * Destination-specific configuration, passed through verbatim. Put secret
   * fields (e.g. `aws_secret_access_key`) behind `secret("ENV_VAR")` — they're
   * read from the environment at apply time and masked by PostHog on read.
   */
  config: Record<string, unknown | SecretRef>;
};

export type BatchExport = {
  key: string;
  /**
   * Human-readable name shown in the batch-exports list. Also carries the
   * identity marker (a trailing HTML comment).
   */
  name: string;
  /** How often the export runs. */
  interval: BatchExportInterval;
  /** Where the data goes. */
  destination: BatchExportDestination;
  /** Which model to export. Defaults to `events`. */
  model?: BatchExportModel;
  /**
   * Whether the export is paused. Declarative — apply drives it to match.
   * Author new exports paused until you've confirmed the destination.
   */
  paused?: boolean;
  /** Optional HogQL SELECT defining a custom model schema (advanced). */
  hogqlQuery?: string;
  /** Optional property filters restricting which events are exported. */
  filters?: unknown;
  /** IANA timezone controlling daily/weekly interval boundaries. */
  timezone?: string;
};

export function batchExport(spec: BatchExport): BatchExport {
  return markResourceKind(spec, "batch-export");
}
