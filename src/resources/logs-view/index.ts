import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { LogsView } from "./sdk.js";
import {
  LOGS_VIEW_IDENTITY_PREFIX,
  displayLogsView,
  displayLogsViewFromServer,
  logsViewHash,
  logsViewHashFromServer,
  logsViewKeyFromServer,
  looksLikeLogsView,
  pruneLogsView,
  runLogsViewOp,
  validateLogsViews,
} from "./pipeline.js";
import {
  getLogsView,
  listLogsViews,
  listManagedLogsViews,
  type ServerLogsView,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { logsView } from "./sdk.js";
export type { LogsView, LogsViewColumn, LogsViewColumnType } from "./sdk.js";

export const logsViewResource: CollectionResourceModule<LogsView, ServerLogsView> = {
  kind: "collection",
  name: "logs-views",
  displayName: "logs view",
  identityPrefix: LOGS_VIEW_IDENTITY_PREFIX,

  isSpec: looksLikeLogsView,
  specKey: (spec) => spec.key,

  list: listManagedLogsViews,
  keyFromServer: (server) => logsViewKeyFromServer(server),
  hashFromServer: (server) => logsViewHashFromServer(server),

  hash: logsViewHash,
  validate: (specs, state) => validateLogsViews(specs, state),
  executeOp: runLogsViewOp,
  prune: pruneLogsView,

  displaySpec: (spec, _ctx: ApplyContext) => displayLogsView(spec),
  displayServer: (server, _ctx: ApplyContext) => displayLogsViewFromServer(server),

  listAll: listLogsViews,
  getById: (config, id, options) => getLogsView(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
