import { describe, expect, it } from "vitest";
import { ServerHogFlowSchema } from "./client.js";

// Shape hand-derived from a real GET
// /api/environments/{id}/hog_flows/{id}/ response (project 806).
const realFlow = {
  id: "019f90ec-db26-0000-f7fe-30b8ff4c002a",
  name: "Welcome series",
  description: "Onboarding drip\n\n<!-- iac:hog-flows:welcome iac:hash:abcd1234 -->",
  status: "draft",
  exit_condition: "exit_only_at_end",
  version: 1,
  actions: [
    { id: "trigger_node", type: "trigger", name: "Trigger", config: { type: "event", filters: {} } },
    { id: "exit_node", type: "exit", name: "Exit", config: { reason: "done" } },
  ],
  edges: [{ from: "trigger_node", to: "exit_node", type: "continue" }],
  variables: [],
  created_at: "2026-07-23T00:00:00Z",
};

describe("ServerHogFlowSchema", () => {
  it("parses a real hog flow payload", () => {
    const parsed = ServerHogFlowSchema.parse(realFlow);
    expect(parsed.id).toBe("019f90ec-db26-0000-f7fe-30b8ff4c002a");
    expect(parsed.status).toBe("draft");
    expect(parsed.actions).toHaveLength(2);
    expect(parsed.edges?.[0]).toMatchObject({ from: "trigger_node", to: "exit_node" });
  });

  it("throws on an unknown status", () => {
    expect(() => ServerHogFlowSchema.parse({ ...realFlow, status: "paused" })).toThrow();
  });

  it("throws when id is missing", () => {
    const { id: _omit, ...withoutId } = realFlow;
    void _omit;
    expect(() => ServerHogFlowSchema.parse(withoutId)).toThrow();
  });
});
