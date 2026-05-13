export type ApplyArgs = {
  command: "apply";
  dryRun: boolean;
  verbose: boolean;
  prune: boolean;
  dir: string;
  host?: string;
  project?: string;
};

export type PullKind = "dashboards";

export type PullArgs = {
  command: "pull";
  dryRun: boolean;
  verbose: boolean;
  dir: string;
  kinds: PullKind[];
  all: boolean;
  host?: string;
  project?: string;
};

export type HelpArgs = { command: "help" };

export type ParsedArgs = ApplyArgs | PullArgs | HelpArgs;

const SUPPORTED_PULL_KINDS: readonly PullKind[] = ["dashboards"];

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
  throw new ArgError(`Unknown command "${command}". Run "posthog-definitions help" for usage.`);
}

function parseApply(argv: string[]): ApplyArgs {
  const args: ApplyArgs = {
    command: "apply",
    dryRun: false,
    verbose: false,
    prune: false,
    dir: "posthog",
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
    kinds: [...SUPPORTED_PULL_KINDS],
    all: false,
  };

  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--all":
        args.all = true;
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
        const kinds = value.split(",").map((s) => s.trim()).filter(Boolean);
        for (const k of kinds) {
          if (!SUPPORTED_PULL_KINDS.includes(k as PullKind)) {
            throw new ArgError(
              `Unsupported --kind "${k}". Supported: ${SUPPORTED_PULL_KINDS.join(", ")}.`,
            );
          }
        }
        args.kinds = kinds as PullKind[];
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

Common flags:
  --dry-run            Compute the plan but make no changes.
  --verbose, -v        Log each HTTP call.
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

Pull flags:
  --kind <list>        Comma-separated list of entity kinds to pull.
                       Supported: dashboards. Default: dashboards.
  --all                Skip the interactive picker and import everything.
                       (Required when stdin is not a TTY.)

Environment:
  POSTHOG_PERSONAL_API_KEY   Required. Personal API key with dashboard:read/write
                             and insight:read/write scopes.
  POSTHOG_PROJECT_ID         Required. Numeric project id.
  POSTHOG_HOST               Optional. Defaults to https://us.posthog.com.
`;
