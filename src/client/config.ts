export type ClientConfig = {
  host: string;
  projectId: string;
  apiKey: string;
};

export type ConfigOverrides = {
  host?: string;
  projectId?: string;
};

const DEFAULT_HOST = "https://us.posthog.com";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function loadConfig(overrides: ConfigOverrides = {}): ClientConfig {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!apiKey) {
    throw new ConfigError(
      "POSTHOG_PERSONAL_API_KEY is not set. Add it to .envrc (and run `direnv allow`) or export it in your shell.",
    );
  }

  const projectId = overrides.projectId ?? process.env.POSTHOG_PROJECT_ID;
  if (!projectId) {
    throw new ConfigError(
      "POSTHOG_PROJECT_ID is not set. Pass --project <id> or set it in .envrc.",
    );
  }

  const host = (overrides.host ?? process.env.POSTHOG_HOST ?? DEFAULT_HOST).replace(/\/$/, "");

  return { host, projectId, apiKey };
}
