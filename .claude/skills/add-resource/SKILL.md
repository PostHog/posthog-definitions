---
name: add-resource
description: Add support for a new PostHog resource type (feature flag, cohort, action, survey, annotation, alert, …) to posthog-definitions. Walks through the eight files that must change, the tag-based identity convention, the load/diff/execute pipeline wiring, and the non-negotiable safety invariant. Use when the user wants to extend posthog-definitions beyond dashboards and insights.
---

# Adding a new resource to posthog-definitions

This skill is the playbook for extending posthog-definitions with a new PostHog resource type. It covers the *what to change and why*, not the line-by-line code — copy the existing dashboard/insight pair as a reference and adapt.

## When to use

The user wants to manage a new PostHog resource as code, e.g.:

- "Let's add feature flags."
- "I want to define cohorts in TypeScript."
- "Add survey support to apply."

If the user only wants a one-off API call or a script, this is the wrong tool — this skill is for resources that should join the `load → validate → diff → execute` pipeline.

## Before you touch anything

Re-read these three files. The whole architecture is in them:

1. `docs/implementation/architecture.md` — the pipeline shape.
2. `docs/implementation/identity.md` — the tag-based identity rule.
3. `docs/implementation/apply.md` — load / diff / execute in detail.

Then read both existing implementations side by side. The insight implementation is the simpler one and is closer to what most new resources will look like:

- SDK: `src/sdk/insight.ts`, `src/sdk/types.ts` (the `Insight` type)
- Client: `src/client/insights.ts`
- Pipeline: relevant blocks in `src/apply/{load,validate,diff,serialize,execute,format-plan}.ts`

If the new resource has *references to other resources* (the way dashboards reference insights via tiles), study the dashboard pair as well — it shows the cross-resource id resolution pattern (`insightIdByKey`).

## The safety invariant (non-negotiable)

**The CLI must never read, modify, or delete a resource it did not tag.** Hand-built resources in the same project must be byte-identical before and after `apply`.

Two mechanisms enforce this — both must be replicated for the new resource:

1. **List filter.** `list<Resource>` only returns rows whose tags contain `iac:<resource>:<...>`. See `listManagedDashboards` in `src/client/dashboards.ts:37`.
2. **Pre-write assertion.** Before any `PATCH`, refetch the row and confirm its `iac:<resource>:<key>` tag is still there. If it's been removed (e.g. an operator stripped it in the UI), abort with `SafetyViolationError`. See `assertManagedDashboard` in `src/apply/execute.ts:129`.

If the resource's API has no `tags` field, this skill does not apply — bring it up with the user before proceeding. The whole identity model depends on writable tags.

## The eight files to change

For a hypothetical resource `Foo` (substitute the real noun), here is the surgery checklist. Order matters — earlier steps' types feed later ones.

| # | File | What changes |
|---|------|--------------|
| 1 | `src/sdk/types.ts` | Add the `Foo` user-facing type. |
| 2 | `src/sdk/foo.ts` (new) | Add the `foo(spec): Foo` factory helper. |
| 3 | `src/index.ts` | Re-export `foo` and the `Foo` type. |
| 4 | `src/client/foos.ts` (new) | Zod schema `ServerFooSchema` (with `ServerFoo` derived via `z.infer`) + `list/get/create/update` HTTP wrappers that `.parse()` every response, with `listManagedFoos` filtering by `iac:foos:` tag. |
| 5 | `src/apply/serialize.ts` | `fooTag(key)`, `fooKeyFromTags(tags)`, `fooPayload(spec, hash)` mirroring the insight versions. |
| 6 | `src/apply/load.ts` | Recognise `Foo` exports via `looksLikeFoo`, collect into `DesiredState.foos`. |
| 7 | `src/apply/validate.ts` | Validate required fields and unique keys for the `Foo` half of `DesiredState`. |
| 8 | `src/apply/diff.ts`, `src/apply/execute.ts`, `src/apply/format-plan.ts` | Add `FooOp`, the diff loop, the execute loop with `assertManagedFoo`, and a plan-render block. Wire into `src/cli/apply.ts` (load the server list, pass through, count it). |

### Identity tag

Pick a stable plural slug for the resource and use it everywhere:

- List filter: `tag.startsWith("iac:foos:")`
- Identity tag: `iac:foos:<key>`
- Hash tag (shared, do not duplicate): `iac:hash:<hex>`

Match the existing convention: lowercase, plural, colon-separated. The slug becomes part of every tagged record in the user's project, so it is effectively a public API — pick once, change never.

### API response validation with Zod

New resources must validate every response from the PostHog API with a Zod schema. The PostHog API is the only external boundary in this codebase and is the right place to fail loudly when the shape we expect drifts. Casting `JSON.parse(text) as ServerFoo` (what the existing dashboard/insight client does, see `src/client/http.ts:139`) is the *legacy* path — do not extend it. Eventually those will be migrated; new resources start on the validated path.

If `zod` is not yet in `package.json`, add it: `pnpm add zod`. One-time cost for the first resource that adopts this.

Pattern for `src/client/foos.ts`:

```ts
import { z } from "zod";

export const ServerFooSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  // … only the fields posthog-definitions actually reads
}).passthrough();

export type ServerFoo = z.infer<typeof ServerFooSchema>;

const PaginatedFooSchema = z.object({
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ServerFooSchema),
});
```

Then in every wrapper, `.parse()` the response before returning. A failure surfaces as a `ZodError` with a precise path into the payload, which is what you want for "the API changed shape" debugging.

Rules of thumb:

- **Use `.passthrough()` on the root object.** The PostHog API returns dozens of fields per resource; only schema the ones posthog-definitions reads. `.passthrough()` keeps unknown fields without making them part of the type.
- **Be strict on the fields you *do* read.** No `z.unknown()` or `z.any()` for those — that defeats the whole point.
- **Mirror server nullability faithfully.** PostHog often returns `null` rather than omitting a field. Use `.nullable()` (allows `null`) vs `.optional()` (allows missing) deliberately — they mean different things on the wire.
- **No defaults that mask bugs.** Use `.default([])` only when the API genuinely may omit the field; otherwise let the parse fail.
- **Parse, don't `safeParse` in the happy path.** A schema failure is a bug (ours or PostHog's), not a recoverable runtime condition. Let it throw; the CLI's existing error handling will surface it.
- **Inline-validate the paginated wrapper too.** `paginate<T>` in `src/client/http.ts:257` currently casts — wrap it for new resources by parsing the page schema at the call site.

What *not* to schema:

- Outgoing request bodies. They are constructed from typed `Foo` specs we already control; Zod adds nothing.
- Response fields posthog-definitions never reads. Keeping them in `.passthrough()` is enough.

### Hashing

Reuse `specHash` from `src/apply/hash.ts:14` on a canonical projection of the desired spec. The projection must:

- Include every field the API round-trips.
- Exclude server-only fields (`id`, `created_at`, …).
- Exclude managed tags (the `iac:*` ones) — they are not user-authored.
- Be stable under key reordering (the hash function canonicalises, but don't rely on it for arrays of objects — sort by a stable key if order is irrelevant).

If hashing misses a field, that field will silently fail to sync on update. If it includes a server-generated field, every apply will be marked dirty. The dashboard implementation in `dashboardSpecForHash` at `src/apply/diff.ts:88` is the canonical example.

### Cross-resource references

If `Foo` references another resource by key (e.g. a survey references a feature flag), do **not** include the referenced server id in the hash — it is environment-specific. Include the *key* and resolve to the id at execute time, the way dashboards resolve insight ids via `insightIdByKey` in `src/apply/execute.ts:58`.

Plan the execute ordering: dependencies must be created before dependents. The simplest model is two passes: create all `Foo`s first if other resources reference them, then move on.

## Validation

Replicate the insight-style checks in `src/apply/validate.ts`:

- `key` is required and unique.
- `name` is required.
- Any resource-specific invariants (e.g. survey must have at least one question).
- Cross-resource references resolve.

Push every error into `issues` and throw `ValidationError` at the end — do not bail on the first. The CLI shows all problems at once.

## Plan rendering

In `src/apply/format-plan.ts`, add:

- A `display<Foo>` and `display<Foo>FromServer` pair that returns a `DisplayValue` tree.
- A `renderFooOp` matching `renderInsightOp` / `renderDashboardOp`.
- A line in `formatPlan` for the per-resource summary counts.
- Optional: orphan rendering for `Foo`s that exist on the server but not in code.

The shape that comes out of `display<Foo>FromServer` must match `display<Foo>` (same field order, same value coercions), otherwise the diff renderer will show spurious changes on `unchanged` rows.

## CLI wiring

In `src/cli/apply.ts`:

1. Fetch the server list in parallel with the existing ones (`Promise.all`).
2. Pass `foos` through to `diff()`.
3. Include the count in the "Loaded N foo(s)" log line.
4. Add `summary.foosCreated/Updated/Unchanged` to the "Applied:" summary.

## Verification (manual, ship-fast)

Per project convention, do not write a test suite for the new resource. Verify against the dev project:

1. `pnpm typecheck` — must pass.
2. Add an example file under `examples/` exercising the new resource.
3. `npx posthog-definitions apply --dry-run` against the dev project. Inspect the plan output: counts make sense, no spurious diffs, no orphan listing of hand-built resources.
4. `npx posthog-definitions apply`. Confirm the resource appears in the PostHog UI with the `iac:foos:<key>` and `iac:hash:<hex>` tags.
5. Run `apply` again with no changes. The plan must show `0 to create · 0 to update · N unchanged` for the new resource. **If even one row is "to update" on a no-op apply, the hash projection is wrong** — fix it before moving on.
6. Edit the spec, re-apply. Confirm an `update` op.
7. Delete the spec file, re-apply. Confirm the resource appears as an *orphan* (left alone, not deleted — MVP doesn't do deletes).
8. Manually create a *hand-built* `Foo` in the UI without any `iac:` tags. Re-apply. Confirm the hand-built one is untouched.

The last step is the safety invariant smoke test. Do not skip it.

## Update the support matrix

After the resource ships, flip its row from ❌ to ✅ in `docs/resources.md`.

## Out-of-scope (do not bundle in)

- **Deletes.** MVP intentionally does not delete server resources. Orphans are listed in the plan but never removed.
- **Multi-environment.** One project per `apply` run.
- **State files.** Identity lives in tags on the server, not on disk.
- **`dev` / `pull` commands.** Out of MVP scope.

If the resource needs any of these, raise it with the user before writing code — they are roadmap items, not free additions.
