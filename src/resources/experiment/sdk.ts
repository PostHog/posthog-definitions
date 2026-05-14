import { markResourceKind } from "../types.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";
import type { ExperimentHoldout } from "../experiment-holdout/sdk.js";
import type { ExperimentSavedMetric } from "../experiment-saved-metric/sdk.js";

export type ExperimentType = "web" | "product";

export type ExperimentLifecycle = "draft" | "running" | "paused" | "stopped";

export type ExperimentConclusion =
  | "won"
  | "lost"
  | "inconclusive"
  | "stopped_early"
  | "invalid";

export type ExperimentVariant = {
  key: string;
  name?: string;
  rollout_percentage: number;
};

export type ExperimentParameters = {
  feature_flag_variants?: ExperimentVariant[];
  minimum_detectable_effect?: number;
  rollout_percentage?: number;
};

/** Opaque metric body for now — `kind: "ExperimentMetric"` with `metric_type` of mean/funnel/ratio/retention. */
export type ExperimentMetric = Record<string, unknown>;

export type ExperimentExposureCriteria = Record<string, unknown>;

export type Experiment = {
  key: string;
  name: string;
  description?: string;
  type?: ExperimentType;
  /**
   * The feature flag this experiment is bound to. Required — every experiment
   * has a flag, and we model it as an object reference so the spec import
   * graph mirrors the server-side relation. The flag's `key` is sent to the
   * API as `feature_flag_key` at create time.
   */
  featureFlag: FeatureFlag;
  /**
   * Where in the lifecycle the experiment should be after apply runs:
   *   - draft:    not yet launched
   *   - running:  start_date set, flag active
   *   - paused:   start_date set, flag inactive (virtual state — pause action)
   *   - stopped:  end_date set
   * Apply executes the right transition op (launch / end / pause / resume) to
   * match. Transitions that don't make sense (e.g. stopped → running) are
   * rejected at validate time.
   */
  lifecycle?: ExperimentLifecycle;
  /** Whether the experiment is archived (orthogonal to lifecycle). */
  archived?: boolean;
  /** Optional reference to an experiment holdout group. */
  holdout?: ExperimentHoldout;
  parameters?: ExperimentParameters;
  metrics?: ExperimentMetric[];
  metrics_secondary?: ExperimentMetric[];
  exposure_criteria?: ExperimentExposureCriteria;
  /** Shared saved metrics, attached as primary. Order is preserved on the server. */
  primarySavedMetrics?: ExperimentSavedMetric[];
  /** Shared saved metrics, attached as secondary. */
  secondarySavedMetrics?: ExperimentSavedMetric[];
  /** Required to land a conclusion when transitioning to `stopped`. */
  conclusion?: ExperimentConclusion;
  conclusionComment?: string;
};

export function experiment(spec: Experiment): Experiment {
  return markResourceKind(spec, "experiment");
}
