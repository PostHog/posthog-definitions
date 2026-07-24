import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { WarehouseSavedQuery } from "./sdk.js";
import type { ServerWarehouseSavedQuery } from "./client.js";
import { warehouseSavedQueryHash, validateWarehouseSavedQueries } from "./pipeline.js";

function spec(key: string, overrides: Partial<WarehouseSavedQuery> = {}): WarehouseSavedQuery {
  return {
    key,
    name: `view_${key}`,
    query: "SELECT 1 AS n",
    description: "A view",
    ...overrides,
  };
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  userDescription = "A view",
): ServerWarehouseSavedQuery {
  const marker = `<!-- iac:warehouse-saved-queries:${key} iac:hash:${hash} -->`;
  return {
    id,
    name: `view_${key}`,
    query: { query: "SELECT 1 AS n" },
    description: `${userDescription}\n\n${marker}`,
    latest_history_id: "hist-1",
  };
}

function desiredFor(specs: WarehouseSavedQuery[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "warehouse-saved-queries",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerWarehouseSavedQuery[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["warehouse-saved-queries", rows]]);
}

describe("warehouse-saved-query pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("v1")]), currentFor([])).get("warehouse-saved-queries")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("v1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("id1", "v1", warehouseSavedQueryHash(desired))]),
    ).get("warehouse-saved-queries")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("v1")]),
      currentFor([serverRow("id1", "v1", "stale00000000")]),
    ).get("warehouse-saved-queries")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when name, query, description, or folder change", () => {
    const base = spec("v");
    expect(warehouseSavedQueryHash(base)).not.toBe(warehouseSavedQueryHash(spec("v", { name: "other" })));
    expect(warehouseSavedQueryHash(base)).not.toBe(warehouseSavedQueryHash(spec("v", { query: "SELECT 2" })));
    expect(warehouseSavedQueryHash(base)).not.toBe(warehouseSavedQueryHash(spec("v", { description: "x" })));
    expect(warehouseSavedQueryHash(base)).not.toBe(warehouseSavedQueryHash(spec("v", { folderId: "f1" })));
  });

  it("classifies a server-only managed row as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("id9", "ghost", "any")])).get(
      "warehouse-saved-queries",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerWarehouseSavedQuery = {
      id: "hand",
      name: "my_view",
      query: { query: "SELECT 1" },
      description: "A view someone built in the SQL editor",
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("warehouse-saved-queries")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("warehouse-saved-query validation", () => {
  const state: DesiredState = new Map();

  it("requires a name", () => {
    const issues = validateWarehouseSavedQueries([spec("v", { name: "" })], state);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("rejects a name that is not a HogQL identifier", () => {
    const issues = validateWarehouseSavedQueries([spec("v", { name: "not a name" })], state);
    expect(issues.some((m) => m.includes("HogQL identifier"))).toBeTruthy();
  });

  it("rejects a duplicate table name", () => {
    const issues = validateWarehouseSavedQueries(
      [spec("a", { name: "dup" }), spec("b", { name: "dup" })],
      state,
    );
    expect(issues.some((m) => m.includes("must be unique"))).toBeTruthy();
  });

  it("requires a query", () => {
    const issues = validateWarehouseSavedQueries([spec("v", { query: "" })], state);
    expect(issues.some((m) => m.includes("query is required"))).toBeTruthy();
  });

  it("accepts a valid saved query", () => {
    expect(validateWarehouseSavedQueries([spec("ok")], state)).toEqual([]);
  });
});
