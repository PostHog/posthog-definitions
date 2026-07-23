import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { HogFunction } from "./sdk.js";
import {
  displayHogFunction,
  displayHogFunctionFromServer,
  HOG_FUNCTION_IDENTITY_PREFIX,
  hogFunctionHash,
  hogFunctionHashFromServer,
  hogFunctionKeyFromServer,
  looksLikeHogFunction,
  pruneHogFunction,
  runHogFunctionOp,
  validateHogFunctions,
} from "./pipeline.js";
import {
  getHogFunction,
  listHogFunctions,
  listManagedHogFunctions,
  type ServerHogFunction,
} from "./client.js";
import {
  hydrateForPull,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { hogFunction, secret } from "./sdk.js";
export type { HogFunction, HogFunctionType, HogFunctionInputValue, SecretInput } from "./sdk.js";

export const hogFunctionResource: CollectionResourceModule<HogFunction, ServerHogFunction> = {
  kind: "collection",
  name: "hog-functions",
  displayName: "hog function",
  identityPrefix: HOG_FUNCTION_IDENTITY_PREFIX,

  isSpec: looksLikeHogFunction,
  specKey: (spec) => spec.key,

  list: listManagedHogFunctions,
  keyFromServer: (server) => hogFunctionKeyFromServer(server),
  hashFromServer: (server) => hogFunctionHashFromServer(server),

  hash: hogFunctionHash,
  validate: (specs) => validateHogFunctions(specs),
  executeOp: runHogFunctionOp,
  prune: pruneHogFunction,

  displaySpec: (spec, _ctx: ApplyContext) => displayHogFunction(spec),
  displayServer: (server, _ctx: ApplyContext) => displayHogFunctionFromServer(server),

  listAll: listHogFunctions,
  getById: (config, id, options) => getHogFunction(config, String(id), options),
  hydrateForPull,
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
