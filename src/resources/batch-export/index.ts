import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { BatchExport } from "./sdk.js";
import {
  BATCH_EXPORT_IDENTITY_PREFIX,
  batchExportHash,
  batchExportHashFromServer,
  batchExportKeyFromServer,
  displayBatchExport,
  displayBatchExportFromServer,
  looksLikeBatchExport,
  pruneBatchExport,
  runBatchExportOp,
  validateBatchExports,
} from "./pipeline.js";
import {
  getBatchExport,
  listBatchExports,
  listManagedBatchExports,
  type ServerBatchExport,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { batchExport } from "./sdk.js";
export type {
  BatchExport,
  BatchExportDestination,
  BatchExportDestinationType,
  BatchExportInterval,
  BatchExportModel,
} from "./sdk.js";

export const batchExportResource: CollectionResourceModule<BatchExport, ServerBatchExport> = {
  kind: "collection",
  name: "batch-exports",
  displayName: "batch export",
  identityPrefix: BATCH_EXPORT_IDENTITY_PREFIX,

  isSpec: looksLikeBatchExport,
  specKey: (spec) => spec.key,

  list: listManagedBatchExports,
  keyFromServer: (server) => batchExportKeyFromServer(server),
  hashFromServer: (server) => batchExportHashFromServer(server),

  hash: batchExportHash,
  validate: (specs, state) => validateBatchExports(specs, state),
  executeOp: runBatchExportOp,
  prune: pruneBatchExport,

  displaySpec: (spec, _ctx: ApplyContext) => displayBatchExport(spec),
  displayServer: (server, _ctx: ApplyContext) => displayBatchExportFromServer(server),

  listAll: listBatchExports,
  getById: (config, id, options) => getBatchExport(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
