import { describe, expect, it } from "vitest";
import { ServerDashboardTemplateSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/projects/{id}/dashboard_templates/{id}/ response (project 806).
const realTemplate = {
  id: "019f90ac-d895-0000-80ae-7b149b3e4a2f",
  template_name: "Growth overview",
  dashboard_description: "Signups, activation, and retention at a glance",
  tags: ["iac:dashboard-templates:growth", "iac:hash:abcd1234", "growth"],
  dashboard_filters: { date_from: "-30d" },
  variables: [{ id: "a1", name: "Event", type: "event", required: true }],
  tiles: [
    {
      name: "Signups",
      type: "INSIGHT",
      color: null,
      layouts: {},
      query: { kind: "TrendsQuery", series: [{ kind: "EventsNode", event: "$pageview" }] },
    },
  ],
  scope: "team",
  is_featured: false,
  deleted: null,
  created_at: "2026-07-23T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
  team_id: 806,
};

describe("ServerDashboardTemplateSchema", () => {
  it("parses a real dashboard-template payload", () => {
    const parsed = ServerDashboardTemplateSchema.parse(realTemplate);
    expect(parsed.id).toBe("019f90ac-d895-0000-80ae-7b149b3e4a2f");
    expect(parsed.template_name).toBe("Growth overview");
    expect(parsed.scope).toBe("team");
    expect(parsed.tiles).toHaveLength(1);
    expect(parsed.tags).toContain("iac:dashboard-templates:growth");
  });

  it("coerces null tags to an empty array", () => {
    const parsed = ServerDashboardTemplateSchema.parse({ ...realTemplate, tags: null });
    expect(parsed.tags).toEqual([]);
  });

  it("throws when a required field is missing (id)", () => {
    const { id: _omit, ...withoutId } = realTemplate;
    void _omit;
    expect(() => ServerDashboardTemplateSchema.parse(withoutId)).toThrow();
  });
});
