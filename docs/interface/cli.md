# CLI reference

## `posthog-definitions apply`

Synchronize the definitions in your repo to the configured PostHog project.

```
$ npx posthog-definitions apply [--dry-run] [--project <id>] [--dir <path>]
```

### Flags

| Flag | Default | Description |
|---|---|---|
| `--dry-run` | off | Print the diff without making API calls. |
| `--prune` | off | Delete IaC-tagged resources that no longer have a matching source file. Opt-in. Only touches resources tagged `iac:dashboards:*` / `iac:insights:*` — hand-built resources are never considered. |
| `--project <id>` | `$POSTHOG_PROJECT_ID` | Target project. |
| `--dir <path>` | `posthog/` | Directory to scan for definition files. |
| `--verbose` | off | Print each API call. |

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

| Code | Meaning |
|---|---|
| 0 | Apply succeeded; project state matches the definitions. |
| 1 | Validation failure; nothing was applied. |
| 2 | API failure mid-apply; partial state may exist on the server. |
| 3 | Authentication or configuration error; nothing was applied. |

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

Bootstrap a definitions directory by importing existing entities from a PostHog project. Useful for adopting `posthog-definitions` on a project that already has dashboards built in the UI.

```
$ npx posthog-definitions pull [--dry-run] [--kind <list>] [--project <id>] [--dir <path>]
```

### Flags

| Flag | Default | Description |
|---|---|---|
| `--kind <list>` | `dashboards` | Comma-separated entity kinds to pull. MVP supports `dashboards`. |
| `--dry-run` | off | Print which files would be written, but do not write anything. |
| `--project <id>` | `$POSTHOG_PROJECT_ID` | Source project. |
| `--dir <path>` | `posthog/` | Destination directory; files are written to `<dir>/<kind>/<slug>.ts`. |
| `--verbose` | off | Print each API call. |

### Behavior

1. **List** every entity of the requested kind in the project — not just `iac:*`-tagged ones.
2. **Fetch detail** for each (dashboard tiles, insight queries) so the generated file is self-contained.
3. **Codegen** a TypeScript file per dashboard with inline `insight(...)` declarations and `text(...)` tiles. Filename is the slugified dashboard name.
4. **Write** to `<dir>/dashboards/`. Existing files with the same name are overwritten — review with `git diff` before committing.

### Limitations

- Only `TrendsQuery` and `HogQLQuery` insights round-trip cleanly through the SDK helpers. Other query kinds are emitted as raw object literals with a cast and a warning — you'll need to edit them by hand.
- Insights are inlined per dashboard. Insights shared across multiple dashboards are duplicated; deduplication into shared `posthog/insights/*.ts` files is post-MVP.
- Buttons authored via the SDK `button(...)` helper round-trip as plain `text(...)` tiles (the server stores them as markdown).
- `pull` overwrites; it does not merge with hand edits.
