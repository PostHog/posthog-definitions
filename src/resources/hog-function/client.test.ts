import { describe, expect, it } from "vitest";
import { ServerHogFunctionSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/projects/{id}/hog_functions/{id}/ response (project 806). Note the
// secret input reads back masked as `{ secret: true }`, and non-secret inputs
// carry server-computed bytecode/order alongside their value.
const realFn = {
  id: "019f90da-df91-0000-6fbc-c7ff8167d1fd",
  type: "destination",
  name: "ActiveCampaign sync",
  description: "Sync users\n\n<!-- iac:hog-functions:ac iac:hash:abcd1234 -->",
  enabled: false,
  deleted: false,
  inputs: {
    accountName: { value: "acme", bytecode: ["_H", 1, 32, "acme"], order: 0 },
    apiKey: { secret: true },
  },
  filters: { source: "events" },
  template: { id: "template-activecampaign", type: "destination" },
  template_id: null,
  bytecode: ["_H", 1],
  status: { state: 0, tokens: 0 },
};

describe("ServerHogFunctionSchema", () => {
  it("parses a real hog function payload", () => {
    const parsed = ServerHogFunctionSchema.parse(realFn);
    expect(parsed.id).toBe("019f90da-df91-0000-6fbc-c7ff8167d1fd");
    expect(parsed.type).toBe("destination");
    expect(parsed.template?.id).toBe("template-activecampaign");
    expect(parsed.inputs?.apiKey).toEqual({ secret: true });
  });

  it("parses the minimal list shape (no inputs)", () => {
    const { inputs: _omit, ...minimal } = realFn;
    void _omit;
    const parsed = ServerHogFunctionSchema.parse(minimal);
    expect(parsed.inputs).toBeUndefined();
    expect(parsed.description).toContain("iac:hog-functions:ac");
  });

  it("throws when id is missing", () => {
    const { id: _omit, ...withoutId } = realFn;
    void _omit;
    expect(() => ServerHogFunctionSchema.parse(withoutId)).toThrow();
  });
});
