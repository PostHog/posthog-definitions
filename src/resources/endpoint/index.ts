import type { ApplyContext, ResourceModule } from "../types.js";
import type { Endpoint } from "./sdk.js";
import {
  displayEndpoint,
  displayEndpointFromServer,
  ENDPOINT_IDENTITY_PREFIX,
  endpointHash,
  endpointHashFromServer,
  endpointKeyFromServer,
  looksLikeEndpoint,
  pruneEndpoint,
  runEndpointOp,
  validateEndpoints,
} from "./pipeline.js";
import { listManagedEndpoints, type ServerEndpoint } from "./client.js";

export { endpoint } from "./sdk.js";
export type { Endpoint } from "./sdk.js";

export const endpointResource: ResourceModule<Endpoint, ServerEndpoint> = {
  name: "endpoints",
  displayName: "endpoint",
  identityPrefix: ENDPOINT_IDENTITY_PREFIX,

  isSpec: looksLikeEndpoint,
  specKey: (spec) => spec.key,

  list: listManagedEndpoints,
  keyFromServer: (server) => endpointKeyFromServer(server),
  hashFromServer: (server) => endpointHashFromServer(server),

  hash: endpointHash,
  validate: (specs) => validateEndpoints(specs),
  executeOp: runEndpointOp,
  prune: pruneEndpoint,

  displaySpec: (spec, _ctx: ApplyContext) => displayEndpoint(spec),
  displayServer: (server, _ctx: ApplyContext) => displayEndpointFromServer(server),
};
