import { cohort } from "../../../src/index.js";

// Behavioral cohort: signed up at least 14 days ago and has never completed a
// core action. Useful as a "win-back email" audience.
export default cohort({
  key: "trial-ghosts",
  name: "Trial ghosts",
  description: "Signed up, never came back. We send them a sad email.",
  filters: {
    properties: {
      type: "AND",
      values: [
        {
          type: "behavioral",
          value: "performed_event_first_time",
          key: "user_signed_up",
          event_type: "events",
          time_value: 14,
          time_interval: "day",
          negation: false,
        },
        {
          type: "behavioral",
          value: "performed_event",
          key: "core_action_completed",
          event_type: "events",
          time_value: 90,
          time_interval: "day",
          operator: "exact",
          operator_value: 0,
        },
      ],
    },
  },
});
