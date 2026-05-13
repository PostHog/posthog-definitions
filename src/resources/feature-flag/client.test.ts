import { describe, expect, it } from "vitest";
import { ServerFeatureFlagSchema } from "./client.js";

// Hand-derived from a real GET /api/projects/<id>/feature_flags/<id>/ response.
// Many fields the server returns are intentionally omitted to verify .loose() behaviour.
const realFixture = {
  id: 12345,
  key: "new-onboarding-flow",
  name: "Enable the redesigned onboarding flow",
  filters: {
    groups: [
      {
        properties: [
          {
            key: "email",
            type: "person",
            operator: "icontains",
            value: "@posthog.com",
          },
        ],
        rollout_percentage: 100,
        variant: null,
      },
    ],
    multivariate: null,
    payloads: {},
  },
  active: true,
  deleted: false,
  created_by: {
    id: 1,
    uuid: "01900000-0000-0000-0000-000000000000",
    distinct_id: "user-1",
    first_name: "Test",
    email: "test@example.com",
    is_email_verified: true,
  },
  created_at: "2026-05-01T12:00:00Z",
  updated_at: "2026-05-13T09:00:00Z",
  tags: ["iac:feature-flags:new-onboarding-flow", "iac:hash:abcdef0123456789"],
  version: 3,
  ensure_experience_continuity: false,
  is_remote_configuration: false,
  has_encrypted_payloads: false,
  evaluation_runtime: "all",
  bucketing_identifier: "distinct_id",
  experiment_set: [],
  surveys: [],
  features: [],
  usage_dashboard: null,
  can_edit: true,
  status: { code: "active", text: "active" },
  // Unknown future field — should not break parsing thanks to .loose().
  some_future_field: "ignored",
};

describe("ServerFeatureFlagSchema", () => {
  it("parses a real-shape response cleanly", () => {
    const parsed = ServerFeatureFlagSchema.parse(realFixture);
    expect(parsed.id).toBe(12345);
    expect(parsed.key).toBe("new-onboarding-flow");
    expect(parsed.active).toBe(true);
    expect(parsed.tags.includes("iac:feature-flags:new-onboarding-flow")).toBeTruthy();
  });

  it("throws when a required field is missing", () => {
    const { key: _omitted, ...broken } = realFixture;
    expect(() => ServerFeatureFlagSchema.parse(broken)).toThrow();
  });

  it("throws when `id` has the wrong type", () => {
    expect(() =>
      ServerFeatureFlagSchema.parse({ ...realFixture, id: "not-a-number" }),
    ).toThrow();
  });
});
