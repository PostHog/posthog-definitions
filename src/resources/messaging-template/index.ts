import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { MessageTemplate } from "./sdk.js";
import {
  displayMessageTemplate,
  displayMessageTemplateFromServer,
  MESSAGING_TEMPLATE_IDENTITY_PREFIX,
  messageTemplateHash,
  messageTemplateHashFromServer,
  messageTemplateKeyFromServer,
  looksLikeMessageTemplate,
  pruneMessageTemplate,
  runMessageTemplateOp,
  validateMessageTemplates,
} from "./pipeline.js";
import {
  getMessageTemplate,
  listManagedMessageTemplates,
  listMessageTemplates,
  type ServerMessageTemplate,
} from "./client.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf, tagOnServer } from "./codegen.js";

export { messageTemplate } from "./sdk.js";
export type { MessageTemplate, MessageTemplateType, EmailContent } from "./sdk.js";

export const messagingTemplateResource: CollectionResourceModule<
  MessageTemplate,
  ServerMessageTemplate
> = {
  kind: "collection",
  name: "messaging-templates",
  displayName: "messaging template",
  identityPrefix: MESSAGING_TEMPLATE_IDENTITY_PREFIX,

  isSpec: looksLikeMessageTemplate,
  specKey: (spec) => spec.key,

  list: listManagedMessageTemplates,
  keyFromServer: (server) => messageTemplateKeyFromServer(server),
  hashFromServer: (server) => messageTemplateHashFromServer(server),

  hash: messageTemplateHash,
  validate: (specs) => validateMessageTemplates(specs),
  executeOp: runMessageTemplateOp,
  prune: pruneMessageTemplate,

  displaySpec: (spec, _ctx: ApplyContext) => displayMessageTemplate(spec),
  displayServer: (server, _ctx: ApplyContext) => displayMessageTemplateFromServer(server),

  listAll: listMessageTemplates,
  getById: (config, id, options) => getMessageTemplate(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
