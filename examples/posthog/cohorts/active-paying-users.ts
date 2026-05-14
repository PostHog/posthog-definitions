import { cohort } from "../../../src/index.js";

// Static cohort: the membership is managed out-of-band (typically via
// `POST /cohorts/{id}/add_persons_to_static_cohort/` or a CSV upload).
// Declaring it here just creates the empty container; IaC won't manage
// member lists.
export default cohort({
  key: "active-paying-users",
  name: "Active paying users (manual list)",
  description: "Maintained by the growth team via the UI / CSV upload.",
  is_static: true,
});
