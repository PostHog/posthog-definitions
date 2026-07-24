import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { LogsSamplingRule } from "./sdk.js";
import {
  LOGS_SAMPLING_RULE_IDENTITY_PREFIX,
  displayLogsSamplingRule,
  displayLogsSamplingRuleFromServer,
  logsSamplingRuleHash,
  logsSamplingRuleHashFromServer,
  logsSamplingRuleKeyFromServer,
  looksLikeLogsSamplingRule,
  pruneLogsSamplingRule,
  runLogsSamplingRuleOp,
  validateLogsSamplingRules,
} from "./pipeline.js";
import {
  getLogsSamplingRule,
  listLogsSamplingRules,
  listManagedLogsSamplingRules,
  type ServerLogsSamplingRule,
} from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { logsSamplingRule } from "./sdk.js";
export type { LogsSamplingRule, LogsSamplingRuleType } from "./sdk.js";

export const logsSamplingRuleResource: CollectionResourceModule<
  LogsSamplingRule,
  ServerLogsSamplingRule
> = {
  kind: "collection",
  name: "logs-sampling-rules",
  displayName: "logs sampling rule",
  identityPrefix: LOGS_SAMPLING_RULE_IDENTITY_PREFIX,

  isSpec: looksLikeLogsSamplingRule,
  specKey: (spec) => spec.key,

  list: listManagedLogsSamplingRules,
  keyFromServer: (server) => logsSamplingRuleKeyFromServer(server),
  hashFromServer: (server) => logsSamplingRuleHashFromServer(server),

  hash: logsSamplingRuleHash,
  validate: (specs, state) => validateLogsSamplingRules(specs, state),
  executeOp: runLogsSamplingRuleOp,
  prune: pruneLogsSamplingRule,

  displaySpec: (spec, _ctx: ApplyContext) => displayLogsSamplingRule(spec),
  displayServer: (server, _ctx: ApplyContext) => displayLogsSamplingRuleFromServer(server),

  listAll: listLogsSamplingRules,
  getById: (config, id, options) => getLogsSamplingRule(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
