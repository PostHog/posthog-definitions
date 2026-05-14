import { featureFlag } from "../../../src/index.js";

// Feature flag bound to the onboarding-redesign experiment. The experiment
// imports this default export; the flag's `key` is what the server sees as
// `feature_flag_key`. Multivariate split mirrors the experiment's variants.
export default featureFlag({
  key: "onboarding-redesign-flag",
  name: "Onboarding redesign rollout",
  active: true,
  filters: {
    groups: [{ properties: [], rollout_percentage: 100 }],
    multivariate: {
      variants: [
        { key: "control", name: "Existing onboarding", rollout_percentage: 50 },
        { key: "test", name: "Redesigned onboarding", rollout_percentage: 50 },
      ],
    },
  },
});
