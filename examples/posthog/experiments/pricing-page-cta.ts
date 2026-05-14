import { experiment } from "../../../src/index.js";
import flag from "./pricing-page-cta-flag.js";
import enterpriseHoldout from "./enterprise-holdout.js";
import trialLength from "./trial-length-metric.js";
import ticketRate from "./ticket-rate-metric.js";

// Hypothesis: "Start free" beats "Get started" by 0.3%, which is enough to
// win a slack argument. Demonstrates a second experiment shape: enterprise
// holdout, a mean primary metric, and a ratio secondary metric.
export default experiment({
  key: "pricing-page-cta",
  name: "Pricing page CTA copy",
  description:
    "Hypothesis: changing the primary CTA on /pricing from 'Get started' to 'Start free' lifts trial_started by 5% without raising support volume.",
  type: "web",
  featureFlag: flag,
  holdout: enterpriseHoldout,
  lifecycle: "draft",
  parameters: {
    feature_flag_variants: [
      { key: "control", name: "Get started", rollout_percentage: 50 },
      { key: "test", name: "Start free", rollout_percentage: 50 },
    ],
    minimum_detectable_effect: 5,
    rollout_percentage: 100,
  },
  primarySavedMetrics: [trialLength],
  secondarySavedMetrics: [ticketRate],
});
