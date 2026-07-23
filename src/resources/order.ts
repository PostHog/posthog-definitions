import type { ResourceModule } from "./types.js";

/**
 * Topologically sort resources by their declared `dependsOn` edges. Throws on
 * cycles or on references to modules that aren't in the input list — both are
 * author mistakes that should be caught before any apply runs.
 *
 * Edges are direct object references (not names), so typos are a compile-time
 * error and this function just checks reference identity.
 *
 * Within a topo level (modules whose dependencies have all been emitted), input
 * order is preserved. That keeps plan output deterministic and gives a stable
 * tiebreak between independent resources.
 *
 * `lenient` (used by pull, which orders an arbitrary `--kind` subset): edges
 * pointing at modules outside the input set are dropped instead of throwing. A
 * dependent can be ordered without its dependency present — pull resolves
 * cross-resource references at render time via the optional-import path, so a
 * missing dependency kind is fine there.
 */
export function topoOrder<T extends ResourceModule<unknown, unknown>>(
  resources: ReadonlyArray<T>,
  options: { lenient?: boolean } = {},
): T[] {
  const known = new Set<ResourceModule<unknown, unknown>>(resources);
  const seenNames = new Set<string>();
  for (const r of resources) {
    if (seenNames.has(r.name)) {
      throw new Error(`Duplicate resource name in registry: "${r.name}"`);
    }
    seenNames.add(r.name);
    for (const dep of r.dependsOn ?? []) {
      if (dep === r) {
        throw new Error(`Resource "${r.name}" depends on itself.`);
      }
      if (!known.has(dep) && !options.lenient) {
        throw new Error(
          `Resource "${r.name}" depends on "${dep.name}", which is not in the registry.`,
        );
      }
    }
  }

  const result: T[] = [];
  const emitted = new Set<ResourceModule<unknown, unknown>>();
  const remaining = resources.slice();

  // Only in-set dependencies gate readiness; out-of-set edges are ignored
  // (they can never be emitted here). Under strict mode every edge is in-set
  // anyway, so this is a no-op there.
  const gatingDeps = (r: T): ReadonlyArray<ResourceModule<unknown, unknown>> =>
    (r.dependsOn ?? []).filter((dep) => known.has(dep));

  while (remaining.length > 0) {
    const readyIndex = remaining.findIndex((r) =>
      gatingDeps(r).every((dep) => emitted.has(dep)),
    );
    if (readyIndex === -1) {
      const stuck = remaining.map((r) => r.name).join(", ");
      throw new Error(`Dependency cycle among resources: ${stuck}`);
    }
    const next = remaining.splice(readyIndex, 1)[0]!;
    result.push(next);
    emitted.add(next);
  }

  return result;
}
