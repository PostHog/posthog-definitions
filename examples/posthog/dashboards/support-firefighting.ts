import { button, dashboard, hogql, insight, text, trends } from "../../../src/index.js";

// If this dashboard is loading, somebody is already paging on-call. Mixes
// trends + hogql tiles and demonstrates the `button()` tile linking out to
// an on-call runbook.

const ticketsByDay = insight({
  key: "tickets-opened-daily",
  name: "Tickets opened (daily)",
  query: trends({
    series: [{ event: "support_ticket_opened", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-14d" },
  }),
});

const urgentTickets = insight({
  key: "urgent-tickets-daily",
  name: "Urgent-priority tickets (daily)",
  query: trends({
    series: [
      {
        event: "support_ticket_opened",
        math: "total",
        properties: [
          { key: "priority", type: "event", operator: "exact", value: ["urgent"] },
        ],
      },
    ],
    interval: "day",
    dateRange: { date_from: "-14d" },
  }),
});

const topOrgs = insight({
  key: "top-orgs-by-tickets-7d",
  name: "Top orgs by tickets (last 7d)",
  description: "Where the pain is concentrated.",
  query: hogql(
    "SELECT properties.org_id AS org_id, count() AS tickets FROM events WHERE event = 'support_ticket_opened' AND timestamp > now() - INTERVAL 7 DAY GROUP BY org_id ORDER BY tickets DESC LIMIT 10",
  ),
});

const exceptionsDaily = insight({
  key: "exceptions-daily-firefighting",
  name: "Exceptions (daily)",
  query: trends({
    series: [{ event: "$exception", math: "total" }],
    interval: "day",
    dateRange: { date_from: "-14d" },
  }),
});

export default dashboard({
  key: "support-firefighting",
  name: "Support firefighting",
  description: "If this dashboard is loading, somebody is already paging on-call.",
  pinned: false,
  tags: ["support", "oncall"],
  tiles: [
    text({
      body: "**On-call?** Start here. If urgent tickets are spiking and exceptions are too, escalate to engineering.",
      layout: { x: 0, y: 0, w: 9, h: 1 },
    }),
    button({
      url: "https://example.com/runbooks/on-call",
      text: "Runbook",
      style: "primary",
      layout: { x: 9, y: 0, w: 3, h: 1 },
    }),
    { insight: ticketsByDay, layout: { x: 0, y: 1, w: 6, h: 4 } },
    { insight: urgentTickets, layout: { x: 6, y: 1, w: 6, h: 4 } },
    { insight: exceptionsDaily, layout: { x: 0, y: 5, w: 6, h: 4 } },
    { insight: topOrgs, layout: { x: 6, y: 5, w: 6, h: 4 } },
  ],
});
