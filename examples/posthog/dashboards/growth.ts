import { dashboard, insight, text, trends } from "../../../src/index.js";

const weeklyActive = insight({
  key: "weekly-active",
  name: "Weekly active users",
  description: "Unique users with at least one $pageview in the rolling week.",
  query: trends({
    series: [{ event: "$pageview", math: "weekly_active" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

const dailyPageviews = insight({
  key: "daily-pageviews",
  name: "Daily pageviews",
  query: trends({
    series: [{ event: "$pageview", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

const dashboardsViewed = insight({
  key: "dashboards-viewed-daily",
  name: "Dashboards viewed per day",
  query: trends({
    series: [{ event: "viewed dashboard", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

const queriesCompleted = insight({
  key: "queries-completed-daily",
  name: "Queries completed per day",
  query: trends({
    series: [{ event: "query completed", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

const exceptionsDaily = insight({
  key: "exceptions-daily",
  name: "Exceptions per day",
  query: trends({
    series: [{ event: "$exception", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

const featureFlagsEvaluated = insight({
  key: "feature-flags-evaluated-daily",
  name: "Feature flag evaluations per day",
  query: trends({
    series: [{ event: "$feature_flag_called", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

export default dashboard({
  key: "growth",
  name: "PostHog dev usage (iac)",
  description:
    "Smoke-test dashboard managed by posthog-definitions. Tracks pageviews, dashboard views, queries, exceptions, and feature flag evaluations on the dev project.",
  pinned: false,
  tags: ["dev-usage"],
  // Insight tiles carry only their insight — the PostHog API can't persist a
  // per-insight-tile layout/color. The optional dashboard-level `insightLayout`
  // ("preserve" | "two_column" | "full_width") picks the coarse packing;
  // "preserve" (the default here) lets PostHog auto-arrange them. Text tiles
  // keep full layout + color.
  tiles: [
    { insight: weeklyActive },
    { insight: dailyPageviews },
    { insight: dashboardsViewed },
    { insight: queriesCompleted },
    { insight: exceptionsDaily },
    { insight: featureFlagsEvaluated },
    text({
      body: "Managed by posthog-definitions. Edit `examples/posthog/dashboards/growth.ts` and run `apply`.",
      layout: { x: 0, y: 12, w: 12, h: 1 },
    }),
  ],
});
