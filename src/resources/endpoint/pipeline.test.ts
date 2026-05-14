import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { hogql } from "../insight/sdk.js";
import { type Endpoint } from "./sdk.js";
import { type ServerEndpoint } from "./client.js";
import {
  endpointHash,
  endpointHashFromServer,
  endpointKeyFromServer,
  stripMarker,
} from "./pipeline.js";

function spec(key: string, name = key): Endpoint {
  return { key, name, query: hogql("SELECT 1") };
}

function managedDescription(key: string, hash: string, userDescription = ""): string {
  const trailer = `<!-- iac:endpoints:${key} iac:hash:${hash} -->`;
  return userDescription ? `${userDescription}\n\n${trailer}` : trailer;
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  overrides: Partial<ServerEndpoint> = {},
): ServerEndpoint {
  return {
    id,
    name: key,
    description: managedDescription(key, hash),
    query: { kind: "HogQLQuery", query: "SELECT 1" },
    is_active: true,
    is_materialized: false,
    derived_from_insight: null,
    data_freshness_seconds: null,
    bucket_overrides: null,
    ...overrides,
  };
}

function desiredFor(endpoints: Endpoint[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set(
    "endpoints",
    endpoints.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerEndpoint[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["endpoints", rows],
  ]);
}

describe("endpoint pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("weekly_signups")]), currentFor([]));
    const slice = result.get("endpoints")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect((slice.ops[0]!.spec as { key: string }).key).toBe("weekly_signups");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("weekly_signups");
    const server = serverRow("uuid-1", "weekly_signups", endpointHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("endpoints")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect((op.server as { id: number | string }).id).toBe("uuid-1");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("weekly_signups");
    const server = serverRow("uuid-1", "weekly_signups", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("endpoints")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect((op.server as { id: number | string }).id).toBe("uuid-1");
  });

  it("classifies a server-only managed endpoint as an orphan", () => {
    const server = serverRow("uuid-ghost", "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("endpoints")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerEndpoint).id).toBe("uuid-ghost");
  });

  it("safety invariant: ignores server rows without the iac:* marker", () => {
    const handBuilt: ServerEndpoint = {
      id: "uuid-hand",
      name: "hand_built",
      description: "Some free-form description without any marker",
      query: { kind: "HogQLQuery", query: "SELECT 1" },
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("endpoints")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("safety invariant: ignores server rows with marker NOT at the trailing position", () => {
    const tampered: ServerEndpoint = {
      id: "uuid-tampered",
      name: "tampered",
      description: "<!-- iac:endpoints:foo iac:hash:abc --> followed by extra text",
      query: { kind: "HogQLQuery", query: "SELECT 1" },
    };
    const result = diff(desiredFor([]), currentFor([tampered]));
    const slice = result.get("endpoints")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("strips marker for display, preserving the user description", () => {
    const desc = managedDescription("k", "h", "User-facing description");
    expect(stripMarker(desc)).toBe("User-facing description");
  });

  it("strips marker even with no user description, returning null", () => {
    const desc = managedDescription("k", "h", "");
    expect(stripMarker(desc)).toBe(null);
  });

  it("extracts key and hash from a description with the marker", () => {
    const desc = managedDescription("my_key", "deadbeef", "hi");
    const server: ServerEndpoint = {
      id: "u",
      name: "my_key",
      description: desc,
      query: {},
    };
    expect(endpointKeyFromServer(server)).toBe("my_key");
    expect(endpointHashFromServer(server)).toBe("deadbeef");
  });
});
