import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerExperimentHoldout, updateExperimentHoldout } from "./client.js";
import type { ExperimentHoldout } from "./sdk.js";

const MARKER_PREFIX = "iac:experiment-holdouts:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:experiment-holdouts:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerExperimentHoldout,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(
  server: ServerExperimentHoldout,
): { primary: string; secondary?: string } {
  return { primary: server.name };
}

export function serverIdOf(server: ServerExperimentHoldout): number {
  return server.id;
}

export function renderToFile(
  server: ServerExperimentHoldout,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `holdout-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.filters = renderRawLiteral(server.filters ?? [], 2);

  const body = renderObject(fields, 2);
  const contents =
    `import { experimentHoldout } from "@posthog/definitions";\n\n` +
    `export default experimentHoldout(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerExperimentHoldout,
  spec: ExperimentHoldout,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateExperimentHoldout(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
