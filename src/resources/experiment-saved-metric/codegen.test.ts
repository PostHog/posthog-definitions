import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf } from "./codegen.js";
import type { ServerExperimentSavedMetric } from "./client.js";

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

function metric(
  overrides: Partial<ServerExperimentSavedMetric> = {},
): ServerExperimentSavedMetric {
  return {
    id: 99,
    name: "Signup conversion",
    description: "",
    query: { kind: "ExperimentMetric", metric_type: "funnel" },
    ...overrides,
  } as ServerExperimentSavedMetric;
}

describe("experiment-saved-metric codegen", () => {
  it("pullFilter keeps all metrics", () => {
    expect(pullFilter(metric()).kept).toBe(true);
  });

  it("pullLabel shows name + metric type", () => {
    const l = pullLabel(metric());
    expect(l.primary).toBe("Signup conversion");
    expect(l.secondary).toBe("[funnel]");
  });

  it("serverIdOf returns numeric id", () => {
    expect(serverIdOf(metric({ id: 11 }))).toBe(11);
  });

  it("renderToFile emits experimentSavedMetric() with query body", () => {
    const ctx = makeCtx();
    const result = renderToFile(metric(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("signup-conversion.ts");
    expect(result.contents).toContain(
      'import { experimentSavedMetric } from "@posthog/definitions";',
    );
    expect(result.contents).toContain('key: "signup-conversion"');
    expect(result.contents).toContain('name: "Signup conversion"');
    expect(result.contents).toContain("ExperimentMetric");
    expect(result.contents).toContain('"funnel"');
  });

  it("renderToFile strips description marker", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      metric({
        description:
          "Primary signup metric\n\n<!-- iac:experiment-saved-metrics:foo iac:hash:abc -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "Primary signup metric"');
    expect(result.contents).not.toContain("iac:");
  });
});
