import type { Dashboard, Insight, Tile } from "../sdk/types.js";
import { isButtonTile, isInsightTile, isTextTile } from "../sdk/types.js";
import type { ServerDashboard, ServerTile } from "../client/dashboards.js";
import type { ServerInsight } from "../client/insights.js";
import type { DashboardOp, DiffResult, InsightOp } from "./diff.js";

type Style = (s: string) => string;

type Palette = {
  bold: Style;
  dim: Style;
  red: Style;
  green: Style;
  yellow: Style;
  blue: Style;
  cyan: Style;
};

const IDENTITY: Style = (s) => s;

function ansi(code: number): Style {
  return (s) => `\x1b[${code}m${s}\x1b[0m`;
}

function pickPalette(useColor: boolean): Palette {
  if (!useColor) {
    return { bold: IDENTITY, dim: IDENTITY, red: IDENTITY, green: IDENTITY, yellow: IDENTITY, blue: IDENTITY, cyan: IDENTITY };
  }
  return { bold: ansi(1), dim: ansi(2), red: ansi(31), green: ansi(32), yellow: ansi(33), blue: ansi(34), cyan: ansi(36) };
}

export function shouldUseColor(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(process.stdout.isTTY) && process.env.TERM !== "dumb";
}

export type FormatOptions = {
  color?: boolean;
  serverInsights?: ServerInsight[];
};

export function formatPlan(result: DiffResult, options: FormatOptions = {}): string {
  const color = options.color ?? shouldUseColor();
  const p = pickPalette(color);

  const serverIdToKey = new Map<number, string>();
  for (const si of options.serverInsights ?? []) {
    const key = readManagedKey(si.tags, "iac:insights:");
    if (key) serverIdToKey.set(si.id, key);
  }

  const insightCounts = countOps(result.insightOps);
  const dashboardCounts = countOps(result.dashboardOps);

  const out: string[] = [];
  out.push(p.bold("Plan"));
  out.push(p.dim("────"));
  out.push(
    `  insights:    ${p.green(`${insightCounts.create} to create`)}  ·  ${p.yellow(`${insightCounts.update} to update`)}  ·  ${p.dim(`${insightCounts.unchanged} unchanged`)}`,
  );
  out.push(
    `  dashboards:  ${p.green(`${dashboardCounts.create} to create`)}  ·  ${p.yellow(`${dashboardCounts.update} to update`)}  ·  ${p.dim(`${dashboardCounts.unchanged} unchanged`)}`,
  );
  if (result.orphanInsights.length > 0 || result.orphanDashboards.length > 0) {
    out.push(
      `  orphans:     ${p.blue(`${result.orphanInsights.length} insight(s)`)}  ·  ${p.blue(`${result.orphanDashboards.length} dashboard(s)`)}  ${p.dim("(left alone)")}`,
    );
  }

  for (const op of result.insightOps) {
    const block = renderInsightOp(op, p);
    if (block) out.push("", block);
  }
  for (const op of result.dashboardOps) {
    const block = renderDashboardOp(op, p, serverIdToKey);
    if (block) out.push("", block);
  }
  for (const orphan of result.orphanInsights) {
    const key = readManagedKey(orphan.tags, "iac:insights:") ?? `id:${orphan.id}`;
    out.push("", `${p.blue("·")} ${p.dim("orphan insight  ")}${key}`);
  }
  for (const orphan of result.orphanDashboards) {
    const key = readManagedKey(orphan.tags, "iac:dashboards:") ?? `id:${orphan.id}`;
    out.push("", `${p.blue("·")} ${p.dim("orphan dashboard")}${" "}${key}`);
  }

  return out.join("\n");
}

function countOps(ops: Array<{ kind: "create" | "update" | "unchanged" }>): {
  create: number;
  update: number;
  unchanged: number;
} {
  return ops.reduce(
    (acc, op) => {
      acc[op.kind]++;
      return acc;
    },
    { create: 0, update: 0, unchanged: 0 },
  );
}

function renderInsightOp(op: InsightOp, p: Palette): string | null {
  if (op.kind === "unchanged") return null;
  if (op.kind === "create") {
    const header = `${p.green("+")} ${p.bold("insight  ")}${op.key}`;
    const desired = renderLines(displayInsight(op.spec));
    return [header, ...desired.map((line) => `    ${p.green(`+ ${line}`)}`)].join("\n");
  }
  const header = `${p.yellow("~")} ${p.bold("insight  ")}${op.key}`;
  const before = renderLines(displayInsightFromServer(op.server));
  const after = renderLines(displayInsight(op.spec));
  return [header, ...renderDiff(before, after, p)].join("\n");
}

function renderDashboardOp(
  op: DashboardOp,
  p: Palette,
  serverIdToKey: Map<number, string>,
): string | null {
  if (op.kind === "unchanged") return null;
  if (op.kind === "create") {
    const header = `${p.green("+")} ${p.bold("dashboard")} ${op.key}`;
    const desired = renderLines(displayDashboard(op.spec));
    return [header, ...desired.map((line) => `    ${p.green(`+ ${line}`)}`)].join("\n");
  }
  const header = `${p.yellow("~")} ${p.bold("dashboard")} ${op.key}`;
  const before = renderLines(displayDashboardFromServer(op.server, serverIdToKey));
  const after = renderLines(displayDashboard(op.spec));
  return [header, ...renderDiff(before, after, p)].join("\n");
}

function renderDiff(before: string[], after: string[], p: Palette): string[] {
  const ops = lcsDiff(before, after);
  return ops.map(({ kind, value }) => {
    if (kind === "eq") return `      ${p.dim(value)}`;
    if (kind === "del") return `    ${p.red(`- ${value}`)}`;
    return `    ${p.green(`+ ${value}`)}`;
  });
}

function lcsDiff(
  a: string[],
  b: string[],
): Array<{ kind: "eq" | "del" | "add"; value: string }> {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const out: Array<{ kind: "eq" | "del" | "add"; value: string }> = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ kind: "eq", value: a[i]! });
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push({ kind: "del", value: a[i]! });
      i++;
    } else {
      out.push({ kind: "add", value: b[j]! });
      j++;
    }
  }
  while (i < n) out.push({ kind: "del", value: a[i++]! });
  while (j < m) out.push({ kind: "add", value: b[j++]! });
  return out;
}

type DisplayValue =
  | { kind: "scalar"; value: string }
  | { kind: "object"; entries: Array<[string, DisplayValue]> }
  | { kind: "array"; items: DisplayValue[] };

function renderLines(value: DisplayValue, indent = 0): string[] {
  const pad = "  ".repeat(indent);
  if (value.kind === "scalar") return [`${pad}${value.value}`];
  if (value.kind === "object") {
    if (value.entries.length === 0) return [`${pad}{}`];
    const lines: string[] = [];
    for (const [k, v] of value.entries) {
      if (v.kind === "scalar") lines.push(`${pad}${k}: ${v.value}`);
      else {
        lines.push(`${pad}${k}:`);
        lines.push(...renderLines(v, indent + 1));
      }
    }
    return lines;
  }
  if (value.items.length === 0) return [`${pad}[]`];
  const lines: string[] = [];
  for (const item of value.items) {
    if (item.kind === "scalar") lines.push(`${pad}- ${item.value}`);
    else {
      const sub = renderLines(item, indent + 1);
      if (sub.length > 0) sub[0] = `${pad}- ${sub[0]!.trimStart()}`;
      lines.push(...sub);
    }
  }
  return lines;
}

function scalar(value: unknown): DisplayValue {
  return { kind: "scalar", value: JSON.stringify(value) };
}

function obj(entries: Array<[string, DisplayValue]>): DisplayValue {
  return { kind: "object", entries };
}

function arr(items: DisplayValue[]): DisplayValue {
  return { kind: "array", items };
}

function displayInsight(spec: Insight): DisplayValue {
  return obj([
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["query", displayJson(spec.query)],
    ["tags", arr((spec.tags ?? []).filter((t) => !isManaged(t)).map(scalar))],
  ]);
}

function displayInsightFromServer(server: ServerInsight): DisplayValue {
  return obj([
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["query", displayJson(unwrapServerQuery(server.query))],
    ["tags", arr((server.tags ?? []).filter((t) => !isManaged(t)).map(scalar))],
  ]);
}

function displayDashboard(spec: Dashboard): DisplayValue {
  return obj([
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["pinned", scalar(spec.pinned ?? false)],
    ["restriction", scalar(spec.restriction ?? null)],
    ["tags", arr((spec.tags ?? []).filter((t) => !isManaged(t)).map(scalar))],
    ["tiles", arr(spec.tiles.map(displayTileSpec))],
  ]);
}

function displayDashboardFromServer(
  server: ServerDashboard,
  serverIdToKey: Map<number, string>,
): DisplayValue {
  return obj([
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["pinned", scalar(server.pinned ?? false)],
    ["restriction", scalar(restrictionFromLevel(server.restriction_level))],
    ["tags", arr((server.tags ?? []).filter((t) => !isManaged(t)).map(scalar))],
    ["tiles", arr((server.tiles ?? []).map((t) => displayServerTile(t, serverIdToKey)))],
  ]);
}

function displayTileSpec(tile: Tile): DisplayValue {
  if (isInsightTile(tile)) {
    return obj([
      ["kind", scalar("insight")],
      ["insightKey", scalar(tile.insight.key)],
      ["layout", displayJson(tile.layout)],
      ...(tile.color !== undefined ? ([["color", scalar(tile.color)]] as Array<[string, DisplayValue]>) : []),
    ]);
  }
  if (isTextTile(tile)) {
    return obj([
      ["kind", scalar("text")],
      ["body", scalar(tile.body)],
      ["layout", displayJson(tile.layout)],
    ]);
  }
  if (isButtonTile(tile)) {
    return obj([
      ["kind", scalar("button")],
      ["text", scalar(tile.text)],
      ["url", scalar(tile.url)],
      ["layout", displayJson(tile.layout)],
    ]);
  }
  return scalar(JSON.stringify(tile));
}

function displayServerTile(tile: ServerTile, serverIdToKey: Map<number, string>): DisplayValue {
  if (tile.insight && typeof tile.insight.id === "number") {
    const key = serverIdToKey.get(tile.insight.id) ?? `id:${tile.insight.id}`;
    return obj([
      ["kind", scalar("insight")],
      ["insightKey", scalar(key)],
      ["layout", displayJson(pickLayout(tile.layouts))],
      ...(tile.color != null ? ([["color", scalar(tile.color)]] as Array<[string, DisplayValue]>) : []),
    ]);
  }
  if (tile.text && typeof tile.text.body === "string") {
    const button = parseMarkdownButton(tile.text.body);
    if (button) {
      return obj([
        ["kind", scalar("button")],
        ["text", scalar(button.text)],
        ["url", scalar(button.url)],
        ["layout", displayJson(pickLayout(tile.layouts))],
      ]);
    }
    return obj([
      ["kind", scalar("text")],
      ["body", scalar(tile.text.body)],
      ["layout", displayJson(pickLayout(tile.layouts))],
    ]);
  }
  return scalar(JSON.stringify(tile));
}

function pickLayout(layouts: ServerTile["layouts"]): unknown {
  if (!layouts) return null;
  return layouts.sm ?? layouts.lg ?? Object.values(layouts)[0] ?? null;
}

function parseMarkdownButton(body: string): { text: string; url: string } | null {
  const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(body.trim());
  if (!match) return null;
  return { text: match[1]!, url: match[2]! };
}

function restrictionFromLevel(level: number | undefined): string | null {
  if (level === 37) return "collaborators";
  if (level === 21) return "everyone";
  return null;
}

function isManaged(tag: string): boolean {
  return tag.startsWith("iac:");
}

function readManagedKey(tags: string[] | undefined, prefix: string): string | undefined {
  return tags?.find((t) => t.startsWith(prefix))?.slice(prefix.length);
}

function unwrapServerQuery(query: unknown): unknown {
  if (!query || typeof query !== "object") return query;
  const obj = query as Record<string, unknown>;
  if (obj.kind === "InsightVizNode" || obj.kind === "DataTableNode") return obj.source;
  return query;
}

function displayJson(value: unknown): DisplayValue {
  if (value === null || value === undefined) return scalar(null);
  if (typeof value !== "object") return scalar(value);
  if (Array.isArray(value)) return arr(value.map(displayJson));
  const entries: Array<[string, DisplayValue]> = [];
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    entries.push([k, displayJson(v)]);
  }
  return obj(entries);
}
