import { cohort } from "../../../src/index.js";

// Behavioral cohort combining two signals: declining session count over the
// last 30 days AND a rising number of support tickets. The renewal-quarter
// mood ring.
export default cohort({
  key: "at-risk-orgs",
  name: "At-risk orgs",
  description: "Falling engagement and rising support volume — the renewal-quarter mood ring.",
  filters: {
    properties: {
      type: "AND",
      values: [
        {
          type: "behavioral",
          value: "performed_event",
          key: "$pageview",
          event_type: "events",
          time_value: 30,
          time_interval: "day",
          operator: "lt",
          operator_value: 5,
        },
        {
          type: "behavioral",
          value: "performed_event",
          key: "support_ticket_opened",
          event_type: "events",
          time_value: 30,
          time_interval: "day",
          operator: "gte",
          operator_value: 2,
        },
      ],
    },
  },
});
