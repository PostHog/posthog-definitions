export { dashboard, text, button } from "./resources/dashboard/index.js";
export type {
  Dashboard,
  Tile,
  InsightTile,
  TextTile,
  ButtonTile,
  Layout,
  Filters,
} from "./resources/dashboard/index.js";

export { insight, trends, funnels, hogql } from "./resources/insight/index.js";
export type {
  Insight,
  Query,
  TrendsQuery,
  FunnelsQuery,
  HogQLQuery,
  EventsNode,
  InsightVizNode,
} from "./resources/insight/index.js";

export { cohort } from "./resources/cohort/index.js";
export type { Cohort, CohortFilters, CohortType } from "./resources/cohort/index.js";

export { subscription } from "./resources/subscription/index.js";
export type {
  Subscription,
  SubscriptionTargetType,
  SubscriptionFrequency,
} from "./resources/subscription/index.js";

export { action } from "./resources/action/index.js";
export type {
  Action,
  ActionStep,
  ActionStepMatching,
  ActionStepProperty,
} from "./resources/action/index.js";

export { featureFlag } from "./resources/feature-flag/index.js";
export type {
  FeatureFlag,
  FeatureFlagFilters,
  ReleaseConditionGroup,
  Variant,
  PropertyFilter,
} from "./resources/feature-flag/index.js";

export { endpoint } from "./resources/endpoint/index.js";
export type { Endpoint } from "./resources/endpoint/index.js";

export { propertyGroup } from "./resources/property-group/index.js";
export type {
  PropertyGroup,
  PropertyDef,
  PropertyMap,
  PropertyType,
} from "./resources/property-group/index.js";

export { eventDefinition } from "./resources/event-definition/index.js";
export type { EventDefinition, EnforcementMode } from "./resources/event-definition/index.js";

export { experimentHoldout } from "./resources/experiment-holdout/index.js";
export type { ExperimentHoldout } from "./resources/experiment-holdout/index.js";

export { experimentSavedMetric } from "./resources/experiment-saved-metric/index.js";
export type { ExperimentSavedMetric } from "./resources/experiment-saved-metric/index.js";

export { experiment } from "./resources/experiment/index.js";
export type {
  Experiment,
  ExperimentLifecycle,
  ExperimentType,
  ExperimentConclusion,
  ExperimentVariant,
  ExperimentParameters,
  ExperimentMetric,
  ExperimentExposureCriteria,
} from "./resources/experiment/index.js";

export { projectSettings } from "./resources/project-settings/index.js";
export type { ProjectSettings } from "./resources/project-settings/index.js";

export { createTypedPostHog } from "./client/typed-posthog.js";
export type { TypedPostHog, CaptureCapableClient } from "./client/typed-posthog.js";
