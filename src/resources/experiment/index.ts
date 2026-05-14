import type { ApplyContext, ResourceModule } from "../types.js";
import type { Experiment } from "./sdk.js";
import {
  displayExperiment,
  displayExperimentFromServer,
  EXPERIMENT_IDENTITY_PREFIX,
  experimentHash,
  experimentHashFromServer,
  experimentKeyFromServer,
  looksLikeExperiment,
  pruneExperiment,
  runExperimentOp,
  validateExperiments,
} from "./pipeline.js";
import { listManagedExperiments, type ServerExperiment } from "./client.js";

export { experiment } from "./sdk.js";
export type {
  Experiment,
  ExperimentLifecycle,
  ExperimentType,
  ExperimentConclusion,
  ExperimentVariant,
  ExperimentParameters,
  ExperimentMetric,
  ExperimentExposureCriteria,
} from "./sdk.js";

export const experimentResource: ResourceModule<Experiment, ServerExperiment> = {
  name: "experiments",
  displayName: "experiment",
  identityPrefix: EXPERIMENT_IDENTITY_PREFIX,

  isSpec: looksLikeExperiment,
  specKey: (spec) => spec.key,

  list: listManagedExperiments,
  keyFromServer: (server) => experimentKeyFromServer(server),
  hashFromServer: (server) => experimentHashFromServer(server),

  hash: experimentHash,
  validate: (specs, state) => validateExperiments(specs, state),
  executeOp: runExperimentOp,
  prune: pruneExperiment,

  displaySpec: (spec, _ctx: ApplyContext) => displayExperiment(spec),
  displayServer: (server, _ctx: ApplyContext) => displayExperimentFromServer(server),
};
