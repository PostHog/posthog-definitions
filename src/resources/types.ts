import type { ClientConfig } from "../client/config.js";
import type { DisplayValue } from "../apply/display.js";

/**
 * Non-enumerable marker installed by each resource's user-facing factory
 * (`insight()`, `dashboard()`, `endpoint()`, …). Lets the loader unambiguously
 * route a default-exported spec to its module — distinct resources can share a
 * structural shape (e.g. insight and endpoint both have `key + name + query`).
 */
export const RESOURCE_KIND = Symbol.for("posthog-definitions/resource-kind");

export function markResourceKind<T extends object>(spec: T, kind: string): T {
  Object.defineProperty(spec, RESOURCE_KIND, {
    value: kind,
    enumerable: false,
    configurable: true,
    writable: false,
  });
  return spec;
}

export function getResourceKind(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const kind = (value as Record<symbol, unknown>)[RESOURCE_KIND];
  return typeof kind === "string" ? kind : undefined;
}

/**
 * What the diff layer asks the executor to do. Three kinds suffice for every
 * resource shape we ship — collections (which run create / update / unchanged)
 * and singletons (which only ever run update / unchanged since the row always
 * exists).
 *
 * The op intentionally carries only `spec` and (when applicable) `server`.
 * Anything the executor needs beyond that — the row's server id, the hash to
 * stash in the tag, the per-field change set — is derived from those two via
 * the resource module's own helpers. That keeps the op a pure intent record;
 * collection mechanics (full-payload PATCH against a server id) and singleton
 * mechanics (declared-fields PATCH against the project) live where they
 * belong, in their executors.
 */
export type ResourceOp<TSpec, TServer> =
  | { kind: "create"; spec: TSpec }
  | { kind: "update"; spec: TSpec; server: TServer }
  | { kind: "unchanged"; spec: TSpec; server: TServer };

export type FieldChange = {
  field: string;
  before: unknown;
  after: unknown;
};

export type LoadedSpec<TSpec = unknown> = { path: string; spec: TSpec };

export type DesiredState = Map<string, LoadedSpec[]>;

export type CurrentState = Map<string, unknown[]>;

export type ResourceDiff<TSpec, TServer> = {
  ops: Array<ResourceOp<TSpec, TServer>>;
  orphans: TServer[];
};

export type DiffByResource = Map<string, ResourceDiff<unknown, unknown>>;

export type ApplyContext = {
  /** Insight server id by spec key. Populated by the insight module's executor; read by the dashboard module to resolve tile references. */
  insightIdByKey: Map<string, number>;
  /** Inverse of insightIdByKey; populated when displaying server-side dashboard tiles so we can show keys rather than ids. */
  insightKeyByServerId: Map<number, string>;
  /** Property-group server id by spec key. Populated by the property-group module's executor; read by the event-definition module to reconcile EventSchema links. */
  propertyGroupIdByKey: Map<string, string>;
  /** Experiment-holdout server id by spec key. Populated by the experiment-holdout module's executor; read by the experiment module's resolver. */
  experimentHoldoutIdByKey: Map<string, number>;
  /** Experiment-saved-metric server id by spec key. Populated by the experiment-saved-metric module's executor; read by the experiment module's resolver. */
  experimentSavedMetricIdByKey: Map<string, number>;
};

export function newApplyContext(): ApplyContext {
  return {
    insightIdByKey: new Map(),
    insightKeyByServerId: new Map(),
    propertyGroupIdByKey: new Map(),
    experimentHoldoutIdByKey: new Map(),
    experimentSavedMetricIdByKey: new Map(),
  };
}

export type ResourceCounts = {
  created: number;
  updated: number;
  unchanged: number;
  pruned: number;
};

/**
 * Common surface across collection and singleton resources. The pipeline
 * (load → validate → diff → execute → render) dispatches through this base;
 * the kind discriminator on the union selects the right lifecycle.
 */
interface BaseResourceModule<TSpec, TServer> {
  /** Plural, lowercase, used as the registry key. */
  readonly name: string;
  /** Singular form used in plan output (e.g. "insight"). */
  readonly displayName: string;

  isSpec(value: unknown): value is TSpec;

  validate(specs: TSpec[], state: DesiredState): string[];

  executeOp(
    config: ClientConfig,
    op: ResourceOp<TSpec, TServer>,
    ctx: ApplyContext,
    options?: { verbose?: boolean },
  ): Promise<void>;

  displaySpec(spec: TSpec, ctx: ApplyContext): DisplayValue;
  displayServer(server: TServer, ctx: ApplyContext): DisplayValue;
}

/**
 * A many-rows-per-project resource. Identity is carried in a server-side tag
 * (`iac:<plural>:<key>`) or a description marker; lifecycle is the standard
 * create / update / unchanged / orphan / prune cycle.
 */
export interface CollectionResourceModule<TSpec = unknown, TServer = unknown>
  extends BaseResourceModule<TSpec, TServer> {
  readonly kind: "collection";
  /** Identity tag prefix, derived from `name` (e.g. "iac:insights:"). */
  readonly identityPrefix: string;

  specKey(spec: TSpec): string;

  /** Optional: extract dependency specs that live inline inside a parent spec (e.g. insights inside dashboard tiles). Called after the main file-load pass. */
  extractInlineSpecs?(spec: TSpec): Array<{ resourceName: string; spec: unknown }>;

  list(config: ClientConfig, options?: { verbose?: boolean }): Promise<TServer[]>;
  keyFromServer(server: TServer): string | undefined;
  hashFromServer(server: TServer): string | undefined;

  hash(spec: TSpec): string;

  prune(config: ClientConfig, orphan: TServer, options?: { verbose?: boolean }): Promise<boolean>;
}

/**
 * A one-row-per-project resource (project settings, billing config, …).
 * No tag identity — the project itself is the key. No create / delete /
 * orphan: the row always exists. Diff is field-level over only the keys the
 * user explicitly declared; everything else is left untouched.
 */
export interface SingletonResourceModule<TSpec = unknown, TServer = unknown>
  extends BaseResourceModule<TSpec, TServer> {
  readonly kind: "singleton";

  /** Single GET against the singleton endpoint. */
  fetchOne(config: ClientConfig, options?: { verbose?: boolean }): Promise<TServer>;

  /**
   * Compute per-field changes between a declared spec and the server row.
   * Only keys present in `spec` are considered — undeclared keys must never
   * appear in the result, regardless of the server value. Empty array means
   * the singleton is in sync.
   */
  diffFields(spec: TSpec, server: TServer): FieldChange[];
}

export type ResourceModule<TSpec = unknown, TServer = unknown> =
  | CollectionResourceModule<TSpec, TServer>
  | SingletonResourceModule<TSpec, TServer>;
