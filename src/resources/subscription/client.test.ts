import { describe, expect, it } from "vitest";
import { ServerSubscriptionSchema } from "./client.js";

// Shape hand-derived from a real GET /api/environments/{id}/subscriptions/{id}/
// response (project 806).
const realSubscription = {
  id: 67,
  title: "Weekly report\n\n<!-- iac:subscriptions:weekly iac:hash:abcd1234 -->",
  insight: 18104,
  dashboard: null,
  target_type: "email",
  target_value: "ops@example.com",
  frequency: "weekly",
  interval: 1,
  start_date: "2026-08-01T00:00:00Z",
  byweekday: null,
  bysetpos: null,
  count: null,
  until_date: null,
  enabled: true,
  integration_id: null,
  summary_enabled: false,
  deleted: false,
  created_at: "2026-07-24T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
};

describe("ServerSubscriptionSchema", () => {
  it("parses a real subscription payload", () => {
    const parsed = ServerSubscriptionSchema.parse(realSubscription);
    expect(parsed.id).toBe(67);
    expect(parsed.target_type).toBe("email");
    expect(parsed.insight).toBe(18104);
    expect(parsed.title).toContain("iac:subscriptions:weekly");
  });

  it("parses a slack subscription with an integration id", () => {
    const parsed = ServerSubscriptionSchema.parse({
      ...realSubscription,
      target_type: "slack",
      target_value: "#alerts",
      integration_id: 12,
    });
    expect(parsed.target_type).toBe("slack");
    expect(parsed.integration_id).toBe(12);
  });

  it("throws when id is missing", () => {
    const { id: _omit, ...withoutId } = realSubscription;
    void _omit;
    expect(() => ServerSubscriptionSchema.parse(withoutId)).toThrow();
  });
});
