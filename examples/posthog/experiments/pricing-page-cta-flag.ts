import { featureFlag } from "../../../src/index.js";

// Feature flag bound to the pricing-page-cta experiment. Boolean (not
// multivariate) — the experiment itself owns the variant split via
// `parameters.feature_flag_variants`.
export default featureFlag({
  key: "pricing-page-cta-flag",
  name: "Pricing page CTA rollout",
  active: true,
  filters: {
    groups: [{ properties: [], rollout_percentage: 100 }],
    multivariate: {
      variants: [
        { key: "control", name: "Get started", rollout_percentage: 50 },
        { key: "test", name: "Start free", rollout_percentage: 50 },
      ],
    },
  },
});
