import type { ClientConfig } from "../client/config.js";
import type { DisplayValue } from "../apply/display.js";
import { obj, scalar } from "../apply/display.js";
import type {
  ApplyContext,
  CollectionResourceModule,
  ResourceOp,
} from "../resources/types.js";

/**
 * Build a minimal `CollectionResourceModule` with sensible defaults and
 * per-test overrides.
 *
 * Only intended for unit tests inside `src/apply/` that orchestrate resources
 * generically and don't care about a specific resource's payload shape.
 */
export function makeFakeResource<TSpec = unknown, TServer = unknown>(
  overrides: Partial<CollectionResourceModule<TSpec, TServer>> & { name: string },
): CollectionResourceModule<TSpec, TServer> {
  const name = overrides.name;
  return {
    kind: "collection",
    name,
    displayName: overrides.displayName ?? name,
    identityPrefix: overrides.identityPrefix ?? `iac:${name}:`,

    isSpec: overrides.isSpec ?? ((v: unknown): v is TSpec => isRecord(v) && v.__kind === name),
    specKey: overrides.specKey ?? ((spec: TSpec) => String((spec as { key: string }).key)),

    list: overrides.list ?? (async () => []),
    keyFromServer:
      overrides.keyFromServer ?? ((server: TServer) => (server as { key?: string }).key),
    hashFromServer:
      overrides.hashFromServer ?? ((server: TServer) => (server as { hash?: string }).hash),

    hash: overrides.hash ?? ((spec: TSpec) => String((spec as { hash?: string }).hash ?? "h")),

    validate: overrides.validate ?? (() => []),

    executeOp: overrides.executeOp ?? (async () => {}),
    prune: overrides.prune ?? (async () => true),

    displaySpec: overrides.displaySpec ?? defaultDisplay,
    displayServer: overrides.displayServer ?? defaultDisplay,

    extractInlineSpecs: overrides.extractInlineSpecs,
    dependsOn: overrides.dependsOn,

    // Pull-side hooks: forward through (all optional).
    listAll: overrides.listAll,
    getById: overrides.getById,
    pullFilter: overrides.pullFilter,
    pullLabel: overrides.pullLabel,
    serverIdOf: overrides.serverIdOf,
    pullDependencies: overrides.pullDependencies,
    renderToFile: overrides.renderToFile,
    tagOnServer: overrides.tagOnServer,
  };
}

function defaultDisplay(value: unknown): DisplayValue {
  if (!isRecord(value)) return scalar(value);
  const entries = Object.entries(value)
    .filter(([k]) => !k.startsWith("__"))
    .map(([k, v]) => [k, scalar(v)] as [string, DisplayValue]);
  return obj(entries);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

/**
 * Capture every executeOp / prune call so tests can assert ordering and arguments.
 */
export function recordCalls(): {
  calls: Array<{ resource: string; kind: string; op?: ResourceOp<unknown, unknown> }>;
  executeOp: CollectionResourceModule["executeOp"];
  prune: CollectionResourceModule["prune"];
  forResource: (name: string) => {
    executeOp: CollectionResourceModule["executeOp"];
    prune: CollectionResourceModule["prune"];
  };
} {
  const calls: Array<{ resource: string; kind: string; op?: ResourceOp<unknown, unknown> }> = [];
  const make = (name: string) => ({
    executeOp: async (
      _config: ClientConfig,
      op: ResourceOp<unknown, unknown>,
      _ctx: ApplyContext,
    ) => {
      calls.push({ resource: name, kind: op.kind, op });
    },
    prune: async () => {
      calls.push({ resource: name, kind: "prune" });
      return true;
    },
  });
  const root = make("<root>");
  return {
    calls,
    executeOp: root.executeOp,
    prune: root.prune,
    forResource: make,
  };
}

