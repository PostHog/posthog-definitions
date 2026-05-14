import { experimentSavedMetric } from "../../../src/index.js";

// Ratio metric: tickets opened per pageview. Goes up when the experiment is
// bad. Attach as a secondary so a regression flags itself without dominating
// the headline number.
export default experimentSavedMetric({
  key: "ticket-rate",
  name: "Support ticket rate",
  description: "support_ticket_opened events per $pageview within the exposure window.",
  query: {
    kind: "ExperimentMetric",
    metric_type: "ratio",
    numerator: { kind: "EventsNode", event: "support_ticket_opened" },
    denominator: { kind: "EventsNode", event: "$pageview" },
  },
});
