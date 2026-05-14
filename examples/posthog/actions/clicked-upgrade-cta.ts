import { action } from "../../../src/index.js";

// An autocapture-style action matching the upgrade button across the marketing
// site. Multiple steps are OR-ed together, so this fires whether the user
// clicks the navbar CTA or the pricing-page CTA.
export default action({
  key: "clicked-upgrade-cta",
  name: "Clicked upgrade CTA",
  description: "Any click on a primary upgrade button across the site.",
  steps: [
    {
      event: "$autocapture",
      selector: "button[data-attr='upgrade-nav']",
      url: "/",
      url_matching: "contains",
    },
    {
      event: "$autocapture",
      selector: "a[data-attr='pricing-upgrade']",
      url: "/pricing",
      url_matching: "contains",
    },
  ],
  tags: ["growth", "monetization"],
});
