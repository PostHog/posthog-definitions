import type { ApplyContext, CollectionResourceModule } from "../types.js";
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
  getExperimentHoldout,
  listExperimentHoldouts,
  listManagedExperimentHoldouts,
  type ServerExperimentHoldout,
} from "./client.js";
import {
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { experimentHoldout } from "./sdk.js";
export type { ExperimentHoldout } from "./sdk.js";

export const experimentHoldoutResource: CollectionResourceModule<
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

  listAll: listExperimentHoldouts,
  getById: (config, id, options) => getExperimentHoldout(config, Number(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
