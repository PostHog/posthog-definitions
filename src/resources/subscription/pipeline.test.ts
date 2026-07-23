import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { Subscription } from "./sdk.js";
import type { Insight } from "../insight/sdk.js";
import type { ServerSubscription } from "./client.js";
import { subscriptionHash, validateSubscriptions } from "./pipeline.js";

const insightRef = { key: "signups" } as Insight;

function spec(key: string, overrides: Partial<Subscription> = {}): Subscription {
  return {
    key,
    title: `Weekly ${key}`,
    insight: insightRef,
    targetType: "email",
    target: "ops@example.com",
    frequency: "weekly",
    startDate: "2026-08-01T00:00:00Z",
    ...overrides,
  };
}

function serverRow(id: number, key: string, hash: string, extraTitle = "Weekly"): ServerSubscription {
  const marker = `<!-- iac:subscriptions:${key} iac:hash:${hash} -->`;
  return {
    id,
    title: `${extraTitle}\n\n${marker}`,
    insight: 100,
    target_type: "email",
    target_value: "ops@example.com",
    frequency: "weekly",
    start_date: "2026-08-01T00:00:00Z",
  };
}

function desiredFor(specs: Subscription[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "subscriptions",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerSubscription[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["subscriptions", rows]]);
}

describe("subscription pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("s1")]), currentFor([])).get("subscriptions")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("s1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow(1, "s1", subscriptionHash(desired), "Weekly s1")]),
    ).get("subscriptions")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("s1")]),
      currentFor([serverRow(1, "s1", "stale00000000")]),
    ).get("subscriptions")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when the delivery target or frequency changes", () => {
    expect(subscriptionHash(spec("s"))).not.toBe(
      subscriptionHash(spec("s", { target: "other@example.com" })),
    );
    expect(subscriptionHash(spec("s"))).not.toBe(subscriptionHash(spec("s", { frequency: "daily" })));
  });

  it("classifies a server-only managed subscription as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow(9, "ghost", "any")])).get(
      "subscriptions",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerSubscription = {
      id: 99,
      title: "A subscription set up in the UI",
      insight: 5,
      target_type: "email",
      target_value: "someone@example.com",
      frequency: "daily",
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("subscriptions")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("subscription validation", () => {
  const state: DesiredState = new Map([
    ["insights", [{ path: "<t>", spec: { key: "signups" } }]],
    ["dashboards", [{ path: "<t>", spec: { key: "growth" } }]],
  ]);

  it("requires exactly one of insight/dashboard (neither)", () => {
    const issues = validateSubscriptions(
      [spec("s", { insight: undefined })],
      state,
    );
    expect(issues.some((m) => m.includes("exactly one of"))).toBeTruthy();
  });

  it("requires exactly one of insight/dashboard (both)", () => {
    const issues = validateSubscriptions(
      [spec("s", { dashboard: { key: "growth" } as Subscription["dashboard"] })],
      state,
    );
    expect(issues.some((m) => m.includes("exactly one of"))).toBeTruthy();
  });

  it("rejects a reference not declared in the same run", () => {
    const issues = validateSubscriptions(
      [spec("s", { insight: { key: "nope" } as Insight })],
      state,
    );
    expect(issues.some((m) => m.includes("unknown insight"))).toBeTruthy();
  });

  it("rejects a title that, with the identity marker, exceeds the 100-char cap", () => {
    const longTitle = "A".repeat(60); // 60 + key + ~55 marker overhead > 100
    const issues = validateSubscriptions([spec("s", { title: longTitle })], state);
    expect(issues.some((m) => m.includes("title is too long"))).toBeTruthy();
  });

  it("accepts a valid insight-scoped subscription", () => {
    expect(validateSubscriptions([spec("ok")], state)).toEqual([]);
  });
});
