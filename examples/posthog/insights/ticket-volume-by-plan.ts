import { insight, trends } from "../../../src/index.js";

// Bar-value display: collapses the time dimension and shows totals per
// breakdown. Free plan generates 80% of tickets. We are aware.
export default insight({
  key: "ticket-volume-by-plan",
  name: "Support ticket volume by plan",
  description: "Total support tickets opened in the last 30 days, broken down by plan.",
  query: trends({
    series: [{ event: "support_ticket_opened", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
    breakdownFilter: { breakdown_type: "event", breakdown: "plan" },
    trendsFilter: { display: "ActionsBarValue" },
  }),
  tags: ["support"],
});
