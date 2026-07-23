import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { featureFlag, type FeatureFlag } from "../feature-flag/sdk.js";
import { survey, type Survey, type SurveyQuestion } from "./sdk.js";
import type { ServerSurvey } from "./client.js";
import { surveyHash, validateSurveys } from "./pipeline.js";

const flag: FeatureFlag = featureFlag({
  key: "beta-users",
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});

const npsQuestion: SurveyQuestion = {
  type: "rating",
  question: "How likely are you to recommend us?",
  display: "number",
  scale: 10,
};

function spec(key: string, overrides: Partial<Survey> = {}): Survey {
  return survey({
    key,
    name: `Survey ${key}`,
    type: "popover",
    questions: [npsQuestion],
    ...overrides,
  });
}

function marker(key: string, hash: string): string {
  return `<!-- iac:surveys:${key} iac:hash:${hash} -->`;
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  overrides: Partial<ServerSurvey> = {},
): ServerSurvey {
  return {
    id,
    name: `Survey ${key}`,
    description: marker(key, hash),
    type: "popover",
    questions: [npsQuestion],
    archived: false,
    ...overrides,
  };
}

function desiredFor(args: { surveys: Survey[]; flags?: FeatureFlag[] }): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "feature-flags",
    (args.flags ?? [flag]).map((spec) => ({ path: "<test>", spec })),
  );
  state.set(
    "surveys",
    args.surveys.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerSurvey[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([
    ["feature-flags", []],
    ["surveys", rows],
  ]);
}

describe("survey pipeline", () => {
  it("creates when no server row matches", () => {
    const result = diff(desiredFor({ surveys: [spec("nps")] }), currentFor([]));
    expect(result.get("surveys")!.ops[0]!.kind).toBe("create");
  });

  it("unchanged when hashes match", () => {
    const desired = spec("nps");
    const server = serverRow("uuid-1", "nps", surveyHash(desired));
    expect(diff(desiredFor({ surveys: [desired] }), currentFor([server])).get("surveys")!.ops[0]!.kind).toBe(
      "unchanged",
    );
  });

  it("updates when hash differs", () => {
    const desired = spec("nps");
    const server = serverRow("uuid-1", "nps", "stale");
    expect(diff(desiredFor({ surveys: [desired] }), currentFor([server])).get("surveys")!.ops[0]!.kind).toBe(
      "update",
    );
  });

  it("classifies a server-only managed survey as an orphan", () => {
    const server = serverRow("uuid-9", "ghost", "any");
    const result = diff(desiredFor({ surveys: [] }), currentFor([server]));
    expect(result.get("surveys")!.orphans.length).toBe(1);
  });

  it("safety invariant: ignores rows without the marker", () => {
    const handBuilt: ServerSurvey = {
      id: "uuid-h",
      name: "Hand-built",
      description: "no marker here",
      type: "popover",
      questions: [],
      archived: false,
    };
    const result = diff(desiredFor({ surveys: [] }), currentFor([handBuilt]));
    const slice = result.get("surveys")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });

  it("status change alters the hash (lifecycle is declarative)", () => {
    expect(surveyHash(spec("nps", { status: "draft" }))).not.toBe(
      surveyHash(spec("nps", { status: "running" })),
    );
  });

  it("flag reference is hashed by key, not server id", () => {
    // Two runs with the same linked flag key must hash identically regardless
    // of environment-specific ids (the id never enters the hash).
    const a = spec("nps", { linkedFlag: flag });
    const b = spec("nps", { linkedFlag: featureFlag({ key: "beta-users", filters: { groups: [] } }) });
    expect(surveyHash(a)).toBe(surveyHash(b));
  });
});

describe("survey validation", () => {
  it("requires at least one question", () => {
    const s = spec("nps", { questions: [] });
    expect(validateSurveys([s], desiredFor({ surveys: [s] })).some((m) => m.includes("at least one question"))).toBe(
      true,
    );
  });

  it("choice questions need non-empty choices", () => {
    const s = spec("feedback", {
      questions: [{ type: "single_choice", question: "Pick one", choices: [] }],
    });
    expect(validateSurveys([s], desiredFor({ surveys: [s] })).some((m) => m.includes("non-empty choices"))).toBe(true);
  });

  it("rejects reference to an undeclared linked flag", () => {
    const orphan = featureFlag({ key: "not-declared", filters: { groups: [] } });
    const s = spec("nps", { linkedFlag: orphan });
    const issues = validateSurveys([s], desiredFor({ surveys: [s], flags: [] }));
    expect(issues.some((m) => m.includes("unknown linked feature flag"))).toBe(true);
  });

  it("accepts a minimal valid spec", () => {
    const s = spec("nps");
    expect(validateSurveys([s], desiredFor({ surveys: [s] }))).toEqual([]);
  });

  it("accepts a full spec with a declared linked flag", () => {
    const s = spec("nps", { linkedFlag: flag, status: "running", conditions: { url: "/app" } });
    expect(validateSurveys([s], desiredFor({ surveys: [s] }))).toEqual([]);
  });
});
