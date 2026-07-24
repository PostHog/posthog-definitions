import { batchExport, secret } from "../../../src/index.js";

// Hourly person sync into the warehouse for the RevOps team's models. Shipped
// paused: turn it on in the UI once the Snowflake role has been granted, so a
// misconfigured credential doesn't spew failed runs.
export default batchExport({
  key: "persons_to_snowflake",
  name: "Persons → Snowflake",
  interval: "hour",
  model: "persons",
  paused: true,
  destination: {
    type: "Snowflake",
    config: {
      account: "acme-prod",
      database: "ANALYTICS",
      warehouse: "LOADING",
      schema: "POSTHOG",
      table_name: "persons",
      role: "POSTHOG_LOADER",
      user: "posthog_svc",
      password: secret("SNOWFLAKE_PASSWORD"),
    },
  },
});
