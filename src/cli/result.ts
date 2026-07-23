/**
 * Structured result types for the CLI subcommands. The CLI entrypoints
 * (runApply/runPullCli/runDump) build one of these and then either render
 * it as prose or stringify it as JSON; tests call the underlying build
 * functions directly so they can assert on a typed object.
 *
 * Every shape carries an `ok` discriminant — false on user/operational
 * errors (validation, config, transient API issues). Unexpected errors
 * still throw, since they're not part of the public contract.
 */

export type ApplyResult =
  | ApplyOkDryRun
  | ApplyOkApplied
  | ApplyErr;

export type ApplyOkDryRun = {
  ok: true;
  dryRun: true;
  applied: false;
  /**
   * When `--kind` scoped the run, the list of kinds that were scanned;
   * `null` means every kind was in scope. Kinds NOT in this list were not
   * scanned at all — their absence from `byResource` is not "0 changes",
   * it is "not looked at".
   */
  scope: string[] | null;
  plan: {
    totalOps: number;
    byResource: Array<{
      resource: string;
      create: number;
      update: number;
      unchanged: number;
      orphans: number;
    }>;
  };
};

export type ApplyOkApplied = {
  ok: true;
  dryRun: false;
  applied: true;
  /** Kinds scanned when `--kind` scoped the run; `null` means all kinds. */
  scope: string[] | null;
  totals: {
    created: number;
    updated: number;
    unchanged: number;
    pruned: number;
  };
  byResource: Record<string, {
    created: number;
    updated: number;
    unchanged: number;
    pruned: number;
  }>;
};

export type ApplyErr = {
  ok: false;
  /** Where in the pipeline the error occurred. */
  stage: "config" | "args" | "load" | "validate" | "fetch" | "apply";
  /** Short human-readable error message. Suitable for `error: …` prose output. */
  error: string;
  /** Validation issues, populated when stage === "validate". */
  issues?: Array<{ resource: string; message: string }>;
};

export type PullResult = PullOk | PullErr;

export type PullOk = {
  ok: true;
  dryRun: boolean;
  dir: string;
  totals: {
    written: number;
    tagged: number;
    dryRunPlanned: number;
  };
  /** Files the orchestrator would have written if not in dry-run. */
  dryRunPlanned: string[];
  byResource: Record<
    string,
    {
      written: string[];
      tagged: number;
      skipped: Array<{ id: number | string; reason: string }>;
      filteredOut: Array<{ id: number | string; reason: string }>;
      warnings: string[];
    }
  >;
};

export type PullErr = {
  ok: false;
  stage: "config" | "args" | "tty" | "pull";
  error: string;
};

export type DumpResult = DumpOk | DumpErr;

export type DumpOk = {
  ok: true;
  dir: string;
  total: number;
  resources: Array<{
    resource: string;
    displayName: string;
    kind: "collection" | "singleton";
    keys: string[];
  }>;
};

export type DumpErr = {
  ok: false;
  stage: "config" | "load";
  error: string;
};

/** Map an Apply/Pull/Dump error stage to the CLI exit code we want. */
export function exitCodeForError(
  result: ApplyErr | PullErr | DumpErr,
): number {
  switch (result.stage) {
    case "config":
    case "args":
    case "tty":
      return 3;
    case "validate":
    case "load":
      return 1;
    case "fetch":
    case "apply":
    case "pull":
      return 2;
    default:
      return 1;
  }
}
