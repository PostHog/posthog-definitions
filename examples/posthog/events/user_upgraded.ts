import { eventDefinition } from "../../../src/index.js";
import billing from "./billing.js";
import identity from "./identity.js";

// Composes two reusable property groups: the typed client sees a single
// merged property shape with all of identity's and billing's fields. The same
// import graph that `apply` syncs to PostHog drives compile-time type safety
// in `createTypedPostHog` — one source of truth.
export default eventDefinition({
  key: "user_upgraded",
  name: "user_upgraded",
  description: "Fired when a user transitions to a paid plan",
  enforcementMode: "allow",
  propertyGroups: [identity, billing],
});
