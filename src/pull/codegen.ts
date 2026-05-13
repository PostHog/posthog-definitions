import { slugify, uniqueSlug } from "./slug.js";

const PACKAGE_NAME = "@posthog/definitions";

type ServerTile = {
  id?: number;
  insight?: {
    id: number;
    short_id?: string;
    name?: string;
    description?: string | null;
    query?: unknown;
    tags?: string[];
  } | null;
  text?: { body: string } | null;
  layouts?: Record<string, { x: number; y: number; w: number; h: number }>;
  color?: string | null;
};

type ServerDashboard = {
  id: number;
  name: string;
  description?: string | null;
  pinned?: boolean;
  tags?: string[];
  restriction_level?: number;
  tiles?: ServerTile[];
};

export type GeneratedFile = {
  filename: string;
  contents: string;
  warnings: string[];
  dashboardKey: string;
  insightKeysByServerId: Map<number, string>;
};

type Imports = {
  dashboard: boolean;
  insight: boolean;
  text: boolean;
  trends: boolean;
  hogql: boolean;
};

const RESTRICTION_LEVEL_TO_NAME: Record<number, "everyone" | "collaborators"> = {
  21: "everyone",
  37: "collaborators",
};

export function generateDashboardFile(
  server: ServerDashboard,
  takenFilenames: Set<string>,
): GeneratedFile {
  const warnings: string[] = [];
  const imports: Imports = {
    dashboard: true,
    insight: false,
    text: false,
    trends: false,
    hogql: false,
  };

  const baseSlug = slugify(server.name) || `dashboard-${server.id}`;
  const filename = `${uniqueSlug(baseSlug, takenFilenames)}.ts`;
  const dashboardKey = baseSlug;

  const insightVars: string[] = [];
  const tileLiterals: string[] = [];
  const usedInsightSlugs = new Set<string>();
  const insightVarByInsightId = new Map<number, string>();
  const insightKeysByServerId = new Map<number, string>();

  for (const tile of server.tiles ?? []) {
    if (tile.insight) {
      const literal = renderInsightTile(
        tile,
        insightVars,
        insightVarByInsightId,
        insightKeysByServerId,
        usedInsightSlugs,
        imports,
        warnings,
      );
      if (literal) tileLiterals.push(literal);
      continue;
    }
    if (tile.text) {
      imports.text = true;
      tileLiterals.push(renderTextTile(tile));
      continue;
    }
    warnings.push(
      `Skipped tile id=${tile.id ?? "?"}: unrecognized tile shape (no insight, no text).`,
    );
  }

  if (tileLiterals.length === 0) {
    warnings.push(
      `Dashboard "${server.name}" (id=${server.id}) has no recognizable tiles; output may not pass validation.`,
    );
  }

  const dashboardSpec: Record<string, string> = {
    key: stringLiteral(dashboardKey),
    name: stringLiteral(server.name),
  };
  if (server.description) dashboardSpec.description = stringLiteral(server.description);
  if (server.pinned) dashboardSpec.pinned = "true";
  const userTags = (server.tags ?? []).filter((t) => !t.startsWith("iac:"));
  if (userTags.length > 0) {
    dashboardSpec.tags = `[${userTags.map(stringLiteral).join(", ")}]`;
  }
  const restriction =
    server.restriction_level !== undefined
      ? RESTRICTION_LEVEL_TO_NAME[server.restriction_level]
      : undefined;
  if (restriction) dashboardSpec.restriction = stringLiteral(restriction);
  dashboardSpec.tiles = renderArray(tileLiterals, 2);

  const dashboardBody = renderObject(dashboardSpec, 2);
  const importLine = renderImportLine(imports);

  const parts: string[] = [importLine, ""];
  if (insightVars.length > 0) {
    parts.push(...insightVars);
  }
  parts.push(`export default dashboard(${dashboardBody});`);
  parts.push("");

  return {
    filename,
    contents: parts.join("\n"),
    warnings,
    dashboardKey,
    insightKeysByServerId,
  };
}

function renderInsightTile(
  tile: ServerTile,
  insightVars: string[],
  insightVarByInsightId: Map<number, string>,
  insightKeysByServerId: Map<number, string>,
  usedInsightSlugs: Set<string>,
  imports: Imports,
  warnings: string[],
): string | undefined {
  const srv = tile.insight!;
  let varName = insightVarByInsightId.get(srv.id);
  if (!varName) {
    const baseSlug =
      slugify(srv.name ?? "") || (srv.short_id ? `insight-${srv.short_id}` : `insight-${srv.id}`);
    const slug = uniqueSlug(baseSlug, usedInsightSlugs);
    varName = identifierFromSlug(slug);

    const queryRendered = renderQuery(srv.query, imports, warnings, srv.short_id ?? String(srv.id));
    if (!queryRendered) {
      warnings.push(`Skipped insight ${srv.short_id ?? srv.id}: unable to render query.`);
      return undefined;
    }
    imports.insight = true;

    const insightSpec: Record<string, string> = {
      key: stringLiteral(slug),
      name: stringLiteral(srv.name ?? slug),
    };
    if (srv.description) insightSpec.description = stringLiteral(srv.description);
    insightSpec.query = queryRendered;
    const userTags = (srv.tags ?? []).filter((t) => !t.startsWith("iac:"));
    if (userTags.length > 0) {
      insightSpec.tags = `[${userTags.map(stringLiteral).join(", ")}]`;
    }

    insightVars.push(`const ${varName} = insight(${renderObject(insightSpec, 2)});`);
    insightVars.push("");
    insightVarByInsightId.set(srv.id, varName);
    insightKeysByServerId.set(srv.id, slug);
  }

  const layout = pickLayout(tile.layouts);
  if (!layout) {
    warnings.push(`Insight tile for "${srv.name ?? srv.short_id}" had no layout; using default.`);
  }
  const layoutLiteral = renderLayout(layout ?? { x: 0, y: 0, w: 6, h: 4 });

  const tileSpec: Record<string, string> = {
    insight: varName,
    layout: layoutLiteral,
  };
  if (tile.color) tileSpec.color = stringLiteral(tile.color);
  return renderObject(tileSpec, 4);
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

function renderQuery(
  query: unknown,
  imports: Imports,
  warnings: string[],
  insightRef: string,
): string | undefined {
  if (!query || typeof query !== "object") return undefined;
  const q = query as Record<string, unknown>;
  const source = isObject(q.source) ? (q.source as Record<string, unknown>) : q;

  if (source.kind === "TrendsQuery") {
    imports.trends = true;
    return renderTrendsCall(source);
  }
  if (source.kind === "HogQLQuery") {
    imports.hogql = true;
    return renderHogqlCall(source);
  }

  warnings.push(
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

function pickLayout(
  layouts: Record<string, { x: number; y: number; w: number; h: number }> | undefined,
): { x: number; y: number; w: number; h: number } | undefined {
  if (!layouts) return undefined;
  return layouts.lg ?? layouts.sm ?? Object.values(layouts)[0];
}

function renderLayout(layout: { x: number; y: number; w: number; h: number }): string {
  return `{ x: ${layout.x}, y: ${layout.y}, w: ${layout.w}, h: ${layout.h} }`;
}

function renderImportLine(imports: Imports): string {
  const names: string[] = [];
  if (imports.dashboard) names.push("dashboard");
  if (imports.insight) names.push("insight");
  if (imports.text) names.push("text");
  if (imports.trends) names.push("trends");
  if (imports.hogql) names.push("hogql");
  return `import { ${names.join(", ")} } from "${PACKAGE_NAME}";`;
}

function identifierFromSlug(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z0-9_]/g, "_");
  const safe = /^[a-zA-Z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
  return safe;
}

function stringLiteral(value: string): string {
  return JSON.stringify(value);
}

function renderObject(fields: Record<string, string>, indent: number): string {
  const entries = Object.entries(fields);
  if (entries.length === 0) return "{}";
  const pad = " ".repeat(indent);
  const outerPad = " ".repeat(Math.max(0, indent - 2));
  const lines = entries.map(([k, v]) => `${pad}${formatKey(k)}: ${v},`);
  return `{\n${lines.join("\n")}\n${outerPad}}`;
}

function renderArray(items: string[], indent: number): string {
  if (items.length === 0) return "[]";
  const pad = " ".repeat(indent);
  const outerPad = " ".repeat(Math.max(0, indent - 2));
  return `[\n${items.map((i) => `${pad}${i},`).join("\n")}\n${outerPad}]`;
}

function formatKey(key: string): string {
  return /^[a-zA-Z_$][\w$]*$/.test(key) ? key : stringLiteral(key);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function renderRawLiteral(value: unknown, indent: number): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return stringLiteral(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => renderRawLiteral(v, indent + 2));
    return renderArray(items, indent);
  }
  if (isObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return "{}";
    const fields: Record<string, string> = {};
    for (const [k, v] of entries) fields[k] = renderRawLiteral(v, indent + 2);
    return renderObject(fields, indent);
  }
  return JSON.stringify(value);
}
