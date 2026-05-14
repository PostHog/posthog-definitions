import { eventDefinition } from "../../../src/index.js";
import identity from "./identity.js";

// First-touch trial event. Day zero of the 14-day countdown.
export default eventDefinition({
  key: "trial_started",
  name: "trial_started",
  description: "Fired once when a workspace enters the free trial window.",
  enforcementMode: "allow",
  propertyGroups: [identity],
});
