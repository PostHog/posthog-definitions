// A second, even simpler campaign: fire when a trial is about to end, branch on
// whether the account has added a payment method, and exit. Shows a
// conditional_branch node and a `branch` edge (index 0 matches
// config.conditions[0]); the no-match path falls through the `continue` edge.
import { hogFlow } from "@posthog/definitions";

export default hogFlow({
  key: "trial-ending-reminder",
  name: "Trial ending reminder",
  description: "Catch trials with no card on file before they lapse.",
  actions: [
    {
      id: "trigger",
      type: "trigger",
      name: "Trial ending soon",
      config: {
        type: "event",
        filters: { events: [{ id: "trial_ending_soon", name: "trial_ending_soon", type: "events" }] },
      },
    },
    {
      id: "has_card",
      type: "conditional_branch",
      name: "Has payment method?",
      config: {
        conditions: [
          { filters: { properties: [{ key: "has_payment_method", value: ["true"], operator: "exact", type: "person" }] } },
        ],
      },
    },
    { id: "exit", type: "exit", name: "Exit", config: { reason: "done" } },
  ],
  edges: [
    { from: "trigger", to: "has_card", type: "continue" },
    // Matched condition[0] → already has a card, just exit.
    { from: "has_card", to: "exit", type: "branch", index: 0 },
    // No match → (in a fuller flow, send the reminder here) → exit.
    { from: "has_card", to: "exit", type: "continue" },
  ],
});
