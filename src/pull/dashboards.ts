import { promises as fs } from "node:fs";
import path from "node:path";
import type { ClientConfig } from "../client/config.js";
import { getDashboard, listDashboards } from "../client/dashboards.js";
import { getInsight } from "../client/insights.js";
import { generateDashboardFile, type GeneratedFile } from "./codegen.js";

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
};

export async function pullDashboards(
  config: ClientConfig,
  options: PullDashboardsOptions,
): Promise<PullDashboardsResult> {
  const all = await listDashboards(config, { verbose: options.verbose });
  const targets = options.ids ? all.filter((d) => options.ids!.has(d.id)) : all;

  const dashboardsDir = path.join(path.resolve(options.outDir), "dashboards");

  const takenFilenames = new Set<string>();
  const written: string[] = [];
  const skipped: string[] = [];
  const allWarnings: string[] = [];

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
  }

  return { written, skipped, warnings: allWarnings };
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
