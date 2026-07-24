import { warehouseSavedQuery } from "../../../src/index.js";

// Finance's canonical MRR-by-plan rollup, exposed as a warehouse view so it can
// be joined against other tables in the SQL editor. Materialization cadence is
// managed in the UI (it's DAG-scheduled server-side) — this file owns the
// query definition, not the refresh schedule.
export default warehouseSavedQuery({
  key: "mrr_by_plan",
  name: "mrr_by_plan",
  description: "Monthly recurring revenue grouped by plan tier.",
  query: [
    "SELECT",
    "    properties.plan AS plan,",
    "    sum(properties.amount_usd) AS mrr",
    "FROM events",
    "WHERE event = 'subscription_renewed'",
    "GROUP BY plan",
    "ORDER BY mrr DESC",
  ].join("\n"),
});
