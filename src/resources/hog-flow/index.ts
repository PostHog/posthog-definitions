import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { HogFlow } from "./sdk.js";
import {
  displayHogFlow,
  displayHogFlowFromServer,
  HOG_FLOW_IDENTITY_PREFIX,
  hogFlowHash,
  hogFlowHashFromServer,
  hogFlowKeyFromServer,
  looksLikeHogFlow,
  pruneHogFlow,
  runHogFlowOp,
  validateHogFlows,
} from "./pipeline.js";
import { getHogFlow, listHogFlows, listManagedHogFlows, type ServerHogFlow } from "./client.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf, tagOnServer } from "./codegen.js";

export { hogFlow } from "./sdk.js";
export type {
  HogFlow,
  HogFlowStatus,
  HogFlowExitCondition,
  HogFlowAction,
  HogFlowEdge,
} from "./sdk.js";

export const hogFlowResource: CollectionResourceModule<HogFlow, ServerHogFlow> = {
  kind: "collection",
  name: "hog-flows",
  displayName: "hog flow",
  identityPrefix: HOG_FLOW_IDENTITY_PREFIX,

  isSpec: looksLikeHogFlow,
  specKey: (spec) => spec.key,

  list: listManagedHogFlows,
  keyFromServer: (server) => hogFlowKeyFromServer(server),
  hashFromServer: (server) => hogFlowHashFromServer(server),

  hash: hogFlowHash,
  validate: (specs) => validateHogFlows(specs),
  executeOp: runHogFlowOp,
  prune: pruneHogFlow,

  displaySpec: (spec, _ctx: ApplyContext) => displayHogFlow(spec),
  displayServer: (server, _ctx: ApplyContext) => displayHogFlowFromServer(server),

  listAll: listHogFlows,
  getById: (config, id, options) => getHogFlow(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
