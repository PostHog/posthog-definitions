import type { ApplyContext, CollectionResourceModule } from "../types.js";
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
import { getDashboard, listDashboards, listManagedDashboards, type ServerDashboard } from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { dashboard, text, button } from "./sdk.js";
export type { Dashboard, Tile, InsightTile, TextTile, ButtonTile, Layout, Filters } from "./sdk.js";

export const dashboardResource: CollectionResourceModule<Dashboard, ServerDashboard> = {
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

  listAll: listDashboards,
  getById: (config, id, options) =>
    getDashboard(config, typeof id === "string" ? Number(id) : id, options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
