import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { experimentSavedMetric, type ExperimentSavedMetric } from "./sdk.js";
import type { ServerExperimentSavedMetric } from "./client.js";
import {
  experimentSavedMetricHash,
  validateExperimentSavedMetrics,
} from "./pipeline.js";

function spec(
  key: string,
  overrides: Partial<ExperimentSavedMetric> = {},
): ExperimentSavedMetric {
  return experimentSavedMetric({
    key,
    name: `Metric ${key}`,
    query: { kind: "ExperimentMetric", metric_type: "mean" },
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:experiment-saved-metrics:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: number,
  key: string,
  hash: string,
  overrides: Partial<ServerExperimentSavedMetric> = {},
): ServerExperimentSavedMetric {
  return {
    id,
    name: `Metric ${key}`,
    description: marker(key, hash),
    query: { kind: "ExperimentMetric", metric_type: "mean" },
    ...overrides,
  };
}

function desiredFor(metrics: ExperimentSavedMetric[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "feature-flags",
    "endpoints",
    "property-groups",
    "event-definitions",
    "experiment-holdouts",
  ]) {
    state.set(k, []);
  }
  state.set(
    "experiment-saved-metrics",
    metrics.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerExperimentSavedMetric[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", []],
    ["event-definitions", []],
    ["experiment-holdouts", []],
    ["experiment-saved-metrics", rows],
  ]);
}

describe("experiment saved metric pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor([spec("checkout-conversion")]), currentFor([]));
    expect(result.get("experiment-saved-metrics")!.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("checkout-conversion");
    const server = serverRow(5, "checkout-conversion", experimentSavedMetricHash(desired));
    expect(
      diff(desiredFor([desired]), currentFor([server])).get("experiment-saved-metrics")!.ops[0]!
        .kind,
    ).toBe("unchanged");
  });

  it("updates when hash differs", () => {
    const desired = spec("checkout-conversion");
    const server = serverRow(5, "checkout-conversion", "stale");
    expect(
      diff(desiredFor([desired]), currentFor([server])).get("experiment-saved-metrics")!.ops[0]!
        .kind,
    ).toBe("update");
  });

  it("safety invariant: ignores rows without marker", () => {
    const handBuilt: ServerExperimentSavedMetric = {
      id: 99,
      name: "Hand-built",
      description: "no marker",
      query: {},
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("experiment-saved-metrics")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("experiment saved metric validation", () => {
  it("accepts a minimal valid spec", () => {
    expect(validateExperimentSavedMetrics([spec("ok")])).toEqual([]);
  });
});
