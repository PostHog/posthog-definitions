import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { propertyGroup, type PropertyGroup } from "./sdk.js";
import { type ServerPropertyGroup } from "./client.js";
import {
  propertyGroupHash,
  propertyGroupHashFromServer,
  propertyGroupKeyFromServer,
  stripMarker,
  validatePropertyGroups,
} from "./pipeline.js";

function spec(key: string, overrides: Partial<PropertyGroup> = {}): PropertyGroup {
  return propertyGroup({
    key,
    properties: {
      foo: { type: "String", required: true },
      bar: { type: "Numeric" },
    },
    ...overrides,
  });
}

function managedDescription(key: string, hash: string, userDescription = ""): string {
  const trailer = `<!-- iac:property-groups:${key} iac:hash:${hash} -->`;
  return userDescription ? `${userDescription}\n\n${trailer}` : trailer;
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  overrides: Partial<ServerPropertyGroup> = {},
): ServerPropertyGroup {
  return {
    id,
    name: key,
    description: managedDescription(key, hash),
    properties: [],
    ...overrides,
  };
}

function desiredFor(groups: PropertyGroup[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set("feature-flags", []);
  state.set("endpoints", []);
  state.set(
    "property-groups",
    groups.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerPropertyGroup[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", rows],
  ]);
}

describe("property group pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("billing")]), currentFor([]));
    const slice = result.get("property-groups")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect(slice.ops[0]!.key).toBe("billing");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("billing");
    const server = serverRow("uuid-1", "billing", propertyGroupHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("property-groups")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect(op.serverId).toBe("uuid-1");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("billing");
    const server = serverRow("uuid-1", "billing", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("property-groups")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect(op.serverId).toBe("uuid-1");
  });

  it("classifies a server-only managed group as an orphan", () => {
    const server = serverRow("uuid-ghost", "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("property-groups")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerPropertyGroup).id).toBe("uuid-ghost");
  });

  it("safety invariant: ignores server rows without the iac:* marker", () => {
    const handBuilt: ServerPropertyGroup = {
      id: "uuid-hand",
      name: "hand_built",
      description: "Some free-form description without any marker",
      properties: [],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("property-groups")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("extracts key and hash from a description with the marker", () => {
    const desc = managedDescription("my_key", "deadbeef", "hi");
    const server: ServerPropertyGroup = {
      id: "u",
      name: "my_key",
      description: desc,
      properties: [],
    };
    expect(propertyGroupKeyFromServer(server)).toBe("my_key");
    expect(propertyGroupHashFromServer(server)).toBe("deadbeef");
  });

  it("strips marker for display, preserving the user description", () => {
    const desc = managedDescription("k", "h", "User-facing description");
    expect(stripMarker(desc)).toBe("User-facing description");
  });
});

describe("property group validation", () => {
  it("rejects keys with invalid characters", () => {
    const issues = validatePropertyGroups([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });

  it("rejects duplicates", () => {
    const issues = validatePropertyGroups([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("rejects empty property maps", () => {
    const issues = validatePropertyGroups([propertyGroup({ key: "empty", properties: {} })]);
    expect(issues.some((m) => m.includes("at least one property"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validatePropertyGroups([spec("ok")])).toEqual([]);
  });
});
