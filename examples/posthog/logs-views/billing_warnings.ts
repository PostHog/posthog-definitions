import { logsView } from "../../../src/index.js";

// Anything the billing worker grumbles about — warnings and up. Not pinned:
// finance only goes looking after a customer complains, so it lives in the
// saved-views list rather than the sidebar.
export default logsView({
  key: "billing_warnings",
  name: "Billing worker warnings",
  filters: {
    severityLevels: ["warn", "error", "fatal"],
    serviceNames: ["billing-worker"],
    searchTerm: "invoice",
  },
  columns: [
    { id: "ts", type: "timestamp" },
    { id: "lvl", type: "level" },
    { id: "msg", type: "message" },
  ],
});
