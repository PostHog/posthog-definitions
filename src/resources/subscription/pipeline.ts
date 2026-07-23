import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import type { Insight } from "../insight/sdk.js";
import type { Dashboard } from "../dashboard/sdk.js";
import type { Subscription } from "./sdk.js";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  type ServerSubscription,
  type SubscriptionCreate,
  updateSubscription,
} from "./client.js";

export const SUBSCRIPTION_IDENTITY_PREFIX = "iac:subscriptions:";

const MARKER_REGEX = /\n*<!--\s*iac:subscriptions:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userTitle: string; key: string; hash: string };

function parseMarker(title: string | null | undefined): ParsedMarker | undefined {
  if (!title) return undefined;
  const match = title.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userTitle: title.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userTitle: string, key: string, hash: string): string {
  const trailer = `<!-- iac:subscriptions:${key} iac:hash:${hash} -->`;
  const trimmed = userTitle.replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(title: string | null | undefined): string | null {
  if (!title) return null;
  const parsed = parseMarker(title);
  return parsed ? parsed.userTitle || null : title;
}

export function subscriptionKeyFromServer(server: ServerSubscription): string | undefined {
  return parseMarker(server.title)?.key;
}

export function subscriptionHashFromServer(server: ServerSubscription): string | undefined {
  return parseMarker(server.title)?.hash;
}

function specForHash(spec: Subscription): unknown {
  return {
    key: spec.key,
    title: spec.title,
    insight_key: spec.insight?.key ?? null,
    dashboard_key: spec.dashboard?.key ?? null,
    target_type: spec.targetType,
    target_value: spec.target,
    frequency: spec.frequency,
    interval: spec.interval ?? 1,
    start_date: spec.startDate,
    byweekday: spec.byweekday ?? null,
    bysetpos: spec.bysetpos ?? null,
    count: spec.count ?? null,
    until_date: spec.untilDate ?? null,
    enabled: spec.enabled ?? true,
    integration_id: spec.integrationId ?? null,
    summary_enabled: spec.summaryEnabled ?? null,
    summary_prompt_guide: spec.summaryPromptGuide ?? null,
    prompt: spec.prompt ?? null,
  };
}

export function subscriptionHash(spec: Subscription): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: Subscription, hash: string, ctx: ApplyContext): SubscriptionCreate {
  const payload: SubscriptionCreate = {
    title: withMarker(spec.title, spec.key, hash),
    target_type: spec.targetType,
    target_value: spec.target,
    frequency: spec.frequency,
    start_date: spec.startDate,
    interval: spec.interval ?? 1,
    enabled: spec.enabled ?? true,
    // Never deliver as a side effect of apply (defaults to true otherwise).
    send_test_now: false,
  };
  if (spec.insight) {
    const id = ctx.insightIdByKey.get(spec.insight.key);
    if (id === undefined) {
      throw new Error(
        `subscription "${spec.key}" references insight "${spec.insight.key}" but no server id is known. Insights must run before subscriptions.`,
      );
    }
    payload.insight = id;
  }
  if (spec.dashboard) {
    const id = ctx.dashboardIdByKey.get(spec.dashboard.key);
    if (id === undefined) {
      throw new Error(
        `subscription "${spec.key}" references dashboard "${spec.dashboard.key}" but no server id is known. Dashboards must run before subscriptions.`,
      );
    }
    payload.dashboard = id;
  }
  if (spec.byweekday !== undefined) payload.byweekday = spec.byweekday;
  if (spec.bysetpos !== undefined) payload.bysetpos = spec.bysetpos;
  if (spec.count !== undefined) payload.count = spec.count;
  if (spec.untilDate !== undefined) payload.until_date = spec.untilDate;
  if (spec.integrationId !== undefined) payload.integration_id = spec.integrationId;
  if (spec.summaryEnabled !== undefined) payload.summary_enabled = spec.summaryEnabled;
  if (spec.summaryPromptGuide !== undefined) payload.summary_prompt_guide = spec.summaryPromptGuide;
  if (spec.prompt !== undefined) payload.prompt = spec.prompt;
  return payload;
}

export function looksLikeSubscription(value: unknown): value is Subscription {
  return getResourceKind(value) === "subscription";
}

export function validateSubscriptions(specs: Subscription[], state: DesiredState): string[] {
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
      issues.push("subscription.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`subscription "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate subscription key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.title || spec.title.trim() === "") {
      issues.push(`subscription "${spec.key}" title is required (it carries the identity marker)`);
    } else {
      // The server caps `title` at 100 chars, and the title also carries the
      // identity+hash marker. Fail here with an actionable message rather than
      // let apply hit a 400. Effective budget: title + key length <= ~45.
      const withMarkerLen = withMarker(spec.title, spec.key, subscriptionHash(spec)).length;
      if (withMarkerLen > 100) {
        issues.push(
          `subscription "${spec.key}" title is too long: title + identity marker is ${withMarkerLen} chars but the server caps \`title\` at 100. Shorten the title (or key) — the budget is roughly 45 minus the key length.`,
        );
      }
    }
    if (!spec.target || spec.target.trim() === "") {
      issues.push(`subscription "${spec.key}" target is required`);
    }
    if (!spec.startDate) issues.push(`subscription "${spec.key}" startDate is required`);

    const hasInsight = Boolean(spec.insight);
    const hasDashboard = Boolean(spec.dashboard);
    if (hasInsight === hasDashboard) {
      issues.push(
        `subscription "${spec.key}" must reference exactly one of \`insight\` or \`dashboard\``,
      );
    }
    if (hasInsight && !knownInsightKeys.has(spec.insight!.key)) {
      issues.push(
        `subscription "${spec.key}" references unknown insight "${spec.insight!.key}" — declare it in the same run`,
      );
    }
    if (hasDashboard && !knownDashboardKeys.has(spec.dashboard!.key)) {
      issues.push(
        `subscription "${spec.key}" references unknown dashboard "${spec.dashboard!.key}" — declare it in the same run`,
      );
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
  const current = await getSubscription(config, id, options);
  if (subscriptionKeyFromServer(current) !== key) {
    throw new SafetyViolationError("subscription", id, key);
  }
}

export async function runSubscriptionOp(
  config: ClientConfig,
  op: ResourceOp<Subscription, ServerSubscription>,
  ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = buildPayload(op.spec, subscriptionHash(op.spec), ctx);

  if (op.kind === "create") {
    await createSubscription(config, payload, options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateSubscription(config, op.server.id, payload, options);
}

export async function pruneSubscription(
  config: ClientConfig,
  orphan: ServerSubscription,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = subscriptionKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteSubscription(config, orphan.id, options);
  return true;
}

export function displaySubscription(spec: Subscription): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["title", scalar(spec.title)],
    ["insight", scalar(spec.insight?.key ?? null)],
    ["dashboard", scalar(spec.dashboard?.key ?? null)],
    ["target_type", scalar(spec.targetType)],
    ["target", scalar(spec.target)],
    ["frequency", scalar(spec.frequency)],
    ["interval", scalar(spec.interval ?? 1)],
    ["start_date", scalar(spec.startDate)],
    ["enabled", scalar(spec.enabled ?? true)],
    ["integration_id", scalar(spec.integrationId ?? null)],
    ["summary_enabled", scalar(spec.summaryEnabled ?? null)],
  ]);
}

export function displaySubscriptionFromServer(
  server: ServerSubscription,
  ctx: ApplyContext,
): DisplayValue {
  const insightKey =
    server.insight != null
      ? (ctx.insightKeyByServerId.get(server.insight) ?? `id:${server.insight}`)
      : null;
  const dashboardKey =
    server.dashboard != null
      ? (ctx.dashboardKeyByServerId.get(server.dashboard) ?? `id:${server.dashboard}`)
      : null;
  return obj([
    ["key", scalar(subscriptionKeyFromServer(server) ?? null)],
    ["title", scalar(stripMarker(server.title))],
    ["insight", scalar(insightKey)],
    ["dashboard", scalar(dashboardKey)],
    ["target_type", scalar(server.target_type ?? null)],
    ["target", scalar(server.target_value ?? null)],
    ["frequency", scalar(server.frequency ?? null)],
    ["interval", scalar(server.interval ?? 1)],
    ["start_date", scalar(server.start_date ?? null)],
    ["enabled", scalar(server.enabled ?? true)],
    ["integration_id", scalar(server.integration_id ?? null)],
    ["summary_enabled", scalar(server.summary_enabled ?? null)],
  ]);
}
