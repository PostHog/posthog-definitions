import { describe, expect, it } from "vitest";
import type { PullRenderContext } from "../../pull/types.js";
import { renderToFile } from "./codegen.js";
import type { ServerProjectSettings } from "./client.js";

function makeCtx(): PullRenderContext {
  return {
    uniqueSlug: (base) => base,
    importForServerId: () => {
      throw new Error("no imports expected");
    },
    importForServerIdOptional: () => undefined,
    warn: () => {},
  };
}

function settings(overrides: Record<string, unknown> = {}): ServerProjectSettings {
  return {
    id: 1,
    name: "Production",
    ...overrides,
  } as ServerProjectSettings;
}

describe("project-settings codegen", () => {
  it("emits projectSettings() with name + flagged fields", () => {
    const result = renderToFile(
      settings({
        timezone: "UTC",
        anonymize_ips: true,
        session_recording_opt_in: true,
        autocapture_opt_out: false,
      }),
      makeCtx(),
    );
    if ("skipped" in result) throw new Error(`Expected RenderedFile: ${result.reason}`);
    expect(result.filename).toBe("settings.ts");
    expect(result.specKey).toBe("project-settings");
    expect(result.contents).toContain(
      'import { projectSettings } from "@posthog/definitions";',
    );
    expect(result.contents).toContain('name: "Production"');
    expect(result.contents).toContain('timezone: "UTC"');
    expect(result.contents).toContain("anonymize_ips: true");
    expect(result.contents).toContain("session_recording_opt_in: true");
    expect(result.contents).toContain("autocapture_opt_out: false");
  });

  it("ignores null and empty-array values", () => {
    const result = renderToFile(
      settings({
        timezone: null,
        recording_domains: [],
        person_display_name_properties: ["email", "name"],
      }),
      makeCtx(),
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).not.toContain("timezone:");
    expect(result.contents).not.toContain("recording_domains:");
    expect(result.contents).toContain("person_display_name_properties");
  });

  it("emits array fields as raw JSON", () => {
    const result = renderToFile(
      settings({ app_urls: ["https://app.example.com", "https://staging.example.com"] }),
      makeCtx(),
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).toContain("app_urls:");
    expect(result.contents).toContain("https://app.example.com");
  });

  it("skips when no curated fields are present beyond required name", () => {
    // Force every curated field — including name — to undefined/null.
    const empty = { id: 1 } as unknown as ServerProjectSettings;
    const result = renderToFile(empty, makeCtx());
    expect("skipped" in result).toBe(true);
  });

  it("excludes fields outside the curated allowlist", () => {
    const result = renderToFile(
      settings({
        // api_token is server-managed; the allowlist must not surface it even
        // when the server returns it.
        api_token: "secret-token-xyz",
        timezone: "UTC",
      }),
      makeCtx(),
    );
    if ("skipped" in result) throw new Error("Unexpected skip");
    expect(result.contents).not.toContain("api_token");
    expect(result.contents).not.toContain("secret-token-xyz");
    expect(result.contents).toContain('timezone: "UTC"');
  });
});
