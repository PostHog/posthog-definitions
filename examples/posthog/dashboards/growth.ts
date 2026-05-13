import { dashboard, insight, text, trends } from "../../../src/index.js";

const signups = insight({
  key: "weekly-signups",
  name: "Weekly signups",
  description: "Count of `user signed up` events per ISO week.",
  query: trends({
    series: [{ event: "user signed up", math: "total" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

const activeUsers = insight({
  key: "weekly-active",
  name: "Weekly active users",
  query: trends({
    series: [{ event: "$pageview", math: "weekly_active" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

export default dashboard({
  key: "growth",
  name: "Growth (iac)",
  description: "Smoke-test dashboard managed by posthog-definitions.",
  pinned: false,
  tags: ["growth"],
  tiles: [
    { insight: signups, layout: { x: 0, y: 0, w: 6, h: 4 } },
    { insight: activeUsers, layout: { x: 6, y: 0, w: 6, h: 4 } },
    text({ body: "Managed by posthog-definitions. Edit the source file, then run `apply`.", layout: { x: 0, y: 4, w: 12, h: 1 } }),
  ],
});
