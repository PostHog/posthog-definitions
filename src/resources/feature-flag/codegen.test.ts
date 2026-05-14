import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile } from "./codegen.js";
import type { ServerFeatureFlag } from "./client.js";

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
      throw new Error("flag codegen should not call importForServerId");
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function flag(overrides: Partial<ServerFeatureFlag> = {}): ServerFeatureFlag {
  return {
    id: 1,
    key: "new-onboarding",
    name: "New onboarding",
    filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
    active: true,
    tags: [],
    ...overrides,
  } as ServerFeatureFlag;
}

describe("feature-flag codegen", () => {
  it("pullFilter drops soft-deleted flags", () => {
    expect(pullFilter(flag({ deleted: true })).kept).toBe(false);
    expect(pullFilter(flag()).kept).toBe(true);
  });

  it("pullLabel surfaces name then user tags", () => {
    const label = pullLabel(flag({ tags: ["iac:feature-flags:x", "growth"] }));
    expect(label.primary).toBe("New onboarding");
    expect(label.secondary).toBe("[growth]");
  });

  it("renderToFile emits a featureFlag() call carrying the key", () => {
    const ctx = makeCtx();
    const result = renderToFile(flag(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("new-onboarding.ts");
    expect(result.specKey).toBe("new-onboarding");
    expect(result.contents).toContain('import { featureFlag } from "@posthog/definitions";');
    expect(result.contents).toContain('key: "new-onboarding"');
    expect(result.contents).toContain("rollout_percentage: 100");
    expect(result.contents).toContain("export default featureFlag(");
  });

  it("renderToFile carries non-default config fields", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      flag({
        ensure_experience_continuity: true,
        evaluation_runtime: "server",
        bucketing_identifier: "device_id",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("ensure_experience_continuity: true");
    expect(result.contents).toContain('evaluation_runtime: "server"');
    expect(result.contents).toContain('bucketing_identifier: "device_id"');
  });

  it("renderToFile strips iac:* tags, keeps user tags", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      flag({ tags: ["iac:feature-flags:foo", "iac:hash:abcdef", "growth"] }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('tags: ["growth"]');
    expect(result.contents).not.toContain("iac:");
  });

  it("renderToFile warns on encrypted payloads", () => {
    const ctx = makeCtx();
    renderToFile(flag({ has_encrypted_payloads: true }), ctx);
    expect(ctx.warnings.some((w) => w.includes("encrypted"))).toBe(true);
  });
});
