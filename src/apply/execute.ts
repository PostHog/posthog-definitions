import type { ClientConfig } from "../client/config.js";
import { ApiError } from "../client/http.js";
import { RESOURCES } from "../resources/index.js";
import {
  newApplyContext,
  type ResourceCounts,
  type ResourceModule,
  type ResourceOp,
} from "../resources/types.js";
import type { DiffResult } from "./diff.js";

/**
 * Thrown by a resource pipeline when the `iac:*` identity marker has disappeared
 * from a server-side row between fetch and write — usually because someone removed
 * the tag in the UI. Aborting prevents the CLI from clobbering a resource it no
 * longer owns. Caught by the CLI to produce a tailored error message.
 */
export class SafetyViolationError extends Error {
  constructor(kind: string, id: number | string, key: string) {
    super(
      `Refusing to write to ${kind} ${id} (key="${key}"): the managed iac:* identity marker is gone. This usually means it was removed in the UI between fetch and write. Aborting.`,
    );
    this.name = "SafetyViolationError";
  }
}

export type ExecuteOptions = {
  verbose?: boolean;
  prune?: boolean;
};

export type ExecuteSummary = Map<string, ResourceCounts>;

export async function execute(
  config: ClientConfig,
  diffResult: DiffResult,
  options: ExecuteOptions = {},
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): Promise<ExecuteSummary> {
  const summary: ExecuteSummary = new Map();
  const ctx = newApplyContext();

  for (const resource of resources) {
    const counts: ResourceCounts = { created: 0, updated: 0, unchanged: 0, pruned: 0 };
    const slice = diffResult.get(resource.name);
    if (slice) {
      for (const op of slice.ops) {
        await resource.executeOp(config, op, ctx, { verbose: options.verbose });
        bumpCount(counts, op);
      }
      if (options.prune) {
        for (const orphan of slice.orphans) {
          if (await resource.prune(config, orphan, { verbose: options.verbose })) {
            counts.pruned++;
          }
        }
      }
    }
    summary.set(resource.name, counts);
  }

  return summary;
}

function bumpCount(counts: ResourceCounts, op: ResourceOp<unknown, unknown>): void {
  if (op.kind === "create") counts.created++;
  else if (op.kind === "update") counts.updated++;
  else counts.unchanged++;
}

export async function fetchCurrentState(
  config: ClientConfig,
  options: ExecuteOptions = {},
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): Promise<Map<string, unknown[]>> {
  const entries = await Promise.all(
    resources.map(
      async (r) => [r.name, await r.list(config, { verbose: options.verbose })] as const,
    ),
  );
  return new Map(entries);
}

/** Re-exported so the CLI doesn't need to know about the underlying error class. */
export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

// Re-export resource module type for downstream consumers that build their own diffs.
export type { ResourceModule };
