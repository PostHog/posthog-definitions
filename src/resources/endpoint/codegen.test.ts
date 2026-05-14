import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullLabel, renderToFile, serverIdOf } from "./codegen.js";
import type { ServerEndpoint } from "./client.js";

function makeCtx(): PullRenderContext & { warnings: string[] } {
  const taken = new Set<string>();
  const warnings: string[] = [];
  return {
    warnings,
    uniqueSlug: (base) => {
      let s = base;
      let i = 2;
      while (taken.has(s)) s = `${base}-${i++}`;
      taken.add(s);
      return s;
    },
    importForServerId: () => {
      throw new Error("endpoint codegen should not call importForServerId");
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function endpoint(overrides: Partial<ServerEndpoint> = {}): ServerEndpoint {
  return {
    id: "uuid-abc",
    name: "weekly_signups",
    description: "",
    query: { kind: "HogQLQuery", query: "SELECT 1" },
    is_active: true,
    ...overrides,
  };
}

describe("endpoint codegen", () => {
  it("serverIdOf returns the name (the URL key)", () => {
    expect(serverIdOf(endpoint())).toBe("weekly_signups");
  });

  it("pullLabel marks inactive endpoints", () => {
    expect(pullLabel(endpoint({ is_active: false })).secondary).toBe("[inactive]");
    expect(pullLabel(endpoint()).secondary).toBeUndefined();
  });

  it("renderToFile emits endpoint() with the query", () => {
    const ctx = makeCtx();
    const result = renderToFile(endpoint(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("weekly-signups.ts");
    expect(result.contents).toContain('import { endpoint } from "@posthog/definitions";');
    expect(result.contents).toContain('name: "weekly_signups"');
    expect(result.contents).toContain('"SELECT 1"');
    expect(result.contents).toContain("export default endpoint(");
  });

  it("renderToFile carries through non-default fields", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      endpoint({
        is_active: false,
        is_materialized: true,
        data_freshness_seconds: 3600,
        derived_from_insight: "abc123",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("is_active: false");
    expect(result.contents).toContain("is_materialized: true");
    expect(result.contents).toContain("data_freshness_seconds: 3600");
    expect(result.contents).toContain('derived_from_insight: "abc123"');
  });

  it("renderToFile preserves user description, strips marker", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      endpoint({
        description: "User text.\n\n<!-- iac:endpoints:weekly-signups iac:hash:abcd -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "User text."');
    expect(result.contents).not.toContain("iac:");
  });
});
