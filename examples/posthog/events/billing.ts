import { propertyGroup } from "../../../src/index.js";

// Reusable property group: events that touch billing share this shape so the
// typed client can enforce consistent property names and types at the call
// site. Attach to one or more events via `eventDefinition({ propertyGroups: […] })`.
export default propertyGroup({
  key: "billing",
  description: "Subscription state captured alongside billing-related events",
  properties: {
    plan: {
      type: "String",
      required: true,
      description: "Subscription tier the user is on at the time of the event",
    },
    seats: { type: "Numeric", required: true, description: "Paid seat count" },
    trial: { type: "Boolean" },
  },
});
