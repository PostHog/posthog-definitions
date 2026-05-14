import { experimentHoldout } from "../../../src/index.js";

// Reusable holdout group attached to one or more experiments. Filters mirror
// the feature-flag conditions shape — same release-condition vocabulary.
export default experimentHoldout({
  key: "eu-customers",
  name: "EU customers (legal review pending)",
  description: "Exclude EU customers until the redesigned flow is reviewed.",
  filters: [
    {
      properties: [
        { key: "$geoip_country_code", type: "person", value: ["DE", "FR", "ES", "IT"] },
      ],
      rollout_percentage: 100,
    },
  ],
});
