import { describe, expect, it } from "vitest";
import type { ResourceDiff, ResourceOp } from "../resources/types.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import type { DiffResult } from "./diff.js";
import { formatPlan, lcsDiff } from "./format-plan.js";

const ANSI_ESC = String.fromCharCode(0x1b) + "[";

type Spec = { key: string };
type Server = { id: number; key: string };

function diffOf(byResource: Record<string, ResourceDiff<unknown, unknown>>): DiffResult {
  return new Map(Object.entries(byResource));
}

function op(kind: "create" | "update" | "unchanged", key: string): ResourceOp<unknown, unknown> {
  const spec: Spec = { key };
  const server: Server = { id: 1, key };
  if (kind === "create") return { kind, spec };
  return { kind, spec, server };
}

const alpha = makeFakeResource<Spec, Server>({ name: "alpha", displayName: "alpha" });
const beta = makeFakeResource<Spec, Server>({ name: "beta", displayName: "beta" });

describe("formatPlan", () => {
  it("renders a header line with create/update/unchanged counts per resource", () => {
    const out = formatPlan(
      diffOf({
        alpha: {
          ops: [op("create", "a1"), op("update", "a2"), op("unchanged", "a3")],
          orphans: [],
        },
      }),
      { color: false },
      [alpha],
    );
    expect(out).toContain("alpha:");
    expect(out).toContain("1 to create");
    expect(out).toContain("1 to update");
    expect(out).toContain("1 unchanged");
  });

  it("walks resources in the order passed", () => {
    const out = formatPlan(
      diffOf({
        beta: { ops: [op("create", "b")], orphans: [] },
        alpha: { ops: [op("create", "a")], orphans: [] },
      }),
      { color: false },
      [alpha, beta],
    );
    expect(out.indexOf("alpha:")).toBeLessThan(out.indexOf("beta:"));
  });

  it("omits the orphan line when there are none", () => {
    const out = formatPlan(
      diffOf({ alpha: { ops: [op("create", "a")], orphans: [] } }),
      { color: false },
      [alpha],
    );
    expect(out).not.toMatch(/orphans:/);
  });

  it("labels orphans 'left alone' by default and 'to delete' when prune is on", () => {
    const orphanDiff: ResourceDiff<unknown, unknown> = {
      ops: [],
      orphans: [{ id: 9, key: "abandoned" }],
    };
    const left = formatPlan(diffOf({ alpha: orphanDiff }), { color: false }, [alpha]);
    const deleted = formatPlan(diffOf({ alpha: orphanDiff }), { color: false, prune: true }, [
      alpha,
    ]);
    expect(left).toMatch(/orphan/);
    expect(left).toMatch(/left alone/);
    expect(deleted).toMatch(/delete/);
  });

  it("emits one block per non-unchanged op, with the resource displayName and key", () => {
    const out = formatPlan(
      diffOf({
        alpha: {
          ops: [op("create", "k-create"), op("update", "k-update"), op("unchanged", "k-eq")],
          orphans: [],
        },
      }),
      { color: false },
      [alpha],
    );
    expect(out).toContain("k-create");
    expect(out).toContain("k-update");
    expect(out).not.toContain("k-eq\n"); // unchanged: no per-op block
  });

  it("emits no ANSI escapes when color is false", () => {
    const out = formatPlan(
      diffOf({
        alpha: { ops: [op("create", "a"), op("update", "b")], orphans: [{ id: 1, key: "x" }] },
      }),
      { color: false, prune: true },
      [alpha],
    );
    expect(out.includes(ANSI_ESC)).toBe(false);
  });

  it("emits ANSI escapes when color is true", () => {
    const out = formatPlan(
      diffOf({ alpha: { ops: [op("create", "a")], orphans: [] } }),
      { color: true },
      [alpha],
    );
    expect(out.includes(ANSI_ESC)).toBe(true);
  });

  it("falls back to id:<n> when an orphan has no key", () => {
    const orphanWithoutKey = makeFakeResource<Spec, Server>({
      name: "alpha",
      displayName: "alpha",
      keyFromServer: () => undefined,
    });
    const out = formatPlan(
      diffOf({ alpha: { ops: [], orphans: [{ id: 42, key: "ignored" }] } }),
      { color: false },
      [orphanWithoutKey],
    );
    expect(out).toContain("id:42");
  });

  it("tolerates resources with no diff slice", () => {
    expect(() => formatPlan(diffOf({}), { color: false }, [alpha])).not.toThrow();
    const out = formatPlan(diffOf({}), { color: false }, [alpha]);
    expect(out).toContain("alpha:");
    expect(out).toContain("0 to create");
  });
});

describe("lcsDiff", () => {
  it("returns all eq when inputs are identical", () => {
    expect(lcsDiff(["a", "b", "c"], ["a", "b", "c"])).toEqual([
      { kind: "eq", value: "a" },
      { kind: "eq", value: "b" },
      { kind: "eq", value: "c" },
    ]);
  });

  it("returns all del when the right side is empty", () => {
    expect(lcsDiff(["a", "b"], [])).toEqual([
      { kind: "del", value: "a" },
      { kind: "del", value: "b" },
    ]);
  });

  it("returns all add when the left side is empty", () => {
    expect(lcsDiff([], ["x", "y"])).toEqual([
      { kind: "add", value: "x" },
      { kind: "add", value: "y" },
    ]);
  });

  it("reports an insertion in the middle as one add against the surrounding eq", () => {
    expect(lcsDiff(["a", "c"], ["a", "b", "c"])).toEqual([
      { kind: "eq", value: "a" },
      { kind: "add", value: "b" },
      { kind: "eq", value: "c" },
    ]);
  });

  it("reports a deletion in the middle as one del against the surrounding eq", () => {
    expect(lcsDiff(["a", "b", "c"], ["a", "c"])).toEqual([
      { kind: "eq", value: "a" },
      { kind: "del", value: "b" },
      { kind: "eq", value: "c" },
    ]);
  });

  it("reports a replacement as a del followed by an add", () => {
    expect(lcsDiff(["a", "b", "c"], ["a", "x", "c"])).toEqual([
      { kind: "eq", value: "a" },
      { kind: "del", value: "b" },
      { kind: "add", value: "x" },
      { kind: "eq", value: "c" },
    ]);
  });

  it("handles two empty inputs", () => {
    expect(lcsDiff([], [])).toEqual([]);
  });
});
