// Email the growth dashboard to the team every Monday. A subscription targets
// exactly one insight OR one dashboard — here a dashboard, defined inline and
// referenced by object (resolved to its id at apply time).
//
// Delivery note: applying an email subscription INVITES the recipients (PostHog
// emails them). posthog-definitions never sends the one-off "test on save"
// delivery, but the recipient invite is inherent to the product — use real
// addresses only when you mean to.
import { dashboard, insight, subscription, trends } from "../../../src/index.js";

const signups = insight({
  key: "weekly-signups",
  name: "Weekly signups",
  query: trends({ series: [{ event: "signed_up", math: "total" }], interval: "week" }),
});

const growth = dashboard({
  key: "growth-overview",
  name: "Growth overview",
  tiles: [{ insight: signups, layout: { x: 0, y: 0, w: 6, h: 4 } }],
});

export default subscription({
  key: "weekly-growth-email",
  title: "Weekly growth digest",
  dashboard: growth,
  targetType: "email",
  target: "growth-team@example.com",
  frequency: "weekly",
  startDate: "2026-08-03T08:00:00Z",
});
