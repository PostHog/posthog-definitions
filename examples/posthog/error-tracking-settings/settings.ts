// A singleton: one error-tracking settings block per project (no key). These
// are the ingestion rate limits for exception events — cap how many are
// accepted per bucket, project-wide and per individual issue, so one noisy
// deploy can't drown out everything else. Apply only ever PATCHes the fields
// declared here; anything you omit is left exactly as it is on the server.
// Set a field to `null` to remove that limit.
import { errorTrackingSettings } from "@posthog/definitions";

export default errorTrackingSettings({
  // Project-wide: at most 50k exception events per 60-minute bucket.
  project_rate_limit_value: 50000,
  project_rate_limit_bucket_size_minutes: 60,
  // Per issue: at most 1k events per 60-minute bucket, so a single runaway
  // error can't consume the whole project budget.
  per_issue_rate_limit_value: 1000,
  per_issue_rate_limit_bucket_size_minutes: 60,
});
