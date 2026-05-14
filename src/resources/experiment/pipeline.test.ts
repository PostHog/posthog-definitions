import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { featureFlag, type FeatureFlag } from "../feature-flag/sdk.js";
import { experimentHoldout } from "../experiment-holdout/sdk.js";
import { experimentSavedMetric } from "../experiment-saved-metric/sdk.js";
import { experiment, type Experiment } from "./sdk.js";
import type { ServerExperiment } from "./client.js";
import { experimentHash, validateExperiments } from "./pipeline.js";

const flag: FeatureFlag = featureFlag({
  key: "my-flag",
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});

const billingMetric = experimentSavedMetric({
  key: "billing-conv",
  name: "Billing conversion",
  query: { kind: "ExperimentMetric", metric_type: "mean" },
});

const euHoldout = experimentHoldout({
  key: "eu-only",
  name: "EU holdout",
  filters: [{ properties: [], rollout_percentage: 10 }],
});

function spec(key: string, overrides: Partial<Experiment> = {}): Experiment {
  return experiment({
    key,
    name: `Experiment ${key}`,
    featureFlag: flag,
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:experiments:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: number,
  key: string,
  hash: string,
  overrides: Partial<ServerExperiment> = {},
): ServerExperiment {
  return {
    id,
    name: `Experiment ${key}`,
    description: marker(key, hash),
    feature_flag_key: "my-flag",
    archived: false,
    metrics: [],
    metrics_secondary: [],
    saved_metrics: [],
    status: "draft",
    ...overrides,
  };
}

function desiredFor(args: {
  experiments: Experiment[];
  flags?: FeatureFlag[];
  holdouts?: Array<ReturnType<typeof experimentHoldout>>;
  savedMetrics?: Array<ReturnType<typeof experimentSavedMetric>>;
}): DesiredState {
  const state: DesiredState = new Map();
  for (const k of ["insights", "dashboards", "endpoints", "property-groups", "event-definitions"]) {
    state.set(k, []);
  }
  state.set(
    "feature-flags",
    (args.flags ?? [flag]).map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "experiment-holdouts",
    (args.holdouts ?? []).map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "experiment-saved-metrics",
    (args.savedMetrics ?? []).map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "experiments",
    args.experiments.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerExperiment[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", []],
    ["event-definitions", []],
    ["experiment-holdouts", []],
    ["experiment-saved-metrics", []],
    ["experiments", rows],
  ]);
}

describe("experiment pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor({ experiments: [spec("onboarding")] }), currentFor([]));
    expect(result.get("experiments")!.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("onboarding");
    const server = serverRow(11, "onboarding", experimentHash(desired));
    expect(
      diff(desiredFor({ experiments: [desired] }), currentFor([server])).get("experiments")!.ops[0]!
        .kind,
    ).toBe("unchanged");
  });

  it("updates when hash differs", () => {
    const desired = spec("onboarding");
    const server = serverRow(11, "onboarding", "stale");
    expect(
      diff(desiredFor({ experiments: [desired] }), currentFor([server])).get("experiments")!.ops[0]!
        .kind,
    ).toBe("update");
  });

  it("update fires when lifecycle changes", () => {
    const desiredDraft = spec("onboarding", { lifecycle: "draft" });
    const desiredRunning = spec("onboarding", { lifecycle: "running" });
    expect(experimentHash(desiredDraft)).not.toBe(experimentHash(desiredRunning));
  });

  it("safety invariant: ignores rows without marker", () => {
    const handBuilt: ServerExperiment = {
      id: 99,
      name: "Hand-built",
      description: "no marker here",
      feature_flag_key: "x",
      archived: false,
      metrics: [],
      metrics_secondary: [],
      saved_metrics: [],
    };
    const result = diff(desiredFor({ experiments: [] }), currentFor([handBuilt]));
    const slice = result.get("experiments")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("experiment validation", () => {
  it("rejects reference to undeclared flag", () => {
    const orphan: FeatureFlag = featureFlag({
      key: "orphan-flag",
      filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
    });
    const exp = spec("onboarding", { featureFlag: orphan });
    const issues = validateExperiments([exp], desiredFor({ experiments: [exp], flags: [] }));
    expect(issues.some((m) => m.includes("unknown feature flag"))).toBeTruthy();
  });

  it("rejects archived without stopped lifecycle", () => {
    const exp = spec("onboarding", { archived: true });
    const issues = validateExperiments([exp], desiredFor({ experiments: [exp] }));
    expect(issues.some((m) => m.includes("can only be archived"))).toBeTruthy();
  });

  it("requires conclusion when lifecycle is stopped", () => {
    const exp = spec("onboarding", { lifecycle: "stopped" });
    const issues = validateExperiments([exp], desiredFor({ experiments: [exp] }));
    expect(issues.some((m) => m.includes("requires a conclusion"))).toBeTruthy();
  });

  it("variant rollout percentages must sum to 100", () => {
    const exp = spec("onboarding", {
      parameters: {
        feature_flag_variants: [
          { key: "control", rollout_percentage: 30 },
          { key: "test", rollout_percentage: 30 },
        ],
      },
    });
    const issues = validateExperiments([exp], desiredFor({ experiments: [exp] }));
    expect(issues.some((m) => m.includes("sum to 60"))).toBeTruthy();
  });

  it("rejects unknown holdout reference", () => {
    const exp = spec("onboarding", { holdout: euHoldout });
    const issues = validateExperiments(
      [exp],
      desiredFor({ experiments: [exp], holdouts: [] }),
    );
    expect(issues.some((m) => m.includes("unknown experiment holdout"))).toBeTruthy();
  });

  it("rejects unknown saved metric reference", () => {
    const exp = spec("onboarding", { primarySavedMetrics: [billingMetric] });
    const issues = validateExperiments(
      [exp],
      desiredFor({ experiments: [exp], savedMetrics: [] }),
    );
    expect(issues.some((m) => m.includes("unknown experiment saved metric"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    const exp = spec("onboarding");
    expect(validateExperiments([exp], desiredFor({ experiments: [exp] }))).toEqual([]);
  });

  it("accepts a full spec with all refs declared", () => {
    const exp = spec("onboarding", {
      lifecycle: "stopped",
      conclusion: "won",
      conclusionComment: "Test won",
      archived: true,
      holdout: euHoldout,
      primarySavedMetrics: [billingMetric],
    });
    const issues = validateExperiments(
      [exp],
      desiredFor({
        experiments: [exp],
        holdouts: [euHoldout],
        savedMetrics: [billingMetric],
      }),
    );
    expect(issues).toEqual([]);
  });
});
