import { featureFlag } from "../../../src/index.js";

// Boolean (no multivariate) gated on a person-property filter. Beta means we
// will email an apology if it breaks, so we keep it scoped to customers who
// opted into the beta program in their account settings.
export default featureFlag({
  key: "beta-api-v2",
  name: "Beta API v2 — opt-in",
  active: true,
  filters: {
    groups: [
      {
        properties: [
          { key: "beta_program_opt_in", type: "person", operator: "exact", value: ["true"] },
        ],
        rollout_percentage: 100,
      },
    ],
  },
  ensure_experience_continuity: false,
  evaluation_runtime: "server",
  tags: ["api", "beta"],
});
