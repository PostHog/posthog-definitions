import { cohort } from "../../../src/index.js";

// Static cohort: the top accounts by ARR, maintained by sales via the UI / CSV
// upload. IaC only creates the empty container; do not author `filters` here.
export default cohort({
  key: "whale-accounts",
  name: "Whale accounts",
  description: "Top accounts by ARR. Maintained by sales. Do not touch.",
  is_static: true,
});
