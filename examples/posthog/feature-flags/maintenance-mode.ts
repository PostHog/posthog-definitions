import { featureFlag } from "../../../src/index.js";

// The big red button. `active: false` and a 0%-rollout group means the flag
// is wired up everywhere in the app but evaluates to `false` until somebody
// flips it. The JSON payload carries the banner copy callers should render.
export default featureFlag({
  key: "maintenance-mode",
  name: "Maintenance mode banner",
  active: false,
  filters: {
    groups: [{ properties: [], rollout_percentage: 0 }],
    payloads: {
      true: JSON.stringify({
        banner: "We're upgrading the database. Things will be slow for ~30 min.",
        severity: "warning",
      }),
    },
  },
  tags: ["ops", "kill-switch"],
});
