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

### What `apply` does **not** do (MVP scope)

- **No delete.** Removing a definition file does not delete the dashboard. Use the UI or API to delete. (Tracked: post-MVP `apply --prune`.)
- **No watch mode.** `apply` is one-shot. (Tracked: post-MVP `posthog-definitions dev`.)
- **No pull.** Existing UI-created dashboards are not imported. (Tracked: post-MVP `posthog-definitions pull`.)
- **No environments.** Single project per run. Multi-env via separate `--project` calls.

See [`implementation/mvp-roadmap.md`](../implementation/mvp-roadmap.md) for the full cut-scope rationale.
