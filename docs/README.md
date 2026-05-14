# posthog-definitions

Infrastructure-as-code for PostHog resources — define dashboards, insights, and (eventually) feature flags in TypeScript, push them to a PostHog project with one command.

```ts
// posthog/dashboards/growth.ts
import { dashboard, insight, trends } from "@posthog/definitions";

export default dashboard({
  key: "growth",
  name: "Growth",
  tiles: [
    {
      insight: insight({
        key: "weekly-signups",
        name: "Weekly signups",
        query: trends({ series: [{ event: "user signed up" }], interval: "week" }),
      }),
      layout: { x: 0, y: 0, w: 6, h: 4 },
    },
  ],
});
```

```
$ npx posthog-definitions apply
```

## Audience

Vercel / full-stack TypeScript developers. Not Terraform users. Familiarity with `convex dev`, `vercel deploy`, or `prisma db push` is the right reference frame.

## Docs layout

Interface and implementation are documented separately so a contributor can read one without the other.

```
docs/
├── interface/         what users write and what the CLI does
│   ├── getting-started.md
│   ├── sdk.md         dashboard, insight, trends, ...
│   └── cli.md         apply
└── implementation/    how it works
    ├── architecture.md
    ├── identity.md    key → server resource mapping
    ├── apply.md       load → diff → execute algorithm
    ├── mvp-roadmap.md sequenced plan to ship `apply` for dashboards
    └── risks.md       open questions blocking the plan
```

## Current status

Pre-MVP. The MVP scope is **dashboard synchronization via `npx posthog-definitions apply`** — see [`implementation/mvp-roadmap.md`](implementation/mvp-roadmap.md).

## Authentication

```
$ npx posthog-definitions login
```

Opens a browser, completes a PKCE OAuth flow against `https://us.posthog.com` (or `--host https://eu.posthog.com`), and prompts you to pick a project. Credentials are saved to `$XDG_CONFIG_HOME/posthog-definitions/config.json` (default `~/.config/posthog-definitions/config.json`) with mode `0600`. Subsequent `apply` / `pull` runs read from that file and auto-refresh the access token.

The CLI uses the CIMD (Client ID Metadata Document) pattern — the same one `posthog/wizard` uses. The `client_id` is `${host}/api/oauth/posthog-definitions/client-metadata`. No DB row needs to be created up-front on the PostHog backend; the OAuth server fetches the metadata document on first authorize and auto-creates the application record.

To switch projects without re-authenticating: `npx posthog-definitions login --switch-project`. To clear credentials: `npx posthog-definitions logout`.

For CI and automation, set `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_PROJECT_ID` in the environment — they take precedence over the stored OAuth token, so existing setups keep working.

## Local development

For testing `apply` against a dev project, you can either run `posthog-definitions login` or use [direnv](https://direnv.net/) to load a personal API key:

```
cp .envrc.example .envrc
# edit .envrc with a dev-project personal API key + project id
direnv allow
```

`.envrc` is gitignored. Resolution order for each setting: `--project` / `--host` CLI flag → `POSTHOG_*` env var → stored OAuth config.
