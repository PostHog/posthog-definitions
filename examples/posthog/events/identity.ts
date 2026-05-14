import { propertyGroup } from "../../../src/index.js";

// Reusable property group: caller identity, attached to anything that wants to
// record who/what triggered the event.
export default propertyGroup({
  key: "identity",
  description: "Caller identity attached to user-initiated events",
  properties: {
    user_id: { type: "String", required: true, description: "Distinct ID of the actor" },
    org_id: { type: "String" },
    source: {
      type: "String",
      description: "Surface that produced the event (web, api, cli, …)",
    },
  },
});
