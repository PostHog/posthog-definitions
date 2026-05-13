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
| Code generation for callers (typed flag keys) | Only relevant once flags ship. |
| Preview environments per branch | Requires server-side support for cheap project creation. |

## Sequenced plan

The order matters: each step unblocks the next. The order is also designed so that the riskiest unknowns are verified earliest.

### Day 1 — De-risk

Read-only investigation. No code yet.

1. **Verify tag round-trip.** Hit `POST /api/projects/:id/dashboards/` with a tag, then `GET`, confirm the tag comes back. Confirm `PATCH` preserves and updates tags.
2. **Verify nested tile write.** Confirm `DashboardSerializer.create` accepts the `tiles: [{ insight: {...} }]` shape and creates the insight inline, or whether we need a two-step (insight first, then dashboard).
3. **Verify tag-based search.** Confirm we can query dashboards/insights by tag prefix. If not, fall back to fetching all and filtering client-side.

Output: a short note in [`risks.md`](risks.md) marking each item ✅/❌ with the API responses.

### Day 2-3 — Skeleton

4. **Repo scaffold**: `package.json`, `tsconfig.json`, `src/`, `bin/posthog-definitions`. Single package with both SDK and CLI exports.
5. **SDK types**: copy/derive `Dashboard`, `Insight`, `Tile`, `Layout` from this docs spec. Add `dashboard`, `insight`, `text` factory functions (bare nouns, no `define*` prefix). Pure, no I/O.
6. **API client**: generate typed client from PostHog's OpenAPI spec. Pin to the endpoints we use (dashboards, insights). No hand-rolled fetch.

### Day 4-5 — Core loop

7. **Loader**: glob `posthog/**/*.ts`, import via `tsx` (programmatic), collect default exports, tag each with `path`.
8. **Validator**: required fields, unique keys per kind, layout bounds, tile non-emptiness.
9. **Differ**: pair desired vs current by tag. Emit ops: `{ kind: "create" | "update" | "unchanged"; resource: ...; payload?: ... }`.
10. **Executor**: serial HTTP calls in order (insights first, dashboards second), stop on first error.
11. **`apply` command wiring**: load → validate → diff → execute → report.

### Day 6 — Polish

12. **`--dry-run`**: short-circuit before any mutation, print the planned ops.
13. **`--verbose`**: log each call.
14. **Exit codes per spec**.
15. **Smoke tests against staging**:
    - **a. Coexistence test (mandatory).** Pre-populate the staging project with 3 hand-built dashboards and 3 hand-built insights (no `iac:*` tags). Run `apply` with one IaC-managed dashboard. Verify: the 3 hand-built dashboards and 3 hand-built insights are byte-identical before and after (compare via API GETs). This is the [safety invariant](apply.md#safety-invariant--this-is-the-rule-everything-else-serves) check. If this fails, the build does not ship.
    - **b. Idempotence test.** Run `apply` twice with no source changes. Second run reports `0 created, 0 updated, N unchanged`.
    - **c. Mutation test.** Edit the source file. Re-run. Verify exactly one resource updated; everything else untouched.
    - **d. Tag-strip test.** Manually remove the `iac:dashboards:<key>` tag from a managed dashboard in the UI. Re-run `apply`. Verify the CLI refuses to write to that resource (executor-layer guard) and exits non-zero.

### Day 7 — Documentation and release

16. Update `docs/interface/getting-started.md` with real installation instructions.
17. Tag `v0.1.0`. Publish to npm under `@posthog/definitions` (private at first).
18. Announce in a small group; gather feedback before public release.

**Total estimate: 5-7 working days for one engineer**, assuming the Day 1 investigation comes back clean. Add 2-3 days of slack if any Day 1 item turns up red.

## Order-of-magnitude cost

Most expensive parts in descending order:

1. **API client correctness** — the OpenAPI spec covers a lot of surface and not every endpoint is well-typed. Plan for some hand-editing.
2. **`tsx` programmatic loader** — loading user TS code at runtime has rough edges (path aliases, `node_modules` resolution). Budget time.
3. **Differ correctness on `tiles`** — the trickiest data structure to compare. Order matters? Insight identity matters? Hash-based skip is the safety net.
4. **Everything else** — SDK types, CLI scaffold, executor — straightforward.

## Definition of done

- A new user can install, write `posthog/dashboards/foo.ts`, run `apply`, and see the dashboard in PostHog.
- Re-running with no changes prints `0 created, 0 updated, 1 unchanged`.
- Editing the file changes `1 unchanged` to `1 updated`.
- CI can run `apply --dry-run` against a real project and exit 0.
- **Day 6 smoke test 15a (coexistence) passes**: hand-built dashboards/insights in the same project are byte-identical before and after `apply`.
- Docs in this repo match the shipped behavior.
