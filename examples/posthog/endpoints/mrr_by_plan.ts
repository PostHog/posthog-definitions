import { endpoint, hogql } from "../../../src/index.js";

// Daily-refreshed: finance only checks once a day anyway. The query bucket of
// 86400 maps to the server's `daily` cadence — see the endpoint sdk for the
// allowed values.
export default endpoint({
  key: "mrr_by_plan",
  name: "mrr_by_plan",
  description: "Monthly recurring revenue grouped by plan tier, last 12 months.",
  query: hogql(
    "SELECT properties.plan AS plan, sum(properties.amount_usd) AS mrr FROM events WHERE event = 'subscription_renewed' AND timestamp > now() - INTERVAL 30 DAY GROUP BY plan ORDER BY mrr DESC",
  ),
  data_freshness_seconds: 86400,
  is_active: true,
});
