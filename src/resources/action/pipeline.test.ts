import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { Action } from "./sdk.js";
import type { ServerAction } from "./client.js";
import { actionHash, validateActions } from "./pipeline.js";

function spec(key: string, overrides: Partial<Action> = {}): Action {
  return {
    key,
    name: `Action ${key}`,
    steps: [{ event: "$pageview", url: "/signup", url_matching: "contains" }],
    ...overrides,
  };
}

function serverRow(id: number, key: string, hash: string, extra: string[] = []): ServerAction {
  return {
    id,
    name: `Action ${key}`,
    description: "",
    steps: [{ event: "$pageview", url: "/signup", url_matching: "contains" }],
    tags: [`iac:actions:${key}`, `iac:hash:${hash}`, ...extra],
  };
}

function desiredFor(actions: Action[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "actions",
    actions.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerAction[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["actions", rows]]);
}

describe("action pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("signed-up")]), currentFor([]));
    const slice = result.get("actions")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect((slice.ops[0]!.spec as { key: string }).key).toBe("signed-up");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("signed-up");
    const server = serverRow(42, "signed-up", actionHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("actions")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect((op.server as { id: number | string }).id).toBe(42);
  });

  it("emits update when server hash differs", () => {
    const desired = spec("signed-up");
    const server = serverRow(42, "signed-up", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("actions")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect((op.server as { id: number | string }).id).toBe(42);
  });

  it("classifies a server-only managed action as an orphan", () => {
    const server = serverRow(99, "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("actions")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerAction).id).toBe(99);
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerAction = {
      id: 999,
      name: "Hand-built",
      description: "",
      steps: [{ event: "$autocapture" }],
      tags: ["marketing"],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("actions")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("action validation", () => {
  it("rejects keys that don't match the allowed pattern", () => {
    const issues = validateActions([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateActions([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("requires a non-empty name", () => {
    const issues = validateActions([spec("ok", { name: "" })]);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("requires at least one step", () => {
    const issues = validateActions([spec("nostep", { steps: [] })]);
    expect(issues.some((m) => m.includes("at least one step"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    const issues = validateActions([spec("ok")]);
    expect(issues).toEqual([]);
  });
});
