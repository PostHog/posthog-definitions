import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { FeatureFlag } from "./sdk.js";
import type { ServerFeatureFlag } from "./client.js";
import { featureFlagHash, validateFeatureFlags } from "./pipeline.js";

function spec(key: string, overrides: Partial<FeatureFlag> = {}): FeatureFlag {
  return {
    key,
    name: `Flag ${key}`,
    filters: {
      groups: [{ properties: [], rollout_percentage: 100 }],
    },
    ...overrides,
  };
}

function serverRow(
  id: number,
  key: string,
  hash: string,
  extra: string[] = [],
): ServerFeatureFlag {
  return {
    id,
    key,
    name: `Flag ${key}`,
    filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
    active: true,
    tags: [`iac:feature-flags:${key}`, `iac:hash:${hash}`, ...extra],
  };
}

function desiredFor(flags: FeatureFlag[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set("feature-flags", flags.map((spec) => ({ path: "<test>", spec })));
  return state;
}

function currentFor(rows: ServerFeatureFlag[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", rows],
  ]);
}

describe("feature flag pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const result = diff(desiredFor([spec("new-onboarding")]), currentFor([]));
    const slice = result.get("feature-flags")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
    expect(slice.ops[0]!.key).toBe("new-onboarding");
  });

  it("emits unchanged when server hash matches the desired spec's hash", () => {
    const desired = spec("new-onboarding");
    const server = serverRow(42, "new-onboarding", featureFlagHash(desired));
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("feature-flags")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
    if (op.kind === "unchanged") expect(op.serverId).toBe(42);
  });

  it("emits update when server hash differs", () => {
    const desired = spec("new-onboarding");
    const server = serverRow(42, "new-onboarding", "stalehash00000000");
    const result = diff(desiredFor([desired]), currentFor([server]));
    const op = result.get("feature-flags")!.ops[0]!;
    expect(op.kind).toBe("update");
    if (op.kind === "update") expect(op.serverId).toBe(42);
  });

  it("classifies a server-only managed flag as an orphan", () => {
    const server = serverRow(99, "ghost", "any");
    const result = diff(desiredFor([]), currentFor([server]));
    const slice = result.get("feature-flags")!;
    expect(slice.orphans.length).toBe(1);
    expect((slice.orphans[0] as ServerFeatureFlag).id).toBe(99);
  });

  it("safety invariant: ignores server rows without an iac:* tag", () => {
    const handBuilt: ServerFeatureFlag = {
      id: 999,
      key: "hand-built",
      name: "Hand-built",
      filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
      active: true,
      tags: ["my-tag"],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("feature-flags")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("feature flag validation", () => {
  it("rejects keys that don't match the allowed pattern", () => {
    const issues = validateFeatureFlags([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateFeatureFlags([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("requires multivariate variant percentages to sum to 100", () => {
    const issues = validateFeatureFlags([
      spec("mv", {
        filters: {
          groups: [{ properties: [], rollout_percentage: 100 }],
          multivariate: {
            variants: [
              { key: "a", rollout_percentage: 30 },
              { key: "b", rollout_percentage: 30 },
            ],
          },
        },
      }),
    ]);
    expect(issues.some((m) => m.includes("sums to 60"))).toBeTruthy();
  });

  it("rejects encrypted payloads as not yet supported", () => {
    const issues = validateFeatureFlags([
      spec("encrypted", { is_remote_configuration: true, has_encrypted_payloads: true }),
    ]);
    expect(issues.some((m) => m.includes("has_encrypted_payloads"))).toBeTruthy();
  });

  it("rejects dependent flag references as not yet supported", () => {
    const issues = validateFeatureFlags([
      spec("dependent", {
        filters: {
          groups: [
            {
              properties: [{ key: "42", type: "flag", operator: "flag_evaluates_to", value: "true" }],
              rollout_percentage: 100,
            },
          ],
        },
      }),
    ]);
    expect(issues.some((m) => m.includes("dependent flags"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    const issues = validateFeatureFlags([spec("ok")]);
    expect(issues).toEqual([]);
  });
});
