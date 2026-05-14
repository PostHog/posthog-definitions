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

export type LoginArgs = {
  command: "login";
  switchProject: boolean;
  host?: string;
};

export type LogoutArgs = { command: "logout" };

export type HelpArgs = { command: "help" };

export type ParsedArgs = ApplyArgs | PullArgs | LoginArgs | LogoutArgs | HelpArgs;

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
  if (command === "login") return parseLogin(argv);
  if (command === "logout") return parseLogout(argv);
  throw new ArgError(`Unknown command "${command}". Run "posthog-definitions help" for usage.`);
}

function parseLogin(argv: string[]): LoginArgs {
  const args: LoginArgs = { command: "login", switchProject: false };
  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--switch-project":
        args.switchProject = true;
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

function parseLogout(argv: string[]): LogoutArgs {
  for (let i = 1; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === "--help" || flag === "-h") {
      throw new ArgError("Run 'posthog-definitions help' for usage.");
    }
    throw new ArgError(`Unknown flag: ${flag}`);
  }
  return { command: "logout" };
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
        const kinds = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
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
  posthog-definitions login  [flags]
  posthog-definitions logout
  posthog-definitions apply  [flags]
  posthog-definitions pull   [flags]

Common flags:
  --dry-run            Compute the plan but make no changes.
  --verbose, -v        Log each HTTP call.
  --dir <path>         Definitions directory (default: posthog).
  --project <id>       Override the stored project (or POSTHOG_PROJECT_ID).
  --host <url>         Override the stored host (or POSTHOG_HOST).
  --help, -h           Show this help.

Login flags:
  --host <url>         Skip the host picker and use this host.
  --switch-project     Re-run the project picker against the existing token.

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

Authentication:
  Run \`posthog-definitions login\` once to authenticate via OAuth in your
  browser and pick a project. Credentials are saved to
  $XDG_CONFIG_HOME/posthog-definitions/config.json (default
  ~/.config/posthog-definitions/config.json) with mode 0600.

  For CI/automation, set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID;
  env vars take precedence over the stored OAuth token.

Environment:
  POSTHOG_PERSONAL_API_KEY   Optional. Personal API key (used by CI).
  POSTHOG_PROJECT_ID         Optional. Numeric project id (overrides store).
  POSTHOG_HOST               Optional. Overrides host (default: https://us.posthog.com).
  POSTHOG_OAUTH_CLIENT_ID    Optional. Override the OAuth client ID (testing).
`;
