import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { arr, displayJson, filterUserTags, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { DashboardTemplate } from "./sdk.js";
import {
  createDashboardTemplate,
  type DashboardTemplateCreate,
  deleteDashboardTemplate,
  getDashboardTemplate,
  type ServerDashboardTemplate,
  updateDashboardTemplate,
} from "./client.js";

/**
 * Dashboard templates carry a real `tags` field, so identity is the plain
 * dashboards pattern: an `iac:dashboard-templates:<key>` tag plus the shared
 * `iac:hash:<hex>` tag.
 */
export const DASHBOARD_TEMPLATE_TAG_PREFIX = "iac:dashboard-templates:";
export const HASH_TAG_PREFIX = "iac:hash:";

const KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function dashboardTemplateTag(key: string): string {
  return `${DASHBOARD_TEMPLATE_TAG_PREFIX}${key}`;
}

export function dashboardTemplateKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith(DASHBOARD_TEMPLATE_TAG_PREFIX));
  return tag?.slice(DASHBOARD_TEMPLATE_TAG_PREFIX.length);
}

export function dashboardTemplateHashFromTags(tags: string[] | undefined): string | undefined {
  return tags?.find((t) => t.startsWith(HASH_TAG_PREFIX))?.slice(HASH_TAG_PREFIX.length);
}

function hashTag(hex: string): string {
  return `${HASH_TAG_PREFIX}${hex}`;
}

function mergeTags(userTags: string[] | undefined, managedTags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of managedTags) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  for (const tag of userTags ?? []) {
    if (tag.startsWith("iac:")) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
}

function dashboardTemplateSpecForHash(spec: DashboardTemplate): unknown {
  // Everything the API round-trips, EXCLUDING server-only fields and managed
  // tags. `scope` is excluded — it is validated to a constant ("team"). Tiles
  // and variables are order-sensitive; array order is preserved by specHash.
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    tiles: spec.tiles ?? [],
    filters: spec.filters ?? {},
    variables: spec.variables ?? null,
    featured: spec.featured ?? false,
    tags: filterUserTags(spec.tags),
  };
}

export function dashboardTemplateHash(spec: DashboardTemplate): string {
  return specHash(dashboardTemplateSpecForHash(spec));
}

export function dashboardTemplatePayload(
  spec: DashboardTemplate,
  hash: string,
): DashboardTemplateCreate {
  const payload: DashboardTemplateCreate = {
    template_name: spec.name,
    tiles: spec.tiles ?? [],
    tags: mergeTags(spec.tags, [dashboardTemplateTag(spec.key), hashTag(hash)]),
    dashboard_filters: spec.filters ?? {},
  };
  if (spec.description !== undefined) payload.dashboard_description = spec.description;
  if (spec.variables !== undefined) payload.variables = spec.variables;
  if (spec.featured !== undefined) payload.is_featured = spec.featured;
  return payload;
}

export function looksLikeDashboardTemplate(value: unknown): value is DashboardTemplate {
  return getResourceKind(value) === "dashboard-template";
}

export function validateDashboardTemplates(specs: DashboardTemplate[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("dashboard-template.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`dashboard template "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate dashboard template key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`dashboard template "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate dashboard template name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (!Array.isArray(spec.tiles) || spec.tiles.length === 0) {
      issues.push(`dashboard template "${spec.key}" must have at least one tile`);
    }

    if (spec.scope !== undefined && spec.scope !== "team") {
      issues.push(
        `dashboard template "${spec.key}" declares scope "${spec.scope}" — only project-scoped (scope: "team") templates are managed; global / organization / feature_flag templates are read-only surface`,
      );
    }
  }
  return issues;
}

async function assertManagedDashboardTemplate(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getDashboardTemplate(config, id, options);
  if (!current.tags?.includes(dashboardTemplateTag(key))) {
    throw new SafetyViolationError("dashboard-template", id, key);
  }
}

export async function runDashboardTemplateOp(
  config: ClientConfig,
  op: ResourceOp<DashboardTemplate, ServerDashboardTemplate>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = dashboardTemplatePayload(op.spec, dashboardTemplateHash(op.spec));

  if (op.kind === "create") {
    await createDashboardTemplate(config, payload, options);
    return;
  }

  await assertManagedDashboardTemplate(config, op.server.id, op.spec.key, options);
  await updateDashboardTemplate(config, op.server.id, payload, options);
}

export async function pruneDashboardTemplate(
  config: ClientConfig,
  orphan: ServerDashboardTemplate,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = dashboardTemplateKeyFromTags(orphan.tags) ?? `id:${orphan.id}`;
  try {
    await assertManagedDashboardTemplate(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteDashboardTemplate(config, orphan.id, options);
  return true;
}

export function displayDashboardTemplate(spec: DashboardTemplate): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? "")],
    ["tiles", displayJson(spec.tiles ?? [])],
    ["filters", displayJson(spec.filters ?? {})],
    ["variables", displayJson(spec.variables ?? null)],
    ["featured", scalar(spec.featured ?? false)],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
  ]);
}

export function displayDashboardTemplateFromServer(server: ServerDashboardTemplate): DisplayValue {
  return obj([
    ["key", scalar(dashboardTemplateKeyFromTags(server.tags) ?? "")],
    ["name", scalar(server.template_name ?? "")],
    ["description", scalar(server.dashboard_description ?? "")],
    ["tiles", displayJson(server.tiles ?? [])],
    ["filters", displayJson(server.dashboard_filters ?? {})],
    ["variables", displayJson(server.variables ?? null)],
    ["featured", scalar(server.is_featured ?? false)],
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
  ]);
}
