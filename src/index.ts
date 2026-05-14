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

export { insight, trends, hogql } from "./resources/insight/index.js";
export type {
  Insight,
  Query,
  TrendsQuery,
  HogQLQuery,
  EventsNode,
  InsightVizNode,
} from "./resources/insight/index.js";

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

export { createTypedPostHog } from "./client/typed-posthog.js";
export type { TypedPostHog, CaptureCapableClient } from "./client/typed-posthog.js";
