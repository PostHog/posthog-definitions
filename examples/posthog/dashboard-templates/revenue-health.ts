// A revenue starter template with a `variables` placeholder — the person
// instantiating it picks which plan-change event to track, so the same
// blueprint works whether your billing events are called `subscription_upgraded`
// or `plan_changed`. Variables are round-tripped verbatim, same as tiles.
import { dashboardTemplate } from "@posthog/definitions";

export default dashboardTemplate({
  key: "revenue-health",
  name: "Revenue health",
  description: "Expansion, contraction, and paid-seat growth. Fill in your billing event on setup.",
  tags: ["revenue", "finance"],
  variables: [
    {
      id: "PLAN_CHANGE_EVENT",
      name: "Plan change event",
      type: "event",
      default: { id: "subscription_upgraded", name: "subscription_upgraded", type: "events" },
      required: true,
      description: "The event your billing system emits when a plan changes",
    },
  ],
  tiles: [
    {
      type: "INSIGHT",
      name: "Paid seats",
      layouts: {},
      color: null,
      query: {
        kind: "TrendsQuery",
        series: [{ kind: "EventsNode", event: "seat_assigned", math: "total" }],
        interval: "week",
      },
    },
  ],
});
