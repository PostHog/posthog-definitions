# CLI reference

## `posthog-definitions apply`

Synchronize the definitions in your repo to the configured PostHog project.

```
$ npx posthog-definitions apply [--dry-run] [--project <id>] [--dir <path>]
```

### Flags

| Flag             | Default               | Description                                                                                                                                                                     |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--dry-run`      | off                   | Print the diff without making API calls.                                                                                                                                        |
| `--prune`        | off                   | Delete IaC-managed resources that no longer have a matching source file. Opt-in. Only touches resources carrying an `iac:*` marker — hand-built resources are never considered. |
| `--project <id>` | `$POSTHOG_PROJECT_ID` | Target project.                                                                                                                                                                 |
| `--dir <path>`   | `posthog/`            | Directory to scan for definition files.                                                                                                                                         |
| `--verbose`      | off                   | Print each API call.                                                                                                                                                            |

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

Pass `--prune` to delete the orphans (only ones carrying an `iac:*` marker; hand-built resources stay untouched). Order: orphan dashboards are deleted first (to drop tile references), then orphan insights. The same `iac:*` tag re-check that gates `PATCH` also gates each `DELETE`.

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

Every resource kind `apply` supports is pullable, except **actions**, which has no codegen yet. See
[`resources.md`](../resources.md) for the full per-resource support matrix.

| Kind                     | `--kind` value             | Notes                                                                                |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| Dashboards               | `dashboards`               | Tile insights are written to `insights/` and imported; `text(...)` tiles are inline. |
| Insights                 | `insights`                 | See the query-kind limitation below.                                                 |
| Feature flags            | `feature-flags`            | Release conditions, experience continuity, evaluation runtime, bucketing identifier. |
| Cohorts                  | `cohorts`                  | Property-filter and static cohorts. Query-based (HogQL) cohorts are skipped.         |
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
   preselected. `--all-rows` skips the prompt. Project settings is a singleton, so it has no prompt.
   Dashboards, insights, cohorts, and feature flags drop soft-deleted rows before the prompt; the
   other kinds do not, so a soft-deleted experiment or endpoint can still appear.
3. **Fetch detail** for each selection, so the next step sees the full row.
4. **Cascade** to referenced resources, unless `--no-cascade` — pulling a dashboard also pulls its
   tile-insights, and pulling an experiment also pulls its feature flag, its holdout, and its saved
   metrics. References are deduplicated, so an insight on two dashboards is pulled once.
5. **Codegen** one TypeScript file per row, named after the slugified key or name.
6. **Write** to `<dir>/<kind>/`. Existing files with the same name are overwritten — review with
   `git diff` before committing.
7. **Mark** each pulled resource on the server with its `iac:*` identity marker, so a later
   `apply` recognizes it as managed rather than creating a duplicate. Most kinds use a tag; cohorts
   and experiments use a marker in the description, because they have no tags field. `--dry-run`
   skips this step, along with the writes.

### Feature flag coverage

A pulled flag carries `key`, `name`, `active`, and the full release conditions (`filters`), plus
`ensure_experience_continuity`, `is_remote_configuration`, `evaluation_runtime`,
`bucketing_identifier`, and any non-`iac:` tags. `evaluation_runtime` and `bucketing_identifier`
are omitted when they hold their default value, and the other optional fields are omitted when
unset.

Flags with `has_encrypted_payloads` are still written, with a warning: `posthog-definitions` does
not manage encrypted payloads, so review those files by hand.

### Limitations

- Only `TrendsQuery`, `FunnelsQuery`, and `HogQLQuery` insights round-trip cleanly through the SDK
  helpers. Other query kinds are emitted as raw object literals with a cast and a warning — you
  will need to edit them by hand.
- Buttons authored via the SDK `button(...)` helper round-trip as plain `text(...)` tiles (the
  server stores them as markdown).
- Static cohort membership is not pulled — `apply` recreates the cohort container, not its members.
- Query-based (HogQL) cohorts are skipped: the pulled row carries no query, so there is nothing to
  render.
- A feature flag's release conditions are written verbatim, including any referenced cohort's
  numeric ID. Those IDs are project-specific, so review them before applying the file to a
  different project.
- Actions are not pullable — they have no codegen yet.
- `pull` overwrites; it does not merge with hand edits.
