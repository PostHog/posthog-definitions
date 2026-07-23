import { dashboard, hogql, insight, text, trends } from "../../../src/index.js";

// A dashboard you'd open in a window the CFO won't see. Mixes trends and
// hogql tiles, pins itself, and uses a `text()` header tile for context.

const upgrades = insight({
  key: "weekly-upgrades",
  name: "Weekly upgrades",
  description: "user_upgraded events per week, last 90 days.",
  query: trends({
    series: [{ event: "user_upgraded", math: "unique_users" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

const mrrByPlan = insight({
  key: "mrr-by-plan-snapshot",
  name: "MRR by plan (30d)",
  description: "Sum of subscription_renewed amounts in the last 30 days, by plan.",
  query: hogql(
    "SELECT properties.plan AS plan, sum(properties.amount_usd) AS mrr FROM events WHERE event = 'subscription_renewed' AND timestamp > now() - INTERVAL 30 DAY GROUP BY plan ORDER BY mrr DESC",
  ),
});

const churnEvents = insight({
  key: "weekly-cancellations",
  name: "Weekly cancellations",
  query: trends({
    series: [{ event: "subscription_cancelled", math: "unique_users" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

const trialStarts = insight({
  key: "weekly-trial-starts",
  name: "Weekly trial starts",
  query: trends({
    series: [{ event: "trial_started", math: "unique_users" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

const seatExpansion = insight({
  key: "seats-added-30d",
  name: "Seats added (30d)",
  query: trends({
    series: [{ event: "seat_added", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

export default dashboard({
  key: "revenue-health",
  name: "Revenue health",
  description: "Open in a window the CFO won't see. Trial volume, upgrades, cancellations, and seat expansion.",
  pinned: true,
  tags: ["revenue", "exec"],
  tiles: [
    text({
      body: "**Revenue health** — refreshed hourly. Cancellations beat trial starts? Ping #growth.",
      layout: { x: 0, y: 0, w: 12, h: 1 },
    }),
    { insight: trialStarts },
    { insight: upgrades },
    { insight: churnEvents },
    { insight: seatExpansion },
    { insight: mrrByPlan },
  ],
});
