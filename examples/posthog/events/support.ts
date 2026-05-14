import { propertyGroup } from "../../../src/index.js";

// Reusable property group: support-ticket-shaped events all share this
// envelope so the typed client can keep `priority` and `ticket_id` consistent
// across every emitter.
export default propertyGroup({
  key: "support",
  description: "Support-ticket fields attached to ticket lifecycle events",
  properties: {
    ticket_id: {
      type: "String",
      required: true,
      description: "Stable id from the support system (e.g. Zendesk ticket #)",
    },
    priority: {
      type: "String",
      required: true,
      description: "`low` | `normal` | `high` | `urgent`. A hint, not a contract.",
    },
    first_response_seconds: {
      type: "Numeric",
      description: "Seconds from ticket open to first agent reply",
    },
    resolved: { type: "Boolean" },
  },
});
