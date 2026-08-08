import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { type FunnelsQuery, type HogQLQuery, type Insight, type TrendsQuery } from "./sdk.js";
import { type ServerInsight } from "./client.js";
import { insightHash, insightPayload } from "./pipeline.js";

function trends(event: string): TrendsQuery {
  return { kind: "TrendsQuery", series: [{ event }] };
}

function funnels(...events: string[]): FunnelsQuery {
  return { kind: "FunnelsQuery", series: events.map((event) => ({ event })) };
}

function spec(key: string, name = key): Insight {
  return { key, name, query: trends("user signed up") };
}

function serverRow(id: number, key: string, hash: string, extra: string[] = []): ServerInsight {
  return {
    id,
    short_id: `s${id}`,
    name: `Insight ${key}`,
    description: null,
    query: {},
    tags: [`iac:insights:${key}`, `iac:hash:${hash}`, ...extra],
  };
}

function desiredFor(insights: Insight[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "insights",
    insights.map((spec) => ({ path: "<test>", spec })),
  );
  state.set("dashboards", []);
  return state;
}

function currentFor(rows: ServerInsight[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", rows],
    ["dashboards", []],
  ]);
}

describe("insight pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("weekly-signups")]), currentFor([]));
    const slice = result.get("insights")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect((slice.ops[0]!.spec as { key: string }).key).toBe("weekly-signups");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("weekly-signups");
    const server = serverRow(42, "weekly-signups", insightHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("insights")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect((op.server as { id: number | string }).id).toBe(42);
  });

  it("emits update when server hash differs", () => {
    const desired = spec("weekly-signups");
    const server = serverRow(42, "weekly-signups", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("insights")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect((op.server as { id: number | string }).id).toBe(42);
  });

  it("classifies a server-only managed insight as an orphan", () => {
    const server = serverRow(99, "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("insights")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerInsight).id).toBe(99);
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerInsight = {
      id: 999,
      short_id: "hb",
      name: "Hand-built",
      description: null,
      query: {},
      tags: ["my-tag"],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("insights")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("insightPayload query wrapping", () => {
  it("wraps a TrendsQuery in an InsightVizNode", () => {
    const query = trends("user signed up");
    const payload = insightPayload({ key: "signups", name: "Signups", query }, "hash");
    expect(payload.query).toEqual({ kind: "InsightVizNode", source: query });
  });

  it("wraps a FunnelsQuery in an InsightVizNode", () => {
    const query = funnels("signed up", "activated");
    const payload = insightPayload({ key: "activation", name: "Activation", query }, "hash");
    expect(payload.query).toEqual({ kind: "InsightVizNode", source: query });
  });

  it("wraps a HogQLQuery in a DataTableNode", () => {
    const query: HogQLQuery = { kind: "HogQLQuery", query: "select 1" };
    const payload = insightPayload({ key: "raw", name: "Raw", query }, "hash");
    expect(payload.query).toEqual({ kind: "DataTableNode", source: query });
  });
});
