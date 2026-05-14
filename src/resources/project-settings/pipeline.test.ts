import { describe, expect, it } from "vitest";
import { projectSettings, type ProjectSettings } from "./sdk.js";
import type { ServerProjectSettings } from "./client.js";
import { diffProjectSettings, validateProjectSettings } from "./pipeline.js";

function server(overrides: Partial<ServerProjectSettings> = {}): ServerProjectSettings {
  return {
    id: 1,
    name: "Project",
    timezone: "Europe/London",
    week_start_day: 0,
    autocapture_opt_out: false,
    app_urls: ["https://app.example.com"],
    ...overrides,
  } as ServerProjectSettings;
}

describe("project-settings field diff", () => {
  it("reports nothing changed when every declared field matches the server", () => {
    const spec: ProjectSettings = projectSettings({
      timezone: "Europe/London",
      week_start_day: 0,
    });
    expect(diffProjectSettings(spec, server())).toEqual([]);
  });

  it("emits a change for every declared field whose value differs", () => {
    const spec: ProjectSettings = projectSettings({
      timezone: "UTC",
      week_start_day: 1,
    });
    expect(diffProjectSettings(spec, server())).toEqual([
      { field: "timezone", before: "Europe/London", after: "UTC" },
      { field: "week_start_day", before: 0, after: 1 },
    ]);
  });

  it("never emits a change for an undeclared field, regardless of server value", () => {
    // Spec only declares timezone; server has many other fields with non-default
    // values. The safety invariant: we touch nothing the user didn't declare.
    const spec: ProjectSettings = projectSettings({ timezone: "Europe/London" });
    const result = diffProjectSettings(
      spec,
      server({ week_start_day: 6, autocapture_opt_out: true }),
    );
    expect(result).toEqual([]);
  });

  it("treats explicit null distinctly from missing", () => {
    const spec: ProjectSettings = projectSettings({ autocapture_opt_out: null });
    expect(diffProjectSettings(spec, server({ autocapture_opt_out: true }))).toEqual([
      { field: "autocapture_opt_out", before: true, after: null },
    ]);
  });

  it("does not flag a field that's null on both sides", () => {
    const spec: ProjectSettings = projectSettings({ autocapture_opt_out: null });
    expect(diffProjectSettings(spec, server({ autocapture_opt_out: null }))).toEqual([]);
  });

  it("deep-compares array values for equality", () => {
    const spec: ProjectSettings = projectSettings({
      app_urls: ["https://app.example.com"],
    });
    expect(diffProjectSettings(spec, server())).toEqual([]);
  });

  it("emits a change when an array value differs in content", () => {
    const spec: ProjectSettings = projectSettings({
      app_urls: ["https://app.example.com", "https://staging.example.com"],
    });
    expect(diffProjectSettings(spec, server())).toEqual([
      {
        field: "app_urls",
        before: ["https://app.example.com"],
        after: ["https://app.example.com", "https://staging.example.com"],
      },
    ]);
  });
});

describe("project-settings validation", () => {
  it("accepts a single declared spec", () => {
    expect(validateProjectSettings([projectSettings({ timezone: "UTC" })])).toEqual([]);
  });

  it("rejects multiple declared specs", () => {
    const issues = validateProjectSettings([
      projectSettings({ timezone: "UTC" }),
      projectSettings({ timezone: "Europe/London" }),
    ]);
    expect(issues.some((m) => m.includes("singleton"))).toBeTruthy();
  });
});
