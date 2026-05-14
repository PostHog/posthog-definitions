import { describe, expect, it } from "vitest";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { topoOrder } from "./order.js";
import { RESOURCES } from "./index.js";
import { dashboardResource } from "./dashboard/index.js";
import { eventDefinitionResource } from "./event-definition/index.js";
import { experimentResource } from "./experiment/index.js";
import { experimentHoldoutResource } from "./experiment-holdout/index.js";
import { experimentSavedMetricResource } from "./experiment-saved-metric/index.js";
import { featureFlagResource } from "./feature-flag/index.js";
import { insightResource } from "./insight/index.js";
import { propertyGroupResource } from "./property-group/index.js";

describe("topoOrder", () => {
  it("emits producers before consumers", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const c = makeFakeResource({ name: "c", dependsOn: [b] });

    expect(topoOrder([c, a, b]).map((r) => r.name)).toEqual(["a", "b", "c"]);
  });

  it("preserves input order between independent resources", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b" });
    const c = makeFakeResource({ name: "c" });

    expect(topoOrder([c, a, b]).map((r) => r.name)).toEqual(["c", "a", "b"]);
  });

  it("throws on a cycle", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    // Forge a cycle by mutating after construction — the type system would
    // catch a literal `dependsOn: [b]` self-reference.
    (a as { dependsOn?: unknown }).dependsOn = [b];

    expect(() => topoOrder([a, b])).toThrow(/cycle/i);
  });

  it("throws when a dependency is not in the registry", () => {
    const orphan = makeFakeResource({ name: "orphan" });
    const dependent = makeFakeResource({ name: "dependent", dependsOn: [orphan] });

    expect(() => topoOrder([dependent])).toThrow(/not in the registry/);
  });

  it("throws on duplicate resource names", () => {
    const a1 = makeFakeResource({ name: "a" });
    const a2 = makeFakeResource({ name: "a" });

    expect(() => topoOrder([a1, a2])).toThrow(/Duplicate/);
  });

  it("throws on self-dependency", () => {
    const a = makeFakeResource({ name: "a" });
    (a as { dependsOn?: unknown }).dependsOn = [a];

    expect(() => topoOrder([a])).toThrow(/depends on itself/);
  });
});

describe("RESOURCES (real registry)", () => {
  it("orders every declared edge correctly", () => {
    const positions = new Map(RESOURCES.map((r, i) => [r.name, i]));
    const before = (a: { name: string }, b: { name: string }): boolean =>
      positions.get(a.name)! < positions.get(b.name)!;

    expect(before(insightResource, dashboardResource)).toBe(true);
    expect(before(propertyGroupResource, eventDefinitionResource)).toBe(true);
    expect(before(featureFlagResource, experimentResource)).toBe(true);
    expect(before(experimentHoldoutResource, experimentResource)).toBe(true);
    expect(before(experimentSavedMetricResource, experimentResource)).toBe(true);
  });

  it("includes every registered resource exactly once", () => {
    const names = RESOURCES.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
