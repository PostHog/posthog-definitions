import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile } from "./codegen.js";
import type { ServerCohort } from "./client.js";

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
      throw new Error("cohort codegen should not call importForServerId");
    },
    importForServerIdOptional: () => undefined,
    warn: (m) => warnings.push(m),
  };
}

function cohort(overrides: Partial<ServerCohort> = {}): ServerCohort {
  return {
    id: 1,
    name: "EU customers",
    description: "",
    is_static: false,
    filters: {
      properties: {
        type: "AND",
        values: [
          { type: "person", key: "$geoip_country_code", operator: "exact", value: ["DE", "FR"] },
        ],
      },
    },
    ...overrides,
  } as ServerCohort;
}

describe("cohort codegen", () => {
  it("pullFilter drops deleted cohorts", () => {
    expect(pullFilter(cohort({ deleted: true })).kept).toBe(false);
    expect(pullFilter(cohort()).kept).toBe(true);
  });

  it("pullLabel marks static cohorts", () => {
    expect(pullLabel(cohort({ is_static: true })).secondary).toBe("[static]");
    expect(pullLabel(cohort()).secondary).toBeUndefined();
  });

  it("renderToFile emits behavioral cohort with filters", () => {
    const ctx = makeCtx();
    const result = renderToFile(cohort(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("eu-customers.ts");
    expect(result.contents).toContain('import { cohort } from "@posthog/definitions";');
    expect(result.contents).toContain('key: "eu-customers"');
    expect(result.contents).toContain('type: "AND"');
    expect(result.contents).toContain('"DE"');
  });

  it("renderToFile emits is_static and warns about membership", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      cohort({ name: "Paying users", is_static: true, filters: null }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("is_static: true");
    expect(ctx.warnings.some((w) => w.includes("static"))).toBe(true);
  });

  it("renderToFile preserves user description, drops the trailing marker", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      cohort({
        description:
          "Hand-written description.\n\n<!-- iac:cohorts:eu-customers iac:hash:abcd1234 -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "Hand-written description."');
    expect(result.contents).not.toContain("iac:");
  });

  it("renderToFile skips when there's nothing to render", () => {
    const ctx = makeCtx();
    const result = renderToFile(cohort({ filters: null, is_static: false }), ctx);
    expect("skipped" in result).toBe(true);
  });
});
