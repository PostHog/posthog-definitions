import { describe, expect, it } from "vitest";
import type { DesiredState } from "../resources/types.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { diff } from "./diff.js";

type Spec = { key: string; hash?: string };
type Server = { id: number; key?: string; hash?: string };

function desiredState(byResource: Record<string, Spec[]>): DesiredState {
  const state: DesiredState = new Map();
  for (const [name, specs] of Object.entries(byResource)) {
    state.set(
      name,
      specs.map((spec) => ({ path: `<test:${name}>`, spec })),
    );
  }
  return state;
}

const fakeAlpha = makeFakeResource<Spec, Server>({ name: "alpha" });

describe("diff", () => {
  it("classifies a spec with no matching server row as create", () => {
    const result = diff(
      desiredState({ alpha: [{ key: "a", hash: "h1" }] }),
      new Map([["alpha", []]]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.ops).toEqual([
      { kind: "create", key: "a", spec: { key: "a", hash: "h1" }, hash: "h1" },
    ]);
  });

  it("classifies a spec whose server hash matches as unchanged", () => {
    const result = diff(
      desiredState({ alpha: [{ key: "a", hash: "h1" }] }),
      new Map([["alpha", [{ id: 7, key: "a", hash: "h1" }]]]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.ops).toEqual([
      { kind: "unchanged", key: "a", spec: { key: "a", hash: "h1" }, serverId: 7 },
    ]);
  });

  it("classifies a spec whose server hash differs as update, carrying the server row", () => {
    const server: Server = { id: 7, key: "a", hash: "h-old" };
    const result = diff(
      desiredState({ alpha: [{ key: "a", hash: "h-new" }] }),
      new Map([["alpha", [server]]]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.ops).toEqual([
      {
        kind: "update",
        key: "a",
        spec: { key: "a", hash: "h-new" },
        hash: "h-new",
        serverId: 7,
        server,
      },
    ]);
  });

  it("collects server rows with no matching desired spec as orphans", () => {
    const orphan1: Server = { id: 1, key: "ghost-1", hash: "h" };
    const orphan2: Server = { id: 2, key: "ghost-2", hash: "h" };
    const live: Server = { id: 3, key: "kept", hash: "h" };
    const result = diff(
      desiredState({ alpha: [{ key: "kept", hash: "h" }] }),
      new Map([["alpha", [orphan1, live, orphan2]]]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.orphans).toEqual([orphan1, orphan2]);
  });

  it("ignores server rows whose keyFromServer returns undefined (unmanaged)", () => {
    const result = diff(
      desiredState({ alpha: [] }),
      new Map([["alpha", [{ id: 99 } as Server]]]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.orphans).toEqual([]);
    expect(result.get("alpha")?.ops).toEqual([]);
  });

  it("emits ops in desired-spec order, independent of server order", () => {
    const result = diff(
      desiredState({
        alpha: [
          { key: "a", hash: "h" },
          { key: "b", hash: "h" },
          { key: "c", hash: "h" },
        ],
      }),
      new Map([
        [
          "alpha",
          [
            { id: 3, key: "c", hash: "h" },
            { id: 1, key: "a", hash: "h" },
          ],
        ],
      ]),
      [fakeAlpha],
    );
    expect(result.get("alpha")?.ops.map((op) => op.key)).toEqual(["a", "b", "c"]);
  });

  it("returns a slice per resource in the order resources are passed", () => {
    const beta = makeFakeResource<Spec, Server>({ name: "beta" });
    const result = diff(desiredState({}), new Map(), [fakeAlpha, beta]);
    expect([...result.keys()]).toEqual(["alpha", "beta"]);
    expect(result.get("alpha")).toEqual({ ops: [], orphans: [] });
    expect(result.get("beta")).toEqual({ ops: [], orphans: [] });
  });

  it("treats missing entries in desired or current as empty", () => {
    const result = diff(new Map(), new Map(), [fakeAlpha]);
    expect(result.get("alpha")).toEqual({ ops: [], orphans: [] });
  });

  it("does not leak desired specs across resources with the same key name", () => {
    const beta = makeFakeResource<Spec, Server>({ name: "beta" });
    const result = diff(
      desiredState({ alpha: [{ key: "shared", hash: "h" }], beta: [] }),
      new Map([
        ["alpha", []],
        ["beta", [{ id: 9, key: "shared", hash: "h" }]],
      ]),
      [fakeAlpha, beta],
    );
    expect(result.get("alpha")?.ops[0]?.kind).toBe("create");
    expect(result.get("beta")?.orphans).toEqual([{ id: 9, key: "shared", hash: "h" }]);
  });
});
