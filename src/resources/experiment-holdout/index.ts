import type { ApplyContext, ResourceModule } from "../types.js";
import type { ExperimentHoldout } from "./sdk.js";
import {
  displayExperimentHoldout,
  displayExperimentHoldoutFromServer,
  EXPERIMENT_HOLDOUT_IDENTITY_PREFIX,
  experimentHoldoutHash,
  experimentHoldoutHashFromServer,
  experimentHoldoutKeyFromServer,
  looksLikeExperimentHoldout,
  pruneExperimentHoldout,
  runExperimentHoldoutOp,
  validateExperimentHoldouts,
} from "./pipeline.js";
import {
  listManagedExperimentHoldouts,
  type ServerExperimentHoldout,
} from "./client.js";

export { experimentHoldout } from "./sdk.js";
export type { ExperimentHoldout } from "./sdk.js";

export const experimentHoldoutResource: ResourceModule<
  ExperimentHoldout,
  ServerExperimentHoldout
> = {
  kind: "collection",
  name: "experiment-holdouts",
  displayName: "experiment holdout",
  identityPrefix: EXPERIMENT_HOLDOUT_IDENTITY_PREFIX,

  isSpec: looksLikeExperimentHoldout,
  specKey: (spec) => spec.key,

  list: listManagedExperimentHoldouts,
  keyFromServer: (server) => experimentHoldoutKeyFromServer(server),
  hashFromServer: (server) => experimentHoldoutHashFromServer(server),

  hash: experimentHoldoutHash,
  validate: (specs) => validateExperimentHoldouts(specs),
  executeOp: runExperimentHoldoutOp,
  prune: pruneExperimentHoldout,

  displaySpec: (spec, _ctx: ApplyContext) => displayExperimentHoldout(spec),
  displayServer: (server, _ctx: ApplyContext) => displayExperimentHoldoutFromServer(server),
};
