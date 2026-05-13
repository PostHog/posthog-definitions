# MVP roadmap

**Goal**: `npx posthog-definitions apply` synchronizes dashboards (with inline insights) from `posthog/dashboards/*.ts` to a single PostHog project.

**Success criterion**: a developer can write a dashboard file, run `apply`, and see it in the PostHog UI. Re-running is a no-op. Editing the file and re-running updates the dashboard.

## Cut scope — explicit non-goals for MVP

| Feature | Why deferred |
|---|---|
| `dev` watch mode | Useful but not required to prove the loop works. Add after `apply` is solid. |
| `pull` command | Requires the same diff logic in reverse; ship `apply` first. |
| Delete on removal | Risky default. Ship `--prune` later, opt-in only. |
| Multi-environment configs | One project per CLI invocation covers the common case via `--project`. |
| Feature flags, actions, cohorts | Different data models. Each is a separate sprint. |
| Query types beyond `trends` and `hogql` | Each is a typed wrapper, additive. Trends covers ~70% of demo cases. |
| Drift detection on UI edits | Strictly post-MVP; needs a UX decision. |
| Automated test suite | MVP verifies by running `apply` against a dev project. Backfill tests once the loop is shipping. |

## Sequenced plan

The order matters: each step unblocks the next. The order is also designed so that the riskiest unknowns are verified earliest.

### De-risk

Read-only investigation. No code yet.

1. **Verify tag round-trip.** Hit `POST /api/projects/:id/dashboards/` with a tag, then `GET`, confirm the tag comes back. Confirm `PATCH` preserves and updates tags.
2. **Verify nested tile write.** Confirm `DashboardSerializer.create` accepts the `tiles: [{ insight: {...} }]` shape and creates the insight inline, or whether we need a two-step (insight first, then dashboard).
3. **Verify tag-based search.** Confirm we can query dashboards/insights by tag prefix. If not, fall back to fetching all and filtering client-side.

These can also be verified inline during implementation by running `apply` against a dev project — the first real run is the test.

### Skeleton

4. **Repo scaffold**: `package.json`, `tsconfig.json`, `src/`, `bin/posthog-definitions`. Single package with both SDK and CLI exports.
5. **SDK types**: copy/derive `Dashboard`, `Insight`, `Tile`, `Layout` from this docs spec. Add `dashboard`, `insight`, `text` factory functions (bare nouns, no `define*` prefix). Pure, no I/O.
6. **API client**: hand-rolled minimal typed wrapper over the dashboards + insights endpoints. Swap for a generated client post-MVP if useful.

### Core loop

7. **Loader**: glob `posthog/**/*.ts`, import via `tsx` (programmatic), collect default exports, tag each with `path`.
8. **Validator**: required fields, unique keys per kind, layout bounds, tile non-emptiness.
9. **Differ**: pair desired vs current by tag. Emit ops: `{ kind: "create" | "update" | "unchanged"; resource: ...; payload?: ... }`.
10. **Executor**: serial HTTP calls in order (insights first, dashboards second), stop on first error. Re-check `iac:*` tag immediately before every write (safety guard).
11. **`apply` command wiring**: load → validate → diff → execute → report.

### Polish

12. **`--dry-run`**: short-circuit before any mutation, print the planned ops.
13. **`--verbose`**: log each call.
14. **Exit codes per spec**.

### Verification

Manual: run `apply` against a dev project with `.envrc`-loaded credentials. Confirm idempotence (second run = all unchanged), mutation (edit a field, re-run = one update), and the safety invariant (a hand-built dashboard alongside is untouched). Backfill automated tests after the first ship.

### Documentation and release

15. Update `docs/interface/getting-started.md` with real installation instructions.
16. Tag `v0.1.0`. Publish to npm under `@posthog/definitions` (private at first).
17. Announce in a small group; gather feedback before public release.

## Order-of-magnitude cost

Most expensive parts in descending order:

1. **API client correctness** — even hand-rolled, the dashboards endpoint has a lot of shape. Plan for some iteration against a real project.
2. **`tsx` programmatic loader** — loading user TS code at runtime has rough edges (path aliases, `node_modules` resolution).
3. **Differ correctness on `tiles`** — the trickiest data structure to compare. Order matters? Insight identity matters? Hash-based skip is the safety net.
4. **Everything else** — SDK types, CLI scaffold, executor — straightforward.

## Definition of done

- A new user can install, write `posthog/dashboards/foo.ts`, run `apply`, and see the dashboard in PostHog.
- Re-running with no changes prints `0 created, 0 updated, 1 unchanged`.
- Editing the file changes `1 unchanged` to `1 updated`.
- A hand-built dashboard in the same project is byte-identical before and after `apply` (safety invariant — verified manually against a dev project).
- Docs in this repo match the shipped behavior.
