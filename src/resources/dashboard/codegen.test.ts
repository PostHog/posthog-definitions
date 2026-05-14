import { describe, expect, it } from "vitest";
import type { ImportEntry, PullRenderContext } from "../../pull/types.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
} from "./codegen.js";
import type { ServerDashboard } from "./client.js";

function makeCtx(
  imports: Map<string, Map<string, ImportEntry>> = new Map(),
): PullRenderContext & { warnings: string[]; taken: Set<string> } {
  const taken = new Set<string>();
  const warnings: string[] = [];
  return {
    taken,
    warnings,
    uniqueSlug: (base) => {
      let s = base;
      let i = 2;
      while (taken.has(s)) s = `${base}-${i++}`;
      taken.add(s);
      return s;
    },
    importForServerId: (rn, id) => {
      const entry = imports.get(rn)?.get(String(id));
      if (!entry) throw new Error(`missing import ${rn}/${id}`);
      return entry;
    },
    importForServerIdOptional: (rn, id) => imports.get(rn)?.get(String(id)),
    warn: (m) => warnings.push(m),
  };
}

function dashboard(overrides: Partial<ServerDashboard> = {}): ServerDashboard {
  return {
    id: 10,
    name: "Growth dashboard",
    description: null,
    pinned: false,
    tags: [],
    tiles: [],
    ...overrides,
  };
}

describe("dashboard codegen", () => {
  it("pullFilter drops auto-generated feature-flag dashboards", () => {
    expect(pullFilter(dashboard({ name: "Feature Flag Usage: foo" })).kept).toBe(false);
    expect(pullFilter(dashboard({ deleted: true })).kept).toBe(false);
  });

  it("pullFilter keeps a normal dashboard", () => {
    expect(pullFilter(dashboard()).kept).toBe(true);
  });

  it("pullLabel surfaces name + user tags", () => {
    const label = pullLabel(dashboard({ tags: ["iac:dashboards:x", "team:growth"] }));
    expect(label.primary).toBe("Growth dashboard");
    expect(label.secondary).toBe("[team:growth]");
  });

  it("pullDependencies lists each tile-insight id", async () => {
    const d = dashboard({
      tiles: [
        { insight: { id: 100 }, layouts: { lg: { x: 0, y: 0, w: 6, h: 4 } } },
        { insight: { id: 101 }, layouts: { lg: { x: 6, y: 0, w: 6, h: 4 } } },
        { text: { body: "note" } },
      ],
    });
    expect(
      await pullDependencies({ host: "h", projectId: "1", apiKey: "k" }, d),
    ).toEqual([
      { resourceName: "insights", serverId: 100 },
      { resourceName: "insights", serverId: 101 },
    ]);
  });

  it("renderToFile emits dashboard() with insight imports resolved by id", () => {
    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set(
      "insights",
      new Map([
        [
          "100",
          {
            key: "signups",
            varName: "signups",
            filename: "signups.ts",
            resourceName: "insights",
          },
        ],
      ]),
    );
    const ctx = makeCtx(imports);
    const d = dashboard({
      tiles: [
        { insight: { id: 100 }, layouts: { lg: { x: 0, y: 0, w: 6, h: 4 } } },
        { text: { body: "Hello" }, layouts: { lg: { x: 0, y: 4, w: 12, h: 2 } } },
      ],
    });
    const result = renderToFile(d, ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("growth-dashboard.ts");
    expect(result.specKey).toBe("growth-dashboard");
    expect(result.contents).toContain('import { dashboard, text } from "@posthog/definitions";');
    expect(result.contents).toContain('import signups from "../insights/signups.js";');
    expect(result.contents).toContain("insight: signups");
    expect(result.contents).toContain('text({');
    expect(result.contents).toContain("export default dashboard(");
  });

  it("renderToFile skips when no tiles render", () => {
    const ctx = makeCtx();
    const d = dashboard({ tiles: [{ id: 1 }] });
    const result = renderToFile(d, ctx);
    expect("skipped" in result).toBe(true);
  });

  it("renderToFile warns when an insight tile's dependency wasn't pulled", () => {
    const ctx = makeCtx();
    const d = dashboard({
      tiles: [
        { insight: { id: 999 }, layouts: { lg: { x: 0, y: 0, w: 6, h: 4 } } },
        { text: { body: "x" } },
      ],
    });
    const result = renderToFile(d, ctx);
    if ("skipped" in result) throw new Error("Expected partial render");
    expect(ctx.warnings.some((w) => w.includes("999"))).toBe(true);
    expect(result.contents).not.toContain("insight: ");
  });

  it("renderToFile carries restriction level + pinned + tags through", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      dashboard({
        pinned: true,
        restriction_level: 21,
        tags: ["team:growth"],
        tiles: [{ text: { body: "x" } }],
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("pinned: true");
    expect(result.contents).toContain('restriction: "everyone"');
    expect(result.contents).toContain('tags: ["team:growth"]');
  });
});
