import { logsSamplingRule } from "../../../src/index.js";

// Priority 10 — evaluated first, so the noisiest thing (load-balancer health
// pings) gets dropped before any rate-limit rule wastes budget on it. Order is
// meaningful here: lower priority wins, so keep the drops ahead of the limits.
export default logsSamplingRule({
  key: "drop_healthchecks",
  name: "Drop /healthz access logs",
  ruleType: "path_drop",
  priority: 10,
  enabled: true,
  config: {
    filter_group: {
      type: "AND",
      values: [
        {
          type: "AND",
          values: [{ key: "http.route", operator: "exact", value: "/healthz", type: "log_attribute" }],
        },
      ],
    },
  },
});
