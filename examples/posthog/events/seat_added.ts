import { eventDefinition } from "../../../src/index.js";
import billing from "./billing.js";
import identity from "./identity.js";

// Fires once per seat added to a workspace. Finance loves this one.
export default eventDefinition({
  key: "seat_added",
  name: "seat_added",
  description: "Fired when a workspace admin provisions an additional paid seat.",
  enforcementMode: "allow",
  propertyGroups: [identity, billing],
});
