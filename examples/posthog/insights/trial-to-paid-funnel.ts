import { insight, trends } from "../../../src/index.js";

// Two-series trends comparison: trial starts vs upgrades, with a
// previous-period overlay. Visualised as a line chart so the gap between the
// two series is the bit you stare at. The drop between step 3 and step 4 is
// called "the pricing page".
export default insight({
  key: "trial-to-paid",
  name: "Trial → paid",
  description: "Weekly trial_started vs user_upgraded with previous-period overlay.",
  query: trends({
    series: [
      { event: "trial_started", math: "unique_users" },
      { event: "user_upgraded", math: "unique_users" },
    ],
    interval: "week",
    dateRange: { date_from: "-90d" },
    trendsFilter: { display: "ActionsLineGraph", compare: true },
  }),
  tags: ["growth", "monetization"],
});
