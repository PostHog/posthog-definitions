import { cohort } from "../../../src/index.js";

// Behavioral cohort: everyone whose email looks like a PostHog employee.
// `filters` is passed through as opaque JSON — author it by building the
// cohort in the UI and copying the structure, or hand-write it as below.
export default cohort({
  key: "internal-users",
  name: "Internal users",
  description: "PostHog employees and on-call ops accounts.",
  filters: {
    properties: {
      type: "OR",
      values: [
        {
          type: "AND",
          values: [
            {
              type: "person",
              key: "email",
              operator: "icontains",
              value: "@posthog.com",
            },
          ],
        },
      ],
    },
  },
});
