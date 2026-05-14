import { describe, expect, it } from "vitest";
import type { DesiredState } from "../resources/types.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { mergeInlineSpecs } from "./load.js";

type Spec = { key: string; tag?: string };

function stateFromSpecs(byResource: Record<string, Array<{ path: string; spec: Spec }>>) {
  const state: DesiredState = new Map();
  for (const [name, entries] of Object.entries(byResource)) {
    state.set(name, entries);
  }
  return state;
}

const dashboard = makeFakeResource<Spec, unknown>({
  name: "dashboards",
  displayName: "dashboard",
});

const insight = makeFakeResource<Spec, unknown>({
  name: "insights",
  displayName: "insight",
});

describe("mergeInlineSpecs", () => {
  it("is a no-op when no resource declares extractInlineSpecs", () => {
    const state = stateFromSpecs({
      dashboards: [{ path: "d.ts", spec: { key: "d1" } }],
      insights: [],
    });
    const before = JSON.stringify([...state.entries()]);
    const result = mergeInlineSpecs(state, [dashboard, insight]);
    expect(result.ok).toBe(true);
    expect(JSON.stringify([...state.entries()])).toBe(before);
  });

  it("appends extracted inline specs into the target resource's bucket", () => {
    const inlineInsight: Spec = { key: "inline-1" };
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      displayName: "dashboard",
      extractInlineSpecs: (spec) =>
        (spec as { tiles?: Spec[] }).tiles?.map((t) => ({
          resourceName: "insights",
          spec: t,
        })) ?? [],
    });
    const state = stateFromSpecs({
      dashboards: [
        {
          path: "d.ts",
          spec: { key: "d1", tag: "hostsInline" } as Spec & { tiles?: Spec[] } as Spec,
        },
      ],
      insights: [],
    });
    state.get("dashboards")![0]!.spec = {
      key: "d1",
      tiles: [inlineInsight],
    } as unknown as Spec;
    const result = mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(result.ok).toBe(true);
    expect(state.get("insights")).toEqual([{ path: "<inline>", spec: inlineInsight }]);
  });

  it("dedupes an inline spec against a file-level spec of the same key when identity matches", () => {
    const shared: Spec = { key: "shared" };
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      extractInlineSpecs: () => [{ resourceName: "insights", spec: shared }],
    });
    const state = stateFromSpecs({
      dashboards: [{ path: "d.ts", spec: { key: "d1" } }],
      insights: [{ path: "i.ts", spec: shared }],
    });
    const result = mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(result.ok).toBe(true);
    expect(state.get("insights")).toEqual([{ path: "i.ts", spec: shared }]);
  });

  it("returns an inline-collision error when two different specs share a key", () => {
    const fileSide: Spec = { key: "growth", tag: "file" };
    const inlineSide: Spec = { key: "growth", tag: "inline" };
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      displayName: "dashboard",
      extractInlineSpecs: () => [{ resourceName: "insights", spec: inlineSide }],
    });
    const state = stateFromSpecs({
      dashboards: [{ path: "/abs/d.ts", spec: { key: "d1" } }],
      insights: [{ path: "/abs/i.ts", spec: fileSide }],
    });
    const result = mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({
        kind: "inline-collision",
        resourceDisplayName: "insight",
        key: "growth",
        firstPath: "/abs/i.ts",
        secondPath: "/abs/d.ts",
      });
    }
  });

  it("ignores inline specs that target an unknown resource name", () => {
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      extractInlineSpecs: () => [{ resourceName: "nonexistent", spec: { key: "x" } }],
    });
    const state = stateFromSpecs({
      dashboards: [{ path: "d.ts", spec: { key: "d1" } }],
      insights: [],
    });
    const result = mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(result.ok).toBe(true);
    expect(state.get("insights")).toEqual([]);
  });

  it("appends multiple distinct inline specs in order", () => {
    const t1: Spec = { key: "t1" };
    const t2: Spec = { key: "t2" };
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      extractInlineSpecs: () => [
        { resourceName: "insights", spec: t1 },
        { resourceName: "insights", spec: t2 },
      ],
    });
    const state = stateFromSpecs({
      dashboards: [{ path: "d.ts", spec: { key: "d1" } }],
      insights: [],
    });
    mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(state.get("insights")).toEqual([
      { path: "<inline>", spec: t1 },
      { path: "<inline>", spec: t2 },
    ]);
  });

  it("attributes a collision to the second occurrence's path, not the first", () => {
    const fileSide: Spec = { key: "k", tag: "file" };
    const inlineSide: Spec = { key: "k", tag: "inline" };
    const dashWithInline = makeFakeResource<Spec, unknown>({
      name: "dashboards",
      displayName: "dashboard",
      extractInlineSpecs: (spec) => {
        if ((spec as Spec).key === "host-dash") {
          return [{ resourceName: "insights", spec: inlineSide }];
        }
        return [];
      },
    });
    const state = stateFromSpecs({
      dashboards: [{ path: "/host-dash.ts", spec: { key: "host-dash" } }],
      insights: [{ path: "/standalone-insight.ts", spec: fileSide }],
    });
    const result = mergeInlineSpecs(state, [dashWithInline, insight]);
    expect(result.ok).toBe(false);
    if (!result.ok && result.error.kind === "inline-collision") {
      expect(result.error.firstPath).toBe("/standalone-insight.ts");
      expect(result.error.secondPath).toBe("/host-dash.ts");
    }
  });
});
