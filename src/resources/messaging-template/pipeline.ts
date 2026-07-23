import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { MessageTemplate } from "./sdk.js";
import {
  createMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplate,
  type MessageTemplateCreate,
  type ServerMessageTemplate,
  updateMessageTemplate,
} from "./client.js";

/**
 * Messaging templates have no `tags` field. Identity sits in a trailing
 * HTML-comment marker on `description` (surveys / endpoints pattern).
 */
export const MESSAGING_TEMPLATE_IDENTITY_PREFIX = "iac:messaging-templates:";

const MARKER_REGEX = /\n*<!--\s*iac:messaging-templates:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userDescription: string; key: string; hash: string };

function parseMarker(description: string | null | undefined): ParsedMarker | undefined {
  if (!description) return undefined;
  const match = description.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userDescription: description.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userDescription: string | undefined, key: string, hash: string): string {
  const trailer = `<!-- iac:messaging-templates:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function messageTemplateKeyFromServer(server: ServerMessageTemplate): string | undefined {
  return parseMarker(server.description)?.key;
}

export function messageTemplateHashFromServer(server: ServerMessageTemplate): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: MessageTemplate): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    type: spec.type ?? "email",
    templating: spec.templating ?? "liquid",
    email: spec.email ?? {},
    message_category: spec.messageCategory ?? null,
  };
}

export function messageTemplateHash(spec: MessageTemplate): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: MessageTemplate, hash: string): MessageTemplateCreate {
  const payload: MessageTemplateCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    type: spec.type ?? "email",
    content: {
      templating: spec.templating ?? "liquid",
      email: (spec.email ?? {}) as Record<string, unknown>,
    },
  };
  if (spec.messageCategory !== undefined) payload.message_category = spec.messageCategory;
  return payload;
}

export function looksLikeMessageTemplate(value: unknown): value is MessageTemplate {
  return getResourceKind(value) === "messaging-template";
}

export function validateMessageTemplates(specs: MessageTemplate[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("messaging-template.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`messaging template "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate messaging template key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`messaging template "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate messaging template name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (spec.type !== undefined && spec.type !== "email") {
      issues.push(`messaging template "${spec.key}" type must be "email" (got "${spec.type}")`);
    }

    if (!spec.email || typeof spec.email !== "object") {
      issues.push(`messaging template "${spec.key}" requires an \`email\` content object`);
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getMessageTemplate(config, id, options);
  if (messageTemplateKeyFromServer(current) !== key) {
    throw new SafetyViolationError("messaging-template", id, key);
  }
}

export async function runMessageTemplateOp(
  config: ClientConfig,
  op: ResourceOp<MessageTemplate, ServerMessageTemplate>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = messageTemplateHash(op.spec);

  if (op.kind === "create") {
    await createMessageTemplate(config, buildPayload(op.spec, hash), options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateMessageTemplate(config, op.server.id, buildPayload(op.spec, hash), options);
}

export async function pruneMessageTemplate(
  config: ClientConfig,
  orphan: ServerMessageTemplate,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = messageTemplateKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteMessageTemplate(config, orphan.id, options);
  return true;
}

export function displayMessageTemplate(spec: MessageTemplate): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["type", scalar(spec.type ?? "email")],
    ["templating", scalar(spec.templating ?? "liquid")],
    ["email", displayJson(spec.email ?? {})],
    ["message_category", scalar(spec.messageCategory ?? null)],
  ]);
}

export function displayMessageTemplateFromServer(server: ServerMessageTemplate): DisplayValue {
  return obj([
    ["key", scalar(messageTemplateKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["type", scalar(server.type ?? "email")],
    ["templating", scalar(server.content?.templating ?? "liquid")],
    ["email", displayJson(server.content?.email ?? {})],
    ["message_category", scalar(server.message_category ?? null)],
  ]);
}
