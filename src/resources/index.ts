import type { ResourceModule } from "./types.js";
import { topoOrder } from "./order.js";
import { actionResource } from "./action/index.js";
import { cohortResource } from "./cohort/index.js";
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
import { hogFunctionResource } from "./hog-function/index.js";

/**
 * Source-of-truth registry. Listed in stable, human-readable order — the
 * `topoOrder` call below derives apply-execute order from each module's
 * declared `dependsOn` edges, so this list itself is order-independent.
 */
const REGISTRY: ReadonlyArray<ResourceModule<unknown, unknown>> = [
  actionResource as ResourceModule<unknown, unknown>,
  cohortResource as ResourceModule<unknown, unknown>,
  dashboardResource as ResourceModule<unknown, unknown>,
  endpointResource as ResourceModule<unknown, unknown>,
  eventDefinitionResource as ResourceModule<unknown, unknown>,
  experimentResource as ResourceModule<unknown, unknown>,
  experimentHoldoutResource as ResourceModule<unknown, unknown>,
  experimentSavedMetricResource as ResourceModule<unknown, unknown>,
  featureFlagResource as ResourceModule<unknown, unknown>,
  insightResource as ResourceModule<unknown, unknown>,
  projectSettingsResource as ResourceModule<unknown, unknown>,
  propertyGroupResource as ResourceModule<unknown, unknown>,
  hogFunctionResource as ResourceModule<unknown, unknown>,
];

/**
 * Resources in apply-execute order. Derived by topologically sorting `REGISTRY`
 * over each module's `dependsOn` edges, so any code that iterates `RESOURCES`
 * processes producers before consumers (e.g. insights before dashboards,
 * property-groups before event-definitions).
 */
export const RESOURCES: ReadonlyArray<ResourceModule<unknown, unknown>> = topoOrder(REGISTRY);

export { insightResource } from "./insight/index.js";
export { dashboardResource } from "./dashboard/index.js";
export { actionResource } from "./action/index.js";
export { cohortResource } from "./cohort/index.js";
export { featureFlagResource } from "./feature-flag/index.js";
export { endpointResource } from "./endpoint/index.js";
export { propertyGroupResource } from "./property-group/index.js";
export { eventDefinitionResource } from "./event-definition/index.js";
export { experimentHoldoutResource } from "./experiment-holdout/index.js";
export { experimentSavedMetricResource } from "./experiment-saved-metric/index.js";
export { experimentResource } from "./experiment/index.js";
export { projectSettingsResource } from "./project-settings/index.js";
export { hogFunctionResource } from "./hog-function/index.js";
export type {
  ResourceModule,
  CollectionResourceModule,
  SingletonResourceModule,
  ResourceOp,
  FieldChange,
  ApplyContext,
  DesiredState,
} from "./types.js";
