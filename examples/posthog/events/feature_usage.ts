import { propertyGroup } from "../../../src/index.js";

// Catch-all property group for feature-touch events. Everything optional —
// attach it to anything you might later regret not measuring.
export default propertyGroup({
  key: "feature_usage",
  description: "Feature-touch envelope: which feature, which surface, which experiment cell.",
  properties: {
    feature_key: {
      type: "String",
      description: "Stable identifier of the feature being used",
    },
    surface: {
      type: "String",
      description: "Where the interaction happened (web, mobile, api, cli, …)",
    },
    experiment_variant: {
      type: "String",
      description: "Variant key if the call site is inside a running experiment",
    },
  },
});
