import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { cohort, type Cohort } from "./sdk.js";
import type { ServerCohort } from "./client.js";
import { cohortHash, validateCohorts } from "./pipeline.js";

const sampleFilters = {
  properties: {
    type: "AND" as const,
    values: [
      {
        type: "person",
        key: "email",
        operator: "icontains",
        value: "@example.com",
      },
    ],
  },
};

function spec(key: string, overrides: Partial<Cohort> = {}): Cohort {
  return cohort({
    key,
    name: `Cohort ${key}`,
    filters: sampleFilters,
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:cohorts:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: number,
  key: string,
  hash: string,
  overrides: Partial<ServerCohort> = {},
): ServerCohort {
  return {
    id,
    name: `Cohort ${key}`,
    description: marker(key, hash),
    is_static: false,
    ...overrides,
  } as ServerCohort;
}

function desiredFor(cohorts: Cohort[]): DesiredState {
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
    "project-settings",
  ]) {
    state.set(k, []);
  }
  state.set(
    "cohorts",
    cohorts.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerCohort[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["insights", []],
    ["dashboards", []],
    ["feature-flags", []],
    ["endpoints", []],
    ["property-groups", []],
    ["event-definitions", []],
    ["experiment-holdouts", []],
    ["experiment-saved-metrics", []],
    ["experiments", []],
    ["project-settings", []],
    ["cohorts", rows],
  ]);
}

describe("cohort pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor([spec("paying-eu")]), currentFor([]));
    expect(result.get("cohorts")!.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("paying-eu");
    const server = serverRow(5, "paying-eu", cohortHash(desired));
    expect(diff(desiredFor([desired]), currentFor([server])).get("cohorts")!.ops[0]!.kind).toBe(
      "unchanged",
    );
  });

  it("updates when hash differs", () => {
    const desired = spec("paying-eu");
    const server = serverRow(5, "paying-eu", "stalehash");
    expect(diff(desiredFor([desired]), currentFor([server])).get("cohorts")!.ops[0]!.kind).toBe(
      "update",
    );
  });

  it("classifies a server-only managed cohort as orphan", () => {
    const server = serverRow(99, "ghost", "any");
    const slice = diff(desiredFor([]), currentFor([server])).get("cohorts")!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores rows without the marker", () => {
    const handBuilt: ServerCohort = {
      id: 99,
      name: "Hand-built",
      description: "no marker",
      is_static: false,
    } as ServerCohort;
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("cohorts")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("cohort validation", () => {
  it("accepts a behavioral cohort", () => {
    expect(validateCohorts([spec("ok")])).toEqual([]);
  });

  it("accepts a static cohort", () => {
    expect(
      validateCohorts([cohort({ key: "static-ok", name: "Static", is_static: true })]),
    ).toEqual([]);
  });

  it("rejects a cohort with no source declared", () => {
    const issues = validateCohorts([cohort({ key: "empty", name: "Empty" })]);
    expect(issues.some((m) => m.includes("must declare one source"))).toBeTruthy();
  });

  it("rejects a cohort declaring multiple sources", () => {
    const issues = validateCohorts([
      cohort({
        key: "double",
        name: "Double",
        is_static: true,
        filters: sampleFilters,
      }),
    ]);
    expect(issues.some((m) => m.includes("more than one source"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateCohorts([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate cohort key"))).toBeTruthy();
  });

  it("rejects invalid key pattern", () => {
    const issues = validateCohorts([spec("not valid!")]);
    expect(issues.some((m) => m.includes("must match"))).toBeTruthy();
  });
});
