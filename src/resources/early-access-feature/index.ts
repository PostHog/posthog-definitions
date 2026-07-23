import type { ApplyContext, CollectionResourceModule } from "../types.js";
import { featureFlagResource } from "../feature-flag/index.js";
import type { EarlyAccessFeature } from "./sdk.js";
import {
  displayEarlyAccessFeature,
  displayEarlyAccessFeatureFromServer,
  EARLY_ACCESS_FEATURE_IDENTITY_PREFIX,
  earlyAccessFeatureHash,
  earlyAccessFeatureHashFromServer,
  earlyAccessFeatureKeyFromServer,
  looksLikeEarlyAccessFeature,
  pruneEarlyAccessFeature,
  runEarlyAccessFeatureOp,
  validateEarlyAccessFeatures,
} from "./pipeline.js";
import {
  getEarlyAccessFeature,
  listEarlyAccessFeatures,
  listManagedEarlyAccessFeatures,
  type ServerEarlyAccessFeature,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { earlyAccessFeature } from "./sdk.js";
export type { EarlyAccessFeature, EarlyAccessStage } from "./sdk.js";

function flagKeyByServerId(ctx: ApplyContext): Map<number, string> {
  const inv = new Map<number, string>();
  for (const [key, id] of ctx.featureFlagIdByKey) inv.set(id, key);
  return inv;
}

export const earlyAccessFeatureResource: CollectionResourceModule<
  EarlyAccessFeature,
  ServerEarlyAccessFeature
> = {
  kind: "collection",
  name: "early-access-features",
  displayName: "early access feature",
  identityPrefix: EARLY_ACCESS_FEATURE_IDENTITY_PREFIX,
  dependsOn: [featureFlagResource],

  isSpec: looksLikeEarlyAccessFeature,
  specKey: (spec) => spec.key,

  list: listManagedEarlyAccessFeatures,
  keyFromServer: (server) => earlyAccessFeatureKeyFromServer(server),
  hashFromServer: (server) => earlyAccessFeatureHashFromServer(server),

  hash: earlyAccessFeatureHash,
  validate: (specs, state) => validateEarlyAccessFeatures(specs, state),
  executeOp: runEarlyAccessFeatureOp,
  prune: pruneEarlyAccessFeature,

  displaySpec: (spec, _ctx: ApplyContext) => displayEarlyAccessFeature(spec),
  displayServer: (server, ctx: ApplyContext) =>
    displayEarlyAccessFeatureFromServer(server, flagKeyByServerId(ctx)),

  listAll: listEarlyAccessFeatures,
  getById: (config, id, options) => getEarlyAccessFeature(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
