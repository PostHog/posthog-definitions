import type { ClientConfig } from "../client/config.js";
import {
  createDashboard,
  getDashboard,
  type ServerDashboard,
  updateDashboard,
} from "../client/dashboards.js";
import {
  createInsight,
  getInsight,
  type ServerInsight,
  updateInsight,
} from "../client/insights.js";
import type { DashboardOp, DiffResult, InsightOp } from "./diff.js";
import {
  dashboardPayload,
  dashboardTag,
  insightPayload,
  insightTag,
} from "./serialize.js";

export class SafetyViolationError extends Error {
  constructor(kind: "dashboard" | "insight", id: number, key: string) {
    super(
      `Refusing to write to ${kind} ${id} (key="${key}"): its tags no longer include the managed iac:* identity tag. This usually means the tag was removed in the UI between fetch and write. Aborting.`,
    );
    this.name = "SafetyViolationError";
  }
}

export type ExecuteOptions = {
  verbose?: boolean;
};

export type ExecuteSummary = {
  insightsCreated: number;
  insightsUpdated: number;
  insightsUnchanged: number;
  dashboardsCreated: number;
  dashboardsUpdated: number;
  dashboardsUnchanged: number;
};

export async function execute(
  config: ClientConfig,
  diffResult: DiffResult,
  options: ExecuteOptions = {},
): Promise<ExecuteSummary> {
  const summary: ExecuteSummary = {
    insightsCreated: 0,
    insightsUpdated: 0,
    insightsUnchanged: 0,
    dashboardsCreated: 0,
    dashboardsUpdated: 0,
    dashboardsUnchanged: 0,
  };

  const insightIdByKey = new Map<string, number>();

  for (const op of diffResult.insightOps) {
    const id = await runInsightOp(config, op, options);
    insightIdByKey.set(op.key, id);
    if (op.kind === "create") summary.insightsCreated++;
    else if (op.kind === "update") summary.insightsUpdated++;
    else summary.insightsUnchanged++;
  }

  for (const op of diffResult.dashboardOps) {
    await runDashboardOp(config, op, insightIdByKey, options);
    if (op.kind === "create") summary.dashboardsCreated++;
    else if (op.kind === "update") summary.dashboardsUpdated++;
    else summary.dashboardsUnchanged++;
  }

  return summary;
}

async function runInsightOp(
  config: ClientConfig,
  op: InsightOp,
  options: ExecuteOptions,
): Promise<number> {
  if (op.kind === "unchanged") return op.serverId;

  const payload = insightPayload(op.spec, op.hash);

  if (op.kind === "create") {
    const created = await createInsight(config, payload, options);
    return created.id;
  }

  await assertManagedInsight(config, op.serverId, op.key, options);
  const updated = await updateInsight(config, op.serverId, payload, options);
  return updated.id;
}

async function runDashboardOp(
  config: ClientConfig,
  op: DashboardOp,
  insightIdByKey: Map<string, number>,
  options: ExecuteOptions,
): Promise<void> {
  if (op.kind === "unchanged") return;

  const payload = dashboardPayload(op.spec, op.hash, insightIdByKey);

  if (op.kind === "create") {
    await createDashboard(config, payload, options);
    return;
  }

  await assertManagedDashboard(config, op.serverId, op.key, options);
  await updateDashboard(config, op.serverId, payload, options);
}

async function assertManagedInsight(
  config: ClientConfig,
  id: number,
  key: string,
  options: ExecuteOptions,
): Promise<void> {
  const current: ServerInsight = await getInsight(config, id, options);
  const expected = insightTag(key);
  if (!current.tags?.includes(expected)) {
    throw new SafetyViolationError("insight", id, key);
  }
}

async function assertManagedDashboard(
  config: ClientConfig,
  id: number,
  key: string,
  options: ExecuteOptions,
): Promise<void> {
  const current: ServerDashboard = await getDashboard(config, id, options);
  const expected = dashboardTag(key);
  if (!current.tags?.includes(expected)) {
    throw new SafetyViolationError("dashboard", id, key);
  }
}
