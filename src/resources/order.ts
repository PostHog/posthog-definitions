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
 */
export function topoOrder<T extends ResourceModule<unknown, unknown>>(
  resources: ReadonlyArray<T>,
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
      if (!known.has(dep)) {
        throw new Error(
          `Resource "${r.name}" depends on "${dep.name}", which is not in the registry.`,
        );
      }
    }
  }

  const result: T[] = [];
  const emitted = new Set<ResourceModule<unknown, unknown>>();
  const remaining = resources.slice();

  while (remaining.length > 0) {
    const readyIndex = remaining.findIndex((r) =>
      (r.dependsOn ?? []).every((dep) => emitted.has(dep)),
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
