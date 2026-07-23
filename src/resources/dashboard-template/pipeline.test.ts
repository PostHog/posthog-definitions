import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { DashboardTemplate } from "./sdk.js";
import type { ServerDashboardTemplate } from "./client.js";
import { dashboardTemplateHash, validateDashboardTemplates } from "./pipeline.js";

function spec(key: string, overrides: Partial<DashboardTemplate> = {}): DashboardTemplate {
  return {
    key,
    name: `Template ${key}`,
    tiles: [{ type: "INSIGHT", name: "Signups", query: { kind: "TrendsQuery", series: [] } }],
    ...overrides,
  };
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  extra: string[] = [],
): ServerDashboardTemplate {
  return {
    id,
    template_name: `Template ${key}`,
    dashboard_description: "",
    tiles: [{ type: "INSIGHT", name: "Signups", query: { kind: "TrendsQuery", series: [] } }],
    dashboard_filters: {},
    scope: "team",
    tags: [`iac:dashboard-templates:${key}`, `iac:hash:${hash}`, ...extra],
  };
}

function desiredFor(specs: DashboardTemplate[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "dashboard-templates",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerDashboardTemplate[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["dashboard-templates", rows]]);
}

describe("dashboard-template pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("growth")]), currentFor([]));
    const slice = result.get("dashboard-templates")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect((slice.ops[0]!.spec as { key: string }).key).toBe("growth");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("growth");
    const server = serverRow("abc", "growth", dashboardTemplateHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("dashboard-templates")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect((op.server as { id: string }).id).toBe("abc");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("growth");
    const server = serverRow("abc", "growth", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("dashboard-templates")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect((op.server as { id: string }).id).toBe("abc");
  });

  it("classifies a server-only managed template as an orphan", () => {
    const server = serverRow("z9", "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("dashboard-templates")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerDashboardTemplate).id).toBe("z9");
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerDashboardTemplate = {
      id: "hand",
      template_name: "Hand-built",
      dashboard_description: "",
      tiles: [],
      tags: ["curated"],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("dashboard-templates")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("dashboard-template validation", () => {
  it("rejects keys that don't match the allowed pattern", () => {
    const issues = validateDashboardTemplates([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateDashboardTemplates([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("requires a non-empty name", () => {
    const issues = validateDashboardTemplates([spec("ok", { name: "" })]);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("requires at least one tile", () => {
    const issues = validateDashboardTemplates([spec("notile", { tiles: [] })]);
    expect(issues.some((m) => m.includes("at least one tile"))).toBeTruthy();
  });

  it("rejects a non-team scope (global/official templates are read-only)", () => {
    const issues = validateDashboardTemplates([
      spec("official", { scope: "global" as DashboardTemplate["scope"] }),
    ]);
    expect(issues.some((m) => m.includes("only project-scoped"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    const issues = validateDashboardTemplates([spec("ok")]);
    expect(issues).toEqual([]);
  });
});
