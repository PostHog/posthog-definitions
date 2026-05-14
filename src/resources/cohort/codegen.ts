import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerCohort, updateCohort } from "./client.js";
import type { Cohort } from "./sdk.js";

const MARKER_PREFIX = "iac:cohorts:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:cohorts:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  server: ServerCohort,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerCohort): { primary: string; secondary?: string } {
  return {
    primary: server.name?.trim() || `cohort-${server.id}`,
    secondary: server.is_static ? "[static]" : undefined,
  };
}

export function serverIdOf(server: ServerCohort): number {
  return server.id;
}

export function renderToFile(
  server: ServerCohort,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name ?? "") || `cohort-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name?.trim() || slug),
  };

  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);

  if (server.is_static) {
    fields.is_static = "true";
    // Static cohorts have manually-managed member lists; we just create the
    // container. Warn loudly so users don't expect membership round-trip.
    ctx.warn(
      `Cohort "${slug}" is static — pull only creates the container; member lists are managed out-of-band.`,
    );
  } else if (server.filters) {
    fields.filters = renderRawLiteral(server.filters, 2);
  } else {
    return {
      skipped: true,
      reason: `Cohort "${slug}" has no filters and isn't static — nothing to render.`,
    };
  }

  if (server.cohort_type) fields.cohort_type = stringLiteral(server.cohort_type);

  const body = renderObject(fields, 2);
  const contents =
    `import { cohort } from "@posthog/definitions";\n\n` +
    `export default cohort(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerCohort,
  spec: Cohort,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateCohort(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
