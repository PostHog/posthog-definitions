# posthog-definitions

> [!WARNING]
> **Alpha — do not use in production.**
> This is alpha software. The CLI, the on-disk file format, the SDK surface, and the identity model are all subject to breaking changes without notice. Use it on throwaway projects or in a sandbox while we stabilize.

Infrastructure-as-code for PostHog. Define dashboards, insights, feature flags, cohorts, actions, endpoints, event definitions, property groups, experiments, experiment holdouts, experiment saved metrics, and project settings in TypeScript, then sync them to a PostHog project with one command.

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
   - `cohort:read`, `cohort:write`
   - `project:read`, `project:write` (only if you sync project settings)

   You only need the scopes for the resource kinds you actually sync.

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

## Bootstrap from an existing project

`npx posthog-definitions pull` writes definition files for resources that already exist on the
server, so you do not hand-write them. It covers every resource kind `apply` can sync except
actions — including feature flags, cohorts, experiments, and project settings. The `--kind` value
for each is the kebab-case plural of the kind name (`feature-flags`, `event-definitions`, ...); see
[CLI reference § Pullable kinds](docs/interface/cli.md#pullable-kinds) for the full list.

`pull` is interactive by default: it lists the rows of each kind and you pick the ones to import.
Pass `--all-rows` to take every row, which is also required when stdin is not a terminal (CI).

```
# Pick the flags to import, interactively
npx posthog-definitions pull --kind feature-flags

# Take everything, no prompts
npx posthog-definitions pull --all --all-rows
```

For feature flags the generated file carries the full release conditions plus the flag's rollout
settings — see [CLI reference § Feature flag coverage](docs/interface/cli.md#feature-flag-coverage)
for the field list, the encrypted-payload caveat, and the current limitations.

## Two regions, one source of truth

If you run both a US and an EU project, keep one set of definition files and apply it to each
region. `pull` from whichever region is already set up, then `apply` to both.

```
# 1. Bootstrap the files from the project you already built out
POSTHOG_HOST=https://us.posthog.com \
POSTHOG_PERSONAL_API_KEY=phx_us_key \
POSTHOG_PROJECT_ID=11111 \
  npx posthog-definitions pull --kind feature-flags

# 2. Review the plan against the other region before writing anything
POSTHOG_HOST=https://eu.posthog.com \
POSTHOG_PERSONAL_API_KEY=phx_eu_key \
POSTHOG_PROJECT_ID=22222 \
  npx posthog-definitions apply --dry-run

# 3. Apply, once per region. --host and --project avoid re-exporting env vars
npx posthog-definitions apply --host https://us.posthog.com --project 11111
npx posthog-definitions apply --host https://eu.posthog.com --project 22222
```

Each region needs its own personal API key, because a key is valid only on the host that issued it
— so step 3 still needs `POSTHOG_PERSONAL_API_KEY` set to the key for the region it targets. The
key has no CLI flag, by design, to keep it out of shell history.

> [!WARNING]
> **Cohort-backed release conditions do not transfer.** A pulled flag carries its `filters`
> verbatim, including the numeric cohort ID from the source project. Nothing remaps that ID, so
> applying the file to a second project either fails or silently targets whatever cohort holds the
> same ID there. Edit those conditions by hand after pulling, and check the plan with `--dry-run`
> before you apply.

Also worth knowing:

- **Pull the cohorts too.** A flag that references a cohort needs that cohort to exist in the target
  project, so include `--kind cohorts` when you bootstrap.
- **Static cohort membership does not transfer.** `apply` creates the cohort, but the member list is
  managed out-of-band, so a static cohort arrives empty in the second project.

## Compared to the Terraform provider

PostHog also has a [Terraform provider](https://registry.terraform.io/providers/posthog/posthog/latest/docs),
which manages feature flags too, along with a wider surface than this package: access control,
roles, project members, hog functions, alerts, and proxy records. If your team already runs
Terraform, the provider is the better fit — use it.

Pick `posthog-definitions` when you want the definitions to live in your application repo, in the
same language as the code that emits the events:

- **TypeScript, not HCL.** Queries are built with typed helpers (`trends(...)`, `funnels(...)`), so
  a bad property name is a compile error rather than a failed apply.
- **No state file.** Identity comes from `iac:*` markers on the resources themselves, so there is
  no state to store, lock, or lose. Two clones of the repo converge on the same project.
- **Typed event capture.** Event definitions and property groups feed `createTypedPostHog`, which
  type-checks `.capture(name, properties)` against the same specs you sync.
- **Dashboards and their tiles are authored together.** One `dashboard(...)` call declares the
  layout and the insights it shows, rather than a graph of resource references.

The two do not share state and both only touch resources they own, so adopting one does not
migrate the other. Do not manage the same resource with both.

## Docs

See [`docs/README.md`](docs/README.md) for the SDK reference, the apply algorithm, the identity model, and the MVP roadmap.

## License

MIT
