# Risks and open questions

Block on these before committing to the MVP timeline. Each is a quick investigation, not a build task.

## R1 — Tags round-trip through dashboard/insight writes

**Question**: does `POST` / `PATCH` to `/api/projects/:id/dashboards/` accept a `tags` field and return it on subsequent `GET`?

**Why it matters**: the entire identity model assumes tags survive writes. If they don't, switch to a server-side `slug` field (requires a posthog change).

**Verification**: `curl` against a dev project; create with `tags: ["iac:dashboards:test"]`, fetch, compare.

**Status**: unverified.

## R2 — Tile-with-inline-insight create

**Question**: does the dashboard `create` endpoint accept `tiles: [{ insight: { name, query } }]` and create the nested insight, or must the insight be created first and then referenced by id?

**Why it matters**: changes the executor from one call per dashboard to two (insight create, then dashboard create that references it). Two-call is fine — just slower and more failure-prone.

**Verification**: read `DashboardSerializer.create` and `update` in `products/dashboards/backend/api/dashboard.py`. Try both shapes against a dev project.

**Status**: unverified. Assumption: two-call is required.

## R3 — Tag-based search

**Question**: can we filter dashboards and insights by tag via a query param (`?tags=iac:dashboards:*` or similar)?

**Why it matters**: if not, pagination + client-side filtering is the fallback. Works fine for small projects; gets slow past a few thousand resources.

**Verification**: check the list-endpoint query params in `posthog/api/dashboards/`.

**Status**: unverified.

## R4 — `posthog.schema` exposure

**Question**: are `TrendsQuery`, `FunnelsQuery`, `Node`, etc. published as a standalone TS package, or do they only exist inside the PostHog repo's frontend bundle?

**Why it matters**: if there's no published types package, we either vendor them into `@posthog/definitions` or stand up a new `@posthog/schema` package. Vendoring is faster; new package is more correct.

**Verification**: check `package.json` workspaces and what `hogli build:openapi` produces.

**Status**: unverified. Assumption: vendor for MVP, factor out later.

## R5 — Programmatic `tsx` loader

**Question**: can we load arbitrary user `.ts` files with path aliases at runtime without forcing the user to set up a build step?

**Why it matters**: the developer experience promise depends on `npx posthog-definitions apply` working with zero config. If `tsx` can't handle the user's tsconfig paths, we ship a worse first-run.

**Verification**: prototype against a sample Next.js repo with path aliases.

**Status**: unverified. Assumption: `tsx` works for the common cases; `--dir` flag handles edge cases.

## R6 — Personal API key scope

**Question**: which API key scope is needed for `dashboards:write` and `insights:write`? Are there project-level keys with finer-grained scopes than personal keys?

**Why it matters**: CI usage. Personal keys in CI is bad practice if avoidable.

**Verification**: check the API key scopes documentation and `posthog/api/personal_api_key.py`.

**Status**: unverified.

## R7 — Insight short_id vs numeric id

**Question**: dashboard tiles reference insights — by numeric `id`, by `short_id`, or either?

**Why it matters**: numeric ids are stable but ugly in URLs; short_ids are user-facing. Just need to pick the right one consistently.

**Verification**: read `DashboardTileSerializer` and a sample dashboard payload.

**Status**: unverified.

---

## Closing the risks

Each item is ~30 min of investigation. Total: half a day. If all come back green, the timeline in `mvp-roadmap.md` holds. If two or more come back red, add 2-3 days for workarounds.
