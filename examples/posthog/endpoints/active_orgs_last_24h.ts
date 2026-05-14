import { endpoint, hogql } from "../../../src/index.js";

// Powers the "are we still alive" status page — short freshness so the
// dashboard doesn't lie to whoever is on call.
export default endpoint({
  key: "active_orgs_last_24h",
  name: "active_orgs_last_24h",
  description: "Distinct org_id values seen in events over the last 24 hours.",
  query: hogql(
    "SELECT properties.org_id AS org_id, count() AS events FROM events WHERE timestamp > now() - INTERVAL 24 HOUR AND properties.org_id IS NOT NULL GROUP BY org_id ORDER BY events DESC",
  ),
  data_freshness_seconds: 900,
  is_active: true,
});
