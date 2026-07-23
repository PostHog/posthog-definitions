import { RESOURCES } from "../resources/index.js";
import type {
  ApplyContext,
  ResourceModule,
  ResourceOp,
  SingletonResourceModule,
} from "../resources/types.js";
import { newApplyContext } from "../resources/types.js";
import { renderLines, type DisplayValue } from "./display.js";
import type { DiffResult } from "./diff.js";

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
    return {
      bold: IDENTITY,
      dim: IDENTITY,
      red: IDENTITY,
      green: IDENTITY,
      yellow: IDENTITY,
      blue: IDENTITY,
      cyan: IDENTITY,
    };
  }
  return {
    bold: ansi(1),
    dim: ansi(2),
    red: ansi(31),
    green: ansi(32),
    yellow: ansi(33),
    blue: ansi(34),
    cyan: ansi(36),
  };
}

export function shouldUseColor(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(process.stdout.isTTY) && process.env.TERM !== "dumb";
}

export type FormatOptions = {
  color?: boolean;
  prune?: boolean;
  serverState?: Map<string, unknown[]>;
};

export function formatPlan(
  result: DiffResult,
  options: FormatOptions = {},
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): string {
  const color = options.color ?? shouldUseColor();
  const p = pickPalette(color);
  const ctx = buildDisplayContext(options.serverState, resources);

  const out: string[] = [];
  out.push(p.bold("Plan"));
  out.push(p.dim("────"));

  let anyOrphan = false;
  for (const resource of resources) {
    const slice = result.get(resource.name);
    const counts = countOps(slice?.ops ?? []);
    out.push(
      `  ${padName(resource.name)}  ${p.green(`${counts.create} to create`)}  ·  ${p.yellow(`${counts.update} to update`)}  ·  ${p.dim(`${counts.unchanged} unchanged`)}`,
    );
    if (slice && slice.orphans.length > 0) anyOrphan = true;
  }

  if (anyOrphan) {
    const action = options.prune ? p.red("to delete") : p.dim("(left alone)");
    const segments: string[] = [];
    for (const resource of resources) {
      const orphans = result.get(resource.name)?.orphans ?? [];
      if (orphans.length === 0) continue;
      segments.push(p.blue(`${orphans.length} ${resource.displayName}(s)`));
    }
    out.push(`  orphans:    ${segments.join("  ·  ")}  ${action}`);
  }

  for (const resource of resources) {
    const slice = result.get(resource.name);
    if (!slice) continue;
    for (const op of slice.ops) {
      const block = renderOp(resource, op, ctx, p);
      if (block) out.push("", block);
    }
  }

  const orphanMarker = options.prune ? p.red("-") : p.blue("·");
  for (const resource of resources) {
    if (resource.kind !== "collection") continue;
    const orphans = result.get(resource.name)?.orphans ?? [];
    for (const orphan of orphans) {
      const key = resource.keyFromServer(orphan) ?? `id:${(orphan as { id: number }).id}`;
      const label = options.prune
        ? p.red(`delete ${resource.displayName.padEnd(9)}`)
        : p.dim(`orphan ${resource.displayName.padEnd(9)}`);
      out.push("", `${orphanMarker} ${label} ${key}`);
    }
  }

  return out.join("\n");
}

function buildDisplayContext(
  serverState: Map<string, unknown[]> | undefined,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>>,
): ApplyContext {
  const ctx = newApplyContext();
  if (!serverState) return ctx;

  // Populate the reverse map (insight server id → key) so dashboard tile diffs
  // render insight keys rather than opaque ids.
  const insightResource = resources.find((r) => r.name === "insights");
  if (insightResource && insightResource.kind === "collection") {
    for (const row of serverState.get("insights") ?? []) {
      const key = insightResource.keyFromServer(row);
      if (!key) continue;
      const id = (row as { id: number }).id;
      ctx.insightKeyByServerId.set(id, key);
      ctx.insightIdByKey.set(key, id);
    }
  }
  // Same for dashboards, so annotation / subscription references to a dashboard
  // render as keys rather than opaque ids.
  const dashboardResource = resources.find((r) => r.name === "dashboards");
  if (dashboardResource && dashboardResource.kind === "collection") {
    for (const row of serverState.get("dashboards") ?? []) {
      const key = dashboardResource.keyFromServer(row);
      if (!key) continue;
      const id = (row as { id: number }).id;
      ctx.dashboardKeyByServerId.set(id, key);
      ctx.dashboardIdByKey.set(key, id);
    }
  }
  return ctx;
}

function countOps(ops: ReadonlyArray<{ kind: "create" | "update" | "unchanged" }>): {
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

function padName(name: string): string {
  // Aligns the count line: "insights:" "dashboards:" → 12-char column.
  return `${name}:`.padEnd(12);
}

function renderOp(
  resource: ResourceModule<unknown, unknown>,
  op: ResourceOp<unknown, unknown>,
  ctx: ApplyContext,
  p: Palette,
): string | null {
  if (op.kind === "unchanged") return null;
  const labelPadded = resource.displayName.padEnd(9);
  // Resolve the display label per resource kind. Collection ops carry a key
  // derivable from the spec; singletons have no key (the project IS the key).
  const idLabel =
    resource.kind === "collection"
      ? ` ${resource.specKey(op.spec)}`
      : "";
  if (op.kind === "create") {
    const header = `${p.green("+")} ${p.bold(labelPadded)}${idLabel}`;
    const desired = renderLines(resource.displaySpec(op.spec, ctx));
    return [header, ...desired.map((line) => `    ${p.green(`+ ${line}`)}`)].join("\n");
  }
  // update
  const header = `${p.yellow("~")} ${p.bold(labelPadded)}${idLabel}`;
  if (resource.kind === "singleton") {
    return [header, ...renderSingletonFieldDiff(resource, op.spec, op.server, p)].join("\n");
  }
  const before = renderLines(resource.displayServer(op.server, ctx));
  const after = renderLines(resource.displaySpec(op.spec, ctx));
  return [header, ...renderDiff(before, after, p)].join("\n");
}

function renderSingletonFieldDiff(
  resource: SingletonResourceModule<unknown, unknown>,
  spec: unknown,
  server: unknown,
  p: Palette,
): string[] {
  const changes = resource.diffFields(spec, server);
  return changes.map(({ field, before, after }) => {
    const b = JSON.stringify(before);
    const a = JSON.stringify(after);
    return `    ${p.dim(field)}: ${p.red(b)} ${p.dim("→")} ${p.green(a)}`;
  });
}

function renderDiff(before: string[], after: string[], p: Palette): string[] {
  const ops = lcsDiff(before, after);
  return ops.map(({ kind, value }) => {
    if (kind === "eq") return `      ${p.dim(value)}`;
    if (kind === "del") return `    ${p.red(`- ${value}`)}`;
    return `    ${p.green(`+ ${value}`)}`;
  });
}

export function lcsDiff(
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

export type { DisplayValue };
