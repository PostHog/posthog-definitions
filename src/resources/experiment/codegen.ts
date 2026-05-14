import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerExperiment, updateExperiment } from "./client.js";
import type { Experiment } from "./sdk.js";

const MARKER_PREFIX = "iac:experiments:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:experiments:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerExperiment,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(server: ServerExperiment): { primary: string; secondary?: string } {
  const status = server.status ?? "draft";
  return { primary: server.name, secondary: `[${status}]` };
}

export function serverIdOf(server: ServerExperiment): number {
  return server.id;
}

/**
 * Experiment depends on feature-flag (by id from the loose `feature_flag` echo),
 * optionally a holdout (`holdout_id`), and zero-or-more saved metrics (each row
 * in `saved_metrics` has a `saved_metric` FK to the metric id).
 */
export async function pullDependencies(
  _config: ClientConfig,
  server: ServerExperiment,
): Promise<PullDependency[]> {
  const deps: PullDependency[] = [];
  if (server.feature_flag && typeof server.feature_flag.id === "number") {
    deps.push({ resourceName: "feature-flags", serverId: server.feature_flag.id });
  }
  if (server.holdout_id != null) {
    deps.push({ resourceName: "experiment-holdouts", serverId: server.holdout_id });
  }
  for (const row of server.saved_metrics ?? []) {
    const metricId = (row as { saved_metric?: number }).saved_metric;
    if (typeof metricId === "number") {
      deps.push({ resourceName: "experiment-saved-metrics", serverId: metricId });
    }
  }
  return deps;
}

export function renderToFile(
  server: ServerExperiment,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `experiment-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  // Resolve feature flag (required).
  const flagId = server.feature_flag?.id;
  const flagImport =
    flagId != null ? ctx.importForServerIdOptional("feature-flags", flagId) : undefined;
  if (!flagImport) {
    ctx.warn(
      `Experiment "${server.name}" references feature flag "${server.feature_flag_key}" (id=${flagId ?? "?"}), but it wasn't pulled. Re-run with cascade on.`,
    );
    return {
      skipped: true,
      reason: `feature flag for experiment "${server.name}" not available`,
    };
  }

  // Resolve holdout (optional).
  let holdoutImport: { varName: string; filename: string } | undefined;
  if (server.holdout_id != null) {
    const entry = ctx.importForServerIdOptional("experiment-holdouts", server.holdout_id);
    if (!entry) {
      ctx.warn(
        `Experiment "${server.name}" references holdout id=${server.holdout_id}, but it wasn't pulled.`,
      );
    } else {
      holdoutImport = { varName: entry.varName, filename: entry.filename };
    }
  }

  // Resolve saved metrics (split primary/secondary). When the server doesn't
  // surface metadata (older payloads), we conservatively treat everything as
  // primary — round-tripping that lands them all as primary, which is the
  // upstream default.
  const primaryMetricImports: Array<{ varName: string; filename: string }> = [];
  const secondaryMetricImports: Array<{ varName: string; filename: string }> = [];
  for (const row of server.saved_metrics ?? []) {
    const metricId = (row as { saved_metric?: number }).saved_metric;
    const metadata = (row as { metadata?: { type?: string } }).metadata;
    const kind = metadata?.type === "secondary" ? "secondary" : "primary";
    if (typeof metricId !== "number") continue;
    const entry = ctx.importForServerIdOptional("experiment-saved-metrics", metricId);
    if (!entry) {
      ctx.warn(
        `Experiment "${server.name}" references saved metric id=${metricId}, but it wasn't pulled.`,
      );
      continue;
    }
    (kind === "primary" ? primaryMetricImports : secondaryMetricImports).push({
      varName: entry.varName,
      filename: entry.filename,
    });
  }

  // Build the experiment() body.
  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  if (server.type) fields.type = stringLiteral(server.type);
  fields.featureFlag = flagImport.varName;
  if (server.status && server.status !== "draft") {
    fields.lifecycle = stringLiteral(server.status);
  }
  if (server.archived) fields.archived = "true";
  if (holdoutImport) fields.holdout = holdoutImport.varName;
  if (server.parameters !== undefined && server.parameters !== null) {
    fields.parameters = renderRawLiteral(server.parameters, 2);
  }
  if (Array.isArray(server.metrics) && server.metrics.length > 0) {
    fields.metrics = renderRawLiteral(server.metrics, 2);
  }
  if (Array.isArray(server.metrics_secondary) && server.metrics_secondary.length > 0) {
    fields.metrics_secondary = renderRawLiteral(server.metrics_secondary, 2);
  }
  if (server.exposure_criteria !== undefined && server.exposure_criteria !== null) {
    fields.exposure_criteria = renderRawLiteral(server.exposure_criteria, 2);
  }
  if (primaryMetricImports.length > 0) {
    fields.primarySavedMetrics = `[${primaryMetricImports.map((m) => m.varName).join(", ")}]`;
  }
  if (secondaryMetricImports.length > 0) {
    fields.secondarySavedMetrics = `[${secondaryMetricImports.map((m) => m.varName).join(", ")}]`;
  }
  if (server.conclusion) fields.conclusion = stringLiteral(server.conclusion);
  if (server.conclusion_comment) {
    fields.conclusionComment = stringLiteral(server.conclusion_comment);
  }

  const parts: string[] = [`import { experiment } from "@posthog/definitions";`];
  parts.push(
    `import ${flagImport.varName} from "../feature-flags/${flagImport.filename.replace(/\.ts$/, ".js")}";`,
  );
  if (holdoutImport) {
    parts.push(
      `import ${holdoutImport.varName} from "../experiment-holdouts/${holdoutImport.filename.replace(/\.ts$/, ".js")}";`,
    );
  }
  for (const m of [...primaryMetricImports, ...secondaryMetricImports]) {
    parts.push(
      `import ${m.varName} from "../experiment-saved-metrics/${m.filename.replace(/\.ts$/, ".js")}";`,
    );
  }
  parts.push("");
  parts.push(`export default experiment(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerExperiment,
  spec: Experiment,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateExperiment(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
