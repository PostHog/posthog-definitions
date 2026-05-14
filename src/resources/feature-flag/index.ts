import type { ApplyContext, ResourceModule } from "../types.js";
import type { FeatureFlag } from "./sdk.js";
import {
  displayFeatureFlag,
  displayFeatureFlagFromServer,
  FEATURE_FLAG_TAG_PREFIX,
  featureFlagHash,
  featureFlagHashFromTags,
  featureFlagKeyFromTags,
  looksLikeFeatureFlag,
  pruneFeatureFlag,
  runFeatureFlagOp,
  validateFeatureFlags,
} from "./pipeline.js";
import { listManagedFeatureFlags, type ServerFeatureFlag } from "./client.js";

export { featureFlag } from "./sdk.js";
export type {
  FeatureFlag,
  FeatureFlagFilters,
  ReleaseConditionGroup,
  Variant,
  PropertyFilter,
} from "./sdk.js";

export const featureFlagResource: ResourceModule<FeatureFlag, ServerFeatureFlag> = {
  kind: "collection",
  name: "feature-flags",
  displayName: "feature flag",
  identityPrefix: FEATURE_FLAG_TAG_PREFIX,

  isSpec: looksLikeFeatureFlag,
  specKey: (spec) => spec.key,

  list: listManagedFeatureFlags,
  keyFromServer: (server) => featureFlagKeyFromTags(server.tags),
  hashFromServer: (server) => featureFlagHashFromTags(server.tags),

  hash: featureFlagHash,
  validate: (specs) => validateFeatureFlags(specs),
  executeOp: runFeatureFlagOp,
  prune: pruneFeatureFlag,

  displaySpec: (spec, _ctx: ApplyContext) => displayFeatureFlag(spec),
  displayServer: (server, _ctx: ApplyContext) => displayFeatureFlagFromServer(server),
};
