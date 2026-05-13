import type { ServerDashboard } from "../resources/dashboard/client.js";

const EXCLUDED_NAME_PREFIXES = [
  "Generated Dashboard:",
  "Feature Flag Usage:",
  "Feature Flag Targeting:",
];

export type FilterReason = "deleted" | "feature-flag" | "template";

export function dashboardExclusionReason(d: ServerDashboard): FilterReason | undefined {
  if (d.deleted) return "deleted";
  if (EXCLUDED_NAME_PREFIXES.some((p) => d.name.startsWith(p))) return "feature-flag";
  if (d.creation_mode === "template" && /feature[ -]?flag/i.test(d.name + (d.description ?? ""))) {
    return "template";
  }
  return undefined;
}

export function partitionDashboards(all: ServerDashboard[]): {
  kept: ServerDashboard[];
  excluded: Array<{ dashboard: ServerDashboard; reason: FilterReason }>;
} {
  const kept: ServerDashboard[] = [];
  const excluded: Array<{ dashboard: ServerDashboard; reason: FilterReason }> = [];
  for (const d of all) {
    const reason = dashboardExclusionReason(d);
    if (reason) excluded.push({ dashboard: d, reason });
    else kept.push(d);
  }
  return { kept, excluded };
}
