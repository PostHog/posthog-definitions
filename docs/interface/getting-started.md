# Getting started

## Install

```
npm install --save-dev @posthog/definitions
```

The package ships a `posthog-definitions` CLI that runs via `npx`.

## Configure

The CLI reads three environment variables (typically `.env.local` for dev, project secrets in CI):

| Variable | Required | Description |
|---|---|---|
| `POSTHOG_PERSONAL_API_KEY` | yes | Personal API key with `dashboard:write` and `insight:write` scopes. Create one at `<host>/settings/user-api-keys`. |
| `POSTHOG_PROJECT_ID` | yes | Numeric project ID to sync into. |
| `POSTHOG_HOST` | no | Defaults to `https://us.posthog.com`. Set to your EU or self-hosted URL. |

Example `.env.local`:

```
POSTHOG_PERSONAL_API_KEY=phx_abc123...
POSTHOG_PROJECT_ID=12345
POSTHOG_HOST=https://us.posthog.com
```

CLI flags override env vars: `--project <id>` and `--host <url>`. The API key has no flag — it must come from the environment to keep it out of shell history.

## Define a dashboard

Create `posthog/dashboards/growth.ts`:

```ts
import { dashboard, insight, trends, text } from "@posthog/definitions";

const signups = insight({
  key: "weekly-signups",
  name: "Weekly signups",
  query: trends({
    series: [{ event: "user signed up", math: "total" }],
    interval: "week",
    dateRange: { date_from: "-90d" },
  }),
});

export default dashboard({
  key: "growth",
  name: "Growth",
  description: "Top-of-funnel and activation",
  pinned: true,
  tags: ["growth", "iac"],
  tiles: [
    { insight: signups, layout: { x: 0, y: 0, w: 6, h: 4 } },
    text({ body: "Updated weekly.", layout: { x: 0, y: 4, w: 12, h: 1 } }),
  ],
});
```

## Apply

```
$ npx posthog-definitions apply
```

The CLI:
1. Loads every `.ts` file under `posthog/dashboards/`.
2. Compares against the project's current IaC-managed state.
3. Creates, updates, or leaves each managed resource untouched.
4. Prints a summary of what changed.

`apply` is idempotent — re-running with no changes is a no-op.

### Safe to run alongside hand-built dashboards

The CLI only touches resources it created (tagged `iac:dashboards:<key>` or `iac:insights:<key>`). Dashboards and insights you built in the UI — or via any other tool — are invisible to `apply`: not modified, not deleted, not warned about. You can adopt this gradually, one dashboard at a time, without risk to the rest of the project. See [the safety invariant](../implementation/apply.md#safety-invariant--this-is-the-rule-everything-else-serves) for how this is enforced.

## Next

- [SDK reference](sdk.md)
- [CLI reference](cli.md)
