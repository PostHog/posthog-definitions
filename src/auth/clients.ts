// OAuth client identification for posthog-definitions.
//
// This CLI uses the CIMD (Client ID Metadata Document) pattern — the same one
// `posthog/wizard` uses. Our client_id is the URL where PostHog serves the
// metadata document, e.g.:
//   https://us.posthog.com/api/oauth/posthog-definitions/client-metadata
//
// On first authorize call against a region, the PostHog backend fetches the
// document, caches it, and auto-creates an OAuthApplication row tagged as a
// CIMD client. No DB migration is required.
//
// Backend prerequisite: PostHog must expose the metadata document at
// `${SITE_URL}/api/oauth/posthog-definitions/client-metadata`. See
// `posthog/posthog/api/oauth/wizard_metadata.py` for the pattern to copy. The
// document must register `http://localhost/callback` (portless) as a redirect
// URI so the OAuth validator's loopback port-flexibility logic accepts any of
// our ephemeral callback ports at runtime.
const CIMD_PATH = "/api/oauth/posthog-definitions/client-metadata";

export const OAUTH_REDIRECT_PORTS = [8239, 8238, 8240, 8237, 8236, 8235] as const;

export const OAUTH_SCOPES = [
  "user:read",
  "project:read",
  "organization:read",
  "dashboard:write",
  "insight:write",
].join(" ");

export function resolveClientId(host: string): string {
  const override = process.env.POSTHOG_OAUTH_CLIENT_ID;
  if (override) return override;
  return `${host.replace(/\/$/, "")}${CIMD_PATH}`;
}
