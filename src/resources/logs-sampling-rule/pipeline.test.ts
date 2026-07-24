import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { LogsSamplingRule } from "./sdk.js";
import type { ServerLogsSamplingRule } from "./client.js";
import { logsSamplingRuleHash, validateLogsSamplingRules } from "./pipeline.js";

function spec(key: string, overrides: Partial<LogsSamplingRule> = {}): LogsSamplingRule {
  return {
    key,
    name: `Rule ${key}`,
    ruleType: "rate_limit",
    config: { logs_per_second: 1000 },
    priority: 10,
    ...overrides,
  };
}

function serverRow(id: string, key: string, hash: string, userName = "Rule"): ServerLogsSamplingRule {
  const marker = `<!-- iac:logs-sampling-rules:${key} iac:hash:${hash} -->`;
  return {
    id,
    name: `${userName}\n\n${marker}`,
    rule_type: "rate_limit",
    config: { logs_per_second: 1000 },
    priority: 10,
    enabled: false,
  };
}

function desiredFor(specs: LogsSamplingRule[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "logs-sampling-rules",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerLogsSamplingRule[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["logs-sampling-rules", rows]]);
}

describe("logs-sampling-rule pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("r1")]), currentFor([])).get("logs-sampling-rules")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("r1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("id1", "r1", logsSamplingRuleHash(desired), "Rule r1")]),
    ).get("logs-sampling-rules")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("r1")]),
      currentFor([serverRow("id1", "r1", "stale00000000")]),
    ).get("logs-sampling-rules")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when priority changes (order is part of identity)", () => {
    expect(logsSamplingRuleHash(spec("r"))).not.toBe(
      logsSamplingRuleHash(spec("r", { priority: 20 })),
    );
  });

  it("hash changes when config, rule_type, name, or enabled change", () => {
    const base = spec("r");
    expect(logsSamplingRuleHash(base)).not.toBe(logsSamplingRuleHash(spec("r", { config: { logs_per_second: 5 } })));
    expect(logsSamplingRuleHash(base)).not.toBe(logsSamplingRuleHash(spec("r", { ruleType: "path_drop" })));
    expect(logsSamplingRuleHash(base)).not.toBe(logsSamplingRuleHash(spec("r", { name: "Other" })));
    expect(logsSamplingRuleHash(base)).not.toBe(logsSamplingRuleHash(spec("r", { enabled: true })));
  });

  it("classifies a server-only managed rule as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("id9", "ghost", "any")])).get(
      "logs-sampling-rules",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerLogsSamplingRule = {
      id: "hand",
      name: "A sampling rule created in the UI",
      rule_type: "rate_limit",
      config: { logs_per_second: 1 },
      enabled: true,
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("logs-sampling-rules")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("logs-sampling-rule validation", () => {
  const state: DesiredState = new Map();

  it("requires a name (it carries the marker)", () => {
    const issues = validateLogsSamplingRules([spec("r", { name: "" })], state);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("rejects an unknown ruleType", () => {
    const issues = validateLogsSamplingRules(
      [spec("r", { ruleType: "nope" as LogsSamplingRule["ruleType"] })],
      state,
    );
    expect(issues.some((m) => m.includes("ruleType must be one of"))).toBeTruthy();
  });

  it("rejects a negative priority", () => {
    const issues = validateLogsSamplingRules([spec("r", { priority: -1 })], state);
    expect(issues.some((m) => m.includes("non-negative integer"))).toBeTruthy();
  });

  it("rejects a name that, with the marker, exceeds the 255-char cap", () => {
    const issues = validateLogsSamplingRules([spec("r", { name: "A".repeat(255) })], state);
    expect(issues.some((m) => m.includes("name is too long"))).toBeTruthy();
  });

  it("accepts a valid rule", () => {
    expect(validateLogsSamplingRules([spec("ok")], state)).toEqual([]);
  });
});
