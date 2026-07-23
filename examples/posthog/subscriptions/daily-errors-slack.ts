// Post a single insight to a Slack channel every morning. Slack targets need an
// `integrationId` — the id of the project's Slack integration. That id is
// ENVIRONMENT-SPECIFIC: it won't be the same in another project, so this
// definition isn't portable as-is (swap the id per project). It round-trips and
// is part of the hash.
import { insight, subscription, trends } from "../../../src/index.js";

const errors = insight({
  key: "daily-error-count",
  name: "Daily error count",
  query: trends({ series: [{ event: "$exception", math: "total" }], interval: "day" }),
});

export default subscription({
  key: "daily-errors-slack",
  title: "Daily error count → #eng-alerts",
  insight: errors,
  targetType: "slack",
  target: "#eng-alerts",
  integrationId: 1, // replace with this project's Slack integration id
  frequency: "daily",
  startDate: "2026-08-01T07:00:00Z",
});
