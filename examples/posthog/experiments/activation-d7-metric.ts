import { experimentSavedMetric } from "../../../src/index.js";

// A reusable experiment metric: D7 activation funnel. Attached as a primary
// metric on the onboarding-redesign experiment; could be shared across other
// experiments later by adding more `primarySavedMetrics` references.
export default experimentSavedMetric({
  key: "activation-d7",
  name: "D7 activation",
  description: "Pct of new signups who completed at least one core action by day 7.",
  query: {
    kind: "ExperimentMetric",
    metric_type: "funnel",
    series: [
      { kind: "EventsNode", event: "user_signed_up" },
      { kind: "EventsNode", event: "core_action_completed" },
    ],
  },
});
