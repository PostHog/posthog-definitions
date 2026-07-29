export type ApplyArgs = {
  command: "apply";
  dryRun: boolean;
  verbose: boolean;
  prune: boolean;
  dir: string;
  json: boolean;
  /**
   * Restrict the run to these resource kinds. Empty = every kind. Mirrors
   * `pull --kind`. Scopes load / validate / diff / plan / execute / prune —
   * critically, `--prune` only considers orphans of the named kinds, so a
   * scoped prune can't touch managed rows of kinds you didn't name.
   */
  kinds: string[];
  host?: string;
  project?: string;
};

export type PullArgs = {
  command: "pull";
  dryRun: boolean;
  verbose: boolean;
  dir: string;
  /** Empty array means "all pull-capable resources". */
  kinds: string[];
  /** True = treat as "every pull-capable resource", skip --kind filtering. */
  all: boolean;
  /** Skip the interactive picker and import every (filtered) row of each target resource. */
  allRows: boolean;
  /** Don't follow cross-resource pullDependencies edges. */
  noCascade: boolean;
  json: boolean;
  host?: string;
  project?: string;
};

export type DumpArgs = {
  command: "dump";
  verbose: boolean;
  dir: string;
  json: boolean;
  host?: string;
  project?: string;
};

export type HelpArgs = { command: "help" };

export type ParsedArgs = ApplyArgs | PullArgs | DumpArgs | HelpArgs;

export class ArgError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArgError";
  }
}

export function parseArgs(argv: string[]): ParsedArgs {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h" || argv[0] === "help") {
    return { command: "help" };
  }

  const command = argv[0];
  if (command === "apply") return parseApply(argv);
  if (command === "pull") return parsePull(argv);
  if (command === "dump") return parseDump(argv);
  throw new ArgError(`Unknown command "${command}". Run "posthog-definitions help" for usage.`);
}

function parseApply(argv: string[]): ApplyArgs {
  const args: ApplyArgs = {
    command: "apply",
    dryRun: false,
    verbose: false,
    prune: false,
    dir: "posthog",
    json: false,
    kinds: [],
  };

  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--prune":
        args.prune = true;
        break;
      case "--kind": {
        const value = expectValue(argv, ++i, flag);
        // Validity of each kind is checked at runtime against the registry —
        // the CLI doesn't carry a hard-coded list.
        args.kinds = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      }
      case "--verbose":
      case "-v":
        args.verbose = true;
        break;
      case "--json":
        args.json = true;
        break;
      case "--dir":
        args.dir = expectValue(argv, ++i, flag);
        break;
      case "--project":
        args.project = expectValue(argv, ++i, flag);
        break;
      case "--host":
        args.host = expectValue(argv, ++i, flag);
        break;
      case "--help":
      case "-h":
        throw new ArgError("Run 'posthog-definitions help' for usage.");
      default:
        throw new ArgError(`Unknown flag: ${flag}`);
    }
  }

  return args;
}

function parsePull(argv: string[]): PullArgs {
  const args: PullArgs = {
    command: "pull",
    dryRun: false,
    verbose: false,
    dir: "posthog",
    kinds: [],
    all: false,
    allRows: false,
    noCascade: false,
    json: false,
  };

  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--all":
        // Now means "every pull-capable resource"; pairs with --kind being empty.
        args.all = true;
        break;
      case "--all-rows":
        args.allRows = true;
        break;
      case "--no-cascade":
        args.noCascade = true;
        break;
      case "--json":
        args.json = true;
        break;
      case "--verbose":
      case "-v":
        args.verbose = true;
        break;
      case "--dir":
        args.dir = expectValue(argv, ++i, flag);
        break;
      case "--project":
        args.project = expectValue(argv, ++i, flag);
        break;
      case "--host":
        args.host = expectValue(argv, ++i, flag);
        break;
      case "--kind": {
        const value = expectValue(argv, ++i, flag);
        const kinds = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        // Validity of each kind is checked at runtime against the registry of
        // pull-capable resources — the CLI doesn't carry a hard-coded list.
        args.kinds = kinds;
        break;
      }
      case "--help":
      case "-h":
        throw new ArgError("Run 'posthog-definitions help' for usage.");
      default:
        throw new ArgError(`Unknown flag: ${flag}`);
    }
  }

  return args;
}

function parseDump(argv: string[]): DumpArgs {
  const args: DumpArgs = {
    command: "dump",
    verbose: false,
    dir: "posthog",
    json: false,
  };

  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--verbose":
      case "-v":
        args.verbose = true;
        break;
      case "--json":
        args.json = true;
        break;
      case "--dir":
        args.dir = expectValue(argv, ++i, flag);
        break;
      case "--project":
        args.project = expectValue(argv, ++i, flag);
        break;
      case "--host":
        args.host = expectValue(argv, ++i, flag);
        break;
      case "--help":
      case "-h":
        throw new ArgError("Run 'posthog-definitions help' for usage.");
      default:
        throw new ArgError(`Unknown flag: ${flag}`);
    }
  }

  return args;
}

function expectValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (value === undefined || value.startsWith("--")) {
    throw new ArgError(`${flag} expects a value.`);
  }
  return value;
}

export const HELP_TEXT = `posthog-definitions — IaC for PostHog dashboards and insights

Usage:
  posthog-definitions apply [flags]
  posthog-definitions pull  [flags]
  posthog-definitions dump  [flags]

Common flags:
  --dry-run            Compute the plan but make no changes. (apply, pull)
  --verbose, -v        Log each HTTP call.
  --json               Emit machine-readable JSON instead of human prose.
  --dir <path>         Definitions directory (default: posthog).
  --project <id>       Override POSTHOG_PROJECT_ID.
  --host <url>         Override POSTHOG_HOST (default: https://us.posthog.com).
  --help, -h           Show this help.

Apply flags:
  --prune              Delete IaC-tagged resources that no longer have a
                       matching source file. Opt-in, off by default. Only
                       touches resources tagged iac:dashboards:* /
                       iac:insights:* — hand-built resources are never
                       considered.
  --kind <list>        Comma-separated list of resource kinds to apply
                       (e.g. dashboards, feature-flags). Omit to apply every
                       kind. Scopes the whole run — load, plan, execute, and
                       prune. With --prune, ONLY orphans of the named kinds
                       are deleted; managed rows of other kinds are not even
                       scanned. Kinds you scope to should include any kinds
                       they reference (deps run in dependency order).

Pull flags:
  --kind <list>        Comma-separated list of resource kinds to pull
                       (e.g. dashboards, feature-flags, cohorts). Omit or
                       pass --all to pull every pull-capable resource.
  --all                Pull every pull-capable resource (no --kind filter).
  --all-rows           Skip the interactive picker and import every (filtered)
                       row of each target resource. Required when stdin is
                       not a TTY.
  --no-cascade         Don't follow cross-resource references. Without this
                       flag, pulling a dashboard also pulls its tile-insights,
                       experiments also pull their flag/holdout/saved-metrics,
                       etc.

Dump flags:
  (Lists every managed resource in apply order; no server calls.
   With --json emits a machine-readable summary; without, a tree.)

Environment:
  POSTHOG_PERSONAL_API_KEY   Required. Personal API key with dashboard:read/write
                             and insight:read/write scopes.
  POSTHOG_PROJECT_ID         Required. Numeric project id.
  POSTHOG_HOST               Optional. Defaults to https://us.posthog.com.
`;
