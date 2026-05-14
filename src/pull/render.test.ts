import { describe, expect, it } from "vitest";
import {
  formatKey,
  identifierFromSlug,
  isObject,
  renderArray,
  renderImportLine,
  renderObject,
  renderRawLiteral,
  stringLiteral,
} from "./render.js";

describe("render primitives", () => {
  it("quotes a string with JSON escaping", () => {
    expect(stringLiteral("hi")).toBe('"hi"');
    expect(stringLiteral('a "b" c')).toBe('"a \\"b\\" c"');
  });

  it("formatKey leaves bare identifiers unquoted, quotes others", () => {
    expect(formatKey("foo")).toBe("foo");
    expect(formatKey("$bar")).toBe("$bar");
    expect(formatKey("with-dash")).toBe('"with-dash"');
    expect(formatKey("1leading")).toBe('"1leading"');
  });

  it("renderObject lays out fields with trailing commas, indented", () => {
    expect(renderObject({ a: '"x"', b: "1" }, 2)).toBe('{\n  a: "x",\n  b: 1,\n}');
    expect(renderObject({}, 2)).toBe("{}");
  });

  it("renderArray lays out items with trailing commas, indented", () => {
    expect(renderArray(['"a"', '"b"'], 4)).toBe('[\n    "a",\n    "b",\n  ]');
    expect(renderArray([], 2)).toBe("[]");
  });

  it("renderRawLiteral handles primitives, arrays, nested objects", () => {
    expect(renderRawLiteral(null, 2)).toBe("null");
    expect(renderRawLiteral(42, 2)).toBe("42");
    expect(renderRawLiteral(true, 2)).toBe("true");
    expect(renderRawLiteral("x", 2)).toBe('"x"');
    expect(renderRawLiteral([], 2)).toBe("[]");
    expect(renderRawLiteral({}, 2)).toBe("{}");
    const nested = renderRawLiteral({ a: 1, b: ["x"] }, 2);
    expect(nested).toContain("a: 1");
    expect(nested).toContain('"x"');
  });

  it("renderImportLine sorts and dedupes names", () => {
    expect(renderImportLine(["dashboard", "trends", "insight", "dashboard"])).toBe(
      'import { dashboard, insight, trends } from "@posthog/definitions";',
    );
    expect(renderImportLine([])).toBe("");
  });

  it("identifierFromSlug produces valid JS identifiers", () => {
    expect(identifierFromSlug("my-slug")).toBe("my_slug");
    expect(identifierFromSlug("123-numeric")).toBe("_123_numeric");
    expect(identifierFromSlug("ok_id")).toBe("ok_id");
  });

  it("isObject distinguishes objects from arrays and primitives", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject("x")).toBe(false);
  });
});
