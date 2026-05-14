import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile } from "./codegen.js";
import type { ServerInsight } from "./client.js";

function makeCtx(): PullRenderContext & { warnings: string[]; taken: Set<string> } {
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
    importForServerId: () => {
      throw new Error("insight codegen should not call importForServerId");
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function serverInsight(overrides: Partial<ServerInsight> = {}): ServerInsight {
  return {
    id: 7,
    short_id: "abc123",
    name: "Signups",
    description: null,
    query: {
      kind: "InsightVizNode",
      source: {
        kind: "TrendsQuery",
        series: [{ kind: "EventsNode", event: "user_signed_up" }],
      },
    },
    tags: [],
    ...overrides,
  };
}

describe("insight codegen", () => {
  it("pullFilter keeps a normal insight", () => {
    expect(pullFilter(serverInsight()).kept).toBe(true);
  });

  it("pullFilter drops an insight with no name and no query", () => {
    const verdict = pullFilter(serverInsight({ name: "", query: undefined }));
    expect(verdict.kept).toBe(false);
  });

  it("pullLabel surfaces the name and user tags", () => {
    const label = pullLabel(
      serverInsight({ name: "Daily signups", tags: ["iac:insights:foo", "growth"] }),
    );
    expect(label.primary).toBe("Daily signups");
    expect(label.secondary).toBe("[growth]");
  });

  it("renderToFile emits a trends() call for a TrendsQuery", () => {
    const ctx = makeCtx();
    const result = renderToFile(serverInsight(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile, got skipped: ${result.reason}`);
    expect(result.filename).toBe("signups.ts");
    expect(result.specKey).toBe("signups");
    expect(result.contents).toContain("import { insight, trends }");
    expect(result.contents).toContain('event: "user_signed_up"');
    expect(result.contents).toContain('key: "signups"');
    expect(result.contents).toContain("export default insight(");
  });

  it("renderToFile emits a hogql() call for a HogQLQuery", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      serverInsight({
        name: "Sessions",
        query: { kind: "HogQLQuery", query: "SELECT 1" },
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error(`Expected RenderedFile, got skipped: ${result.reason}`);
    expect(result.contents).toContain("import { hogql, insight }");
    expect(result.contents).toContain('hogql("SELECT 1")');
  });

  it("renderToFile warns and emits a raw object for unsupported queries", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      serverInsight({
        name: "Funnel",
        query: { kind: "FunnelsQuery", series: [] },
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Expected raw-fallback, not skipped");
    expect(ctx.warnings.some((w) => w.includes("FunnelsQuery"))).toBe(true);
    expect(result.contents).toContain("as unknown as");
  });

  it("renderToFile dedupes slugs across multiple calls", () => {
    const ctx = makeCtx();
    const a = renderToFile(serverInsight({ name: "Conv" }), ctx);
    const b = renderToFile(serverInsight({ id: 8, short_id: "xyz", name: "Conv" }), ctx);
    if ("skipped" in a || "skipped" in b) throw new Error("Unexpected skip");
    expect(a.filename).toBe("conv.ts");
    expect(b.filename).toBe("conv-2.ts");
  });

  it("renderToFile preserves user tags but drops iac:* ones", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      serverInsight({ tags: ["iac:insights:foo", "iac:hash:abcdef", "growth"] }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('tags: ["growth"]');
    expect(result.contents).not.toContain("iac:");
  });
});
