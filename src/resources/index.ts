import type { ResourceModule } from "./types.js";
import { dashboardResource } from "./dashboard/index.js";
import { endpointResource } from "./endpoint/index.js";
import { featureFlagResource } from "./feature-flag/index.js";
import { insightResource } from "./insight/index.js";
import { eventDefinitionResource } from "./event-definition/index.js";
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
];

export { insightResource } from "./insight/index.js";
export { dashboardResource } from "./dashboard/index.js";
export { featureFlagResource } from "./feature-flag/index.js";
export { endpointResource } from "./endpoint/index.js";
export { propertyGroupResource } from "./property-group/index.js";
export { eventDefinitionResource } from "./event-definition/index.js";
export type { ResourceModule, ResourceOp, ApplyContext, DesiredState } from "./types.js";
