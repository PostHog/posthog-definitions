import type { ResourceModule } from "./types.js";
import { dashboardResource } from "./dashboard/index.js";
import { endpointResource } from "./endpoint/index.js";
import { featureFlagResource } from "./feature-flag/index.js";
import { insightResource } from "./insight/index.js";
import { eventDefinitionResource } from "./event-definition/index.js";
import { experimentResource } from "./experiment/index.js";
import { experimentHoldoutResource } from "./experiment-holdout/index.js";
import { experimentSavedMetricResource } from "./experiment-saved-metric/index.js";
import { projectSettingsResource } from "./project-settings/index.js";
import { propertyGroupResource } from "./property-group/index.js";

/**
 * Resources are listed in apply-execute order: each resource is fully created/updated
 * before the next runs, so a resource may depend on earlier ones (e.g. dashboards rely
 * on insight server ids being available in ApplyContext, and event-definitions rely
 * on property-group ids).
 */
export const RESOURCES: ReadonlyArray<ResourceModule<unknown, unknown>> = [
  insightResource as ResourceModule<unknown, unknown>,
  dashboardResource as ResourceModule<unknown, unknown>,
  featureFlagResource as ResourceModule<unknown, unknown>,
  endpointResource as ResourceModule<unknown, unknown>,
  propertyGroupResource as ResourceModule<unknown, unknown>,
  eventDefinitionResource as ResourceModule<unknown, unknown>,
  experimentHoldoutResource as ResourceModule<unknown, unknown>,
  experimentSavedMetricResource as ResourceModule<unknown, unknown>,
  experimentResource as ResourceModule<unknown, unknown>,
  projectSettingsResource as ResourceModule<unknown, unknown>,
];

export { insightResource } from "./insight/index.js";
export { dashboardResource } from "./dashboard/index.js";
export { featureFlagResource } from "./feature-flag/index.js";
export { endpointResource } from "./endpoint/index.js";
export { propertyGroupResource } from "./property-group/index.js";
export { eventDefinitionResource } from "./event-definition/index.js";
export { experimentHoldoutResource } from "./experiment-holdout/index.js";
export { experimentSavedMetricResource } from "./experiment-saved-metric/index.js";
export { experimentResource } from "./experiment/index.js";
export { projectSettingsResource } from "./project-settings/index.js";
export type {
  ResourceModule,
  CollectionResourceModule,
  SingletonResourceModule,
  ResourceOp,
  FieldChange,
  ApplyContext,
  DesiredState,
} from "./types.js";
