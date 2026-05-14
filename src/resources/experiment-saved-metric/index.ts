import type { ApplyContext, CollectionResourceModule } from "../types.js";
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
  getExperimentSavedMetric,
  listExperimentSavedMetrics,
  listManagedExperimentSavedMetrics,
  type ServerExperimentSavedMetric,
} from "./client.js";
import {
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { experimentSavedMetric } from "./sdk.js";
export type { ExperimentSavedMetric } from "./sdk.js";

export const experimentSavedMetricResource: CollectionResourceModule<
  ExperimentSavedMetric,
  ServerExperimentSavedMetric
> = {
  kind: "collection",
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

  listAll: listExperimentSavedMetrics,
  getById: (config, id, options) => getExperimentSavedMetric(config, Number(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
