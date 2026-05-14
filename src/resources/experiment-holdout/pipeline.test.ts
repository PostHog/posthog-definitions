import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { experimentHoldout, type ExperimentHoldout } from "./sdk.js";
import type { ServerExperimentHoldout } from "./client.js";
import { experimentHoldoutHash, validateExperimentHoldouts } from "./pipeline.js";

function spec(key: string, overrides: Partial<ExperimentHoldout> = {}): ExperimentHoldout {
  return experimentHoldout({
    key,
    name: `Holdout ${key}`,
    filters: [{ properties: [], rollout_percentage: 10 }],
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:experiment-holdouts:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: number,
  key: string,
  hash: string,
  overrides: Partial<ServerExperimentHoldout> = {},
): ServerExperimentHoldout {
  return {
    id,
    name: `Holdout ${key}`,
    description: marker(key, hash),
    filters: [{ properties: [], rollout_percentage: 10 }],
    ...overrides,
  };
}

function desiredFor(holdouts: ExperimentHoldout[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "feature-flags",
    "endpoints",
    "property-groups",
    "event-definitions",
  ]) {
    state.set(k, []);
  }
  state.set(
    "experiment-holdouts",
    holdouts.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerExperimentHoldout[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", []],
    ["event-definitions", []],
    ["experiment-holdouts", rows],
  ]);
}

describe("experiment holdout pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor([spec("eu-only")]), currentFor([]));
    const slice = result.get("experiment-holdouts")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("eu-only");
    const server = serverRow(7, "eu-only", experimentHoldoutHash(desired));
    const op = diff(desiredFor([desired]), currentFor([server])).get("experiment-holdouts")!
      .ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("updates when hash differs", () => {
    const desired = spec("eu-only");
    const server = serverRow(7, "eu-only", "stalehash");
    const op = diff(desiredFor([desired]), currentFor([server])).get("experiment-holdouts")!
      .ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("safety invariant: ignores rows without marker", () => {
    const handBuilt: ServerExperimentHoldout = {
      id: 99,
      name: "Hand-built",
      description: "no marker",
      filters: [],
    };
    const result = diff(desiredFor([]), currentFor([handBuilt]));
    const slice = result.get("experiment-holdouts")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("experiment holdout validation", () => {
  it("rejects empty filters", () => {
    const issues = validateExperimentHoldouts([spec("empty", { filters: [] })]);
    expect(issues.some((m) => m.includes("at least one filter"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validateExperimentHoldouts([spec("ok")])).toEqual([]);
  });
});
