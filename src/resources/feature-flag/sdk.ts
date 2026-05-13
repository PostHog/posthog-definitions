export type PropertyFilter = {
  key: string;
  type: "person" | "cohort" | "group" | "flag";
  value?: unknown;
  operator?: string;
  group_type_index?: number;
};

export type ReleaseConditionGroup = {
  properties: PropertyFilter[];
  rollout_percentage: number | null;
  variant?: string | null;
};

export type Variant = {
  key: string;
  name?: string;
  rollout_percentage: number;
};

export type FeatureFlagFilters = {
  groups: ReleaseConditionGroup[];
  multivariate?: { variants: Variant[] } | null;
  payloads?: Record<string, string>;
  aggregation_group_type_index?: number | null;
  super_groups?: ReleaseConditionGroup[];
  holdout?: unknown;
};

export type FeatureFlag = {
  key: string;
  name?: string;
  active?: boolean;
  filters: FeatureFlagFilters;
  ensure_experience_continuity?: boolean;
  is_remote_configuration?: boolean;
  has_encrypted_payloads?: boolean;
  evaluation_runtime?: "server" | "client" | "all";
  bucketing_identifier?: "distinct_id" | "device_id";
  tags?: string[];
};

export function featureFlag(spec: FeatureFlag): FeatureFlag {
  return spec;
}
