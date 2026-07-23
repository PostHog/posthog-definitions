import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf } from "./codegen.js";
import type { ServerAction } from "./client.js";

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
      throw new Error("action codegen should not call importForServerId");
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function serverAction(overrides: Partial<ServerAction> = {}): ServerAction {
  return {
    id: 1,
    name: "Signed up",
    description: "",
    tags: ["iac:actions:signed-up", "iac:hash:abcd1234"],
    steps: [{ event: "$autocapture", url: "/signup", url_matching: "contains" }],
    ...overrides,
  } as ServerAction;
}

describe("action codegen", () => {
  it("pullFilter drops deleted actions", () => {
    expect(pullFilter(serverAction({ deleted: true })).kept).toBe(false);
    expect(pullFilter(serverAction()).kept).toBe(true);
  });

  it("pullLabel surfaces user tags, hides managed ones", () => {
    expect(pullLabel(serverAction()).secondary).toBeUndefined();
    expect(
      pullLabel(serverAction({ tags: ["iac:actions:x", "iac:hash:y", "growth"] })).secondary,
    ).toBe("[growth]");
  });

  it("serverIdOf returns the numeric id", () => {
    expect(serverIdOf(serverAction({ id: 42 }))).toBe(42);
  });

  it("renderToFile emits an action with its steps, dropping null step fields", () => {
    const ctx = makeCtx();
    const result = renderToFile(serverAction(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("signed-up.ts");
    expect(result.contents).toContain('import { action } from "@posthog/definitions";');
    expect(result.contents).toContain('key: "signed-up"');
    expect(result.contents).toContain('event: "$autocapture"');
    expect(result.contents).toContain('url: "/signup"');
    // Managed tags never leak into the rendered file.
    expect(result.contents).not.toContain("iac:");
    // Unpopulated step fields (selector, text, href, …) are omitted.
    expect(result.contents).not.toContain("selector");
  });

  it("renderToFile preserves user tags", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      serverAction({ tags: ["iac:actions:signed-up", "iac:hash:y", "growth", "billing"] }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('tags: ["growth", "billing"]');
  });

  it("renderToFile skips actions with no steps", () => {
    const ctx = makeCtx();
    const result = renderToFile(serverAction({ steps: [] }), ctx);
    expect("skipped" in result).toBe(true);
  });
});
