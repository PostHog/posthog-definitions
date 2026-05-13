export type ApplyArgs = {
  command: "apply";
  dryRun: boolean;
  verbose: boolean;
  prune: boolean;
  dir: string;
  host?: string;
  project?: string;
};

export type HelpArgs = { command: "help" };

export type ParsedArgs = ApplyArgs | HelpArgs;

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
  if (command !== "apply") {
    throw new ArgError(`Unknown command "${command}". Run "posthog-definitions help" for usage.`);
  }

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
        return { command: "help" };
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

Flags:
  --dry-run            Compute the diff but make no API calls.
  --prune              Delete IaC-tagged resources that no longer have a
                       matching source file. Opt-in, off by default. Only
                       touches resources tagged iac:dashboards:* /
                       iac:insights:* — hand-built resources are never
                       considered.
  --verbose, -v        Log each HTTP call.
  --dir <path>         Directory to scan for definition files (default: posthog).
  --project <id>       Override POSTHOG_PROJECT_ID.
  --host <url>         Override POSTHOG_HOST (default: https://us.posthog.com).
  --help, -h           Show this help.

Environment:
  POSTHOG_PERSONAL_API_KEY   Required. Personal API key with dashboard:write
                             and insight:write scopes.
  POSTHOG_PROJECT_ID         Required. Numeric project id.
  POSTHOG_HOST               Optional. Defaults to https://us.posthog.com.
`;
