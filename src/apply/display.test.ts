import { describe, expect, it } from "vitest";
import { displayJson, renderLines } from "./display.js";

describe("displayJson", () => {
  it("renders identical lines for objects with the same keys in a different order", () => {
    const a = displayJson({ a: 1, b: { x: "x", y: "y" }, c: 3 });
    const b = displayJson({ c: 3, b: { y: "y", x: "x" }, a: 1 });
    expect(renderLines(a)).toEqual(renderLines(b));
  });

  it("preserves array order", () => {
    const a = renderLines(displayJson({ items: [1, 2, 3] }));
    const b = renderLines(displayJson({ items: [3, 2, 1] }));
    expect(a).not.toEqual(b);
  });

  it("treats undefined fields as omitted", () => {
    const a = renderLines(displayJson({ name: "x", description: undefined }));
    const b = renderLines(displayJson({ name: "x" }));
    expect(a).toEqual(b);
  });

  it("keeps null fields visible", () => {
    const withNull = renderLines(displayJson({ description: null }));
    const withoutKey = renderLines(displayJson({}));
    expect(withNull).not.toEqual(withoutKey);
  });
});
