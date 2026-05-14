import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { Insight } from "./sdk.js";
import {
  displayInsight,
  displayInsightFromServer,
  INSIGHT_TAG_PREFIX,
  insightHash,
  insightHashFromTags,
  insightKeyFromTags,
  looksLikeInsight,
  pruneInsight,
  runInsightOp,
  validateInsights,
} from "./pipeline.js";
import {
  getInsight,
  listInsights,
  listManagedInsights,
  type ServerInsight,
} from "./client.js";
import {
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { insight, trends, funnels, hogql } from "./sdk.js";
export type {
  Insight,
  Query,
  TrendsQuery,
  FunnelsQuery,
  HogQLQuery,
  EventsNode,
  InsightVizNode,
} from "./sdk.js";

export const insightResource: CollectionResourceModule<Insight, ServerInsight> = {
  kind: "collection",
  name: "insights",
  displayName: "insight",
  identityPrefix: INSIGHT_TAG_PREFIX,

  isSpec: looksLikeInsight,
  specKey: (spec) => spec.key,

  list: listManagedInsights,
  keyFromServer: (server) => insightKeyFromTags(server.tags),
  hashFromServer: (server) => insightHashFromTags(server.tags),

  hash: insightHash,
  validate: (specs) => validateInsights(specs),
  executeOp: runInsightOp,
  prune: pruneInsight,

  displaySpec: (spec, _ctx: ApplyContext) => displayInsight(spec),
  displayServer: (server, _ctx: ApplyContext) => displayInsightFromServer(server),

  listAll: listInsights,
  getById: (config, id, options) =>
    getInsight(config, typeof id === "string" ? Number(id) : id, options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
