/**
 * Shared types for the pull pipeline. Lives here (not in resources/types.ts)
 * so the resource modules can import them without circularity.
 */

/**
 * Why a server row was excluded from pull. Each resource picks the reasons
 * that apply to its domain (e.g. "feature-flag" / "template" for dashboards;
 * "deleted" / "system" elsewhere). Surface in the CLI output.
 */
export type FilterReason = string;

export type PullFilterResult =
  | { kept: true }
  | { kept: false; reason: FilterReason };

/** Display label for the interactive picker. */
export type PullLabel = {
  /** Main line — typically the row's `name`. */
  primary: string;
  /** Right-aligned grey hint — e.g. tags, kind. Optional. */
  secondary?: string;
};

/**
 * Result of rendering a single server row to a TS source file.
 */
export type RenderedFile = {
  filename: string;
  contents: string;
  /** The `key` field embedded in the spec — used to look up the spec after
   * reload to compute its hash for tag-back. */
  specKey: string;
};

/** What a resource's `renderToFile` returns when it can't usefully codegen a row. */
export type RenderSkipped = { skipped: true; reason: string };

/**
 * Entry registered in the orchestrator after a row is codegen'd; lets
 * dependents resolve cross-resource imports.
 */
export type ImportEntry = {
  /** Spec key (`key:` field) of the dependency. */
  key: string;
  /** Identifier suitable for default-import: `import <varName> from "..."`. */
  varName: string;
  /** Filename within the resource's subdir (e.g. "signups.ts"). */
  filename: string;
  /** Resource name (the registry name, e.g. "insights"). */
  resourceName: string;
};

/**
 * Context handed to a resource's `renderToFile`. The orchestrator owns it;
 * the resource consumes it.
 */
export interface PullRenderContext {
  /**
   * Reserve a unique slug for this resource's output subdir. Pass the
   * preferred slug; gets `-2`, `-3`, ... appended if already taken.
   */
  uniqueSlug(base: string): string;

  /**
   * Look up the import entry for a cross-resource reference. The
   * orchestrator guarantees dependencies are codegen'd before dependents
   * (topo order over `dependsOn`); calling this for a dependency that
   * wasn't queued throws — that's an author bug in `pullDependencies`.
   */
  importForServerId(
    resourceName: string,
    serverId: number | string,
  ): ImportEntry;

  /**
   * Best-effort lookup. Returns undefined if the dependency wasn't pulled
   * (e.g. user opted out via `--no-cascade`). Resources use this when an
   * inline-fallback rendering is preferable to skipping the row.
   */
  importForServerIdOptional(
    resourceName: string,
    serverId: number | string,
  ): ImportEntry | undefined;

  /** Append a warning that surfaces in the CLI report. */
  warn(message: string): void;
}

/** Cross-resource dependency declared by a server row. */
export type PullDependency = {
  /** Plural resource name (matches `ResourceModule.name`). */
  resourceName: string;
  /** Server id of the row that needs to be pulled to satisfy the reference. */
  serverId: number | string;
};
