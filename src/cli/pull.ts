import path from "node:path";
import { listDashboards } from "../resources/dashboard/client.js";
import { ConfigError, loadConfig } from "../client/config.js";
import { ApiError } from "../client/typed.js";
import { pullDashboards } from "../pull/dashboards.js";
import { partitionDashboards } from "../pull/filter.js";
import { PickAbortedError, pickDashboardIds } from "../pull/picker.js";
import type { PullArgs } from "./args.js";

export async function runPull(args: PullArgs): Promise<number> {
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;

  let config;
  try {
    config = await loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(`error: ${err.message}`);
      return 3;
    }
    throw err;
  }

  for (const kind of args.kinds) {
    if (kind === "dashboards") {
      try {
        const list = await listDashboards(config, { verbose: args.verbose });
        const { kept, excluded } = partitionDashboards(list);
        if (excluded.length > 0) {
          console.error(
            `Ignoring ${excluded.length} auto-generated dashboard(s) (feature flags, deleted, templates).`,
          );
        }
        if (kept.length === 0) {
          console.log("No importable dashboards found in this project.");
          continue;
        }

        let ids: Set<number> | undefined;
        if (!args.all) {
          if (!process.stdin.isTTY) {
            console.error(
              "error: pull is interactive by default. Pass --all to import every dashboard, or run from a terminal.",
            );
            return 3;
          }
          try {
            ids = await pickDashboardIds(kept);
          } catch (err) {
            if (err instanceof PickAbortedError) {
              console.error("Aborted.");
              return 0;
            }
            throw err;
          }
          if (ids.size === 0) {
            console.log("No dashboards selected. Nothing to do.");
            continue;
          }
        }

        const pullOpts: Parameters<typeof pullDashboards>[1] = {
          outDir: args.dir,
          verbose: args.verbose,
          dryRun: args.dryRun,
        };
        if (ids) pullOpts.ids = ids;
        const result = await pullDashboards(config, pullOpts);
        reportDashboards(result, args.dir, args.dryRun);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error(`error: PostHog API while pulling dashboards: ${err.message}`);
          return 2;
        }
        throw err;
      }
    }
  }

  return 0;
}

function reportDashboards(
  result: {
    written: string[];
    skipped: string[];
    warnings: string[];
    excluded: Array<{ id: number; name: string; reason: string }>;
    tagged: { dashboards: number; insights: number };
  },
  dir: string,
  dryRun: boolean,
): void {
  const target = path.join(path.resolve(dir), "dashboards");
  if (dryRun) {
    console.log(
      `Dry run — ${result.skipped.length} dashboard file(s) would be written to ${target}/`,
    );
    for (const f of result.skipped) console.log(`  would write ${path.relative(process.cwd(), f)}`);
    console.log("Server tags would not change (dry run).");
  } else {
    console.log(`Wrote ${result.written.length} dashboard file(s) to ${target}/`);
    for (const f of result.written) console.log(`  ${path.relative(process.cwd(), f)}`);
    console.log(
      `Tagged ${result.tagged.dashboards} dashboard(s) and ${result.tagged.insights} insight(s) on the server as iac-managed.`,
    );
  }
  if (result.warnings.length > 0) {
    console.error(`\n${result.warnings.length} warning(s):`);
    for (const w of result.warnings) console.error(`  ${w}`);
  }
}
