import { eventDefinition } from "../../../src/index.js";
import identity from "./identity.js";

// First-touch signup event. Pulls in the `identity` property group so every
// signup carries a consistent caller-id shape.
export default eventDefinition({
  key: "user_signed_up",
  name: "user_signed_up",
  description: "Fired once on successful signup",
  enforcementMode: "allow",
  propertyGroups: [identity],
});
