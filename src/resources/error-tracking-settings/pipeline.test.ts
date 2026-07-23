import { describe, expect, it } from "vitest";
import { errorTrackingSettings, type ErrorTrackingSettings } from "./sdk.js";
import type { ServerErrorTrackingSettings } from "./client.js";
import { diffErrorTrackingSettings, validateErrorTrackingSettings } from "./pipeline.js";

function server(overrides: Partial<ServerErrorTrackingSettings> = {}): ServerErrorTrackingSettings {
  return {
    project_rate_limit_value: null,
    project_rate_limit_bucket_size_minutes: null,
    per_issue_rate_limit_value: null,
    per_issue_rate_limit_bucket_size_minutes: null,
    ...overrides,
  };
}

describe("error-tracking-settings field diff", () => {
  it("reports nothing changed when every declared field matches the server", () => {
    const spec: ErrorTrackingSettings = errorTrackingSettings({ project_rate_limit_value: 1000 });
    expect(diffErrorTrackingSettings(spec, server({ project_rate_limit_value: 1000 }))).toEqual([]);
  });

  it("emits a change for a declared field that differs", () => {
    const spec: ErrorTrackingSettings = errorTrackingSettings({ project_rate_limit_value: 1000 });
    expect(diffErrorTrackingSettings(spec, server({ project_rate_limit_value: 500 }))).toEqual([
      { field: "project_rate_limit_value", before: 500, after: 1000 },
    ]);
  });

  it("never emits a change for an undeclared field, regardless of server value", () => {
    const spec: ErrorTrackingSettings = errorTrackingSettings({ project_rate_limit_value: 1000 });
    const result = diffErrorTrackingSettings(
      spec,
      server({ project_rate_limit_value: 1000, per_issue_rate_limit_value: 42 }),
    );
    expect(result).toEqual([]);
  });

  it("treats explicit null (remove the limit) distinctly from missing", () => {
    const spec: ErrorTrackingSettings = errorTrackingSettings({ project_rate_limit_value: null });
    expect(diffErrorTrackingSettings(spec, server({ project_rate_limit_value: 1000 }))).toEqual([
      { field: "project_rate_limit_value", before: 1000, after: null },
    ]);
  });

  it("does not flag a field that's null on both sides", () => {
    const spec: ErrorTrackingSettings = errorTrackingSettings({ project_rate_limit_value: null });
    expect(diffErrorTrackingSettings(spec, server())).toEqual([]);
  });
});

describe("error-tracking-settings validation", () => {
  it("rejects a zero or negative rate limit", () => {
    expect(
      validateErrorTrackingSettings([errorTrackingSettings({ project_rate_limit_value: 0 })]),
    ).toHaveLength(1);
    expect(
      validateErrorTrackingSettings([errorTrackingSettings({ per_issue_rate_limit_value: -5 })]),
    ).toHaveLength(1);
  });

  it("accepts a positive integer or null", () => {
    expect(
      validateErrorTrackingSettings([
        errorTrackingSettings({ project_rate_limit_value: 1000, per_issue_rate_limit_value: null }),
      ]),
    ).toEqual([]);
  });

  it("rejects declaring the singleton more than once", () => {
    const issues = validateErrorTrackingSettings([
      errorTrackingSettings({ project_rate_limit_value: 1 }),
      errorTrackingSettings({ per_issue_rate_limit_value: 1 }),
    ]);
    expect(issues.some((m) => m.includes("singleton"))).toBeTruthy();
  });

  it("accepts an empty spec (nothing declared)", () => {
    expect(validateErrorTrackingSettings([errorTrackingSettings({})])).toEqual([]);
  });
});
