import { describe, expect, it } from "vitest";
import { ServerMessageTemplateSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/environments/{id}/messaging_templates/{id}/ response (project 806).
const realTemplate = {
  id: "019f90f8-1f1b-0000-747d-7d0d6b714f5f",
  name: "Welcome email",
  description: "Onboarding\n\n<!-- iac:messaging-templates:welcome iac:hash:abcd1234 -->",
  type: "email",
  message_category: null,
  content: {
    templating: "liquid",
    email: {
      subject: "Welcome {{ person.name }}",
      text: "Hi there",
      html: "<p>Hi there</p>",
      design: { body: { rows: [] } },
    },
  },
  deleted: false,
  created_at: "2026-07-23T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
};

describe("ServerMessageTemplateSchema", () => {
  it("parses a real messaging template payload", () => {
    const parsed = ServerMessageTemplateSchema.parse(realTemplate);
    expect(parsed.id).toBe("019f90f8-1f1b-0000-747d-7d0d6b714f5f");
    expect(parsed.type).toBe("email");
    expect(parsed.content?.email).toMatchObject({ subject: "Welcome {{ person.name }}" });
  });

  it("parses when message_category carries a uuid", () => {
    const parsed = ServerMessageTemplateSchema.parse({
      ...realTemplate,
      message_category: "019f0000-0000-0000-0000-000000000000",
    });
    expect(parsed.message_category).toBe("019f0000-0000-0000-0000-000000000000");
  });

  it("throws when name is missing", () => {
    const { name: _omit, ...withoutName } = realTemplate;
    void _omit;
    expect(() => ServerMessageTemplateSchema.parse(withoutName)).toThrow();
  });
});
