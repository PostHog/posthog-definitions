import type { ClientConfig } from "../client/config.js";
import type { DisplayValue } from "../apply/display.js";

export type ResourceOp<TSpec, TServer> =
  | { kind: "create"; key: string; spec: TSpec; hash: string }
  | { kind: "update"; key: string; spec: TSpec; hash: string; serverId: number; server: TServer }
  | { kind: "unchanged"; key: string; spec: TSpec; serverId: number };

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
};

export function newApplyContext(): ApplyContext {
  return {
    insightIdByKey: new Map(),
    insightKeyByServerId: new Map(),
  };
}

export type ResourceCounts = {
  created: number;
  updated: number;
  unchanged: number;
  pruned: number;
};

export interface ResourceModule<TSpec = unknown, TServer = unknown> {
  /** Plural, lowercase, used as the registry key and in the `iac:<name>:<key>` tag prefix. */
  readonly name: string;
  /** Singular form used in plan output (e.g. "insight"). */
  readonly displayName: string;
  /** Identity tag prefix, derived from `name` (e.g. "iac:insights:"). */
  readonly identityPrefix: string;

  isSpec(value: unknown): value is TSpec;
  specKey(spec: TSpec): string;

  /** Optional: extract dependency specs that live inline inside a parent spec (e.g. insights inside dashboard tiles). Called after the main file-load pass. */
  extractInlineSpecs?(spec: TSpec): Array<{ resourceName: string; spec: unknown }>;

  list(config: ClientConfig, options?: { verbose?: boolean }): Promise<TServer[]>;
  keyFromServer(server: TServer): string | undefined;
  hashFromServer(server: TServer): string | undefined;

  hash(spec: TSpec): string;

  validate(specs: TSpec[], state: DesiredState): string[];

  executeOp(
    config: ClientConfig,
    op: ResourceOp<TSpec, TServer>,
    ctx: ApplyContext,
    options?: { verbose?: boolean },
  ): Promise<void>;

  prune(
    config: ClientConfig,
    orphan: TServer,
    options?: { verbose?: boolean },
  ): Promise<boolean>;

  displaySpec(spec: TSpec, ctx: ApplyContext): DisplayValue;
  displayServer(server: TServer, ctx: ApplyContext): DisplayValue;
}
