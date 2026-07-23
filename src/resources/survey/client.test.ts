import { describe, expect, it } from "vitest";
import { ServerSurveySchema } from "./client.js";

// Shape hand-derived from a real GET /api/projects/{id}/surveys/{id}/ response.
const realSurvey = {
  id: "019f900c-ca87-0000-525d-d47c991fea7a",
  name: "Quarterly NPS",
  description: "Rolling NPS\n\n<!-- iac:surveys:nps iac:hash:abcd1234 -->",
  type: "popover",
  questions: [
    { id: "q1", type: "rating", question: "How likely?", display: "number", scale: 10 },
  ],
  appearance: { submitButtonText: "Send", whiteLabel: false },
  conditions: { url: "/app", urlMatchType: "icontains" },
  linked_flag_id: 4242,
  linked_flag: { id: 4242, key: "beta-users" },
  targeting_flag: null,
  start_date: "2026-07-01T00:00:00Z",
  end_date: null,
  archived: false,
  responses_limit: null,
  enable_partial_responses: true,
  created_at: "2026-06-01T00:00:00Z",
  created_by: { id: 1, uuid: "u", distinct_id: "d" },
  user_access_level: "editor",
};

describe("ServerSurveySchema", () => {
  it("parses a real survey payload", () => {
    const parsed = ServerSurveySchema.parse(realSurvey);
    expect(parsed.id).toBe("019f900c-ca87-0000-525d-d47c991fea7a");
    expect(parsed.type).toBe("popover");
    expect(parsed.linked_flag_id).toBe(4242);
    expect(parsed.start_date).toBe("2026-07-01T00:00:00Z");
    expect(parsed.questions).toHaveLength(1);
  });

  it("throws when a required field is missing (name)", () => {
    const { name: _omit, ...withoutName } = realSurvey;
    void _omit;
    expect(() => ServerSurveySchema.parse(withoutName)).toThrow();
  });

  it("throws on an unknown survey type", () => {
    expect(() => ServerSurveySchema.parse({ ...realSurvey, type: "banner" })).toThrow();
  });
});
