import { describe, expect, it } from "vitest";
import type { ImportEntry, PullRenderContext } from "../../pull/types.js";
import { _testHooks, pullLabel, renderToFile } from "./codegen.js";
import type { ServerEventDefinition } from "./client.js";

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
      const entry = imports.get(rn)?.get(String(id));
      if (!entry) throw new Error(`missing import ${rn}/${id}`);
      return entry;
    },
    importForServerIdOptional: (rn, id) => imports.get(rn)?.get(String(id)),
    warn: (m) => warnings.push(m),
  };
}

function eventDef(overrides: Partial<ServerEventDefinition> = {}): ServerEventDefinition {
  return {
    id: "uuid-evt-1",
    name: "user_signed_up",
    description: "",
    tags: [],
    ...overrides,
  } as ServerEventDefinition;
}

describe("event-definition codegen", () => {
  it("pullLabel surfaces name + user tags", () => {
    const label = pullLabel(
      eventDef({ tags: ["iac:event-definitions:foo", "growth"] }),
    );
    expect(label.primary).toBe("user_signed_up");
    expect(label.secondary).toBe("[growth]");
  });

  it("renderToFile emits eventDefinition() with no property groups", () => {
    const ctx = makeCtx();
    const result = renderToFile(eventDef(), ctx);
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("user-signed-up.ts");
    expect(result.contents).toContain('import { eventDefinition } from "@posthog/definitions";');
    expect(result.contents).toContain('name: "user_signed_up"');
    expect(result.contents).not.toContain("propertyGroups");
  });

  it("renderToFile imports linked property groups via the side-channel cache", () => {
    const server = eventDef();
    _testHooks.setLinkedGroupIds(server, ["pg-uuid-1", "pg-uuid-2"]);

    const imports = new Map<string, Map<string, ImportEntry>>();
    imports.set(
      "property-groups",
      new Map([
        [
          "pg-uuid-1",
          {
            key: "billing",
            varName: "billing",
            filename: "billing.ts",
            resourceName: "property-groups",
          },
        ],
        [
          "pg-uuid-2",
          {
            key: "identity",
            varName: "identity",
            filename: "identity.ts",
            resourceName: "property-groups",
          },
        ],
      ]),
    );
    const ctx = makeCtx(imports);
    const result = renderToFile(server, ctx);
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('import billing from "../property-groups/billing.js";');
    expect(result.contents).toContain('import identity from "../property-groups/identity.js";');
    expect(result.contents).toContain("propertyGroups: [");
    expect(result.contents).toContain("billing");
    expect(result.contents).toContain("identity");
  });

  it("renderToFile warns when a linked group wasn't pulled", () => {
    const server = eventDef();
    _testHooks.setLinkedGroupIds(server, ["missing-pg"]);
    const ctx = makeCtx();
    const result = renderToFile(server, ctx);
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(ctx.warnings.some((w) => w.includes("missing-pg"))).toBe(true);
    expect(result.contents).not.toContain("propertyGroups: [");
  });

  it("renderToFile carries enforcement_mode and primary_property", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      eventDef({ enforcement_mode: "reject", primary_property: "$pathname" }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('enforcementMode: "reject"');
    expect(result.contents).toContain('primaryProperty: "$pathname"');
  });

  it("renderToFile strips iac:* tags, keeps user tags", () => {
    const ctx = makeCtx();
    const result = renderToFile(
      eventDef({ tags: ["iac:event-definitions:foo", "iac:hash:abc", "marketing"] }),
      ctx,
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain('tags: ["marketing"]');
    expect(result.contents).not.toContain("iac:");
  });
});
