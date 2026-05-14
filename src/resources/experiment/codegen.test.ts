import { describe, expect, it } from "vitest";
import type { ImportEntry, PullRenderContext } from "../../pull/types.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
} from "./codegen.js";
import type { ServerExperiment } from "./client.js";

function makeCtx(
  imports: Map<string, Map<string, ImportEntry>> = new Map(),
): PullRenderContext & { warnings: string[] } {
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
      const e = imports.get(rn)?.get(String(id));
      if (!e) throw new Error(`missing import ${rn}/${id}`);
      return e;
    },
    importForServerIdOptional: (rn, id) => imports.get(rn)?.get(String(id)),
    warn: (m) => warnings.push(m),
  };
}

function experimentRow(overrides: Partial<ServerExperiment> = {}): ServerExperiment {
  return {
    id: 50,
    name: "Signup CTA",
    description: "",
    feature_flag_key: "signup-cta-test",
    archived: false,
    metrics: [],
    metrics_secondary: [],
    saved_metrics: [],
    feature_flag: { id: 200, key: "signup-cta-test", active: true },
    ...overrides,
  } as ServerExperiment;
}

function flagImport(id: number, key: string): Map<string, ImportEntry> {
  return new Map([[
    String(id),
    {
      key,
      varName: key.replace(/-/g, "_"),
      filename: `${key}.ts`,
      resourceName: "feature-flags",
    },
  ]]);
}

describe("experiment codegen", () => {
  it("pullFilter keeps all experiments", () => {
    expect(pullFilter(experimentRow()).kept).toBe(true);
  });

  it("pullLabel shows name + status", () => {
    const l = pullLabel(experimentRow({ status: "running" }));
    expect(l.primary).toBe("Signup CTA");
    expect(l.secondary).toBe("[running]");
  });

  it("serverIdOf returns numeric id", () => {
    expect(serverIdOf(experimentRow({ id: 7 }))).toBe(7);
  });

  it("pullDependencies yields flag + holdout + saved metric ids", async () => {
    const deps = await pullDependencies({} as never, experimentRow({
      holdout_id: 33,
      saved_metrics: [
        { saved_metric: 11, metadata: { type: "primary" } },
        { saved_metric: 12, metadata: { type: "secondary" } },
      ],
    }));
    expect(deps).toEqual([
      { resourceName: "feature-flags", serverId: 200 },
      { resourceName: "experiment-holdouts", serverId: 33 },
      { resourceName: "experiment-saved-metrics", serverId: 11 },
      { resourceName: "experiment-saved-metrics", serverId: 12 },
    ]);
  });

  it("renderToFile emits experiment() with flag import wired", () => {
    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set("feature-flags", flagImport(200, "signup-cta-test"));
    const ctx = makeCtx(imports);
    const result = renderToFile(experimentRow(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("signup-cta.ts");
    expect(result.contents).toContain('import { experiment } from "@posthog/definitions";');
    expect(result.contents).toContain(
      'import signup_cta_test from "../feature-flags/signup-cta-test.js";',
    );
    expect(result.contents).toContain("featureFlag: signup_cta_test");
    expect(result.contents).toContain('name: "Signup CTA"');
  });

  it("renderToFile resolves holdout + primary/secondary saved metrics", () => {
    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set("feature-flags", flagImport(200, "signup-cta-test"));
    imports.set(
      "experiment-holdouts",
      new Map([
        [
          "33",
          {
            key: "beta-excludes",
            varName: "beta_excludes",
            filename: "beta-excludes.ts",
            resourceName: "experiment-holdouts",
          },
        ],
      ]),
    );
    imports.set(
      "experiment-saved-metrics",
      new Map([
        [
          "11",
          {
            key: "signup-conversion",
            varName: "signup_conversion",
            filename: "signup-conversion.ts",
            resourceName: "experiment-saved-metrics",
          },
        ],
        [
          "12",
          {
            key: "revenue",
            varName: "revenue",
            filename: "revenue.ts",
            resourceName: "experiment-saved-metrics",
          },
        ],
      ]),
    );
    const ctx = makeCtx(imports);
    const result = renderToFile(
      experimentRow({
        holdout_id: 33,
        saved_metrics: [
          { saved_metric: 11, metadata: { type: "primary" } },
          { saved_metric: 12, metadata: { type: "secondary" } },
        ],
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("holdout: beta_excludes");
    expect(result.contents).toContain("primarySavedMetrics: [signup_conversion]");
    expect(result.contents).toContain("secondarySavedMetrics: [revenue]");
    expect(result.contents).toContain(
      'import beta_excludes from "../experiment-holdouts/beta-excludes.js";',
    );
    expect(result.contents).toContain(
      'import signup_conversion from "../experiment-saved-metrics/signup-conversion.js";',
    );
  });

  it("renderToFile skips when the feature flag wasn't pulled", () => {
    const ctx = makeCtx();
    const result = renderToFile(experimentRow(), ctx);
    expect("skipped" in result).toBe(true);
    expect(ctx.warnings.some((w) => w.includes("signup-cta-test"))).toBe(true);
  });

  it("renderToFile carries lifecycle, archived, and conclusion", () => {
    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set("feature-flags", flagImport(200, "signup-cta-test"));
    const ctx = makeCtx(imports);
    const result = renderToFile(
      experimentRow({
        status: "stopped",
        archived: true,
        conclusion: "won",
        conclusion_comment: "Test variant won by 12%",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('lifecycle: "stopped"');
    expect(result.contents).toContain("archived: true");
    expect(result.contents).toContain('conclusion: "won"');
    expect(result.contents).toContain('conclusionComment: "Test variant won by 12%"');
  });

  it("renderToFile strips description marker", () => {
    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set("feature-flags", flagImport(200, "signup-cta-test"));
    const ctx = makeCtx(imports);
    const result = renderToFile(
      experimentRow({
        description:
          "Q1 onboarding test\n\n<!-- iac:experiments:signup iac:hash:abc -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "Q1 onboarding test"');
    expect(result.contents).not.toContain("iac:");
  });
});
