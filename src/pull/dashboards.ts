import { promises as fs } from "node:fs";
import path from "node:path";
import { loadDefinitions } from "../apply/load.js";
import { isManagedTag } from "../apply/display.js";
import type { ClientConfig } from "../client/config.js";
import type { Dashboard } from "../resources/dashboard/sdk.js";
import { getDashboard, listDashboards, updateDashboard } from "../resources/dashboard/client.js";
import { dashboardHash, dashboardTag } from "../resources/dashboard/pipeline.js";
import type { Insight } from "../resources/insight/sdk.js";
import { getInsight, updateInsight } from "../resources/insight/client.js";
import { insightHash, insightTag } from "../resources/insight/pipeline.js";
import {
  generateDashboardFile,
  generateInsightFile,
  insightVarNameFromKey,
  type GeneratedFile,
  type GeneratedInsightFile,
  type InsightImportEntry,
} from "./codegen.js";
import { partitionDashboards, type FilterReason } from "./filter.js";

const HASH_TAG_PREFIX = "iac:hash:";

function hashTag(hex: string): string {
  return `${HASH_TAG_PREFIX}${hex}`;
}

export type PullDashboardsOptions = {
  outDir: string;
  verbose?: boolean;
  dryRun?: boolean;
  ids?: ReadonlySet<number>;
};

export type PullDashboardsResult = {
  written: string[];
  skipped: string[];
  warnings: string[];
  excluded: Array<{ id: number; name: string; reason: FilterReason }>;
  tagged: { dashboards: number; insights: number };
};

export async function pullDashboards(
  config: ClientConfig,
  options: PullDashboardsOptions,
): Promise<PullDashboardsResult> {
  const all = await listDashboards(config, { verbose: options.verbose });
  const { kept, excluded } = partitionDashboards(all);
  const targets = options.ids ? kept.filter((d) => options.ids!.has(d.id)) : kept;

  const dashboardsDir = path.join(path.resolve(options.outDir), "dashboards");
  const insightsDir = path.join(path.resolve(options.outDir), "insights");

  const takenDashboardFilenames = new Set<string>();
  const takenInsightSlugs = new Set<string>();
  const written: string[] = [];
  const skipped: string[] = [];
  const allWarnings: string[] = [];
  let dashboardsTagged = 0;
  let insightsTagged = 0;
  const taggedInsightIds = new Set<number>();

  type DashboardDetail = Awaited<ReturnType<typeof getDashboard>>;
  const details: DashboardDetail[] = [];
  for (const summary of targets) {
    const detail = await getDashboard(config, summary.id, { verbose: options.verbose });
    await ensureTileInsightsHaveQueries(config, detail, options.verbose);
    details.push(detail);
  }

  // First pass: extract every distinct insight (by server id) into its own
  // file under posthog/insights/. Dashboards then import shared insights so
  // two dashboards can reference the same JS object without tripping the
  // loader's inline-collision check.
  const insightImportsByServerId = new Map<number, InsightImportEntry>();
  const insightFiles: GeneratedInsightFile[] = [];
  for (const detail of details) {
    for (const tile of detail.tiles ?? []) {
      const srv = tile.insight;
      if (!srv) continue;
      if (insightImportsByServerId.has(srv.id)) continue;
      const result = generateInsightFile(srv, takenInsightSlugs);
      if ("skipped" in result) {
        allWarnings.push(result.warning);
        continue;
      }
      insightFiles.push(result);
      insightImportsByServerId.set(srv.id, {
        key: result.insightKey,
        varName: insightVarNameFromKey(result.insightKey),
        filename: result.filename,
      });
    }
  }

  for (const file of insightFiles) {
    for (const w of file.warnings) allWarnings.push(`${file.filename}: ${w}`);
    const target = path.join(insightsDir, file.filename);
    if (options.dryRun) {
      skipped.push(target);
      continue;
    }
    await fs.mkdir(insightsDir, { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
    written.push(target);
  }

  const dashboardTagPlan = new Map<
    string,
    { serverId: number; existingTags: string[] | undefined }
  >();
  const insightTagPlan = new Map<
    string,
    { serverId: number; existingTags: string[] | undefined }
  >();
  for (const [serverId, entry] of insightImportsByServerId) {
    const tile = details
      .flatMap((d) => d.tiles ?? [])
      .find((t) => t.insight?.id === serverId);
    const existingTags = (tile?.insight as { tags?: string[] } | null | undefined)?.tags;
    insightTagPlan.set(entry.key, { serverId, existingTags });
  }

  for (const detail of details) {
    const result = generateDashboardFile(
      detail,
      takenDashboardFilenames,
      insightImportsByServerId,
    );
    if ("skipped" in result) {
      allWarnings.push(result.warning);
      continue;
    }
    const file: GeneratedFile = result;
    for (const w of file.warnings) allWarnings.push(`${file.filename}: ${w}`);

    const target = path.join(dashboardsDir, file.filename);
    if (options.dryRun) {
      skipped.push(target);
      continue;
    }
    await fs.mkdir(dashboardsDir, { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
    written.push(target);

    dashboardTagPlan.set(file.dashboardKey, { serverId: detail.id, existingTags: detail.tags });
  }

  if (!options.dryRun && (dashboardTagPlan.size > 0 || insightTagPlan.size > 0)) {
    // Reload just-written files so the iac:hash:<hex> tag we write matches
    // what `apply` will compute later — without this, every pulled resource
    // gets classified as an update on the next apply (hashFromServer ===
    // undefined ≠ localHash).
    const loaded = await loadDefinitions(options.outDir);
    const dashboardHashByKey = new Map<string, string>();
    const insightHashByKey = new Map<string, string>();
    if (loaded.ok) {
      for (const { spec } of loaded.value.get("dashboards") ?? []) {
        const d = spec as Dashboard;
        dashboardHashByKey.set(d.key, dashboardHash(d));
      }
      for (const { spec } of loaded.value.get("insights") ?? []) {
        const i = spec as Insight;
        insightHashByKey.set(i.key, insightHash(i));
      }
    } else {
      allWarnings.push(
        `Could not reload pulled files to compute hashes — next apply will report spurious updates.`,
      );
    }

    for (const [key, plan] of dashboardTagPlan) {
      const hash = dashboardHashByKey.get(key);
      const managed = hash ? [dashboardTag(key), hashTag(hash)] : [dashboardTag(key)];
      await updateDashboard(
        config,
        plan.serverId,
        { tags: withManagedTags(plan.existingTags, managed) },
        { verbose: options.verbose },
      );
      dashboardsTagged++;
    }

    for (const [key, plan] of insightTagPlan) {
      if (taggedInsightIds.has(plan.serverId)) continue;
      const hash = insightHashByKey.get(key);
      const managed = hash ? [insightTag(key), hashTag(hash)] : [insightTag(key)];
      await updateInsight(
        config,
        plan.serverId,
        { tags: withManagedTags(plan.existingTags, managed) },
        { verbose: options.verbose },
      );
      taggedInsightIds.add(plan.serverId);
      insightsTagged++;
    }
  }

  return {
    written,
    skipped,
    warnings: allWarnings,
    excluded: excluded.map(({ dashboard, reason }) => ({
      id: dashboard.id,
      name: dashboard.name,
      reason,
    })),
    tagged: { dashboards: dashboardsTagged, insights: insightsTagged },
  };
}

function withManagedTags(existing: string[] | undefined, managedTags: string[]): string[] {
  const userTags = (existing ?? []).filter((t) => !isManagedTag(t));
  return [...managedTags, ...userTags];
}

async function ensureTileInsightsHaveQueries(
  config: ClientConfig,
  dashboard: { tiles?: Array<{ insight?: { id: number; query?: unknown } | null }> },
  verbose: boolean | undefined,
): Promise<void> {
  for (const tile of dashboard.tiles ?? []) {
    if (!tile.insight) continue;
    if (tile.insight.query !== undefined && tile.insight.query !== null) continue;
    const full = await getInsight(config, tile.insight.id, { verbose });
    Object.assign(tile.insight, full);
  }
}
