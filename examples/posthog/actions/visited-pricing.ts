import { action } from "../../../src/index.js";

// A URL-pattern action with no event — matches any pageview to a pricing
// page, including localized variants. Useful as a funnel step on top of
// `$pageview` without dragging the URL filter into every insight that needs
// it.
export default action({
  key: "visited-pricing",
  name: "Visited pricing page",
  description: "Any pageview on /pricing (any locale).",
  steps: [
    {
      event: "$pageview",
      url: "/pricing",
      url_matching: "regex",
    },
  ],
  tags: ["growth", "funnel"],
});
