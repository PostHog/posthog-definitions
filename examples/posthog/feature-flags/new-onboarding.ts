import { featureFlag } from "../../../src/index.js";

// A multivariate feature flag with per-variant payloads, a release-condition
// group, and the advanced runtime fields exposed. Each .ts file under the
// definitions directory contributes one default-exported resource — author
// additional flags as sibling files.
export default featureFlag({
  key: "new-onboarding-flow",
  name: "Enable the redesigned onboarding flow",
  active: true,
  filters: {
    groups: [
      {
        // Only roll out to PostHog employees while iterating.
        properties: [
          { key: "email", type: "person", operator: "icontains", value: "@posthog.com" },
        ],
        rollout_percentage: 100,
      },
      {
        // Everyone else gets a smaller exposure to gather signal.
        properties: [],
        rollout_percentage: 10,
      },
    ],
    multivariate: {
      variants: [
        { key: "control", name: "Existing flow", rollout_percentage: 50 },
        { key: "guided", name: "Guided checklist", rollout_percentage: 25 },
        { key: "minimal", name: "Minimal one-pager", rollout_percentage: 25 },
      ],
    },
    payloads: {
      // payload values are JSON-encoded strings, keyed by variant key.
      guided: JSON.stringify({ checklistSteps: 5, showProgressBar: true }),
      minimal: JSON.stringify({ checklistSteps: 0, showProgressBar: false }),
    },
  },
  ensure_experience_continuity: true,
  evaluation_runtime: "all",
  bucketing_identifier: "distinct_id",
  tags: ["onboarding", "growth"],
});
