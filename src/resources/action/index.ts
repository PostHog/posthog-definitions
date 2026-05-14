import type { ApplyContext, ResourceModule } from "../types.js";
import type { Action } from "./sdk.js";
import {
  ACTION_TAG_PREFIX,
  actionHash,
  actionHashFromTags,
  actionKeyFromTags,
  displayAction,
  displayActionFromServer,
  looksLikeAction,
  pruneAction,
  runActionOp,
  validateActions,
} from "./pipeline.js";
import { listManagedActions, type ServerAction } from "./client.js";

export { action } from "./sdk.js";
export type { Action, ActionStep, ActionStepMatching, ActionStepProperty } from "./sdk.js";

export const actionResource: ResourceModule<Action, ServerAction> = {
  kind: "collection",
  name: "actions",
  displayName: "action",
  identityPrefix: ACTION_TAG_PREFIX,

  isSpec: looksLikeAction,
  specKey: (spec) => spec.key,

  list: listManagedActions,
  keyFromServer: (server) => actionKeyFromTags(server.tags),
  hashFromServer: (server) => actionHashFromTags(server.tags),

  hash: actionHash,
  validate: (specs) => validateActions(specs),
  executeOp: runActionOp,
  prune: pruneAction,

  displaySpec: (spec, _ctx: ApplyContext) => displayAction(spec),
  displayServer: (server, _ctx: ApplyContext) => displayActionFromServer(server),
};
