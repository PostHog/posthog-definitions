import type { ApplyContext, CollectionResourceModule } from "../types.js";
import { propertyGroupResource } from "../property-group/index.js";
import type { EventDefinition } from "./sdk.js";
import {
  displayEventDefinition,
  displayEventDefinitionFromServer,
  EVENT_DEFINITION_TAG_PREFIX,
  eventDefinitionHash,
  eventDefinitionHashFromTags,
  eventDefinitionKeyFromTags,
  looksLikeEventDefinition,
  pruneEventDefinition,
  runEventDefinitionOp,
  validateEventDefinitions,
} from "./pipeline.js";
import {
  getEventDefinition,
  listEventDefinitions,
  listManagedEventDefinitions,
  type ServerEventDefinition,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { eventDefinition } from "./sdk.js";
export type { EventDefinition, EnforcementMode } from "./sdk.js";

export const eventDefinitionResource: CollectionResourceModule<EventDefinition, ServerEventDefinition> = {
  kind: "collection",
  name: "event-definitions",
  displayName: "event definition",
  identityPrefix: EVENT_DEFINITION_TAG_PREFIX,
  dependsOn: [propertyGroupResource],

  isSpec: looksLikeEventDefinition,
  specKey: (spec) => spec.key,

  list: listManagedEventDefinitions,
  keyFromServer: (server) => eventDefinitionKeyFromTags(server.tags),
  hashFromServer: (server) => eventDefinitionHashFromTags(server.tags),

  hash: eventDefinitionHash,
  validate: (specs, state) => validateEventDefinitions(specs, state),
  executeOp: runEventDefinitionOp,
  prune: pruneEventDefinition,

  displaySpec: (spec, _ctx: ApplyContext) => displayEventDefinition(spec),
  displayServer: (server, _ctx: ApplyContext) => displayEventDefinitionFromServer(server),

  listAll: listEventDefinitions,
  getById: (config, id, options) => getEventDefinition(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
