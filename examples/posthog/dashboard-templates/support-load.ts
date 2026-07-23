// The smallest useful template: a single tile the support team pins in every
// new project. `featured` asks the UI to surface it near the top of the
// template picker.
import { dashboardTemplate } from "@posthog/definitions";

export default dashboardTemplate({
  key: "support-load",
  name: "Support load",
  description: "Ticket volume over time — a one-tile starting point.",
  tags: ["support"],
  featured: true,
  tiles: [
    {
      type: "INSIGHT",
      name: "Tickets opened",
      layouts: {},
      color: null,
      query: {
        kind: "TrendsQuery",
        series: [{ kind: "EventsNode", event: "support_ticket_opened", math: "total" }],
        interval: "day",
      },
    },
  ],
});
