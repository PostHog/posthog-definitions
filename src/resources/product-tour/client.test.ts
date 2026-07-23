import { describe, expect, it } from "vitest";
import { ServerProductTourSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/projects/{id}/product_tours/{id}/ response (project 806).
const realTour = {
  id: "18880131-ee7b-44eb-b2eb-293c6c0bad6b",
  name: "Onboarding tour",
  description: "First-run tour\n\n<!-- iac:product-tours:onboarding iac:hash:abcd1234 -->",
  content: { steps: [{ title: "Welcome" }] },
  auto_launch: true,
  start_date: "2026-08-01T00:00:00Z",
  end_date: null,
  archived: false,
  // Read-only fields the server always includes:
  linked_flag: null,
  internal_targeting_flag: null,
  targeting_flag_filters: null,
  draft_content: null,
  has_draft: false,
  created_at: "2026-07-23T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
};

describe("ServerProductTourSchema", () => {
  it("parses a real product tour payload", () => {
    const parsed = ServerProductTourSchema.parse(realTour);
    expect(parsed.id).toBe("18880131-ee7b-44eb-b2eb-293c6c0bad6b");
    expect(parsed.auto_launch).toBe(true);
    expect(parsed.start_date).toBe("2026-08-01T00:00:00Z");
    expect(parsed.content).toMatchObject({ steps: [{ title: "Welcome" }] });
  });

  it("parses the minimal list shape (null dates)", () => {
    const parsed = ServerProductTourSchema.parse({ ...realTour, start_date: null, auto_launch: false });
    expect(parsed.start_date).toBeNull();
  });

  it("throws when name is missing", () => {
    const { name: _omit, ...withoutName } = realTour;
    void _omit;
    expect(() => ServerProductTourSchema.parse(withoutName)).toThrow();
  });
});
