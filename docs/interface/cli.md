# CLI reference

## `posthog-definitions apply`

Synchronize the definitions in your repo to the configured PostHog project.

```
$ npx posthog-definitions apply [--dry-run] [--project <id>] [--dir <path>]
```

### Flags

| Flag             | Default               | Description                                                                                                                                                                                      |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--dry-run`      | off                   | Print the diff without making API calls.                                                                                                                                                         |
| `--prune`        | off                   | Delete IaC-tagged resources that no longer have a matching source file. Opt-in. Only touches resources tagged `iac:dashboards:*` / `iac:insights:*` — hand-built resources are never considered. |
| `--project <id>` | `$POSTHOG_PROJECT_ID` | Target project.                                                                                                                                                                                  |
| `--dir <path>`   | `posthog/`            | Directory to scan for definition files.                                                                                                                                                          |
| `--verbose`      | off                   | Print each API call.                                                                                                                                                                             |

### Behavior

1. **Discover** — glob `<dir>/**/*.ts`, load each via the TS runtime, collect default exports.
2. **Validate** — see [SDK reference § Validation](sdk.md#validation).
3. **Diff** — fetch the project's current state and compare to the desired state.
4. **Execute** — apply the diff via the PostHog REST API in the order:
   1. Create/update insights (dashboards reference them).
   2. Create/update dashboards.
   3. Update dashboard tiles to current insights and layouts.
5. **Report** — print a summary: created / updated / unchanged counts and any errors.

### Exit codes

| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------- |
| 0    | Apply succeeded; project state matches the definitions.       |
| 1    | Validation failure; nothing was applied.                      |
| 2    | API failure mid-apply; partial state may exist on the server. |
| 3    | Authentication or configuration error; nothing was applied.   |

### Idempotence

Re-running `apply` with no source changes is a no-op — every resource is "unchanged."

### Delete behavior

By default `apply` never deletes anything — removing a definition file leaves the previously-managed resource on the server, where it surfaces as an "orphan" in the plan output.

Pass `--prune` to delete the orphans (only ones tagged `iac:dashboards:*` / `iac:insights:*`; hand-built resources stay untouched). Order: orphan dashboards are deleted first (to drop tile references), then orphan insights. The same `iac:*` tag re-check that gates `PATCH` also gates each `DELETE`.

### What `apply` does **not** do (MVP scope)

- **No watch mode.** `apply` is one-shot. (Tracked: post-MVP `posthog-definitions dev`.)
- **No environments.** Single project per run. Multi-env via separate `--project` calls.

See [`implementation/mvp-roadmap.md`](../implementation/mvp-roadmap.md) for the full cut-scope rationale.

## `posthog-definitions pull`

Bootstrap a definitions directory by importing existing entities from a PostHog project. Useful for
adopting `posthog-definitions` on a project that was built out in the UI, and for copying a setup
into a second project or region.

```
$ npx posthog-definitions pull [--kind <list>] [--all] [--all-rows] [--no-cascade]
                               [--dry-run] [--project <id>] [--host <url>] [--dir <path>]
                               [--json] [--verbose]
```

### Flags

| Flag             | Default               | Description                                                                                  |
| ---------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| `--kind <list>`  | every pullable kind   | Comma-separated resource kinds to pull. An unknown kind fails with the list of valid ones.   |
| `--all`          | off                   | Pull every pullable kind. Same as omitting `--kind`.                                         |
| `--all-rows`     | off                   | Skip the interactive picker and import every row. Required when stdin is not a TTY.          |
| `--no-cascade`   | off                   | Do not follow cross-resource references (a dashboard's tile-insights, an experiment's flag). |
| `--dry-run`      | off                   | Print which files would be written, but do not write anything.                               |
| `--project <id>` | `$POSTHOG_PROJECT_ID` | Source project.                                                                              |
| `--host <url>`   | `$POSTHOG_HOST`       | Source host. Use to pull from a different region.                                            |
| `--dir <path>`   | `posthog/`            | Destination directory; files are written to `<dir>/<kind>/<slug>.ts`.                        |
| `--json`         | off                   | Emit the result as JSON instead of prose.                                                    |
| `--verbose`      | off                   | Print each API call.                                                                         |

### Pullable kinds

Every resource kind `apply` supports is pullable, except **actions**, which has no codegen yet.

| Kind                     | `--kind` value             | Notes                                                                                |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| Dashboards               | `dashboards`               | Tiles are inlined as `insight(...)` and `text(...)` declarations.                    |
| Insights                 | `insights`                 | See the query-kind limitation below.                                                 |
| Feature flags            | `feature-flags`            | Release conditions, experience continuity, evaluation runtime, bucketing identifier. |
| Cohorts                  | `cohorts`                  | Behavioral, HogQL, and static cohorts. Static membership is not pulled.              |
| Endpoints                | `endpoints`                |                                                                                      |
| Event definitions        | `event-definitions`        | Cascades to the property groups it references.                                       |
| Property groups          | `property-groups`          |                                                                                      |
| Experiments              | `experiments`              | Cascades to the flag, holdout, and saved metrics.                                    |
| Experiment holdouts      | `experiment-holdouts`      |                                                                                      |
| Experiment saved metrics | `experiment-saved-metrics` |                                                                                      |
| Project settings         | `project-settings`         | Singleton — one block, no row picker.                                                |

### Behavior

1. **List** every entity of each requested kind in the project — not just `iac:*`-tagged ones.
2. **Select** rows. `pull` prompts with a searchable multi-select per kind, with everything
   preselected. `--all-rows` skips the prompt. Deleted rows are filtered out before the prompt.
3. **Cascade** to referenced resources, unless `--no-cascade` — pulling a dashboard also pulls its
   tile-insights, and pulling an experiment also pulls its feature flag, its holdout, and its saved
   metrics.
4. **Fetch detail** for each selection so the generated file is self-contained.
5. **Codegen** one TypeScript file per row, named after the slugified key or name.
6. **Write** to `<dir>/<kind>/`. Existing files with the same name are overwritten — review with
   `git diff` before committing.
7. **Tag** each pulled resource on the server with its `iac:*` identity tag, so a later `apply`
   recognizes it as managed rather than creating a duplicate. `--dry-run` skips this.

### Feature flag coverage

A pulled flag carries `key`, `name`, `active`, and the full release conditions (`filters`), plus
`ensure_experience_continuity`, `is_remote_configuration`, `evaluation_runtime`,
`bucketing_identifier`, and any non-`iac:` tags. Fields left at their server default are omitted
rather than written out.

Flags with `has_encrypted_payloads` are still written, with a warning: `posthog-definitions` does
not manage encrypted payloads, so review those files by hand.

### Limitations

- Only `TrendsQuery`, `FunnelsQuery`, and `HogQLQuery` insights round-trip cleanly through the SDK
  helpers. Other query kinds are emitted as raw object literals with a cast and a warning — you
  will need to edit them by hand.
- Insights are inlined per dashboard. Insights shared across multiple dashboards are duplicated;
  deduplication into shared `posthog/insights/*.ts` files is post-MVP.
- Buttons authored via the SDK `button(...)` helper round-trip as plain `text(...)` tiles (the
  server stores them as markdown).
- Static cohort membership is not pulled — `apply` recreates the cohort container, not its members.
- `pull` overwrites; it does not merge with hand edits.
