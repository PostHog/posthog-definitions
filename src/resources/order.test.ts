import { describe, expect, it } from "vitest";
import type { ClientConfig } from "../client/config.js";
import type { ResourceDiff, ResourceOp } from "./types.js";
import { execute } from "../apply/execute.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { topoOrder } from "./order.js";
import { RESOURCES } from "./index.js";
import { actionResource } from "./action/index.js";
import { cohortResource } from "./cohort/index.js";
import { dashboardResource } from "./dashboard/index.js";
import { endpointResource } from "./endpoint/index.js";
import { eventDefinitionResource } from "./event-definition/index.js";
import { experimentResource } from "./experiment/index.js";
import { experimentHoldoutResource } from "./experiment-holdout/index.js";
import { experimentSavedMetricResource } from "./experiment-saved-metric/index.js";
import { featureFlagResource } from "./feature-flag/index.js";
import { insightResource } from "./insight/index.js";
import { projectSettingsResource } from "./project-settings/index.js";
import { sessionRecordingPlaylistResource } from "./session-recording-playlist/index.js";
import { propertyGroupResource } from "./property-group/index.js";

describe("topoOrder", () => {
  it("returns an empty array for empty input", () => {
    expect(topoOrder([])).toEqual([]);
  });

  it("returns a single resource unchanged", () => {
    const a = makeFakeResource({ name: "a" });
    expect(topoOrder([a]).map((r) => r.name)).toEqual(["a"]);
  });

  it("emits producers before consumers in a linear chain", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const c = makeFakeResource({ name: "c", dependsOn: [b] });

    expect(topoOrder([c, a, b]).map((r) => r.name)).toEqual(["a", "b", "c"]);
  });

  it("handles a diamond (one root, two paths, one sink)", () => {
    // a → b ↘
    //       d
    // a → c ↗
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const c = makeFakeResource({ name: "c", dependsOn: [a] });
    const d = makeFakeResource({ name: "d", dependsOn: [b, c] });

    const out = topoOrder([d, c, b, a]).map((r) => r.name);
    expect(out[0]).toBe("a");
    expect(out[out.length - 1]).toBe("d");
    expect(out.indexOf("b")).toBeLessThan(out.indexOf("d"));
    expect(out.indexOf("c")).toBeLessThan(out.indexOf("d"));
    // Every node appears exactly once.
    expect(new Set(out)).toEqual(new Set(["a", "b", "c", "d"]));
    expect(out).toHaveLength(4);
  });

  it("interleaves disconnected components by registry order", () => {
    // Two independent subgraphs: a → b, x → y.
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const x = makeFakeResource({ name: "x" });
    const y = makeFakeResource({ name: "y", dependsOn: [x] });

    const out = topoOrder([a, x, b, y]).map((r) => r.name);
    expect(out.indexOf("a")).toBeLessThan(out.indexOf("b"));
    expect(out.indexOf("x")).toBeLessThan(out.indexOf("y"));
    expect(out).toHaveLength(4);
  });

  it("handles many consumers of one producer", () => {
    const root = makeFakeResource({ name: "root" });
    const consumers = ["c1", "c2", "c3", "c4"].map((n) =>
      makeFakeResource({ name: n, dependsOn: [root] }),
    );

    const out = topoOrder([...consumers, root]).map((r) => r.name);
    expect(out[0]).toBe("root");
    expect(out.slice(1).sort()).toEqual(["c1", "c2", "c3", "c4"]);
  });

  it("handles many producers feeding one consumer", () => {
    const producers = ["p1", "p2", "p3"].map((n) => makeFakeResource({ name: n }));
    const consumer = makeFakeResource({ name: "sink", dependsOn: producers });

    const out = topoOrder([consumer, ...producers]).map((r) => r.name);
    expect(out[out.length - 1]).toBe("sink");
    expect(out.slice(0, 3).sort()).toEqual(["p1", "p2", "p3"]);
  });

  it("preserves input order between fully independent resources", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b" });
    const c = makeFakeResource({ name: "c" });

    expect(topoOrder([c, a, b]).map((r) => r.name)).toEqual(["c", "a", "b"]);
  });

  it("is idempotent — sorting the output again yields the same order", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const c = makeFakeResource({ name: "c", dependsOn: [b] });

    const first = topoOrder([c, a, b]);
    const second = topoOrder(first);
    expect(second.map((r) => r.name)).toEqual(first.map((r) => r.name));
  });

  it("does not mutate the input array", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const input = [b, a];
    const snapshot = input.slice();

    topoOrder(input);

    expect(input).toEqual(snapshot);
  });

  it("throws on a two-node cycle and names the participants", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    // Forge the cycle by mutation — the type system would catch a literal
    // self-referencing dependsOn.
    (a as { dependsOn?: unknown }).dependsOn = [b];

    expect(() => topoOrder([a, b])).toThrow(/cycle.*a.*b|cycle.*b.*a/);
  });

  it("throws on a three-node cycle", () => {
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    const c = makeFakeResource({ name: "c", dependsOn: [b] });
    (a as { dependsOn?: unknown }).dependsOn = [c];

    expect(() => topoOrder([a, b, c])).toThrow(/cycle/i);
  });

  it("detects a cycle even when independent resources are present", () => {
    const standalone = makeFakeResource({ name: "standalone" });
    const a = makeFakeResource({ name: "a" });
    const b = makeFakeResource({ name: "b", dependsOn: [a] });
    (a as { dependsOn?: unknown }).dependsOn = [b];

    expect(() => topoOrder([standalone, a, b])).toThrow(/cycle/i);
  });

  it("throws when a dependency is not in the registry", () => {
    const orphan = makeFakeResource({ name: "orphan" });
    const dependent = makeFakeResource({ name: "dependent", dependsOn: [orphan] });

    expect(() => topoOrder([dependent])).toThrow(
      /"dependent" depends on "orphan".*not in the registry/,
    );
  });

  it("throws on duplicate resource names with distinct objects", () => {
    const a1 = makeFakeResource({ name: "a" });
    const a2 = makeFakeResource({ name: "a" });

    expect(() => topoOrder([a1, a2])).toThrow(/Duplicate resource name.*"a"/);
  });

  it("throws on self-dependency", () => {
    const a = makeFakeResource({ name: "a" });
    (a as { dependsOn?: unknown }).dependsOn = [a];

    expect(() => topoOrder([a])).toThrow(/"a" depends on itself/);
  });
});

describe("RESOURCES (real registry)", () => {
  it("includes every imported module exactly once", () => {
    const expected = new Set(
      [
        actionResource,
        cohortResource,
        dashboardResource,
        endpointResource,
        eventDefinitionResource,
        experimentResource,
        experimentHoldoutResource,
        experimentSavedMetricResource,
        featureFlagResource,
        insightResource,
        projectSettingsResource,
        propertyGroupResource,
        sessionRecordingPlaylistResource,
      ].map((r) => r.name),
    );
    expect(new Set(RESOURCES.map((r) => r.name))).toEqual(expected);
    expect(RESOURCES).toHaveLength(expected.size);
  });

  it("places every declared producer before its consumer", () => {
    const position = new Map(RESOURCES.map((r, i) => [r.name, i]));
    for (const consumer of RESOURCES) {
      for (const producer of consumer.dependsOn ?? []) {
        expect(position.get(producer.name)).toBeDefined();
        expect(position.get(producer.name)!).toBeLessThan(position.get(consumer.name)!);
      }
    }
  });

  it("declares every dependsOn target inside the registry", () => {
    const known = new Set(RESOURCES);
    for (const r of RESOURCES) {
      for (const dep of r.dependsOn ?? []) {
        expect(known.has(dep)).toBe(true);
      }
    }
  });
});

describe("topoOrder + execute (integration)", () => {
  const FAKE_CONFIG: ClientConfig = {
    host: "https://test.example",
    projectId: "1",
    apiKey: "test",
  };

  function createOp(key: string): ResourceOp<unknown, unknown> {
    return { kind: "create", spec: { key } };
  }

  function diffOf(
    byName: Record<string, ResourceDiff<unknown, unknown>>,
  ): Map<string, ResourceDiff<unknown, unknown>> {
    return new Map(Object.entries(byName));
  }

  // The producer/consumer pair models the real dashboard↔insight handoff:
  // the producer writes a server id into ApplyContext, the consumer reads it
  // and throws if the producer ran after it. Passed to topoOrder in the
  // *wrong* order so the test fails if topoOrder is a no-op.
  it("makes the consumer see the producer's ctx writes when sorted+executed", async () => {
    const seenIds: number[] = [];
    const producer = makeFakeResource({
      name: "producer",
      executeOp: async (_c, _op, ctx) => {
        ctx.insightIdByKey.set("k", 42);
      },
    });
    const consumer = makeFakeResource({
      name: "consumer",
      dependsOn: [producer],
      executeOp: async (_c, _op, ctx) => {
        const id = ctx.insightIdByKey.get("k");
        if (id === undefined) throw new Error("producer ctx missing");
        seenIds.push(id);
      },
    });

    const ordered = topoOrder([consumer, producer]);

    await execute(
      FAKE_CONFIG,
      diffOf({
        producer: { ops: [createOp("k")], orphans: [] },
        consumer: { ops: [createOp("c")], orphans: [] },
      }),
      {},
      ordered,
    );

    expect(seenIds).toEqual([42]);
  });

  it("would surface a missing edge — consumer fails without dependsOn", async () => {
    // Same setup but no dependsOn edge — topoOrder preserves input order,
    // so passing [consumer, producer] runs consumer first and throws.
    const producer = makeFakeResource({
      name: "producer",
      executeOp: async (_c, _op, ctx) => {
        ctx.insightIdByKey.set("k", 42);
      },
    });
    const consumer = makeFakeResource({
      name: "consumer",
      // Intentionally no dependsOn.
      executeOp: async (_c, _op, ctx) => {
        const id = ctx.insightIdByKey.get("k");
        if (id === undefined) throw new Error("producer ctx missing");
      },
    });

    const ordered = topoOrder([consumer, producer]);
    await expect(
      execute(
        FAKE_CONFIG,
        diffOf({
          producer: { ops: [createOp("k")], orphans: [] },
          consumer: { ops: [createOp("c")], orphans: [] },
        }),
        {},
        ordered,
      ),
    ).rejects.toThrow(/producer ctx missing/);
  });
});
