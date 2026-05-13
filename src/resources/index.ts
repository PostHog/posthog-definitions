import type { ResourceModule } from "./types.js";
import { dashboardResource } from "./dashboard/index.js";
import { insightResource } from "./insight/index.js";

/**
 * Resources are listed in apply-execute order: each resource is fully created/updated
 * before the next runs, so a resource may depend on earlier ones (e.g. dashboards rely
 * on insight server ids being available in ApplyContext).
 */
export const RESOURCES: ReadonlyArray<ResourceModule<unknown, unknown>> = [
  insightResource as ResourceModule<unknown, unknown>,
  dashboardResource as ResourceModule<unknown, unknown>,
];

export { insightResource } from "./insight/index.js";
export { dashboardResource } from "./dashboard/index.js";
export type { ResourceModule, ResourceOp, ApplyContext, DesiredState } from "./types.js";
