import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import {
  type ServerExperimentSavedMetric,
  updateExperimentSavedMetric,
} from "./client.js";
import type { ExperimentSavedMetric } from "./sdk.js";

const MARKER_PREFIX = "iac:experiment-saved-metrics:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:experiment-saved-metrics:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerExperimentSavedMetric,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(
  server: ServerExperimentSavedMetric,
): { primary: string; secondary?: string } {
  const metricType = (server.query as { metric_type?: string } | undefined)?.metric_type;
  return {
    primary: server.name,
    secondary: metricType ? `[${metricType}]` : undefined,
  };
}

export function serverIdOf(server: ServerExperimentSavedMetric): number {
  return server.id;
}

export function renderToFile(
  server: ServerExperimentSavedMetric,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `saved-metric-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.query = renderRawLiteral(server.query ?? {}, 2);

  const body = renderObject(fields, 2);
  const contents =
    `import { experimentSavedMetric } from "@posthog/definitions";\n\n` +
    `export default experimentSavedMetric(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerExperimentSavedMetric,
  spec: ExperimentSavedMetric,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateExperimentSavedMetric(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
