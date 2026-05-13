# Identity: `key` → server resource

## The problem

Each dashboard in code has a stable `key`. Each dashboard on the server has a numeric `id`. The CLI needs to map between them every time it runs, with no client-side state file.

## Solution: tag on the resource

When the CLI creates a dashboard, it sets a tag of the form `iac:dashboards:<key>`. On subsequent runs the CLI fetches all dashboards with `iac:dashboards:*` tags and uses them to resolve the mapping.

```
                                        server
┌────────────────────────┐
│ key: "growth"          │      ┌─────────────────────────────┐
│ name: "Growth"         │ ───→ │ id: 4218                    │
│ tiles: [...]           │      │ name: "Growth"              │
└────────────────────────┘      │ tags: ["iac:dashboards:     │
                                │        growth","growth"]    │
                                └─────────────────────────────┘
```

Same approach for insights, keyed by `iac:insights:<key>`.

## Why a tag and not a separate field

PostHog dashboards already have tags as a first-class concept. Reusing them avoids:
- A schema migration (no new column).
- A versioning question (no new field to maintain compatibility around).
- A new endpoint (existing tag filtering works).

Cost: users see `iac:dashboards:growth` in the UI tag list. We can hide tags starting with `iac:` in the UI as a follow-up.

## Why not the dashboard name

Names are user-editable in the UI and not unique. Tag is more durable.

## Why not a slug field

We could ask the dashboard endpoint to accept an optional `slug` field. Cleaner long-term, but requires a server change and waiting for it to ship. Tag-based identity works today.

## Renames

Renaming `key` in code is destructive — the CLI sees a "new" key and orphans the old resource.

MVP behavior: **refuse to apply if a dashboard has a tag matching `iac:dashboards:*` but the corresponding code file is gone.** This catches accidental key renames. A `--rename old:new` flag lifts the block by retagging.

## Verifying the tag survives writes

**Risk to verify Day 1 of the MVP**: confirm that tags pass through the dashboard `create` / `partial_update` endpoints round-trip, with PostHog's tagged-item model. The dashboard serializer mixes in `TaggedItemSerializerMixin` — confirm via a manual API call before building further.
