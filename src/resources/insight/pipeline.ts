import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/http.js";
import { specHash } from "../../apply/hash.js";
import {
  arr,
  displayJson,
  filterUserTags,
  obj,
  scalar,
  type DisplayValue,
} from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/safety.js";
import type { ApplyContext, ResourceOp } from "../types.js";
import type { Insight, Query } from "./sdk.js";
import {
  createInsight,
  deleteInsight,
  getInsight,
  type ServerInsight,
  updateInsight,
} from "./client.js";

export const INSIGHT_TAG_PREFIX = "iac:insights:";
export const HASH_TAG_PREFIX = "iac:hash:";

export function insightTag(key: string): string {
  return `${INSIGHT_TAG_PREFIX}${key}`;
}

export function insightKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith(INSIGHT_TAG_PREFIX));
  return tag?.slice(INSIGHT_TAG_PREFIX.length);
}

export function insightHashFromTags(tags: string[] | undefined): string | undefined {
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

function wrapQuery(query: Query): unknown {
  if (query.kind === "TrendsQuery") {
    return { kind: "InsightVizNode", source: query };
  }
  return { kind: "DataTableNode", source: query };
}

export function insightPayload(
  spec: Insight,
  hash: string,
): { name: string; description: string | null; query: unknown; tags: string[] } {
  return {
    name: spec.name,
    description: spec.description ?? null,
    query: wrapQuery(spec.query),
    tags: mergeTags(spec.tags, [insightTag(spec.key), hashTag(hash)]),
  };
}

function insightSpecForHash(spec: Insight): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? null,
    query: spec.query,
    tags: spec.tags ?? [],
  };
}

export function insightHash(spec: Insight): string {
  return specHash(insightSpecForHash(spec));
}

export function looksLikeInsight(value: unknown): value is Insight {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.name === "string" &&
    !!v.query &&
    typeof v.query === "object" &&
    !Array.isArray((value as { tiles?: unknown }).tiles)
  );
}

export function validateInsights(specs: Insight[]): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const spec of specs) {
    if (!spec.key) issues.push("insight.key is required");
    if (!spec.name) issues.push(`insight "${spec.key}" name is required`);
    if (!spec.query) issues.push(`insight "${spec.key}" is missing query`);
    if (seen.has(spec.key)) {
      issues.push(`Duplicate insight key "${spec.key}"`);
    }
    seen.add(spec.key);
  }
  return issues;
}

async function assertManagedInsight(
  config: ClientConfig,
  id: number,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getInsight(config, id, options);
  if (!current.tags?.includes(insightTag(key))) {
    throw new SafetyViolationError("insight", id, key);
  }
}

export async function runInsightOp(
  config: ClientConfig,
  op: ResourceOp<Insight, ServerInsight>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") {
    ctx.insightIdByKey.set(op.key, op.serverId);
    return;
  }

  const payload = insightPayload(op.spec, op.hash);

  if (op.kind === "create") {
    const created = await createInsight(config, payload, options);
    ctx.insightIdByKey.set(op.key, created.id);
    return;
  }

  await assertManagedInsight(config, op.serverId, op.key, options);
  const updated = await updateInsight(config, op.serverId, payload, options);
  ctx.insightIdByKey.set(op.key, updated.id);
}

export async function pruneInsight(
  config: ClientConfig,
  orphan: ServerInsight,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = insightKeyFromTags(orphan.tags) ?? `id:${orphan.id}`;
  try {
    await assertManagedInsight(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteInsight(config, orphan.id, options);
  return true;
}

function unwrapServerQuery(query: unknown): unknown {
  if (!query || typeof query !== "object") return query;
  const obj = query as Record<string, unknown>;
  if (obj.kind === "InsightVizNode" || obj.kind === "DataTableNode") return obj.source;
  return query;
}

export function displayInsight(spec: Insight): DisplayValue {
  return obj([
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["query", displayJson(spec.query)],
    ["tags", arr(filterUserTags(spec.tags).map(scalar))],
  ]);
}

export function displayInsightFromServer(server: ServerInsight): DisplayValue {
  return obj([
    ["name", scalar(server.name)],
    ["description", scalar(server.description ?? null)],
    ["query", displayJson(unwrapServerQuery(server.query))],
    ["tags", arr(filterUserTags(server.tags).map(scalar))],
  ]);
}
