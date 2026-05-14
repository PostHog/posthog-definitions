import type { ClientConfig } from "../client/config.js";
import type { DisplayValue } from "../apply/display.js";
import type { PullRenderContext, RenderedFile } from "../pull/types.js";

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
  /**
   * Other resource modules this one reads from at apply time — server ids it
   * looks up in `ApplyContext`, sibling specs it cross-references during
   * validation, or inline children it pulls out of its own specs. Drives the
   * topological sort that produces apply-execute order; if A depends on B,
   * B runs first.
   *
   * Direct module references (not names) so typos are caught by the compiler
   * and refactor-renames propagate automatically. Type is `any/any` because
   * the dependent doesn't care about the dependency's spec/server types — it
   * only needs identity.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly dependsOn?: ReadonlyArray<ResourceModule<any, any>>;

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

  // ---- Pull-side hooks (optional; resources that don't implement them can't be pulled) ----

  /**
   * Unfiltered list of every server row in the project, including ones that
   * aren't iac-managed. Distinct from `list()` (which only returns rows
   * carrying our identity marker). The puller needs the broader view because
   * the whole point is to import things that aren't yet under management.
   */
  listAll?(config: ClientConfig, options?: { verbose?: boolean }): Promise<TServer[]>;

  /**
   * Fetch a single server row by id. Used by the puller to resolve
   * cross-resource dependency references that the dependent declared via
   * `pullDependencies` — those ids may or may not be in the dependency's
   * own listAll result (e.g. an insight referenced from a dashboard tile
   * but not picked by the user directly).
   */
  getById?(
    config: ClientConfig,
    id: number | string,
    options?: { verbose?: boolean },
  ): Promise<TServer>;

  /**
   * Re-fetch a selected row in case `listAll` returned a trimmed shape that
   * omits fields the puller needs. Dashboards are the canonical case: the
   * list endpoint returns `DashboardBasic` (no `tiles`), so without
   * hydration `pullDependencies` and `renderToFile` see no tiles and skip
   * the dashboard. Runs after selection, before the cascade — so
   * `pullDependencies` sees the fully-populated row.
   */
  hydrateForPull?(
    config: ClientConfig,
    server: TServer,
    options?: { verbose?: boolean },
  ): Promise<TServer>;

  /**
   * Decide whether a server row is worth offering to the user for pull. Used
   * to drop auto-generated, deleted, or system rows that the user can't
   * usefully declare as code.
   */
  pullFilter?(server: TServer): { kept: true } | { kept: false; reason: string };

  /** Display label for the interactive picker. */
  pullLabel?(server: TServer): { primary: string; secondary?: string };

  /** Server-id extractor for the picker / dependency cascade. */
  serverIdOf?(server: TServer): number | string;

  /**
   * Declare cross-resource references — when pulling row X that references
   * row Y by server id, the orchestrator follows the edge so Y gets a file
   * too and X's codegen can resolve the import. Edges typically mirror the
   * apply-time `dependsOn` graph.
   *
   * Async because some resources (event-definitions ↔ EventSchema)
   * discover their dependencies via a separate API call rather than from
   * the listAll response itself.
   */
  pullDependencies?(
    config: ClientConfig,
    server: TServer,
    options?: { verbose?: boolean },
  ): Promise<
    Array<{
      resourceName: string;
      serverId: number | string;
    }>
  >;

  /**
   * Render a server row to a TS source file. `ctx` provides cross-resource
   * lookups (for import lines), unique-slug helpers, and warning collection.
   */
  renderToFile?(
    server: TServer,
    ctx: import("../pull/types.js").PullRenderContext,
  ):
    | import("../pull/types.js").RenderedFile
    | { skipped: true; reason: string };

  /**
   * After the freshly-written file is reloaded and re-hashed, stamp the
   * server row with the iac identity (tag or description marker) + hash so
   * the next `apply` sees it as unchanged. Identity-carrier-specific:
   * tag-based resources patch tags, marker-based resources patch the
   * description.
   */
  tagOnServer?(
    config: ClientConfig,
    server: TServer,
    spec: TSpec,
    hash: string,
    options?: { verbose?: boolean },
  ): Promise<void>;
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

  /**
   * Render the server row as a single TS file. Singletons have no picker
   * and no tag-back step — there's nothing to filter and no identity carrier
   * to stamp. They get a simpler hook than collections.
   */
  renderToFile?(
    server: TServer,
    ctx: import("../pull/types.js").PullRenderContext,
  ):
    | import("../pull/types.js").RenderedFile
    | { skipped: true; reason: string };
}

export type ResourceModule<TSpec = unknown, TServer = unknown> =
  | CollectionResourceModule<TSpec, TServer>
  | SingletonResourceModule<TSpec, TServer>;
