import type { ClientConfig } from "../../client/config.js";
import { isManagedTag } from "../../apply/display.js";
import {
  identifierFromSlug,
  isObject,
  PACKAGE_NAME,
  renderArray,
  renderImportLine,
  renderObject,
  renderRawLiteral,
  stringLiteral,
} from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerInsight, updateInsight } from "./client.js";
import { insightTag } from "./pipeline.js";
import type { Insight } from "./sdk.js";

const HASH_TAG_PREFIX = "iac:hash:";

/**
 * Filter out insights that aren't usefully pull-able. The wider list also
 * includes derived "saved-query" rows, deleted ones, and dashboard-internal
 * placeholders — none of which a user wants to declare as code.
 */
export function pullFilter(
  server: ServerInsight,
): { kept: true } | { kept: false; reason: string } {
  // ServerInsight strips `deleted`, so we don't see soft-deletes here — the
  // server's default list already drops them. Still, name-prefix sentinels
  // catch the cases we've seen leak through.
  const name = server.name ?? "";
  if (!name && !server.query) {
    return { kept: false, reason: "no-name-no-query" };
  }
  return { kept: true };
}

export function pullLabel(server: ServerInsight): { primary: string; secondary?: string } {
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  const secondary = userTags.length > 0 ? `[${userTags.join(", ")}]` : undefined;
  return { primary: server.name || `(untitled #${server.short_id ?? server.id})`, secondary };
}

export function serverIdOf(server: ServerInsight): number {
  return server.id;
}

/**
 * Render a single insight row as a TS spec file. The generated code mirrors
 * what a hand-author would write:
 *
 *   import { insight, trends } from "@posthog/definitions";
 *   export default insight({ key, name, description?, query: trends(...), tags? });
 */
export function renderToFile(
  server: ServerInsight,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug =
    slugify(server.name ?? "") ||
    (server.short_id ? `insight-${server.short_id}` : `insight-${server.id}`);
  const slug = ctx.uniqueSlug(baseSlug);

  const namesUsed = new Set<string>(["insight"]);
  const queryRef = `insight ${server.short_id ?? server.id}`;
  const queryRendered = renderQuery(server.query, namesUsed, (msg) => ctx.warn(msg), queryRef);
  if (!queryRendered) {
    return { skipped: true, reason: `Skipped insight ${server.short_id ?? server.id}: unable to render query.` };
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name || slug),
  };
  if (server.description) fields.description = stringLiteral(server.description);
  fields.query = queryRendered;
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  if (userTags.length > 0) {
    fields.tags = `[${userTags.map(stringLiteral).join(", ")}]`;
  }

  const importLine = renderImportLine([...namesUsed]);
  const body = renderObject(fields, 2);
  const contents = `${importLine}\n\nexport default insight(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerInsight,
  spec: Insight,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  await updateInsight(
    config,
    server.id,
    { tags: [insightTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags] },
    options,
  );
}

/** Helper for dependents (e.g. dashboards) that need to compute an import varname from a spec key. */
export function insightVarNameFromKey(key: string): string {
  return identifierFromSlug(key);
}

// ---------------------------------------------------------------------------
// Query renderers
// ---------------------------------------------------------------------------

function renderQuery(
  query: unknown,
  imports: Set<string>,
  warn: (msg: string) => void,
  insightRef: string,
): string | undefined {
  if (!query || typeof query !== "object") return undefined;
  const q = query as Record<string, unknown>;
  const source = isObject(q.source) ? (q.source as Record<string, unknown>) : q;

  if (source.kind === "TrendsQuery") {
    imports.add("trends");
    return renderTrendsCall(source);
  }
  if (source.kind === "HogQLQuery") {
    imports.add("hogql");
    return renderHogqlCall(source);
  }
  warn(
    `Insight ${insightRef}: unsupported query kind "${String(source.kind)}". Emitting raw object — you'll need to edit manually.`,
  );
  return `${renderRawLiteral(source, 4)} as unknown as import("${PACKAGE_NAME}").Query`;
}

function renderTrendsCall(source: Record<string, unknown>): string {
  const fields: Record<string, string> = {};
  const series = Array.isArray(source.series) ? source.series : [];
  fields.series = renderArray(
    series.map((node) => {
      if (!isObject(node)) return renderRawLiteral(node, 6);
      const { kind: _kind, ...rest } = node as Record<string, unknown>;
      return renderRawLiteral(rest, 6);
    }),
    4,
  );
  for (const key of ["interval", "dateRange", "breakdownFilter", "trendsFilter", "properties"]) {
    if (source[key] !== undefined && source[key] !== null) {
      fields[key] = renderRawLiteral(source[key], 4);
    }
  }
  return `trends(${renderObject(fields, 4)})`;
}

function renderHogqlCall(source: Record<string, unknown>): string {
  const query = typeof source.query === "string" ? source.query : "";
  const values = isObject(source.values) ? source.values : undefined;
  if (values) {
    return `hogql(${stringLiteral(query)}, ${renderRawLiteral(values, 4)})`;
  }
  return `hogql(${stringLiteral(query)})`;
}
