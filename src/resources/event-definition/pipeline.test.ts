import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { propertyGroup } from "../property-group/sdk.js";
import { eventDefinition, type EventDefinition } from "./sdk.js";
import type { ServerEventDefinition } from "./client.js";
import { eventDefinitionHash, validateEventDefinitions } from "./pipeline.js";

const billing = propertyGroup({
  key: "billing",
  properties: { plan: { type: "String", required: true } },
});

function spec(key: string, overrides: Partial<EventDefinition> = {}): EventDefinition {
  return eventDefinition({
    key,
    name: key,
    ...overrides,
  });
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  overrides: Partial<ServerEventDefinition> = {},
): ServerEventDefinition {
  return {
    id,
    name: key,
    tags: [`iac:event-definitions:${key}`, `iac:hash:${hash}`],
    ...overrides,
  };
}

function desiredFor(events: EventDefinition[], groups: typeof billing[] = []): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set("feature-flags", []);
  state.set("endpoints", []);
  state.set(
    "property-groups",
    groups.map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "event-definitions",
    events.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerEventDefinition[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", []],
    ["event-definitions", rows],
  ]);
}

describe("event definition pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("signup")]), currentFor([]));
    const slice = result.get("event-definitions")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect((slice.ops[0]!.spec as { key: string }).key).toBe("signup");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("signup");
    const server = serverRow("uuid-1", "signup", eventDefinitionHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("event-definitions")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect((op.server as { id: number | string }).id).toBe("uuid-1");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("signup");
    const server = serverRow("uuid-1", "signup", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("event-definitions")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect((op.server as { id: number | string }).id).toBe("uuid-1");
  });

  it("emits update when propertyGroups change (so links get reconciled)", () => {
    const before = spec("signup");
    const after = spec("signup", { propertyGroups: [billing] });
    expect(eventDefinitionHash(before)).not.toBe(eventDefinitionHash(after));
  });

  it("classifies server-only managed event as orphan", () => {
    const server = serverRow("uuid-ghost", "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("event-definitions")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerEventDefinition).id).toBe("uuid-ghost");
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerEventDefinition = {
      id: "uuid-hand",
      name: "hand_built",
      tags: ["someTag"],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("event-definitions")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("event definition validation", () => {
  it("rejects duplicate keys", () => {
    const issues = validateEventDefinitions(
      [spec("dup"), spec("dup")],
      desiredFor([spec("dup"), spec("dup")]),
    );
    expect(issues.some((m) => m.includes("Duplicate event definition key"))).toBeTruthy();
  });

  it("rejects duplicate event names", () => {
    const issues = validateEventDefinitions(
      [spec("a", { name: "signup" }), spec("b", { name: "signup" })],
      desiredFor([spec("a", { name: "signup" }), spec("b", { name: "signup" })]),
    );
    expect(issues.some((m) => m.includes("Duplicate event definition name"))).toBeTruthy();
  });

  it("rejects references to undeclared property groups", () => {
    const undeclared = propertyGroup({
      key: "undeclared",
      properties: { x: { type: "String" } },
    });
    const issues = validateEventDefinitions(
      [spec("signup", { propertyGroups: [undeclared] })],
      desiredFor([spec("signup", { propertyGroups: [undeclared] })]),
    );
    expect(issues.some((m) => m.includes("unknown property group"))).toBeTruthy();
  });

  it("accepts a valid event referencing a declared property group", () => {
    const issues = validateEventDefinitions(
      [spec("signup", { propertyGroups: [billing] })],
      desiredFor([spec("signup", { propertyGroups: [billing] })], [billing]),
    );
    expect(issues).toEqual([]);
  });
});
