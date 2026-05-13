import { describe, expect, it } from "vitest";
import { SafetyViolationError } from "./execute.js";

describe("SafetyViolationError", () => {
  it("is an Error subclass with the expected name", () => {
    const err = new SafetyViolationError("insight", 7, "growth");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SafetyViolationError);
    expect(err.name).toBe("SafetyViolationError");
  });

  it("interpolates kind, id, and key into the message", () => {
    const err = new SafetyViolationError("dashboard", 42, "weekly-growth");
    expect(err.message).toContain("dashboard");
    expect(err.message).toContain("42");
    expect(err.message).toContain('key="weekly-growth"');
  });

  it("explains the likely cause (managed marker removed in UI)", () => {
    const err = new SafetyViolationError("insight", 1, "k");
    expect(err.message).toMatch(/iac:\*/);
    expect(err.message).toMatch(/removed in the UI/i);
  });

  it("accepts string ids", () => {
    const err = new SafetyViolationError("endpoint", "abc-123", "k");
    expect(err.message).toContain("abc-123");
  });
});
