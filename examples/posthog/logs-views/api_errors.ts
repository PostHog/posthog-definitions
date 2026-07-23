import { logsView } from "../../../src/index.js";

// The saved view on-call opens first: errors and fatals from the API service,
// with a custom column pulling the request path out of the log attributes so
// you can eyeball which endpoint is angry without expanding every row.
export default logsView({
  key: "api_errors",
  name: "API errors",
  filters: {
    severityLevels: ["error", "fatal"],
    serviceNames: ["api"],
  },
  columns: [
    { id: "ts", type: "timestamp" },
    { id: "lvl", type: "level" },
    { id: "route", type: "custom", name: "route", expression: "attributes.http.route" },
    { id: "msg", type: "message" },
  ],
  pinned: true,
});
