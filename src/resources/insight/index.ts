import type { ApplyContext, ResourceModule } from "../types.js";
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
import { listManagedInsights, type ServerInsight } from "./client.js";

export { insight, trends, hogql } from "./sdk.js";
export type {
  Insight,
  Query,
  TrendsQuery,
  HogQLQuery,
  EventsNode,
  InsightVizNode,
} from "./sdk.js";

export const insightResource: ResourceModule<Insight, ServerInsight> = {
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
};
