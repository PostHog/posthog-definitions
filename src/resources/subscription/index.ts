import type { ApplyContext, CollectionResourceModule } from "../types.js";
import { insightResource } from "../insight/index.js";
import { dashboardResource } from "../dashboard/index.js";
import type { Subscription } from "./sdk.js";
import {
  SUBSCRIPTION_IDENTITY_PREFIX,
  subscriptionHash,
  subscriptionHashFromServer,
  subscriptionKeyFromServer,
  displaySubscription,
  displaySubscriptionFromServer,
  looksLikeSubscription,
  pruneSubscription,
  runSubscriptionOp,
  validateSubscriptions,
} from "./pipeline.js";
import {
  getSubscription,
  listSubscriptions,
  listManagedSubscriptions,
  type ServerSubscription,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { subscription } from "./sdk.js";
export type { Subscription, SubscriptionTargetType, SubscriptionFrequency } from "./sdk.js";

export const subscriptionResource: CollectionResourceModule<Subscription, ServerSubscription> = {
  kind: "collection",
  name: "subscriptions",
  displayName: "subscription",
  identityPrefix: SUBSCRIPTION_IDENTITY_PREFIX,
  dependsOn: [insightResource, dashboardResource],

  isSpec: looksLikeSubscription,
  specKey: (spec) => spec.key,

  list: listManagedSubscriptions,
  keyFromServer: (server) => subscriptionKeyFromServer(server),
  hashFromServer: (server) => subscriptionHashFromServer(server),

  hash: subscriptionHash,
  validate: (specs, state) => validateSubscriptions(specs, state),
  executeOp: runSubscriptionOp,
  prune: pruneSubscription,

  displaySpec: (spec, _ctx: ApplyContext) => displaySubscription(spec),
  displayServer: (server, ctx: ApplyContext) => displaySubscriptionFromServer(server, ctx),

  listAll: listSubscriptions,
  getById: (config, id, options) => getSubscription(config, Number(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
