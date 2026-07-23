import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { type Dashboard } from "./sdk.js";
import { type ServerDashboard } from "./client.js";
import { dashboardHash } from "./pipeline.js";
import type { Insight, TrendsQuery } from "../insight/sdk.js";

function trends(event: string): TrendsQuery {
  return { kind: "TrendsQuery", series: [{ event }] };
}

function insightSpec(key: string, name = key): Insight {
  return { key, name, query: trends("user signed up") };
}

function spec(key: string, insightKey: string): Dashboard {
  return {
    key,
    name: `Dashboard ${key}`,
    tiles: [{ insight: insightSpec(insightKey) }],
  };
}

function serverRow(id: number, key: string, hash: string, extra: string[] = []): ServerDashboard {
  return {
    id,
    name: `Dashboard ${key}`,
    description: null,
    pinned: false,
    tags: [`iac:dashboards:${key}`, `iac:hash:${hash}`, ...extra],
    tiles: [],
  };
}

function desiredFor(dashboards: Dashboard[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set(
    "dashboards",
    dashboards.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerDashboard[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", rows],
  ]);
}

describe("dashboard pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("growth", "weekly-signups")]), currentFor([]));
    const slice = result.get("dashboards")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("growth", "weekly-signups");
    const server = serverRow(7, "growth", dashboardHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    expect(result.get("dashboards")!.ops[0]!.kind).toBe("unchanged");
  });

  it("emits update when server hash drifted", () => {
    const desired = spec("growth", "weekly-signups");
    const server = serverRow(7, "growth", "deadbeef12345678");
    const result = diff(desiredFor([desired]), currentFor([server]));
    expect(result.get("dashboards")!.ops[0]!.kind).toBe("update");
  });

  it("classifies a server-only managed dashboard as an orphan", () => {
    const server = serverRow(123, "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    expect(result.get("dashboards")!.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerDashboard = {
      id: 999,
      name: "Hand-built",
      description: null,
      pinned: false,
      tags: ["my-tag"],
      tiles: [],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("dashboards")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("dashboard hash (settable fields only)", () => {
  const withTiles = (key: string, tiles: Dashboard["tiles"], insightLayout?: Dashboard["insightLayout"]): Dashboard => ({
    key,
    name: `Dashboard ${key}`,
    ...(insightLayout && { insightLayout }),
    tiles,
  });

  it("insight-tile membership is order-insensitive", () => {
    const a = withTiles("d", [{ insight: insightSpec("x") }, { insight: insightSpec("y") }]);
    const b = withTiles("d", [{ insight: insightSpec("y") }, { insight: insightSpec("x") }]);
    expect(dashboardHash(a)).toBe(dashboardHash(b));
  });

  it("changing insightLayout changes the hash", () => {
    const preserve = withTiles("d", [{ insight: insightSpec("x") }]);
    const twoCol = withTiles("d", [{ insight: insightSpec("x") }], "two_column");
    expect(dashboardHash(preserve)).not.toBe(dashboardHash(twoCol));
  });

  it("text-tile layout is hashed under preserve but not under a repacking mode", () => {
    const t1 = withTiles("d", [{ kind: "text", body: "n", layout: { x: 0, y: 0, w: 6, h: 1 } }]);
    const t2 = withTiles("d", [{ kind: "text", body: "n", layout: { x: 6, y: 0, w: 6, h: 1 } }]);
    // preserve: different layout ⇒ different hash
    expect(dashboardHash(t1)).not.toBe(dashboardHash(t2));
    // two_column repacks everything, so text layout is excluded ⇒ equal hash
    const c1 = withTiles("d", [{ kind: "text", body: "n", layout: { x: 0, y: 0, w: 6, h: 1 } }], "two_column");
    const c2 = withTiles("d", [{ kind: "text", body: "n", layout: { x: 6, y: 0, w: 6, h: 1 } }], "two_column");
    expect(dashboardHash(c1)).toBe(dashboardHash(c2));
  });

  it("insight-tile layout/color are not part of the type or hash", () => {
    // Text color IS hashed; insight tiles have no such field.
    const noColor = withTiles("d", [{ kind: "text", body: "n", layout: { x: 0, y: 0, w: 6, h: 1 } }]);
    const withColor = withTiles("d", [
      { kind: "text", body: "n", layout: { x: 0, y: 0, w: 6, h: 1 }, color: "blue" },
    ]);
    expect(dashboardHash(noColor)).not.toBe(dashboardHash(withColor));
  });
});
