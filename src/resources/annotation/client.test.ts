import { describe, expect, it } from "vitest";
import { ServerAnnotationSchema } from "./client.js";

// Shape hand-derived from a real GET /api/projects/{id}/annotations/{id}/
// response (project 806).
const realAnnotation = {
  id: 42,
  content: "Deployed v2.3\n\n<!-- iac:annotations:deploy-v23 iac:hash:abcd1234 -->",
  date_marker: "2026-08-01T00:00:00Z",
  creation_type: "GIT",
  dashboard_item: null,
  dashboard_id: null,
  scope: "project",
  emoji: null,
  hidden_in_user_interface: true,
  deleted: false,
  created_at: "2026-07-24T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
};

describe("ServerAnnotationSchema", () => {
  it("parses a real annotation payload", () => {
    const parsed = ServerAnnotationSchema.parse(realAnnotation);
    expect(parsed.id).toBe(42);
    expect(parsed.scope).toBe("project");
    expect(parsed.content).toContain("iac:annotations:deploy-v23");
    expect(parsed.hidden_in_user_interface).toBe(true);
  });

  it("parses a dashboard_item-scoped annotation with an insight ref", () => {
    const parsed = ServerAnnotationSchema.parse({
      ...realAnnotation,
      scope: "dashboard_item",
      dashboard_item: 18104,
    });
    expect(parsed.dashboard_item).toBe(18104);
  });

  it("throws when id is missing", () => {
    const { id: _omit, ...withoutId } = realAnnotation;
    void _omit;
    expect(() => ServerAnnotationSchema.parse(withoutId)).toThrow();
  });
});
