import { experimentHoldout } from "../../../src/index.js";

// Enterprise customers are excluded from experiments because their CSM will
// hear about it. Reusable across multiple experiments by importing this
// default export from each experiment file.
export default experimentHoldout({
  key: "enterprise",
  name: "Enterprise customers",
  description: "Hold enterprise plan customers out of product experiments by default.",
  filters: [
    {
      properties: [
        { key: "plan", type: "person", operator: "exact", value: ["enterprise"] },
      ],
      rollout_percentage: 100,
    },
  ],
});
