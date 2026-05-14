import { markResourceKind } from "../types.js";
import type { PropertyFilter } from "../feature-flag/sdk.js";

/**
 * Holdout group: a slice of users excluded from one or more experiments by
 * the linked feature flag. `filters` is the list of release-condition groups
 * applied to the holdout's flag — same shape as a feature flag's `filters.groups`.
 */
export type ExperimentHoldout = {
  key: string;
  name: string;
  description?: string;
  filters: Array<{
    properties: PropertyFilter[];
    rollout_percentage: number | null;
    variant?: string | null;
  }>;
};

export function experimentHoldout(spec: ExperimentHoldout): ExperimentHoldout {
  return markResourceKind(spec, "experiment-holdout");
}
