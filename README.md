# posthog-definitions

> [!WARNING]
> **Alpha — do not use in production.**
> This is pre-MVP software (`0.1.0-alpha.0`). The CLI, the on-disk file format, the SDK surface, and the tag-based identity model are all subject to breaking changes without notice. Use it on throwaway projects or in a sandbox while we stabilize.

Infrastructure-as-code for PostHog. Define dashboards, insights, feature flags, actions, endpoints, event definitions, property groups, experiments, experiment holdouts, experiment saved metrics, and subscriptions in TypeScript, then sync them to a PostHog project with one command.

## Why

- **Version control your PostHog setup.** Dashboards and flags live next to the app code that emits the events they depend on.
- **Code-review changes before they ship.** A renamed metric or a flipped flag is a diff, not a click in the UI.
- **Reproduce setups across projects.** Apply the same definitions to staging and prod, or bootstrap a new project from an existing one.

## Install

```
npm install --save-dev @posthog/definitions
```

## Example

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

## Workflow

1. **Authenticate** — create a personal API key ([US](https://us.posthog.com/settings/user-api-keys) / [EU](https://eu.posthog.com/settings/user-api-keys)) with these scopes:
   - `insight:read`, `insight:write`
   - `dashboard:read`, `dashboard:write`
   - `feature_flag:read`, `feature_flag:write`
   - `action:read`, `action:write`
   - `endpoint:read`, `endpoint:write`
   - `event_definition:read`, `event_definition:write` (also covers property groups)
   - `experiment:read`, `experiment:write` (also covers experiment holdouts)
   - `experiment_saved_metric:read`, `experiment_saved_metric:write`
   - `subscription:read`, `subscription:write` (subscriptions reference insights/dashboards, so `insight:*` / `dashboard:*` above are also needed)

   Then add it (and your numeric project ID) to a `.env` (or `.envrc`) file:

   ```
   POSTHOG_PERSONAL_API_KEY=phx_...
   POSTHOG_PROJECT_ID=000000
   # POSTHOG_HOST=https://eu.posthog.com   # optional, defaults to us.posthog.com
   ```

   See `.envrc.example` in the repo for a copy-paste starting point.

2. **Write definitions** as `.ts` files under `posthog/`.
3. **Preview the plan** — diff your files against the live project, no writes:
   ```
   npx posthog-definitions apply --dry-run
   ```
4. **Apply** — create / update server resources to match:
   ```
   npx posthog-definitions apply
   ```
5. **Commit** the `.ts` files.

To bootstrap from an existing project, `npx posthog-definitions pull` writes definition files for the dashboards already on the server.

## Docs

See [`docs/README.md`](docs/README.md) for the SDK reference, the apply algorithm, the identity model, and the MVP roadmap.

## License

MIT
