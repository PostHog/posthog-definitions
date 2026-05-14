import { markResourceKind } from "../types.js";

/**
 * A reusable experiment metric, attached to one or more experiments via
 * `experiment({ primarySavedMetrics: [...] })` or `secondarySavedMetrics`.
 * `query` is the metric body (kind: "ExperimentMetric" with metric_type
 * "mean" | "funnel" | "ratio" | "retention") — passed through as opaque JSON
 * for now; richer typing can be layered on later.
 */
export type ExperimentSavedMetric = {
  key: string;
  name: string;
  description?: string;
  query: Record<string, unknown>;
};

export function experimentSavedMetric(spec: ExperimentSavedMetric): ExperimentSavedMetric {
  return markResourceKind(spec, "experiment-saved-metric");
}
