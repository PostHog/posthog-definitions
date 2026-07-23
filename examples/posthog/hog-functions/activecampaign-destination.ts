// A real-time destination built from a marketplace template: forward activated
// accounts to ActiveCampaign. This is the flagship example for the secrets
// convention — the API key never appears in the file. `secret("ENV_VAR")` reads
// the value from the environment at apply time; it is excluded from the hash
// and, once set, is never re-sent on update (so a masked read-back can't cause
// a perpetual diff). To rotate it, bump the `rotate` token.
import { hogFunction, secret } from "@posthog/definitions";

export default hogFunction({
  key: "activecampaign-sync",
  type: "destination",
  name: "ActiveCampaign — sync activated accounts",
  description: "Push activated workspaces to ActiveCampaign for lifecycle email.",
  templateId: "template-activecampaign",
  enabled: true,
  inputs: {
    accountName: "acme-inc",
    apiKey: secret("ACTIVECAMPAIGN_API_KEY"),
    // To rotate later: secret("ACTIVECAMPAIGN_API_KEY", { rotate: "2026-q3" })
    email: "{person.properties.email}",
    firstName: "{person.properties.first_name}",
    lastName: "{person.properties.last_name}",
    phone: "{person.properties.phone}",
    attributes: {},
  },
  filters: {
    source: "events",
    events: [{ id: "workspace_activated", name: "workspace_activated", type: "events", order: 0 }],
  },
});
