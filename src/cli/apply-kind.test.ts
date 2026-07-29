import { describe, expect, it } from "vitest";
import { resolveActiveResources } from "./apply.js";
import { parseArgs } from "./args.js";
import { RESOURCES } from "../resources/index.js";

describe("resolveActiveResources", () => {
  it("returns every resource when no kinds are given", () => {
    const res = resolveActiveResources([]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value).toBe(RESOURCES);
  });

  it("restricts to the named kinds", () => {
    const res = resolveActiveResources(["dashboards", "insights"]);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.map((r) => r.name).sort()).toEqual(["dashboards", "insights"]);
    }
  });

  it("preserves RESOURCES' topological order regardless of --kind order", () => {
    // insights run before dashboards in the registry (dependency order).
    const forward = resolveActiveResources(["insights", "dashboards"]);
    const reversed = resolveActiveResources(["dashboards", "insights"]);
    expect(forward.ok && reversed.ok).toBe(true);
    if (forward.ok && reversed.ok) {
      expect(forward.value.map((r) => r.name)).toEqual(reversed.value.map((r) => r.name));
      const idxInsights = RESOURCES.findIndex((r) => r.name === "insights");
      const idxDashboards = RESOURCES.findIndex((r) => r.name === "dashboards");
      const ordered = forward.value.map((r) => r.name);
      // Whichever comes first in RESOURCES comes first here too.
      if (idxInsights < idxDashboards) {
        expect(ordered).toEqual(["insights", "dashboards"]);
      } else {
        expect(ordered).toEqual(["dashboards", "insights"]);
      }
    }
  });

  it("dedupes repeated kinds", () => {
    const res = resolveActiveResources(["cohorts", "cohorts"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value.filter((r) => r.name === "cohorts")).toHaveLength(1);
  });

  it("rejects an unknown kind with a stage:args error listing valid kinds", () => {
    const res = resolveActiveResources(["dashboards", "not_a_kind"]);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.stage).toBe("args");
      expect(res.error).toContain("not_a_kind");
      expect(res.error).toContain("Known:");
    }
  });
});

describe("parseArgs apply --kind", () => {
  it("defaults kinds to an empty array", () => {
    const args = parseArgs(["apply"]);
    expect(args.command).toBe("apply");
    if (args.command === "apply") expect(args.kinds).toEqual([]);
  });

  it("parses a comma-separated --kind list, trimming whitespace", () => {
    const args = parseArgs(["apply", "--kind", "dashboards, feature-flags ,cohorts"]);
    if (args.command === "apply") {
      expect(args.kinds).toEqual(["dashboards", "feature-flags", "cohorts"]);
    }
  });

  it("carries --kind alongside --prune", () => {
    const args = parseArgs(["apply", "--prune", "--kind", "dashboards"]);
    if (args.command === "apply") {
      expect(args.prune).toBe(true);
      expect(args.kinds).toEqual(["dashboards"]);
    }
  });
});
