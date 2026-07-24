import { logsSamplingRule } from "../../../src/index.js";

// Priority 20 — runs after the path-drop above. Caps debug-level chatter at
// 500 logs/sec (with a small burst) so a runaway loop can't blow the ingestion
// bill, while errors and warnings sail through untouched.
export default logsSamplingRule({
  key: "cap_debug_volume",
  name: "Rate-limit debug logs",
  ruleType: "rate_limit",
  priority: 20,
  enabled: true,
  config: {
    logs_per_second: 500,
    burst_logs: 2000,
    filter_group: {
      type: "AND",
      values: [
        {
          type: "AND",
          values: [{ key: "severity_text", operator: "exact", value: "debug", type: "log_attribute" }],
        },
      ],
    },
  },
});
