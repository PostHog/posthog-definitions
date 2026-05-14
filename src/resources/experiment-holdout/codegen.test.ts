import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf } from "./codegen.js";
import type { ServerExperimentHoldout } from "./client.js";

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
    importForServerId: (rn, id) => {
      throw new Error(`no imports expected (${rn}/${id})`);
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function holdout(overrides: Partial<ServerExperimentHoldout> = {}): ServerExperimentHoldout {
  return {
    id: 42,
    name: "Beta excludes",
    description: "",
    filters: [{ properties: [], rollout_percentage: 10 }],
    ...overrides,
  } as ServerExperimentHoldout;
}

describe("experiment-holdout codegen", () => {
  it("pullFilter keeps all holdouts", () => {
    expect(pullFilter(holdout()).kept).toBe(true);
  });

  it("pullLabel shows name", () => {
    expect(pullLabel(holdout()).primary).toBe("Beta excludes");
  });

  it("serverIdOf returns numeric id", () => {
    expect(serverIdOf(holdout({ id: 7 }))).toBe(7);
  });

  it("renderToFile emits experimentHoldout() with filters", () => {
    const ctx = makeCtx();
    const result = renderToFile(holdout(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("beta-excludes.ts");
    expect(result.contents).toContain(
      'import { experimentHoldout } from "@posthog/definitions";',
    );
    expect(result.contents).toContain('key: "beta-excludes"');
    expect(result.contents).toContain('name: "Beta excludes"');
    expect(result.contents).toContain("rollout_percentage");
  });

  it("renderToFile strips description marker", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      holdout({
        description:
          "Excludes for billing experiment\n\n<!-- iac:experiment-holdouts:beta iac:hash:abc -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "Excludes for billing experiment"');
    expect(result.contents).not.toContain("iac:");
  });
});
