import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { displayJson, renderLines } from "./display.js";

describe("displayJson", () => {
  it("renders identical lines for objects with the same keys in a different order", () => {
    const a = displayJson({ a: 1, b: { x: "x", y: "y" }, c: 3 });
    const b = displayJson({ c: 3, b: { y: "y", x: "x" }, a: 1 });
    assert.deepEqual(renderLines(a), renderLines(b));
  });

  it("preserves array order", () => {
    const a = renderLines(displayJson({ items: [1, 2, 3] }));
    const b = renderLines(displayJson({ items: [3, 2, 1] }));
    assert.notDeepEqual(a, b);
  });

  it("treats undefined fields as omitted", () => {
    const a = renderLines(displayJson({ name: "x", description: undefined }));
    const b = renderLines(displayJson({ name: "x" }));
    assert.deepEqual(a, b);
  });

  it("keeps null fields visible", () => {
    const withNull = renderLines(displayJson({ description: null }));
    const withoutKey = renderLines(displayJson({}));
    assert.notDeepEqual(withNull, withoutKey);
  });
});
