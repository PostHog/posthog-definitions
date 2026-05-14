import { experiment } from "../../../src/index.js";
import flag from "./onboarding-redesign-flag.js";
import euHoldout from "./eu-customers-holdout.js";
import activationMetric from "./activation-d7-metric.js";

// The experiment itself, referencing the sibling specs by import. The same
// import graph that drives compile-time validation in your editor also drives
// apply's resolution of feature_flag_key, holdout_id, and saved_metrics_ids.
export default experiment({
  key: "onboarding-redesign",
  name: "Onboarding redesign — D7 activation",
  description:
    "Hypothesis: the redesigned, checklist-driven onboarding flow lifts D7 activation by 5–10%. " +
    "Variant: test uses a guided checklist; control retains the existing free-form tour.",
  type: "product",
  featureFlag: flag,
  holdout: euHoldout,
  lifecycle: "draft",
  parameters: {
    feature_flag_variants: [
      { key: "control", name: "Existing onboarding", rollout_percentage: 50 },
      { key: "test", name: "Redesigned onboarding", rollout_percentage: 50 },
    ],
    minimum_detectable_effect: 20,
    rollout_percentage: 100,
  },
  primarySavedMetrics: [activationMetric],
});
