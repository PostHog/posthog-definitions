import { eventDefinition } from "../../../src/index.js";
import identity from "./identity.js";
import support from "./support.js";

// Strict schema: tickets without a `ticket_id` are just feelings.
// `enforcementMode: "reject"` makes the server drop events that don't match
// the merged property shape of `identity` + `support`.
export default eventDefinition({
  key: "support_ticket_opened",
  name: "support_ticket_opened",
  description: "Fired when a customer opens a support ticket.",
  enforcementMode: "reject",
  propertyGroups: [identity, support],
});
