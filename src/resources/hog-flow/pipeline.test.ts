import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { HogFlow } from "./sdk.js";
import type { ServerHogFlow } from "./client.js";
import { hogFlowHash, validateHogFlows } from "./pipeline.js";

function spec(key: string, overrides: Partial<HogFlow> = {}): HogFlow {
  return {
    key,
    name: `Flow ${key}`,
    actions: [
      { id: "t", type: "trigger", name: "Trigger", config: { type: "event", filters: {} } },
      { id: "x", type: "exit", name: "Exit", config: { reason: "done" } },
    ],
    edges: [{ from: "t", to: "x", type: "continue" }],
    ...overrides,
  };
}

function serverRow(id: string, key: string, hash: string): ServerHogFlow {
  return {
    id,
    name: `Flow ${key}`,
    description: `<!-- iac:hog-flows:${key} iac:hash:${hash} -->`,
    status: "draft",
    actions: [{ id: "t", type: "trigger" }],
    edges: [],
  };
}

function desiredFor(specs: HogFlow[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "hog-flows",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerHogFlow[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["hog-flows", rows]]);
}

describe("hog-flow pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("welcome")]), currentFor([])).get("hog-flows")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("welcome");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("u1", "welcome", hogFlowHash(desired))]),
    ).get("hog-flows")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("welcome")]),
      currentFor([serverRow("u1", "welcome", "stale00000000")]),
    ).get("hog-flows")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash ignores server-set action created_at/updated_at", () => {
    const clean = spec("welcome");
    const withStamps = spec("welcome", {
      actions: clean.actions.map((a) => ({ ...a, created_at: 123, updated_at: 456 })),
    });
    expect(hogFlowHash(clean)).toBe(hogFlowHash(withStamps));
  });

  it("hash changes when the graph changes", () => {
    const a = spec("welcome");
    const b = spec("welcome", { edges: [{ from: "t", to: "x", type: "branch", index: 0 }] });
    expect(hogFlowHash(a)).not.toBe(hogFlowHash(b));
  });

  it("classifies a server-only managed flow as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("gh", "ghost", "any")])).get(
      "hog-flows",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerHogFlow = {
      id: "hb",
      name: "Hand-built",
      description: "a campaign someone built in the UI",
      status: "active",
      actions: [{ id: "t", type: "trigger" }],
      edges: [],
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("hog-flows")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("hog-flow validation", () => {
  it("requires exactly one trigger action", () => {
    const issues = validateHogFlows([
      spec("two", {
        actions: [
          { id: "t1", type: "trigger", config: {} },
          { id: "t2", type: "trigger", config: {} },
        ],
        edges: [],
      }),
    ]);
    expect(issues.some((m) => m.includes("exactly one action with type \"trigger\""))).toBeTruthy();
  });

  it("rejects an edge referencing an unknown action id", () => {
    const issues = validateHogFlows([
      spec("bad", { edges: [{ from: "t", to: "nope", type: "continue" }] }),
    ]);
    expect(issues.some((m) => m.includes('"to" does not reference'))).toBeTruthy();
  });

  it("rejects duplicate action ids", () => {
    const issues = validateHogFlows([
      spec("dupids", {
        actions: [
          { id: "t", type: "trigger", config: {} },
          { id: "t", type: "exit", config: {} },
        ],
        edges: [],
      }),
    ]);
    expect(issues.some((m) => m.includes("duplicate action id"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validateHogFlows([spec("ok")])).toEqual([]);
  });
});
