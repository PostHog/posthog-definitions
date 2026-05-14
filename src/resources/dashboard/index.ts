import type { ApplyContext, ResourceModule } from "../types.js";
import { insightResource } from "../insight/index.js";
import type { Dashboard } from "./sdk.js";
import {
  DASHBOARD_TAG_PREFIX,
  dashboardHash,
  dashboardHashFromTags,
  dashboardKeyFromTags,
  displayDashboard,
  displayDashboardFromServer,
  extractInlineInsights,
  looksLikeDashboard,
  pruneDashboard,
  runDashboardOp,
  validateDashboards,
} from "./pipeline.js";
import { listManagedDashboards, type ServerDashboard } from "./client.js";

export { dashboard, text, button } from "./sdk.js";
export type { Dashboard, Tile, InsightTile, TextTile, ButtonTile, Layout, Filters } from "./sdk.js";

export const dashboardResource: ResourceModule<Dashboard, ServerDashboard> = {
  kind: "collection",
  name: "dashboards",
  displayName: "dashboard",
  identityPrefix: DASHBOARD_TAG_PREFIX,
  dependsOn: [insightResource],

  isSpec: looksLikeDashboard,
  specKey: (spec) => spec.key,
  extractInlineSpecs: extractInlineInsights,

  list: listManagedDashboards,
  keyFromServer: (server) => dashboardKeyFromTags(server.tags),
  hashFromServer: (server) => dashboardHashFromTags(server.tags),

  hash: dashboardHash,
  validate: (specs, state) => validateDashboards(specs, state),
  executeOp: runDashboardOp,
  prune: pruneDashboard,

  displaySpec: (spec, _ctx: ApplyContext) => displayDashboard(spec),
  displayServer: (server, ctx: ApplyContext) =>
    displayDashboardFromServer(server, ctx.insightKeyByServerId),
};
