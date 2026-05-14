import type { ApplyContext, ResourceModule } from "../types.js";
import type { ExperimentSavedMetric } from "./sdk.js";
import {
  displayExperimentSavedMetric,
  displayExperimentSavedMetricFromServer,
  EXPERIMENT_SAVED_METRIC_IDENTITY_PREFIX,
  experimentSavedMetricHash,
  experimentSavedMetricHashFromServer,
  experimentSavedMetricKeyFromServer,
  looksLikeExperimentSavedMetric,
  pruneExperimentSavedMetric,
  runExperimentSavedMetricOp,
  validateExperimentSavedMetrics,
} from "./pipeline.js";
import {
  listManagedExperimentSavedMetrics,
  type ServerExperimentSavedMetric,
} from "./client.js";

export { experimentSavedMetric } from "./sdk.js";
export type { ExperimentSavedMetric } from "./sdk.js";

export const experimentSavedMetricResource: ResourceModule<
  ExperimentSavedMetric,
  ServerExperimentSavedMetric
> = {
  name: "experiment-saved-metrics",
  displayName: "experiment saved metric",
  identityPrefix: EXPERIMENT_SAVED_METRIC_IDENTITY_PREFIX,

  isSpec: looksLikeExperimentSavedMetric,
  specKey: (spec) => spec.key,

  list: listManagedExperimentSavedMetrics,
  keyFromServer: (server) => experimentSavedMetricKeyFromServer(server),
  hashFromServer: (server) => experimentSavedMetricHashFromServer(server),

  hash: experimentSavedMetricHash,
  validate: (specs) => validateExperimentSavedMetrics(specs),
  executeOp: runExperimentSavedMetricOp,
  prune: pruneExperimentSavedMetric,

  displaySpec: (spec, _ctx: ApplyContext) => displayExperimentSavedMetric(spec),
  displayServer: (server, _ctx: ApplyContext) => displayExperimentSavedMetricFromServer(server),
};
