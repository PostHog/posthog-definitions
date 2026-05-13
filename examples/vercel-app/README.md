# vercel-app — posthog-definitions on Vercel

Minimal Next.js (app router) app that:

1. Fires a `button_clicked` event into PostHog from the browser when you click "Throw event".
2. Defines a dashboard counting those events in `posthog/dashboards/vercel-demo.ts`.
3. Runs `posthog-definitions apply` during the Vercel build — **dry-run on preview deploys, real apply on production deploys**.

## Two kinds of credentials

| Variable | Where used | What it is | Where to find it |
| --- | --- | --- | --- |
| `POSTHOG_PERSONAL_API_KEY` | Build step (server). Never shipped to the browser. | Personal API key, starts with `phx_`. Needs `dashboard:read/write` and `insight:read/write` scopes. | `<host>/settings/user-api-keys` |
| `POSTHOG_PROJECT_ID` | Build step (server). | Numeric project ID. | Project settings → General |
| `POSTHOG_HOST` | Build step (server). Optional. | Dashboard host. Defaults to `https://us.posthog.com`. | — |
| `NEXT_PUBLIC_POSTHOG_KEY` | Browser. Exposed in client bundle. | Project public token, starts with `phc_`. Safe to ship. | Project settings → Project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Browser. Optional. | Ingestion host. Defaults to `https://us.i.posthog.com`. | — |

> **Do not put `POSTHOG_PERSONAL_API_KEY` in a `NEXT_PUBLIC_*` var.** `NEXT_PUBLIC_*` ships to every browser. The personal key has write access to your project.

> **Use a dedicated dev PostHog project.** Do not set `POSTHOG_PROJECT_ID` to any project you care about for real analytics.

## Local development

From the **repo root** (`posthog-definitions/`):

```bash
pnpm install
cp examples/vercel-app/.env.example examples/vercel-app/.env
# Fill in .env with dev-project credentials
```

Run the dev server:

```bash
pnpm --filter vercel-app dev
```

Open <http://localhost:3000>, click "Throw event", and watch the event arrive in PostHog → Activity → Live events.

### Local dry-run of the dashboard sync

```bash
pnpm --filter vercel-app build
```

Because `VERCEL_ENV` is unset locally, `posthog-sync.mjs` runs `posthog-definitions apply --dir posthog --dry-run` — it prints the plan but does not write to PostHog. Then `next build` runs.

### Real local apply

When you want to actually create/update the dashboard from your machine:

```bash
pnpm --filter vercel-app posthog:apply
```

## Deploy to Vercel

```bash
cd examples/vercel-app
vercel link
```

When prompted, set **Root Directory** to `examples/vercel-app`. Vercel auto-detects the pnpm workspace root above it.

Add environment variables for both Preview and Production scopes:

```bash
vercel env add POSTHOG_PERSONAL_API_KEY preview
vercel env add POSTHOG_PERSONAL_API_KEY production
vercel env add POSTHOG_PROJECT_ID preview
vercel env add POSTHOG_PROJECT_ID production
vercel env add NEXT_PUBLIC_POSTHOG_KEY preview
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
# Optional, only if non-default:
# vercel env add POSTHOG_HOST preview
# vercel env add POSTHOG_HOST production
# vercel env add NEXT_PUBLIC_POSTHOG_HOST preview
# vercel env add NEXT_PUBLIC_POSTHOG_HOST production
```

Trigger deploys:

```bash
vercel          # preview — build log shows "VERCEL_ENV=preview — DRY-RUN"
vercel --prod   # production — build log shows "VERCEL_ENV=production — applying for real"
```

After the production deploy, the `Vercel demo (iac)` dashboard appears in PostHog. Visit the live URL, click the button, refresh the dashboard — the trend ticks up.

## How the build wiring works

`package.json` `build`:

```
pnpm --filter @posthog/definitions build && node scripts/posthog-sync.mjs && next build
```

1. Build the local `@posthog/definitions` lib (its `bin` points at `dist/cli/index.js`).
2. `scripts/posthog-sync.mjs` reads `VERCEL_ENV` and runs `posthog-definitions apply --dir posthog [--dry-run]`.
3. `next build` produces the deploy artifacts.

A failed `apply` fails the build, which fails the deploy. This is the desired behavior — a broken dashboard definition should block the deploy.

## Troubleshooting

**`Cannot find module '@posthog/definitions'` during Vercel install.** Vercel sometimes installs only inside the Root Directory and misses the workspace root. Add a `vercel.json` in this folder:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "framework": "nextjs"
}
```

**Browser doesn't fire events.** Check that `NEXT_PUBLIC_POSTHOG_KEY` starts with `phc_` (project public token), not `phx_` (personal key). Confirm `NEXT_PUBLIC_POSTHOG_HOST` (if set) is the ingestion host (`us.i.posthog.com`), not the dashboard host.

**Build claims `0 created` but dashboard isn't visible.** Check `POSTHOG_PROJECT_ID` matches the project you're viewing. The dashboard is tagged `iac:dashboards:vercel-demo` — filter by tag in PostHog to find it.
