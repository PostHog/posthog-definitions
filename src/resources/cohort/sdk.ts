import { markResourceKind } from "../types.js";

/**
 * Server-side classification. The API computes this from `filters` / `query` /
 * `is_static`, but accepts the value on write — set it when you want to be
 * explicit about the cohort's purpose.
 */
export type CohortType = "static" | "person_property" | "behavioral" | "realtime" | "analytical";

/**
 * Behavioral filter spec — passed through as opaque JSON. The full shape is
 * {properties: {type: "AND"|"OR", values: [...]}}, with values being any mix
 * of behavioral / person / nested cohort filters. Too rich to type usefully
 * without becoming a maintenance burden; users author them as plain objects
 * and we round-trip them verbatim.
 */
export type CohortFilters = {
  properties: {
    type: "AND" | "OR";
    values: unknown[];
  };
};

export type Cohort = {
  /** IaC identity key — appears in the `iac:cohorts:<key>` description marker. Unique per project. */
  key: string;
  /** Human-readable name shown in the PostHog UI. */
  name: string;
  description?: string;
  /**
   * If true, the cohort is a static list of people. Members are added via the
   * `add_persons_to_static_cohort` action (out of scope for IaC). Declaring a
   * static cohort here creates an empty one — populate it elsewhere.
   */
  is_static?: boolean;
  /** Behavioral filter tree. Mutually exclusive with `query`. */
  filters?: CohortFilters;
  /** HogQL query body for query-based cohorts. Mutually exclusive with `filters`. */
  query?: Record<string, unknown>;
  /**
   * Optional explicit classification. When omitted, the server infers from
   * `filters` / `query` / `is_static`.
   */
  cohort_type?: CohortType;
};

export function cohort(spec: Cohort): Cohort {
  return markResourceKind(spec, "cohort");
}
