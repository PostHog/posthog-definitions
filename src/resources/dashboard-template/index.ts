import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { DashboardTemplate } from "./sdk.js";
import {
  DASHBOARD_TEMPLATE_TAG_PREFIX,
  dashboardTemplateHash,
  dashboardTemplateHashFromTags,
  dashboardTemplateKeyFromTags,
  displayDashboardTemplate,
  displayDashboardTemplateFromServer,
  looksLikeDashboardTemplate,
  pruneDashboardTemplate,
  runDashboardTemplateOp,
  validateDashboardTemplates,
} from "./pipeline.js";
import {
  getDashboardTemplate,
  listDashboardTemplates,
  listManagedDashboardTemplates,
  type ServerDashboardTemplate,
} from "./client.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf, tagOnServer } from "./codegen.js";

export { dashboardTemplate } from "./sdk.js";
export type {
  DashboardTemplate,
  DashboardTemplateScope,
  DashboardTemplateTile,
  DashboardTemplateVariable,
} from "./sdk.js";

export const dashboardTemplateResource: CollectionResourceModule<
  DashboardTemplate,
  ServerDashboardTemplate
> = {
  kind: "collection",
  name: "dashboard-templates",
  displayName: "dashboard template",
  identityPrefix: DASHBOARD_TEMPLATE_TAG_PREFIX,

  isSpec: looksLikeDashboardTemplate,
  specKey: (spec) => spec.key,

  list: listManagedDashboardTemplates,
  keyFromServer: (server) => dashboardTemplateKeyFromTags(server.tags),
  hashFromServer: (server) => dashboardTemplateHashFromTags(server.tags),

  hash: dashboardTemplateHash,
  validate: (specs) => validateDashboardTemplates(specs),
  executeOp: runDashboardTemplateOp,
  prune: pruneDashboardTemplate,

  displaySpec: (spec, _ctx: ApplyContext) => displayDashboardTemplate(spec),
  displayServer: (server, _ctx: ApplyContext) => displayDashboardTemplateFromServer(server),

  listAll: listDashboardTemplates,
  getById: (config, id, options) => getDashboardTemplate(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
