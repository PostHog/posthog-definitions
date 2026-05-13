# `apply` algorithm

## Safety invariant — this is the rule everything else serves

**The CLI must never create, update, or delete a resource it did not create.**

A resource is "ours" iff it carries an `iac:dashboards:<key>` or `iac:insights:<key>` tag that we wrote. Everything without such a tag is invisible to the CLI: not fetched into the working set, not compared, not warned about, not deleted. A user can have 500 hand-built dashboards in the same project and `apply` will leave every one of them alone.

This rule is enforced at three layers, so any single bug doesn't break it:

1. **List queries are tag-scoped.** The CLI fetches dashboards and insights with `?tags__contains=iac:` (or client-side filter as a fallback per [R3](risks.md)). Non-tagged resources never enter the working set.
2. **The differ has no "delete unmatched" branch in MVP.** Even an `iac:*`-tagged orphan is warned, not deleted. A non-tagged resource is impossible to reach because of (1).
3. **The executor refuses to write to a resource without an `iac:*` tag.** A final guard before every `PATCH` / `DELETE` call: re-fetch the target, assert the tag is present, abort if not. Belt-and-suspenders against a bug in (1) or (2).

If the executor ever sees a target that lacks the tag, it stops with exit 2 and reports the resource id — interpreted as evidence of a bug or a race (someone removed the tag in the UI between fetch and write).

This guarantee is the first thing the MVP smoke test verifies (see [`mvp-roadmap.md`](mvp-roadmap.md) Day 6).

## Inputs

- `desired`: `{ dashboards: Dashboard[]; insights: Insight[] }` from user files.
- `current`: `{ dashboards: ServerDashboard[]; insights: ServerInsight[] }` from API, filtered by `iac:*` tag.

## Pairing

Pair desired and current by `key`:

```
for each desired insight:
  if a current insight has tag iac:insights:<key>: pair → maybe-update
  else: create

for each desired dashboard:
  if a current dashboard has tag iac:dashboards:<key>: pair → maybe-update
  else: create

for each current iac:* resource with no desired counterpart:
  flag as orphan (MVP: warn only, do not delete)

# non-iac resources are filtered out at fetch time and never reach this loop
```

## "Unchanged" detection

Compute a canonical hash of the desired spec (sorted keys, normalized whitespace). Compare to a hash stored in a tag on the resource (`iac:hash:<sha256-prefix>`). If equal, skip the API call.

Without the hash, every `apply` would rewrite every resource. The hash is the only optimization in the MVP — drop it if it adds complexity.

## Execution order

1. **Insights first.** Dashboards reference insights by id; the dashboard write needs the insight id to exist.
2. **Dashboards next.** Create or update with full `tiles[]` payload.
3. **Tile diffs are part of the dashboard update.** `DashboardSerializer` accepts a `tiles` array; we send the full desired set every time. The server reconciles.

## Error handling

- **Validation error before any call**: exit 1, nothing on the server changed.
- **First HTTP failure**: stop. Report which resources were applied and which weren't. Exit 2.
- **Partial state**: the next `apply` re-pairs by tag and retries the un-applied ops. The idempotent pairing means partial state is recoverable.

No transactions, no rollback. The atomic unit is a single resource.

## Concurrency

Single-threaded sequential calls. Dashboards have side effects (filters_hash caching, signals); parallel writes are not worth the complexity at MVP scale.

## What we send to the API

### Insight (create or PATCH)

```jsonc
POST /api/projects/:id/insights/
{
  "name": "Weekly signups",
  "description": null,
  "query": { "kind": "InsightVizNode", "source": {...} },
  "tags": ["iac:insights:weekly-signups", "iac:hash:abc123..."]
}
```

### Dashboard (create or PATCH)

```jsonc
POST /api/projects/:id/dashboards/
{
  "name": "Growth",
  "description": "...",
  "pinned": true,
  "tags": ["iac:dashboards:growth", "iac:hash:def456...", "growth", "iac"],
  "restriction_level": 21,
  "tiles": [
    { "insight": { "id": 9182 }, "layouts": { "sm": {...}, "lg": {...} } },
    { "text":    { "body": "..." }, "layouts": {...} }
  ]
}
```

### Pairing query

```
GET /api/projects/:id/dashboards/?search=iac:dashboards:
GET /api/projects/:id/insights/?search=iac:insights:
```

(Or whichever filter the existing API supports for tags. To verify on Day 1.)
