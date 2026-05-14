import type { ApplyContext, ResourceModule } from "../types.js";
import type { PropertyGroup } from "./sdk.js";
import {
  displayPropertyGroup,
  displayPropertyGroupFromServer,
  PROPERTY_GROUP_IDENTITY_PREFIX,
  propertyGroupHash,
  propertyGroupHashFromServer,
  propertyGroupKeyFromServer,
  looksLikePropertyGroup,
  prunePropertyGroup,
  runPropertyGroupOp,
  validatePropertyGroups,
} from "./pipeline.js";
import { listManagedPropertyGroups, type ServerPropertyGroup } from "./client.js";

export { propertyGroup } from "./sdk.js";
export type { PropertyGroup, PropertyDef, PropertyMap, PropertyType } from "./sdk.js";

export const propertyGroupResource: ResourceModule<PropertyGroup, ServerPropertyGroup> = {
  kind: "collection",
  name: "property-groups",
  displayName: "property group",
  identityPrefix: PROPERTY_GROUP_IDENTITY_PREFIX,

  isSpec: looksLikePropertyGroup,
  specKey: (spec) => spec.key,

  list: listManagedPropertyGroups,
  keyFromServer: (server) => propertyGroupKeyFromServer(server),
  hashFromServer: (server) => propertyGroupHashFromServer(server),

  hash: propertyGroupHash,
  validate: (specs) => validatePropertyGroups(specs),
  executeOp: runPropertyGroupOp,
  prune: prunePropertyGroup,

  displaySpec: (spec, _ctx: ApplyContext) => displayPropertyGroup(spec),
  displayServer: (server, _ctx: ApplyContext) => displayPropertyGroupFromServer(server),
};
