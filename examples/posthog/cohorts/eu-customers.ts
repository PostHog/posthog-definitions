import { cohort } from "../../../src/index.js";

// Behavioral cohort filtering by GeoIP property. Useful target for
// region-specific feature flag rollouts.
export default cohort({
  key: "eu-customers",
  name: "EU customers",
  description: "Customers whose first-seen GeoIP country is in the EU.",
  filters: {
    properties: {
      type: "AND",
      values: [
        {
          type: "person",
          key: "$geoip_country_code",
          operator: "exact",
          value: ["DE", "FR", "ES", "IT", "NL", "BE", "PT", "AT", "SE", "DK", "FI", "IE"],
        },
      ],
    },
  },
});
