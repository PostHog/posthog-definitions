import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import { loadAcceptanceConfig, withCleanup } from "../../test-helpers/acceptance.js";
import { getProjectSettings, patchProjectSettings } from "./client.js";
import { diffProjectSettings, runProjectSettingsOp } from "./pipeline.js";
import { projectSettings, type ProjectSettings } from "./sdk.js";

/**
 * Project-settings is a singleton mutating a shared row on the test project.
 * Integration and acceptance assertions live in one file (and one
 * `describe`) so they run sequentially — vitest's default file-level
 * parallelism would otherwise race PATCHes against the same row.
 *
 * Every test reads the original value, registers a restore cleanup, then
 * mutates. The restore puts the project back to the state it was in before
 * the test ran.
 */

function desiredFor(spec: ProjectSettings | null): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "feature-flags",
    "endpoints",
    "property-groups",
    "event-definitions",
    "experiment-holdouts",
    "experiment-saved-metrics",
    "experiments",
  ]) {
    state.set(k, []);
  }
  state.set("project-settings", spec ? [{ path: "<acceptance>", spec }] : []);
  return state;
}

describe("project-settings (client + pipeline acceptance)", () => {
  it("fetches the singleton settings row", async () => {
    const config = loadAcceptanceConfig();
    const settings = await getProjectSettings(config);
    expect(typeof settings.id).toBe("number");
    expect(typeof settings.name).toBe("string");
  });

  it("patches a scalar field via the raw client and echoes the change back", async () => {
    const config = loadAcceptanceConfig();
    const original = await getProjectSettings(config);
    await withCleanup(async (registerCleanup) => {
      const originalTz: "UTC" | "Europe/London" | undefined =
        (original as { timezone?: string }).timezone === "Europe/London"
          ? "Europe/London"
          : (original as { timezone?: string }).timezone === "UTC"
            ? "UTC"
            : undefined;
      registerCleanup(async () => {
        if (originalTz !== undefined) {
          await patchProjectSettings(config, { timezone: originalTz }).catch(() => undefined);
        }
      });

      const newTz: "UTC" | "Europe/London" = originalTz === "UTC" ? "Europe/London" : "UTC";
      const updated = await patchProjectSettings(config, { timezone: newTz });
      expect((updated as { timezone?: string }).timezone).toBe(newTz);

      const refetched = await getProjectSettings(config);
      expect((refetched as { timezone?: string }).timezone).toBe(newTz);
    });
  });

  it("client does not touch undeclared fields", async () => {
    const config = loadAcceptanceConfig();
    const original = await getProjectSettings(config);
    await withCleanup(async (registerCleanup) => {
      const originalAnonymize = (original as { anonymize_ips?: boolean }).anonymize_ips;
      registerCleanup(async () => {
        if (originalAnonymize !== undefined) {
          await patchProjectSettings(config, { anonymize_ips: originalAnonymize }).catch(
            () => undefined,
          );
        }
      });

      await patchProjectSettings(config, { anonymize_ips: !originalAnonymize });
      const after = await getProjectSettings(config);
      expect((after as { name?: string }).name).toBe((original as { name?: string }).name);
    });
  });

  it("pipeline patches declared fields, re-diffs unchanged, restores on cleanup", async () => {
    const config = loadAcceptanceConfig();
    const original = await getProjectSettings(config);
    const originalTz: "UTC" | "Europe/London" =
      (original as { timezone?: string }).timezone === "Europe/London" ? "Europe/London" : "UTC";
    const originalWeekStart: 0 | 1 =
      (original as { week_start_day?: number }).week_start_day === 1 ? 1 : 0;

    await withCleanup(async (registerCleanup) => {
      registerCleanup(async () => {
        await patchProjectSettings(config, {
          timezone: originalTz,
          week_start_day: originalWeekStart,
        }).catch(() => undefined);
      });

      const newTz: "UTC" | "Europe/London" = originalTz === "UTC" ? "Europe/London" : "UTC";
      const newWeekStart: 0 | 1 = originalWeekStart === 0 ? 1 : 0;
      const spec = projectSettings({ timezone: newTz, week_start_day: newWeekStart });

      const ctx = newApplyContext();
      const opUpdate: ResourceOp<ProjectSettings, typeof original> = {
        kind: "update",
        spec,
        server: original,
      };
      await runProjectSettingsOp(config, opUpdate, ctx);

      const afterUpdate = await getProjectSettings(config);
      expect((afterUpdate as { timezone?: string }).timezone).toBe(newTz);
      expect((afterUpdate as { week_start_day?: number }).week_start_day).toBe(newWeekStart);

      expect(diffProjectSettings(spec, afterUpdate)).toEqual([]);

      const result = diff(
        desiredFor(spec),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["property-groups", []],
          ["event-definitions", []],
          ["experiment-holdouts", []],
          ["experiment-saved-metrics", []],
          ["experiments", []],
          ["project-settings", [afterUpdate]],
        ]),
      );
      const op = result.get("project-settings")!.ops[0];
      expect(op?.kind).toBe("unchanged");
    });

    const restored = await getProjectSettings(config);
    expect((restored as { timezone?: string }).timezone).toBe(originalTz);
    expect((restored as { week_start_day?: number }).week_start_day).toBe(originalWeekStart);
  });

  it("pipeline never patches undeclared fields, even if the server has a non-default value", async () => {
    const config = loadAcceptanceConfig();
    const original = await getProjectSettings(config);
    const originalName = (original as { name?: string }).name ?? "";
    const originalTz: "UTC" | "Europe/London" =
      (original as { timezone?: string }).timezone === "Europe/London" ? "Europe/London" : "UTC";

    await withCleanup(async (registerCleanup) => {
      registerCleanup(async () => {
        await patchProjectSettings(config, { timezone: originalTz }).catch(() => undefined);
      });

      const newTz: "UTC" | "Europe/London" = originalTz === "UTC" ? "Europe/London" : "UTC";
      const spec = projectSettings({ timezone: newTz });
      const ctx = newApplyContext();
      await runProjectSettingsOp(config, { kind: "update", spec, server: original }, ctx);

      const afterUpdate = await getProjectSettings(config);
      expect((afterUpdate as { timezone?: string }).timezone).toBe(newTz);
      expect((afterUpdate as { name?: string }).name).toBe(originalName);
    });
  });
});
