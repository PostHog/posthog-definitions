import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { featureFlag, type FeatureFlag } from "../feature-flag/sdk.js";
import { earlyAccessFeature, type EarlyAccessFeature } from "./sdk.js";
import type { ServerEarlyAccessFeature } from "./client.js";
import { earlyAccessFeatureHash, validateEarlyAccessFeatures } from "./pipeline.js";

const flag: FeatureFlag = featureFlag({
  key: "dark-mode",
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});

function spec(key: string, overrides: Partial<EarlyAccessFeature> = {}): EarlyAccessFeature {
  return earlyAccessFeature({
    key,
    name: `EAF ${key}`,
    stage: "beta",
    featureFlag: flag,
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:early-access-features:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  overrides: Partial<ServerEarlyAccessFeature> = {},
): ServerEarlyAccessFeature {
  return {
    id,
    name: `EAF ${key}`,
    description: marker(key, hash),
    stage: "beta",
    feature_flag: { id: 1, key: "dark-mode" },
    ...overrides,
  };
}

function desiredFor(args: { eafs: EarlyAccessFeature[]; flags?: FeatureFlag[] }): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "feature-flags",
    (args.flags ?? [flag]).map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "early-access-features",
    args.eafs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerEarlyAccessFeature[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["feature-flags", []],
    ["early-access-features", rows],
  ]);
}

describe("early access feature pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor({ eafs: [spec("dark-mode-eaf")] }), currentFor([]));
    expect(result.get("early-access-features")!.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("dm");
    const server = serverRow("uuid-1", "dm", earlyAccessFeatureHash(desired));
    expect(
      diff(desiredFor({ eafs: [desired] }), currentFor([server])).get("early-access-features")!.ops[0]!.kind,
    ).toBe("unchanged");
  });

  it("updates when stage changes (hash differs)", () => {
    const desired = spec("dm", { stage: "general-availability" });
    const server = serverRow("uuid-1", "dm", earlyAccessFeatureHash(spec("dm", { stage: "beta" })));
    expect(
      diff(desiredFor({ eafs: [desired] }), currentFor([server])).get("early-access-features")!.ops[0]!.kind,
    ).toBe("update");
  });

  it("classifies a server-only managed row as an orphan", () => {
    const server = serverRow("uuid-9", "ghost", "any");
    expect(diff(desiredFor({ eafs: [] }), currentFor([server])).get("early-access-features")!.orphans.length).toBe(1);
  });

  it("safety invariant: ignores rows without the marker", () => {
    const handBuilt: ServerEarlyAccessFeature = {
      id: "uuid-h",
      name: "Hand-built",
      description: "no marker",
      stage: "beta",
    };
    const result = diff(desiredFor({ eafs: [] }), currentFor([handBuilt]));
    const slice = result.get("early-access-features")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("flag reference is hashed by key, not id", () => {
    const a = spec("dm", { featureFlag: flag });
    const b = spec("dm", { featureFlag: featureFlag({ key: "dark-mode", filters: { groups: [] } }) });
    expect(earlyAccessFeatureHash(a)).toBe(earlyAccessFeatureHash(b));
  });
});

describe("early access feature validation", () => {
  it("rejects an undeclared feature flag", () => {
    const orphan = featureFlag({ key: "nope", filters: { groups: [] } });
    const s = spec("dm", { featureFlag: orphan });
    const issues = validateEarlyAccessFeatures([s], desiredFor({ eafs: [s], flags: [] }));
    expect(issues.some((m) => m.includes("unknown feature flag"))).toBe(true);
  });

  it("rejects a multivariate linked flag", () => {
    const mv = featureFlag({
      key: "mv-flag",
      filters: {
        groups: [{ properties: [], rollout_percentage: 100 }],
        multivariate: {
          variants: [
            { key: "control", rollout_percentage: 50 },
            { key: "test", rollout_percentage: 50 },
          ],
        },
      },
    });
    const s = spec("dm", { featureFlag: mv });
    const issues = validateEarlyAccessFeatures([s], desiredFor({ eafs: [s], flags: [mv] }));
    expect(issues.some((m) => m.includes("multivariate"))).toBe(true);
  });

  it("accepts a minimal valid spec", () => {
    const s = spec("dm");
    expect(validateEarlyAccessFeatures([s], desiredFor({ eafs: [s] }))).toEqual([]);
  });
});
