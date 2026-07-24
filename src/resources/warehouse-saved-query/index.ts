import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { WarehouseSavedQuery } from "./sdk.js";
import {
  WAREHOUSE_SAVED_QUERY_IDENTITY_PREFIX,
  displayWarehouseSavedQuery,
  displayWarehouseSavedQueryFromServer,
  looksLikeWarehouseSavedQuery,
  pruneWarehouseSavedQuery,
  runWarehouseSavedQueryOp,
  validateWarehouseSavedQueries,
  warehouseSavedQueryHash,
  warehouseSavedQueryHashFromServer,
  warehouseSavedQueryKeyFromServer,
} from "./pipeline.js";
import {
  getWarehouseSavedQuery,
  listManagedWarehouseSavedQueries,
  listWarehouseSavedQueries,
  type ServerWarehouseSavedQuery,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { warehouseSavedQuery } from "./sdk.js";
export type { WarehouseSavedQuery } from "./sdk.js";

export const warehouseSavedQueryResource: CollectionResourceModule<
  WarehouseSavedQuery,
  ServerWarehouseSavedQuery
> = {
  kind: "collection",
  name: "warehouse-saved-queries",
  displayName: "warehouse saved query",
  identityPrefix: WAREHOUSE_SAVED_QUERY_IDENTITY_PREFIX,

  isSpec: looksLikeWarehouseSavedQuery,
  specKey: (spec) => spec.key,

  list: listManagedWarehouseSavedQueries,
  keyFromServer: (server) => warehouseSavedQueryKeyFromServer(server),
  hashFromServer: (server) => warehouseSavedQueryHashFromServer(server),

  hash: warehouseSavedQueryHash,
  validate: (specs, state) => validateWarehouseSavedQueries(specs, state),
  executeOp: runWarehouseSavedQueryOp,
  prune: pruneWarehouseSavedQuery,

  displaySpec: (spec, _ctx: ApplyContext) => displayWarehouseSavedQuery(spec),
  displayServer: (server, _ctx: ApplyContext) => displayWarehouseSavedQueryFromServer(server),

  listAll: listWarehouseSavedQueries,
  getById: (config, id, options) => getWarehouseSavedQuery(config, String(id), options),
  // The list endpoint returns a minimal serializer without `query`; re-fetch
  // the full row so renderToFile sees the SQL.
  hydrateForPull: (config, server, options) => getWarehouseSavedQuery(config, server.id, options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
