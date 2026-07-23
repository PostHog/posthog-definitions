import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { LogsView } from "./sdk.js";
import type { ServerLogsView } from "./client.js";
import { logsViewHash, validateLogsViews } from "./pipeline.js";

function spec(key: string, overrides: Partial<LogsView> = {}): LogsView {
  return {
    key,
    name: `Errors ${key}`,
    filters: { severityLevels: ["error"] },
    columns: [{ id: "c1", type: "timestamp" }],
    ...overrides,
  };
}

function serverRow(shortId: string, key: string, hash: string, userName = "Errors"): ServerLogsView {
  const marker = `<!-- iac:logs-views:${key} iac:hash:${hash} -->`;
  return {
    id: `uuid-${shortId}`,
    short_id: shortId,
    name: `${userName}\n\n${marker}`,
    filters: { severityLevels: ["error"] },
    columns: [{ id: "c1", type: "timestamp" }],
  };
}

function desiredFor(specs: LogsView[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "logs-views",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerLogsView[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["logs-views", rows]]);
}

describe("logs-view pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("v1")]), currentFor([])).get("logs-views")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("v1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("AAA", "v1", logsViewHash(desired), "Errors v1")]),
    ).get("logs-views")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("v1")]),
      currentFor([serverRow("AAA", "v1", "stale00000000")]),
    ).get("logs-views")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when filters, columns, name, or pinned change", () => {
    const base = spec("v");
    expect(logsViewHash(base)).not.toBe(logsViewHash(spec("v", { filters: { severityLevels: ["warn"] } })));
    expect(logsViewHash(base)).not.toBe(logsViewHash(spec("v", { columns: [{ id: "c1", type: "message" }] })));
    expect(logsViewHash(base)).not.toBe(logsViewHash(spec("v", { name: "Other" })));
    expect(logsViewHash(base)).not.toBe(logsViewHash(spec("v", { pinned: true })));
  });

  it("hash is stable under column reordering being significant", () => {
    const a = spec("v", { columns: [{ id: "c1", type: "timestamp" }, { id: "c2", type: "message" }] });
    const b = spec("v", { columns: [{ id: "c2", type: "message" }, { id: "c1", type: "timestamp" }] });
    // Column order is meaningful (array index = display order) → different hash.
    expect(logsViewHash(a)).not.toBe(logsViewHash(b));
  });

  it("classifies a server-only managed view as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("ZZ", "ghost", "any")])).get(
      "logs-views",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerLogsView = {
      id: "uuid-hand",
      short_id: "HAND",
      name: "A view someone saved in the UI",
      filters: {},
      columns: [],
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("logs-views")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("logs-view validation", () => {
  const state: DesiredState = new Map();

  it("requires a name (it carries the marker)", () => {
    const issues = validateLogsViews([spec("v", { name: "" })], state);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("rejects a name that, with the marker, exceeds the 400-char cap", () => {
    const issues = validateLogsViews([spec("v", { name: "A".repeat(400) })], state);
    expect(issues.some((m) => m.includes("name is too long"))).toBeTruthy();
  });

  it("rejects a duplicate key", () => {
    const issues = validateLogsViews([spec("dup"), spec("dup")], state);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("rejects a column missing id or type", () => {
    const issues = validateLogsViews(
      [spec("v", { columns: [{ id: "", type: "timestamp" }] })],
      state,
    );
    expect(issues.some((m) => m.includes("stable `id`"))).toBeTruthy();
  });

  it("accepts a valid view", () => {
    expect(validateLogsViews([spec("ok")], state)).toEqual([]);
  });
});
