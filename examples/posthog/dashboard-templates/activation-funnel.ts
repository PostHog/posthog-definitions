// Onboarding template the growth team hands to every new workspace: a couple
// of trend tiles that answer "are trials turning into activated accounts?".
// A dashboard TEMPLATE isn't a live dashboard — it's the reusable blueprint
// people pick from "New dashboard → From template". Tiles embed their query
// inline (there's no link to a standalone insight), so the whole tile array
// is round-tripped verbatim.
import { dashboardTemplate } from "@posthog/definitions";

export default dashboardTemplate({
  key: "activation-funnel",
  name: "Trial activation",
  description: "How trials move from signup to first activated action. Duplicate per team.",
  tags: ["growth", "onboarding"],
  filters: { date_from: "-30d" },
  tiles: [
    {
      type: "INSIGHT",
      name: "Trial signups",
      layouts: {},
      color: null,
      query: {
        kind: "TrendsQuery",
        series: [{ kind: "EventsNode", event: "trial_started", math: "total" }],
        interval: "day",
      },
    },
    {
      type: "INSIGHT",
      name: "Activated accounts",
      layouts: {},
      color: "green",
      query: {
        kind: "TrendsQuery",
        series: [{ kind: "EventsNode", event: "workspace_activated", math: "dau" }],
        interval: "day",
      },
    },
  ],
});
