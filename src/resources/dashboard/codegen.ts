import type { ClientConfig } from "../../client/config.js";
import { isManagedTag } from "../../apply/display.js";
import {
  renderArray,
  renderImportLine,
  renderObject,
  stringLiteral,
} from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerDashboard, type ServerTile, updateDashboard } from "./client.js";
import { dashboardTag } from "./pipeline.js";
import type { Dashboard } from "./sdk.js";

const HASH_TAG_PREFIX = "iac:hash:";

const EXCLUDED_NAME_PREFIXES = [
  "Generated Dashboard:",
  "Feature Flag Usage:",
  "Feature Flag Targeting:",
];

const RESTRICTION_LEVEL_TO_NAME: Record<number, "everyone" | "collaborators"> = {
  21: "everyone",
  37: "collaborators",
};

export function pullFilter(
  server: ServerDashboard,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  if (EXCLUDED_NAME_PREFIXES.some((p) => server.name.startsWith(p))) {
    return { kept: false, reason: "feature-flag" };
  }
  if (
    server.creation_mode === "template" &&
    /feature[ -]?flag/i.test(server.name + (server.description ?? ""))
  ) {
    return { kept: false, reason: "template" };
  }
  return { kept: true };
}

export function pullLabel(server: ServerDashboard): { primary: string; secondary?: string } {
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  const secondary = userTags.length > 0 ? `[${userTags.join(", ")}]` : undefined;
  return { primary: server.name || `(untitled #${server.id})`, secondary };
}

export function serverIdOf(server: ServerDashboard): number {
  return server.id;
}

/** Every tile.insight.id this dashboard references, for the cross-resource cascade. */
export async function pullDependencies(
  _config: ClientConfig,
  server: ServerDashboard,
): Promise<PullDependency[]> {
  const deps: PullDependency[] = [];
  for (const tile of server.tiles ?? []) {
    if (tile.insight) deps.push({ resourceName: "insights", serverId: tile.insight.id });
  }
  return deps;
}

export function renderToFile(
  server: ServerDashboard,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `dashboard-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const namesUsed = new Set<string>(["dashboard"]);
  const tileLiterals: string[] = [];
  const insightImports: Array<{ varName: string; filename: string }> = [];
  const usedVarNames = new Set<string>();

  for (const tile of server.tiles ?? []) {
    if (tile.insight) {
      const literal = renderInsightTile(tile, ctx, insightImports, usedVarNames);
      if (literal) tileLiterals.push(literal);
      continue;
    }
    if (tile.text) {
      namesUsed.add("text");
      tileLiterals.push(renderTextTile(tile));
      continue;
    }
    ctx.warn(`Skipped tile id=${tile.id ?? "?"}: unrecognized tile shape (no insight, no text).`);
  }

  if (tileLiterals.length === 0) {
    return {
      skipped: true,
      reason: `Skipped dashboard "${server.name}" (id=${server.id}): no recognizable tiles.`,
    };
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  if (server.description) fields.description = stringLiteral(server.description);
  if (server.pinned) fields.pinned = "true";
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  if (userTags.length > 0) {
    fields.tags = `[${userTags.map(stringLiteral).join(", ")}]`;
  }
  const restriction =
    server.restriction_level !== undefined
      ? RESTRICTION_LEVEL_TO_NAME[server.restriction_level]
      : undefined;
  if (restriction) fields.restriction = stringLiteral(restriction);
  fields.tiles = renderArray(tileLiterals, 2);

  const body = renderObject(fields, 2);
  const importLine = renderImportLine([...namesUsed]);

  const parts: string[] = [importLine];
  for (const { varName, filename } of insightImports) {
    parts.push(`import ${varName} from "../insights/${filename.replace(/\.ts$/, ".js")}";`);
  }
  parts.push("");
  parts.push(`export default dashboard(${body});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerDashboard,
  spec: Dashboard,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTags = server.tags.filter((t) => !isManagedTag(t));
  await updateDashboard(
    config,
    server.id,
    { tags: [dashboardTag(spec.key), `${HASH_TAG_PREFIX}${hash}`, ...userTags] },
    options,
  );
}

// ---------------------------------------------------------------------------

function renderInsightTile(
  tile: ServerTile,
  ctx: PullRenderContext,
  insightImports: Array<{ varName: string; filename: string }>,
  usedVarNames: Set<string>,
): string | undefined {
  const srv = tile.insight!;
  const entry = ctx.importForServerIdOptional("insights", srv.id);
  if (!entry) {
    ctx.warn(
      `Skipped insight tile for insight id=${srv.id}: dependency wasn't pulled (re-run with cascade or pull insights too).`,
    );
    return undefined;
  }
  if (!usedVarNames.has(entry.varName)) {
    usedVarNames.add(entry.varName);
    insightImports.push({ varName: entry.varName, filename: entry.filename });
  }

  const layout = pickLayout(tile.layouts);
  if (!layout) {
    ctx.warn(`Insight tile for insight id=${srv.id} had no layout; using default.`);
  }
  const layoutLiteral = renderLayout(layout ?? { x: 0, y: 0, w: 6, h: 4 });

  const fields: Record<string, string> = {
    insight: entry.varName,
    layout: layoutLiteral,
  };
  if (tile.color) fields.color = stringLiteral(tile.color);
  return renderObject(fields, 4);
}

function renderTextTile(tile: ServerTile): string {
  const layout = pickLayout(tile.layouts) ?? { x: 0, y: 0, w: 12, h: 2 };
  return `text(${renderObject(
    {
      body: stringLiteral(tile.text?.body ?? ""),
      layout: renderLayout(layout),
    },
    4,
  )})`;
}

function pickLayout(
  layouts: Record<string, { x: number; y: number; w: number; h: number }> | undefined,
): { x: number; y: number; w: number; h: number } | undefined {
  if (!layouts) return undefined;
  return layouts.lg ?? layouts.sm ?? Object.values(layouts)[0];
}

function renderLayout(layout: { x: number; y: number; w: number; h: number }): string {
  return `{ x: ${layout.x}, y: ${layout.y}, w: ${layout.w}, h: ${layout.h} }`;
}
