import { describe, expect, it } from "vitest";
import type { DesiredState } from "../resources/types.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { validate } from "./validate.js";

function stateFromSpecs(byResource: Record<string, unknown[]>): DesiredState {
  const state: DesiredState = new Map();
  for (const [name, specs] of Object.entries(byResource)) {
    state.set(
      name,
      specs.map((spec) => ({ path: `<test:${name}>`, spec })),
    );
  }
  return state;
}

describe("validate", () => {
  it("returns ok when every resource produces no issues", () => {
    const resources = [
      makeFakeResource({ name: "alpha", validate: () => [] }),
      makeFakeResource({ name: "beta", validate: () => [] }),
    ];
    const result = validate(stateFromSpecs({ alpha: [{ key: "a" }] }), resources);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.resourceCount).toBe(2);
  });

  it("aggregates issues across all resources before returning err", () => {
    const resources = [
      makeFakeResource({ name: "alpha", validate: () => ["alpha-issue-1", "alpha-issue-2"] }),
      makeFakeResource({ name: "beta", validate: () => ["beta-issue"] }),
    ];
    const result = validate(stateFromSpecs({}), resources);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual(["alpha-issue-1", "alpha-issue-2", "beta-issue"]);
    }
  });

  it("passes the specs and full state through to each resource validator", () => {
    const seen: Array<{ resource: string; specs: unknown[]; stateKeys: string[] }> = [];
    const resources = [
      makeFakeResource({
        name: "alpha",
        validate: (specs, state) => {
          seen.push({ resource: "alpha", specs, stateKeys: [...state.keys()] });
          return [];
        },
      }),
      makeFakeResource({
        name: "beta",
        validate: (specs, state) => {
          seen.push({ resource: "beta", specs, stateKeys: [...state.keys()] });
          return [];
        },
      }),
    ];
    const state = stateFromSpecs({ alpha: [{ key: "a1" }, { key: "a2" }], beta: [{ key: "b1" }] });
    validate(state, resources);
    expect(seen).toEqual([
      { resource: "alpha", specs: [{ key: "a1" }, { key: "a2" }], stateKeys: ["alpha", "beta"] },
      { resource: "beta", specs: [{ key: "b1" }], stateKeys: ["alpha", "beta"] },
    ]);
  });

  it("treats a missing entry in state as zero specs", () => {
    const calls: unknown[][] = [];
    const resources = [
      makeFakeResource({
        name: "alpha",
        validate: (specs) => {
          calls.push(specs);
          return [];
        },
      }),
    ];
    const result = validate(stateFromSpecs({}), resources);
    expect(result.ok).toBe(true);
    expect(calls).toEqual([[]]);
  });

  it("walks resources in order so issues are reported in a stable sequence", () => {
    const resources = [
      makeFakeResource({ name: "first", validate: () => ["1"] }),
      makeFakeResource({ name: "second", validate: () => ["2"] }),
      makeFakeResource({ name: "third", validate: () => ["3"] }),
    ];
    const result = validate(stateFromSpecs({}), resources);
    if (!result.ok) expect(result.error).toEqual(["1", "2", "3"]);
    else throw new Error("expected err");
  });
});
