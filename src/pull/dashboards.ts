import { promises as fs } from "node:fs";
import path from "node:path";
import { isManagedTag } from "../apply/display.js";
import type { ClientConfig } from "../client/config.js";
import {
  getDashboard,
  listDashboards,
  updateDashboard,
} from "../resources/dashboard/client.js";
import { dashboardTag } from "../resources/dashboard/pipeline.js";
import { getInsight, updateInsight } from "../resources/insight/client.js";
import { insightTag } from "../resources/insight/pipeline.js";
import { generateDashboardFile, type GeneratedFile } from "./codegen.js";
import { partitionDashboards, type FilterReason } from "./filter.js";

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

  const takenFilenames = new Set<string>();
  const written: string[] = [];
  const skipped: string[] = [];
  const allWarnings: string[] = [];
  let dashboardsTagged = 0;
  let insightsTagged = 0;
  const taggedInsightIds = new Set<number>();

  for (const summary of targets) {
    const detail = await getDashboard(config, summary.id, { verbose: options.verbose });
    await ensureTileInsightsHaveQueries(config, detail, options.verbose);

    const file: GeneratedFile = generateDashboardFile(detail, takenFilenames);
    for (const w of file.warnings) {
      allWarnings.push(`${file.filename}: ${w}`);
    }

    const target = path.join(dashboardsDir, file.filename);
    if (options.dryRun) {
      skipped.push(target);
      continue;
    }

    await fs.mkdir(dashboardsDir, { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
    written.push(target);

    const newDashboardTags = withManagedTag(detail.tags, dashboardTag(file.dashboardKey));
    await updateDashboard(
      config,
      detail.id,
      { tags: newDashboardTags },
      { verbose: options.verbose },
    );
    dashboardsTagged++;

    for (const [serverId, key] of file.insightKeysByServerId) {
      if (taggedInsightIds.has(serverId)) continue;
      const tile = detail.tiles?.find((t) => t.insight?.id === serverId);
      const existingTags = (tile?.insight as { tags?: string[] } | null | undefined)?.tags;
      const newInsightTags = withManagedTag(existingTags, insightTag(key));
      await updateInsight(
        config,
        serverId,
        { tags: newInsightTags },
        { verbose: options.verbose },
      );
      taggedInsightIds.add(serverId);
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

function withManagedTag(existing: string[] | undefined, managedTag: string): string[] {
  const userTags = (existing ?? []).filter((t) => !isManagedTag(t));
  return [managedTag, ...userTags];
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
