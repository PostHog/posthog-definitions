// Early-access feature gated behind a feature flag. The flag is declared here
// and linked by value — apply resolves it to the feature_flag_id. `stage`
// moves through concept → alpha → beta → general-availability as the opt-in
// programme progresses; bump it in code and re-apply.
import { earlyAccessFeature, featureFlag } from "../../../src/index.js";

const darkModeFlag = featureFlag({
  key: "dark-mode",
  name: "Dark mode",
  active: true,
  filters: { groups: [{ properties: [], rollout_percentage: 0 }] },
});

export default earlyAccessFeature({
  key: "dark-mode",
  name: "Dark mode",
  description: "Opt-in dark theme for the whole app. Managed by the design team.",
  stage: "beta",
  documentationUrl: "https://example.com/docs/dark-mode",
  featureFlag: darkModeFlag,
  payload: {
    // Arbitrary metadata surfaced on the opt-in page.
    tagline: "Easier on the eyes, especially at 2am.",
  },
});
