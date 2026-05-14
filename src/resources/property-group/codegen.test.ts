import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf } from "./codegen.js";
import type { ServerPropertyGroup } from "./client.js";

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

function group(overrides: Partial<ServerPropertyGroup> = {}): ServerPropertyGroup {
  return {
    id: "uuid-pg-1",
    name: "billing",
    description: "",
    properties: [
      {
        id: "p1",
        name: "plan",
        property_type: "String",
        is_required: true,
        is_optional_in_types: false,
        description: "",
      },
    ],
    ...overrides,
  } as ServerPropertyGroup;
}

describe("property-group codegen", () => {
  it("pullFilter keeps all groups", () => {
    expect(pullFilter(group()).kept).toBe(true);
  });

  it("pullLabel shows name + property count", () => {
    const l = pullLabel(group());
    expect(l.primary).toBe("billing");
    expect(l.secondary).toBe("[1 props]");
  });

  it("serverIdOf returns the uuid", () => {
    expect(serverIdOf(group({ id: "abc-123" }))).toBe("abc-123");
  });

  it("renderToFile emits propertyGroup() with sorted properties", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      group({
        properties: [
          {
            id: "p2",
            name: "amount",
            property_type: "Numeric",
            is_required: false,
            is_optional_in_types: false,
            description: "",
          },
          {
            id: "p1",
            name: "plan",
            property_type: "String",
            is_required: true,
            is_optional_in_types: false,
            description: "Active plan",
          },
        ],
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("billing.ts");
    expect(result.specKey).toBe("billing");
    expect(result.contents).toContain(
      'import { propertyGroup } from "@posthog/definitions";',
    );
    expect(result.contents).toContain('key: "billing"');
    // amount appears before plan (sorted)
    const amountIdx = result.contents.indexOf("amount:");
    const planIdx = result.contents.indexOf("plan:");
    expect(amountIdx).toBeGreaterThan(-1);
    expect(planIdx).toBeGreaterThan(amountIdx);
    expect(result.contents).toContain('type: "String"');
    expect(result.contents).toContain('type: "Numeric"');
    expect(result.contents).toContain("required: true");
    expect(result.contents).toContain('description: "Active plan"');
  });

  it("renderToFile strips description marker and keeps user description", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      group({
        description:
          "Billing properties\n\n<!-- iac:property-groups:billing iac:hash:abc123 -->",
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('description: "Billing properties"');
    expect(result.contents).not.toContain("iac:");
  });

  it("renderToFile skips when the group has no properties", () => {
    const ctx = makeCtx();
    const result = renderToFile(group({ properties: [] }), ctx);
    expect("skipped" in result).toBe(true);
  });

  it("renderToFile quotes property keys that aren't valid identifiers", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      group({
        properties: [
          {
            id: "p1",
            name: "$current_url",
            property_type: "String",
            is_required: false,
            is_optional_in_types: false,
            description: "",
          },
        ],
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    // $current_url has $ which IS a valid JS identifier start, so unquoted
    expect(result.contents).toContain("$current_url:");
  });

  it("renderToFile quotes property keys with hyphens", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      group({
        properties: [
          {
            id: "p1",
            name: "plan-id",
            property_type: "String",
            is_required: false,
            is_optional_in_types: false,
            description: "",
          },
        ],
      }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('"plan-id":');
  });
});
