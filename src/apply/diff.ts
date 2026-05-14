import { RESOURCES } from "../resources/index.js";
import type {
  CollectionResourceModule,
  DesiredState,
  ResourceDiff,
  ResourceModule,
  ResourceOp,
  SingletonResourceModule,
} from "../resources/types.js";

export type DiffResult = Map<string, ResourceDiff<unknown, unknown>>;

export function diff(
  desired: DesiredState,
  current: Map<string, unknown[]>,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): DiffResult {
  const result: DiffResult = new Map();
  for (const resource of resources) {
    result.set(
      resource.name,
      resource.kind === "singleton"
        ? diffSingleton(resource, desired, current)
        : diffCollection(resource, desired, current),
    );
  }
  return result;
}

function diffCollection(
  resource: CollectionResourceModule<unknown, unknown>,
  desired: DesiredState,
  current: Map<string, unknown[]>,
): ResourceDiff<unknown, unknown> {
  const ops: Array<ResourceOp<unknown, unknown>> = [];
  const desiredSpecs = (desired.get(resource.name) ?? []).map((l) => l.spec);
  const serverRows = current.get(resource.name) ?? [];

  const currentByKey = new Map<string, unknown>();
  for (const row of serverRows) {
    const key = resource.keyFromServer(row);
    if (!key) continue;
    currentByKey.set(key, row);
  }

  for (const spec of desiredSpecs) {
    const key = resource.specKey(spec);
    const server = currentByKey.get(key);
    if (!server) {
      ops.push({ kind: "create", spec });
    } else if (resource.hashFromServer(server) === resource.hash(spec)) {
      ops.push({ kind: "unchanged", spec, server });
    } else {
      ops.push({ kind: "update", spec, server });
    }
  }

  const desiredKeys = new Set(desiredSpecs.map((s) => resource.specKey(s)));
  const orphans = serverRows.filter((row) => {
    const key = resource.keyFromServer(row);
    return key !== undefined && !desiredKeys.has(key);
  });

  return { ops, orphans };
}

/**
 * Singletons fetch one row and diff at the field level. If no spec is
 * declared, we emit no ops — the user has opted out of managing this resource.
 * If a spec is declared, we always emit exactly one op (update or unchanged);
 * the row always exists on the server.
 */
function diffSingleton(
  resource: SingletonResourceModule<unknown, unknown>,
  desired: DesiredState,
  current: Map<string, unknown[]>,
): ResourceDiff<unknown, unknown> {
  const declared = (desired.get(resource.name) ?? []).map((l) => l.spec);
  if (declared.length === 0) return { ops: [], orphans: [] };

  const spec = declared[0]!;
  const serverRows = current.get(resource.name) ?? [];
  const server = serverRows[0];
  if (server === undefined) {
    // The pipeline fetched no server row for a singleton resource; that is a
    // bug in `fetchCurrentState`, not a user-visible condition. Refuse to
    // proceed rather than guessing.
    throw new Error(
      `singleton ${resource.name} has no server row in current state — fetchCurrentState should have produced one`,
    );
  }

  const changes = resource.diffFields(spec, server);
  const op: ResourceOp<unknown, unknown> =
    changes.length === 0
      ? { kind: "unchanged", spec, server }
      : { kind: "update", spec, server };
  return { ops: [op], orphans: [] };
}
