import { action } from "../../../src/index.js";

// A pure event-name match. Actions like this are the simplest way to turn a
// recurring custom event into a named entity the rest of PostHog (insights,
// funnels, experiments) can reference without retyping the event name.
export default action({
  key: "checkout-completed",
  name: "Checkout completed",
  description: "Fires whenever a paid checkout flow reaches its success page.",
  steps: [
    {
      event: "checkout_completed",
      properties: [
        { key: "amount", type: "event", operator: "gt", value: 0 },
        { key: "currency", type: "event", operator: "is_set" },
      ],
    },
  ],
  tags: ["billing", "revenue"],
});
