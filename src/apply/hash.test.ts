import { describe, expect, it } from "vitest";
import { specHash } from "./hash.js";

describe("specHash", () => {
  it("returns the same digest for identical inputs", () => {
    const a = specHash({ name: "x", tiles: [{ k: 1 }] });
    const b = specHash({ name: "x", tiles: [{ k: 1 }] });
    expect(a).toBe(b);
  });

  it("is invariant to key order in objects", () => {
    const a = specHash({ a: 1, b: 2, c: 3 });
    const b = specHash({ c: 3, a: 1, b: 2 });
    expect(a).toBe(b);
  });

  it("is sensitive to array order", () => {
    const a = specHash({ tiles: [1, 2, 3] });
    const b = specHash({ tiles: [3, 2, 1] });
    expect(a).not.toBe(b);
  });

  it("ignores undefined properties (same as omitting them)", () => {
    const a = specHash({ name: "x", description: undefined });
    const b = specHash({ name: "x" });
    expect(a).toBe(b);
  });

  it("distinguishes null from undefined", () => {
    const a = specHash({ description: null });
    const b = specHash({ description: undefined });
    expect(a).not.toBe(b);
  });

  it("changes when any leaf value changes", () => {
    const base = specHash({ name: "growth", pinned: false });
    expect(specHash({ name: "growth ", pinned: false })).not.toBe(base);
    expect(specHash({ name: "growth", pinned: true })).not.toBe(base);
  });

  it("returns a 16-character lowercase hex digest", () => {
    const h = specHash({ anything: "here" });
    expect(h).toMatch(/^[0-9a-f]{16}$/);
  });
});
