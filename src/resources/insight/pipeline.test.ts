import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { type Insight, type TrendsQuery } from "./sdk.js";
import { type ServerInsight } from "./client.js";
import { insightHash } from "./pipeline.js";

function trends(event: string): TrendsQuery {
  return { kind: "TrendsQuery", series: [{ event }] };
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
  state.set("insights", insights.map((spec) => ({ path: "<test>", spec })));
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
    assert.equal(slice.ops.length, 1);
    assert.equal(slice.ops[0]!.kind, "create");
    assert.equal(slice.ops[0]!.key, "weekly-signups");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("weekly-signups");
    const server = serverRow(42, "weekly-signups", insightHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("insights")!.ops[0]!;
    assert.equal(op.kind, "unchanged");
    if (op.kind === "unchanged") assert.equal(op.serverId, 42);
  });

  it("emits update when server hash differs", () => {
    const desired = spec("weekly-signups");
    const server = serverRow(42, "weekly-signups", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("insights")!.ops[0]!;
    assert.equal(op.kind, "update");
    if (op.kind === "update") assert.equal(op.serverId, 42);
  });

  it("classifies a server-only managed insight as an orphan", () => {
    const server = serverRow(99, "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("insights")!;
    assert.equal(slice.orphans.length, 1);
    assert.equal((slice.orphans[0] as ServerInsight).id, 99);
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
    assert.equal(slice.ops.length, 0);
    assert.equal(slice.orphans.length, 0);
  });
});
