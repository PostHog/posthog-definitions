import { markResourceKind } from "../types.js";

/** Message channel. Currently only "email" exists. */
export type MessageTemplateType = "email";

/**
 * Email content — a passthrough bag matching the API's EmailTemplate:
 * `{ subject, text, html, design }`. `design` is the visual-editor JSON
 * document; `subject`/`text`/`html` are Liquid-templated strings. Round-tripped
 * verbatim and canonically hashed — posthog-definitions does not enumerate the
 * design tree.
 */
export type EmailContent = {
  subject?: string;
  text?: string;
  html?: string;
  design?: Record<string, unknown>;
};

export type MessageTemplate = {
  key: string;
  name: string;
  description?: string;
  /** Defaults to "email" (the only channel today). */
  type?: MessageTemplateType;
  /** The email content. Replaced as a whole on update. */
  email: EmailContent;
  /** Templating language — always "liquid" (the default). */
  templating?: "liquid";
  /**
   * Optional messaging category id (uuid) to file the template under. Must
   * belong to the same project. Messaging categories are not managed by
   * posthog-definitions, so this is a raw id passthrough.
   */
  messageCategory?: string;
};

export function messageTemplate(spec: MessageTemplate): MessageTemplate {
  return markResourceKind(spec, "messaging-template");
}
