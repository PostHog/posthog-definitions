import { experimentSavedMetric } from "../../../src/index.js";

// Mean-typed metric: time from trial_started → user_upgraded, in days.
// Lower is better. Surprisingly contentious.
export default experimentSavedMetric({
  key: "trial-length-days",
  name: "Trial length (days)",
  description: "Mean number of days between trial_started and user_upgraded per exposed user.",
  query: {
    kind: "ExperimentMetric",
    metric_type: "mean",
    source: {
      kind: "EventsNode",
      event: "user_upgraded",
      math: "avg",
      math_property: "trial_days_to_paid",
    },
  },
});
