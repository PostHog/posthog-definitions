import { batchExport, secret } from "../../../src/index.js";

// Nightly dump of raw events to the data lake. Credentials never live in this
// file — they're read from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY at apply
// time and masked by PostHog on read. Rotate by bumping the `rotate` token.
export default batchExport({
  key: "events_to_s3",
  name: "Events → S3 (data lake)",
  interval: "day",
  model: "events",
  destination: {
    type: "AwsS3",
    config: {
      bucket_name: "acme-analytics-lake",
      region: "us-east-1",
      prefix: "posthog/events/",
      file_format: "Parquet",
      aws_access_key_id: secret("AWS_ACCESS_KEY_ID"),
      aws_secret_access_key: secret("AWS_SECRET_ACCESS_KEY", { rotate: "2026-07" }),
    },
  },
});
