import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { specHash } from "./hash.js";

describe("specHash", () => {
  it("returns the same digest for identical inputs", () => {
    const a = specHash({ name: "x", tiles: [{ k: 1 }] });
    const b = specHash({ name: "x", tiles: [{ k: 1 }] });
    assert.equal(a, b);
  });

  it("is invariant to key order in objects", () => {
    const a = specHash({ a: 1, b: 2, c: 3 });
    const b = specHash({ c: 3, a: 1, b: 2 });
    assert.equal(a, b);
  });

  it("is sensitive to array order", () => {
    const a = specHash({ tiles: [1, 2, 3] });
    const b = specHash({ tiles: [3, 2, 1] });
    assert.notEqual(a, b);
  });

  it("ignores undefined properties (same as omitting them)", () => {
    const a = specHash({ name: "x", description: undefined });
    const b = specHash({ name: "x" });
    assert.equal(a, b);
  });

  it("distinguishes null from undefined", () => {
    const a = specHash({ description: null });
    const b = specHash({ description: undefined });
    assert.notEqual(a, b);
  });

  it("changes when any leaf value changes", () => {
    const base = specHash({ name: "growth", pinned: false });
    assert.notEqual(base, specHash({ name: "growth ", pinned: false }));
    assert.notEqual(base, specHash({ name: "growth", pinned: true }));
  });

  it("returns a 16-character lowercase hex digest", () => {
    const h = specHash({ anything: "here" });
    assert.match(h, /^[0-9a-f]{16}$/);
  });
});
