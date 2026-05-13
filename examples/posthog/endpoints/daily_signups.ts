import { endpoint, hogql } from "../../../src/index.js";

export default endpoint({
  key: "daily_signups",
  name: "daily_signups",
  description: "Smoke-test endpoint managed by posthog-definitions. Daily count of user_signed_up events for the last 30 days. (edited)",
  query: hogql(
    "SELECT toDate(timestamp) AS day, count() AS signups FROM events WHERE event = 'user signed up' AND timestamp > now() - INTERVAL 30 DAY GROUP BY day ORDER BY day",
  ),
  data_freshness_seconds: 3600,
  is_active: true,
});
