import { dashboard, insight, text, trends } from "@posthog/definitions";

const buttonClicks = insight({
  key: "vercel-demo-button-clicks",
  name: "Button clicks (vercel demo)",
  description: "Daily count of `button_clicked` events from the Vercel demo app.",
  query: trends({
    series: [{ event: "button_clicked", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-30d" },
  }),
});

export default dashboard({
  key: "vercel-demo",
  name: "Vercel demo (iac)",
  description: "Managed by posthog-definitions via Vercel build step.",
  pinned: false,
  tags: ["vercel-demo"],
  tiles: [
    { insight: buttonClicks, layout: { x: 0, y: 0, w: 12, h: 4 } },
    text({
      body: "Managed by posthog-definitions. Edits to `examples/vercel-app/posthog/dashboards/vercel-demo.ts` apply on the next production deploy.",
      layout: { x: 0, y: 4, w: 12, h: 1 },
    }),
  ],
});
