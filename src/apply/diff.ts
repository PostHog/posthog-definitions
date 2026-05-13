import { RESOURCES } from "../resources/index.js";
import type {
  DesiredState,
  ResourceDiff,
  ResourceModule,
  ResourceOp,
} from "../resources/types.js";

export type DiffResult = Map<string, ResourceDiff<unknown, unknown>>;

export function diff(
  desired: DesiredState,
  current: Map<string, unknown[]>,
): DiffResult {
  const result: DiffResult = new Map();
  for (const resource of RESOURCES) {
    result.set(resource.name, diffOne(resource, desired, current));
  }
  return result;
}

function diffOne(
  resource: ResourceModule<unknown, unknown>,
  desired: DesiredState,
  current: Map<string, unknown[]>,
): ResourceDiff<unknown, unknown> {
  const ops: Array<ResourceOp<unknown, unknown>> = [];
  const desiredSpecs = (desired.get(resource.name) ?? []).map((l) => l.spec);
  const serverRows = current.get(resource.name) ?? [];

  const currentByKey = new Map<string, { key: string; row: unknown; id: number }>();
  for (const row of serverRows) {
    const key = resource.keyFromServer(row);
    if (!key) continue;
    const id = (row as { id: number }).id;
    currentByKey.set(key, { key, row, id });
  }

  for (const spec of desiredSpecs) {
    const key = resource.specKey(spec);
    const hash = resource.hash(spec);
    const server = currentByKey.get(key);
    if (!server) {
      ops.push({ kind: "create", key, spec, hash });
    } else if (resource.hashFromServer(server.row) === hash) {
      ops.push({ kind: "unchanged", key, spec, serverId: server.id });
    } else {
      ops.push({ kind: "update", key, spec, hash, serverId: server.id, server: server.row });
    }
  }

  const desiredKeys = new Set(desiredSpecs.map((s) => resource.specKey(s)));
  const orphans = serverRows.filter((row) => {
    const key = resource.keyFromServer(row);
    return key !== undefined && !desiredKeys.has(key);
  });

  return { ops, orphans };
}
