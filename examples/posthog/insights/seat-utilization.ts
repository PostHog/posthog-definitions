import { hogql, insight } from "../../../src/index.js";

// HogQL joining events to persons.properties to compute paid seats vs active
// seats per org. Useful for the expansion conversation nobody wants to have.
export default insight({
  key: "seat-utilization",
  name: "Seat utilization (paid vs active)",
  description:
    "For each org: how many seats they're paying for, and how many distinct users actually showed up in the last 30 days.",
  query: hogql(
    "SELECT person.properties.org_id AS org_id, max(person.properties.paid_seats) AS paid_seats, count(DISTINCT distinct_id) AS active_seats FROM events WHERE timestamp > now() - INTERVAL 30 DAY AND person.properties.org_id IS NOT NULL GROUP BY org_id ORDER BY paid_seats - active_seats DESC LIMIT 50",
  ),
  tags: ["expansion", "revenue"],
});
