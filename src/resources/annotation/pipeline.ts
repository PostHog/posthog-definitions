import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { Insight } from "../insight/sdk.js";
import type { Dashboard } from "../dashboard/sdk.js";
import type { Annotation, AnnotationScope } from "./sdk.js";
import {
  type AnnotationCreate,
  createAnnotation,
  deleteAnnotation,
  getAnnotation,
  type ServerAnnotation,
  updateAnnotation,
} from "./client.js";

export const ANNOTATION_IDENTITY_PREFIX = "iac:annotations:";

const MARKER_REGEX = /\n*<!--\s*iac:annotations:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userContent: string; key: string; hash: string };

function parseMarker(content: string | null | undefined): ParsedMarker | undefined {
  if (!content) return undefined;
  const match = content.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userContent: content.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userContent: string, key: string, hash: string): string {
  const trailer = `<!-- iac:annotations:${key} iac:hash:${hash} -->`;
  const trimmed = userContent.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(content: string | null | undefined): string | null {
  if (!content) return null;
  const parsed = parseMarker(content);
  return parsed ? parsed.userContent || null : content;
}

export function annotationKeyFromServer(server: ServerAnnotation): string | undefined {
  return parseMarker(server.content)?.key;
}

export function annotationHashFromServer(server: ServerAnnotation): string | undefined {
  return parseMarker(server.content)?.hash;
}

function desiredScope(spec: Annotation): AnnotationScope {
  return spec.scope ?? "project";
}

function specForHash(spec: Annotation): unknown {
  return {
    key: spec.key,
    content: spec.content,
    date_marker: spec.dateMarker,
    scope: desiredScope(spec),
    insight_key: spec.insight?.key ?? null,
    dashboard_key: spec.dashboard?.key ?? null,
    emoji: spec.emoji ?? null,
    hidden: spec.hidden ?? null,
    creation_type: spec.creationType ?? null,
  };
}

export function annotationHash(spec: Annotation): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: Annotation, hash: string, ctx: ApplyContext): AnnotationCreate {
  const scope = desiredScope(spec);
  const payload: AnnotationCreate = {
    content: withMarker(spec.content, spec.key, hash),
    date_marker: spec.dateMarker,
    scope,
  };
  if (scope === "dashboard_item") {
    const id = ctx.insightIdByKey.get(spec.insight!.key);
    if (id === undefined) {
      throw new Error(
        `annotation "${spec.key}" references insight "${spec.insight!.key}" but no server id is known. Insights must run before annotations.`,
      );
    }
    payload.dashboard_item = id;
  }
  if (scope === "dashboard") {
    const id = ctx.dashboardIdByKey.get(spec.dashboard!.key);
    if (id === undefined) {
      throw new Error(
        `annotation "${spec.key}" references dashboard "${spec.dashboard!.key}" but no server id is known. Dashboards must run before annotations.`,
      );
    }
    payload.dashboard_id = id;
  }
  if (spec.emoji !== undefined) payload.emoji = spec.emoji;
  if (spec.hidden !== undefined) payload.hidden_in_user_interface = spec.hidden;
  if (spec.creationType !== undefined) payload.creation_type = spec.creationType;
  return payload;
}

export function looksLikeAnnotation(value: unknown): value is Annotation {
  return getResourceKind(value) === "annotation";
}

export function validateAnnotations(specs: Annotation[], state: DesiredState): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();

  const knownInsightKeys = new Set<string>();
  for (const loaded of state.get("insights") ?? []) {
    const insight = loaded.spec as Insight;
    if (insight?.key) knownInsightKeys.add(insight.key);
  }
  const knownDashboardKeys = new Set<string>();
  for (const loaded of state.get("dashboards") ?? []) {
    const dashboard = loaded.spec as Dashboard;
    if (dashboard?.key) knownDashboardKeys.add(dashboard.key);
  }

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("annotation.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`annotation "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate annotation key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.content || spec.content.trim() === "") {
      issues.push(`annotation "${spec.key}" content is required (it carries the identity marker)`);
    }
    if (!spec.dateMarker) {
      issues.push(`annotation "${spec.key}" dateMarker (ISO timestamp) is required`);
    }

    const scope = desiredScope(spec);
    if (scope === "dashboard_item") {
      if (!spec.insight) {
        issues.push(`annotation "${spec.key}" scope "dashboard_item" requires an \`insight\` reference`);
      } else if (!knownInsightKeys.has(spec.insight.key)) {
        issues.push(
          `annotation "${spec.key}" references unknown insight "${spec.insight.key}" — declare it in the same run`,
        );
      }
      if (spec.dashboard) issues.push(`annotation "${spec.key}" scope "dashboard_item" must not declare a \`dashboard\``);
    } else if (scope === "dashboard") {
      if (!spec.dashboard) {
        issues.push(`annotation "${spec.key}" scope "dashboard" requires a \`dashboard\` reference`);
      } else if (!knownDashboardKeys.has(spec.dashboard.key)) {
        issues.push(
          `annotation "${spec.key}" references unknown dashboard "${spec.dashboard.key}" — declare it in the same run`,
        );
      }
      if (spec.insight) issues.push(`annotation "${spec.key}" scope "dashboard" must not declare an \`insight\``);
    } else {
      // project / organization
      if (spec.insight || spec.dashboard) {
        issues.push(
          `annotation "${spec.key}" scope "${scope}" must not declare an \`insight\` or \`dashboard\` reference`,
        );
      }
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getAnnotation(config, id, options);
  if (annotationKeyFromServer(current) !== key) {
    throw new SafetyViolationError("annotation", id, key);
  }
}

export async function runAnnotationOp(
  config: ClientConfig,
  op: ResourceOp<Annotation, ServerAnnotation>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = buildPayload(op.spec, annotationHash(op.spec), ctx);

  if (op.kind === "create") {
    await createAnnotation(config, payload, options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateAnnotation(config, op.server.id, payload, options);
}

export async function pruneAnnotation(
  config: ClientConfig,
  orphan: ServerAnnotation,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = annotationKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteAnnotation(config, orphan.id, options);
  return true;
}

export function displayAnnotation(spec: Annotation): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["content", scalar(spec.content)],
    ["date_marker", scalar(spec.dateMarker)],
    ["scope", scalar(desiredScope(spec))],
    ["insight", scalar(spec.insight?.key ?? null)],
    ["dashboard", scalar(spec.dashboard?.key ?? null)],
    ["emoji", scalar(spec.emoji ?? null)],
    ["hidden", scalar(spec.hidden ?? null)],
    ["creation_type", scalar(spec.creationType ?? null)],
  ]);
}

export function displayAnnotationFromServer(
  server: ServerAnnotation,
  ctx: ApplyContext,
): DisplayValue {
  const insightKey =
    server.dashboard_item != null
      ? (ctx.insightKeyByServerId.get(server.dashboard_item) ?? `id:${server.dashboard_item}`)
      : null;
  const dashboardKey =
    server.dashboard_id != null
      ? (ctx.dashboardKeyByServerId.get(server.dashboard_id) ?? `id:${server.dashboard_id}`)
      : null;
  return obj([
    ["key", scalar(annotationKeyFromServer(server) ?? null)],
    ["content", scalar(stripMarker(server.content))],
    ["date_marker", scalar(server.date_marker ?? null)],
    ["scope", scalar(server.scope ?? "project")],
    ["insight", scalar(insightKey)],
    ["dashboard", scalar(dashboardKey)],
    ["emoji", scalar(server.emoji ?? null)],
    ["hidden", scalar(server.hidden_in_user_interface ?? null)],
    ["creation_type", scalar(server.creation_type ?? null)],
  ]);
}
