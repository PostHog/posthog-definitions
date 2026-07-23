// Multi-question feedback survey gated behind a feature flag: only users the
// `new-onboarding` flag is enabled for see it, so the survey ships alongside the
// rollout it's measuring. The flag is declared right here and referenced by
// value — apply resolves it to the linked-flag id at execute time.
import { survey, featureFlag } from "../../../src/index.js";

const newOnboarding = featureFlag({
  key: "new-onboarding",
  name: "New onboarding flow",
  active: true,
  filters: { groups: [{ properties: [], rollout_percentage: 50 }] },
});

export default survey({
  key: "onboarding-feedback",
  name: "New onboarding feedback",
  description: "Only asked of accounts in the new-onboarding rollout.",
  type: "popover",
  status: "running",
  linkedFlag: newOnboarding,
  questions: [
    {
      type: "single_choice",
      question: "How was setting up your first project?",
      choices: ["Effortless", "Fine", "Confusing", "I gave up"],
    },
    {
      type: "multiple_choice",
      question: "Which steps tripped you up?",
      choices: ["Inviting the team", "Connecting data", "Building a dashboard", "Nothing"],
      hasOpenChoice: true,
      optional: true,
    },
    {
      type: "open",
      question: "Anything you'd change about the setup flow?",
      optional: true,
    },
  ],
  appearance: {
    submitButtonText: "Send feedback",
    displayThankYouMessage: true,
    thankYouMessageHeader: "Thanks — this goes straight to the product team.",
  },
});
