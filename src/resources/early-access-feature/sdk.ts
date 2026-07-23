import { markResourceKind } from "../types.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";

/**
 * Rollout stage. Plain declarative field — PostHog has no stage-transition
 * endpoint, so any stage is set with a PATCH. If the API rejects a particular
 * transition, that surfaces as an API error at apply time.
 */
export type EarlyAccessStage =
  | "draft"
  | "concept"
  | "alpha"
  | "beta"
  | "general-availability"
  | "archived";

export type EarlyAccessFeature = {
  key: string;
  name: string;
  description?: string;
  stage: EarlyAccessStage;
  documentationUrl?: string;
  /** Arbitrary JSON metadata attached to the feature. */
  payload?: Record<string, unknown>;
  /**
   * The feature flag that gates this early-access feature, referenced by key.
   * Required: posthog-definitions links an existing (declared) flag rather than
   * letting the API auto-create an unmanaged one. Resolved to `feature_flag_id`
   * at apply time; the flag must be declared in the same run.
   */
  featureFlag: FeatureFlag;
};

export function earlyAccessFeature(spec: EarlyAccessFeature): EarlyAccessFeature {
  return markResourceKind(spec, "early-access-feature");
}
