import { describe, expect, it } from "vitest";
import { displayJson, filterUserTags, isManagedTag, renderLines } from "./display.js";

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

describe("isManagedTag", () => {
  it("recognises the iac: prefix as managed", () => {
    expect(isManagedTag("iac:insights:growth")).toBe(true);
    expect(isManagedTag("iac:hash:abc123")).toBe(true);
  });

  it("treats anything without iac: prefix as user-owned", () => {
    expect(isManagedTag("growth")).toBe(false);
    expect(isManagedTag("priority")).toBe(false);
  });

  it("does not match substrings or near-prefixes", () => {
    expect(isManagedTag("not-iac:")).toBe(false);
    expect(isManagedTag("iac")).toBe(false);
  });

  it("treats the empty string as not managed", () => {
    expect(isManagedTag("")).toBe(false);
  });
});

describe("filterUserTags", () => {
  it("strips managed tags and keeps user tags in original order", () => {
    expect(filterUserTags(["growth", "iac:insights:growth", "priority", "iac:hash:abc"])).toEqual([
      "growth",
      "priority",
    ]);
  });

  it("treats undefined as empty", () => {
    expect(filterUserTags(undefined)).toEqual([]);
  });

  it("returns an empty array when every tag is managed", () => {
    expect(filterUserTags(["iac:a", "iac:b"])).toEqual([]);
  });

  it("returns the input unchanged when no managed tags are present", () => {
    expect(filterUserTags(["growth", "priority"])).toEqual(["growth", "priority"]);
  });
});
