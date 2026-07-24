import { warehouseSavedQuery } from "../../../src/index.js";

// A reusable "who's actually active" view the whole team queries by name in
// HogQL (`SELECT * FROM active_accounts`). Kept as a saved query so the
// definition lives in one place instead of being copy-pasted into ten insights.
export default warehouseSavedQuery({
  key: "active_accounts",
  name: "active_accounts",
  description: "Accounts with at least one event in the last 30 days.",
  query: [
    "SELECT",
    "    properties.account_id AS account_id,",
    "    max(timestamp) AS last_seen",
    "FROM events",
    "WHERE timestamp > now() - INTERVAL 30 DAY",
    "GROUP BY account_id",
  ].join("\n"),
});
