import { promises as fs } from "node:fs";
import path from "node:path";
import type { ClientConfig } from "../client/config.js";
import { ApiError } from "../client/typed.js";
import { loadDefinitions } from "../apply/load.js";
import { RESOURCES } from "../resources/index.js";
import { topoOrder } from "../resources/order.js";
import type {
  CollectionResourceModule,
  DesiredState,
  ResourceModule,
} from "../resources/types.js";
import { identifierFromSlug } from "./render.js";
import { uniqueSlug } from "./slug.js";
import type { ImportEntry, PullRenderContext, RenderedFile } from "./types.js";

export type PullRunOptions = {
  outDir: string;
  /** Which resources the user asked for. `--all` populates this with every pull-capable resource. */
  resources: ReadonlyArray<ResourceModule<unknown, unknown>>;
  /** Pre-selected server ids per resource (empty / undefined = pick interactively or use --all-rows). */
  selectionByResource?: Map<string, Set<number | string>>;
  /** Skip the cross-resource dependency cascade. */
  noCascade?: boolean;
  /** Don't write or tag — just compute the plan. */
  dryRun?: boolean;
  verbose?: boolean;
};

export type ResourceReport = {
  name: string;
  written: string[];
  skippedReasons: Array<{ id: number | string; reason: string }>;
  filteredOut: Array<{ id: number | string; reason: string }>;
  tagged: number;
  warnings: string[];
};

export type PullRunResult = {
  byResource: Map<string, ResourceReport>;
  /** Files that would have been written but were skipped due to --dry-run. */
  dryRunSkipped: string[];
};

type CollectionEntry = {
  resource: CollectionResourceModule<unknown, unknown>;
  /** server rows we plan to codegen, in stable order. */
  selected: unknown[];
  /** Map from server id (as string for stable map keys) → row. */
  byId: Map<string, unknown>;
};

/**
 * Resource-agnostic pull orchestrator. Walks each target resource:
 *
 *  1. listAll → pullFilter → user selection.
 *  2. Cross-resource dependency cascade (unless --no-cascade).
 *  3. Codegen in topo order (deps before dependents).
 *  4. Reload generated files via loadDefinitions to compute hashes.
 *  5. tagOnServer for each row, stamping `iac:<plural>:<key>` + `iac:hash:<hex>`
 *     so the next apply sees the row as unchanged.
 *
 * Singletons follow a simplified path: no picker, no tag-back, single file.
 */
export async function runPull(
  config: ClientConfig,
  options: PullRunOptions,
): Promise<PullRunResult> {
  const outDir = path.resolve(options.outDir);
  const reportByResource = new Map<string, ResourceReport>();
  const ensureReport = (name: string): ResourceReport => {
    let rep = reportByResource.get(name);
    if (!rep) {
      rep = { name, written: [], skippedReasons: [], filteredOut: [], tagged: 0, warnings: [] };
      reportByResource.set(name, rep);
    }
    return rep;
  };
  const dryRunSkipped: string[] = [];

  // --- 1. Build per-resource selection + cascade dependencies ---------------

  const collectionEntries = new Map<string, CollectionEntry>();
  const singletonTargets: Array<{
    resource: import("../resources/types.js").SingletonResourceModule<unknown, unknown>;
    server: unknown;
  }> = [];

  for (const resource of options.resources) {
    if (resource.kind === "singleton") {
      if (!resource.renderToFile) continue; // no pull support
      const server = await resource.fetchOne(config, { verbose: options.verbose });
      singletonTargets.push({ resource, server });
      ensureReport(resource.name);
      continue;
    }
    if (!resource.renderToFile || !resource.listAll) continue;

    const rows = await resource.listAll(config, { verbose: options.verbose });
    const report = ensureReport(resource.name);
    const byId = new Map<string, unknown>();
    const filtered: unknown[] = [];
    const idOf = resource.serverIdOf ?? ((row: unknown) => (row as { id: number | string }).id);
    for (const row of rows) {
      byId.set(String(idOf(row)), row);
      const verdict = resource.pullFilter
        ? resource.pullFilter(row)
        : ({ kept: true } as const);
      if (verdict.kept) {
        filtered.push(row);
      } else {
        report.filteredOut.push({ id: idOf(row), reason: verdict.reason });
      }
    }

    const selectionSet = options.selectionByResource?.get(resource.name);
    const selected = selectionSet
      ? filtered.filter((row) => selectionSet.has(idOf(row)))
      : filtered;

    collectionEntries.set(resource.name, {
      resource,
      selected: selected.slice(),
      byId,
    });
  }

  // Hydrate selected rows whose listAll shape is trimmed (e.g. DashboardBasic
  // omits tiles). Done before cascade so pullDependencies sees full rows.
  await hydrateSelectedRows(config, collectionEntries, options.verbose);

  // Cascade: walk pullDependencies BFS-style, fetching missing rows via
  // resource.getById and adding them to the dependency's selection.
  if (!options.noCascade) {
    await cascadeDependencies(config, collectionEntries, options.verbose);
  }

  // --- 2. Codegen in topo order --------------------------------------------

  // ctx holds per-resource state shared across all rendered rows: filename
  // collisions, cross-resource import lookups, accumulated warnings.
  const importsByResource = new Map<string, Map<string, ImportEntry>>();
  const takenSlugsByResource = new Map<string, Set<string>>();

  const filesToWrite: Array<{
    resource: ResourceModule<unknown, unknown>;
    file: RenderedFile;
    server: unknown;
  }> = [];

  // Codegen in dependency order over the *targeted* resources, not the whole
  // global registry. Reusing topoOrder over the targets — it tolerates missing
  // edges (a target whose dependency isn't a target still works; the
  // optional-import path covers that case).
  const orderedTargets = topoOrder(options.resources.slice());

  for (const resource of orderedTargets) {
    if (resource.kind === "singleton") {
      const target = singletonTargets.find((t) => t.resource.name === resource.name);
      if (!target) continue;
      const report = ensureReport(resource.name);
      const ctx = makeRenderContext(resource.name, takenSlugsByResource, importsByResource, report);
      const result = target.resource.renderToFile!(target.server, ctx);
      if ("skipped" in result) {
        report.skippedReasons.push({ id: "(singleton)", reason: result.reason });
        continue;
      }
      filesToWrite.push({ resource, file: result, server: target.server });
      continue;
    }

    const entry = collectionEntries.get(resource.name);
    if (!entry) continue;
    const report = ensureReport(resource.name);
    const idOf = entry.resource.serverIdOf ?? ((row: unknown) => (row as { id: number | string }).id);

    for (const server of entry.selected) {
      const ctx = makeRenderContext(resource.name, takenSlugsByResource, importsByResource, report);
      const result = entry.resource.renderToFile!(server, ctx);
      if ("skipped" in result) {
        report.skippedReasons.push({ id: idOf(server), reason: result.reason });
        continue;
      }
      registerImport(importsByResource, resource.name, idOf(server), {
        key: result.specKey,
        varName: identifierFromSlug(result.specKey),
        filename: result.filename,
        resourceName: resource.name,
      });
      filesToWrite.push({ resource, file: result, server });
    }
  }

  // --- 3. Write or dry-run --------------------------------------------------

  for (const { resource, file } of filesToWrite) {
    const target = path.join(outDir, resource.name, file.filename);
    if (options.dryRun) {
      dryRunSkipped.push(target);
      continue;
    }
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
    ensureReport(resource.name).written.push(target);
  }

  // --- 4. Reload-and-hash, then tag back ------------------------------------

  if (!options.dryRun && filesToWrite.length > 0) {
    const loaded = await loadDefinitions(outDir);
    if (!loaded.ok) {
      const report = ensureReport("(load)");
      report.warnings.push("Could not reload pulled files; tag-back skipped, next apply will report spurious updates.");
    } else {
      await tagPulledRows(config, filesToWrite, loaded.value, ensureReport, options.verbose);
    }
  }

  return { byResource: reportByResource, dryRunSkipped };
}

// ---------------------------------------------------------------------------
// Hydration
// ---------------------------------------------------------------------------

async function hydrateSelectedRows(
  config: ClientConfig,
  entries: Map<string, CollectionEntry>,
  verbose: boolean | undefined,
): Promise<void> {
  for (const entry of entries.values()) {
    const hydrate = entry.resource.hydrateForPull;
    if (!hydrate) continue;
    const idOf =
      entry.resource.serverIdOf ??
      ((r: unknown) => (r as { id: number | string }).id);
    const hydrated = await Promise.all(
      entry.selected.map((row) => hydrate(config, row, { verbose })),
    );
    entry.selected = hydrated;
    for (const row of hydrated) entry.byId.set(String(idOf(row)), row);
  }
}

// ---------------------------------------------------------------------------
// Cascade
// ---------------------------------------------------------------------------

/**
 * Wave-parallel BFS. Each wave:
 *   1. Calls every frontier row's `pullDependencies` in parallel — important
 *      for hooks that round-trip the API (e.g. event-definition listing
 *      EventSchemas). pullDependencies implementations are encouraged to
 *      cache their own round-trips so the parallel calls collapse to one.
 *   2. Collects every (resource, id) pair the wave produced, deduped.
 *   3. Splits them into "already in byId" (fast) and "must fetch" (slow).
 *   4. Issues all `getById` calls in parallel.
 *   5. Selects + enqueues each fresh row for the next wave.
 *
 * The sequential version was O(N) round-trips for a dashboard pulling N
 * tile-insights; this version is O(depth) parallel round-trips, where
 * depth ≤ 2 for the resource graph we have today.
 */
async function cascadeDependencies(
  config: ClientConfig,
  entries: Map<string, CollectionEntry>,
  verbose: boolean | undefined,
): Promise<void> {
  type Frontier = {
    resource: CollectionResourceModule<unknown, unknown>;
    row: unknown;
  };

  let frontier: Frontier[] = [];
  for (const entry of entries.values()) {
    for (const row of entry.selected) frontier.push({ resource: entry.resource, row });
  }

  let wave = 0;
  while (frontier.length > 0) {
    wave++;
    if (verbose) console.error(`[cascade] wave ${wave}: frontier=${frontier.length}`);
    // 1. Discover dependencies for every row in this wave in parallel.
    const allDeps = await Promise.all(
      frontier.map(async ({ resource, row }) => {
        if (!resource.pullDependencies) return [];
        return resource.pullDependencies(config, row, { verbose });
      }),
    );

    // 2. Dedupe to the missing-from-byId set, keyed by (resourceName,id).
    const missing = new Map<
      string,
      { entry: CollectionEntry; serverId: number | string }
    >();
    const alreadyKnown: Array<{ entry: CollectionEntry; row: unknown }> = [];
    for (const deps of allDeps) {
      for (const dep of deps) {
        const depEntry = entries.get(dep.resourceName);
        if (!depEntry) continue;
        const idStr = String(dep.serverId);
        const idOf =
          depEntry.resource.serverIdOf ??
          ((r: unknown) => (r as { id: number | string }).id);
        if (depEntry.selected.some((r) => String(idOf(r)) === idStr)) continue;

        const cacheKey = `${dep.resourceName}|${idStr}`;
        const existing = depEntry.byId.get(idStr);
        if (existing !== undefined) {
          alreadyKnown.push({ entry: depEntry, row: existing });
        } else if (depEntry.resource.getById) {
          if (!missing.has(cacheKey)) {
            missing.set(cacheKey, { entry: depEntry, serverId: dep.serverId });
          }
        }
      }
    }

    // 3. Fetch every missing row in parallel.
    if (verbose) {
      console.error(
        `[cascade] wave ${wave}: alreadyKnown=${alreadyKnown.length} missing=${missing.size}`,
      );
    }
    const fetched = await Promise.all(
      [...missing.values()].map(async ({ entry, serverId }) => {
        try {
          const row = await entry.resource.getById!(config, serverId, { verbose });
          return { entry, row };
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) return undefined;
          throw err;
        }
      }),
    );

    // 4. Promote every newly-known row to selected and seed the next wave.
    const nextFrontier: Frontier[] = [];
    const promote = (entry: CollectionEntry, row: unknown): void => {
      const idOf =
        entry.resource.serverIdOf ??
        ((r: unknown) => (r as { id: number | string }).id);
      const idStr = String(idOf(row));
      if (entry.selected.some((r) => String(idOf(r)) === idStr)) return;
      entry.byId.set(idStr, row);
      entry.selected.push(row);
      nextFrontier.push({ resource: entry.resource, row });
    };
    for (const { entry, row } of alreadyKnown) promote(entry, row);
    for (const f of fetched) {
      if (f) promote(f.entry, f.row);
    }

    frontier = nextFrontier;
  }
}

// ---------------------------------------------------------------------------
// Render context + helpers
// ---------------------------------------------------------------------------

function makeRenderContext(
  resourceName: string,
  takenSlugsByResource: Map<string, Set<string>>,
  importsByResource: Map<string, Map<string, ImportEntry>>,
  report: ResourceReport,
): PullRenderContext {
  let taken = takenSlugsByResource.get(resourceName);
  if (!taken) {
    taken = new Set<string>();
    takenSlugsByResource.set(resourceName, taken);
  }
  return {
    uniqueSlug: (base) => uniqueSlug(base, taken!),
    importForServerId: (rn, id) => {
      const map = importsByResource.get(rn);
      const entry = map?.get(String(id));
      if (!entry) {
        throw new Error(
          `Resource "${resourceName}" asked for import of ${rn}/${String(id)}, but no entry was registered. ` +
            `Check the dependency's pullDependencies declaration and the apply-order dependsOn graph.`,
        );
      }
      return entry;
    },
    importForServerIdOptional: (rn, id) => importsByResource.get(rn)?.get(String(id)),
    warn: (message) => report.warnings.push(message),
  };
}

function registerImport(
  importsByResource: Map<string, Map<string, ImportEntry>>,
  resourceName: string,
  serverId: number | string,
  entry: ImportEntry,
): void {
  let map = importsByResource.get(resourceName);
  if (!map) {
    map = new Map<string, ImportEntry>();
    importsByResource.set(resourceName, map);
  }
  map.set(String(serverId), entry);
}

async function tagPulledRows(
  config: ClientConfig,
  filesToWrite: Array<{
    resource: ResourceModule<unknown, unknown>;
    file: RenderedFile;
    server: unknown;
  }>,
  loaded: DesiredState,
  ensureReport: (name: string) => ResourceReport,
  verbose: boolean | undefined,
): Promise<void> {
  // Build a (resource name, spec key) → loaded spec map so we can grab the
  // hash for each row we wrote.
  const specsByKey = new Map<string, Map<string, unknown>>();
  for (const [resourceName, loadedSpecs] of loaded) {
    const byKey = new Map<string, unknown>();
    for (const { spec } of loadedSpecs) {
      const r = RESOURCES.find((rr) => rr.name === resourceName);
      if (!r || r.kind !== "collection") continue;
      const key = r.specKey(spec);
      byKey.set(key, spec);
    }
    specsByKey.set(resourceName, byKey);
  }

  for (const { resource, file, server } of filesToWrite) {
    if (resource.kind !== "collection" || !resource.tagOnServer) continue;
    const spec = specsByKey.get(resource.name)?.get(file.specKey);
    if (spec === undefined) {
      ensureReport(resource.name).warnings.push(
        `Couldn't reload spec for ${resource.name}/${file.specKey}; tag-back skipped.`,
      );
      continue;
    }
    const hash = resource.hash(spec);
    try {
      await resource.tagOnServer(config, server, spec, hash, { verbose });
      ensureReport(resource.name).tagged++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      ensureReport(resource.name).warnings.push(
        `Tag-back failed for ${resource.name}/${file.specKey}: ${reason}`,
      );
    }
  }
}
