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

## Directory layout for a new resource

Each new resource lives in its own self-contained directory under `src/resources/<resource>/`. The directory is the unit of contribution: everything a reviewer needs to understand the resource is co-located, and the generic pipeline (under `src/apply/`) is the only thing that depends on it.

```
src/resources/foo/
├── sdk.ts               user-facing factory + the Foo type
├── client.ts            ServerFooSchema (Zod) + list/get/create/update wrappers
├── pipeline.ts          serialize, validate, diff, execute, format — pipeline plumbing
├── pipeline.test.ts     hash determinism, diff op selection, safety invariant
├── client.test.ts       Zod schema parses real fixtures (only if non-trivial shape)
└── index.ts             public surface + registration object for the pipeline
```

For a hypothetical resource `Foo` (substitute the real noun), here is the per-file content. Order matters — earlier files' types feed later ones.

| # | File | What it contains |
|---|------|------------------|
| 1 | `src/resources/foo/sdk.ts` | The `Foo` user-facing type and the `foo(spec): Foo` factory helper. |
| 2 | `src/resources/foo/client.ts` | `ServerFooSchema` (Zod, with `ServerFoo` derived via `z.infer`) + `list/get/create/update` HTTP wrappers that `.parse()` every response. `listManagedFoos` filters by `iac:foos:` tag. |
| 3 | `src/resources/foo/pipeline.ts` | `fooTag(key)`, `fooKeyFromTags(tags)`, `fooPayload(spec, hash)`, `validateFoos`, `FooOp` union, `diffFoos`, `fooPayloadHash`, `runFooOp` with `assertManagedFoo`, `renderFooOp` for plan output. |
| 4 | `src/resources/foo/index.ts` | Re-export `foo` and `Foo` for users; export a `fooResource` registration object that the generic pipeline picks up. |
| 5 | `src/resources/index.ts` | Add `fooResource` to the `RESOURCES` array. |
| 6 | `src/index.ts` | Re-export `foo` and the `Foo` type for SDK users. |

Truly cross-resource types (`Layout`, `Filters`, the query node types) stay in `src/sdk/types.ts`. Generic pipeline orchestration (hash, file load, the apply driver) stays in `src/apply/`. The CLI does not change — it iterates the registry.

**Legacy note.** Dashboards and insights still live in the flat layout — `src/sdk/{dashboard,insight,types}.ts`, `src/client/{dashboards,insights}.ts`, and the shared `src/apply/{serialize,validate,diff,execute,format-plan}.ts` files. New resources go in the per-directory layout above; the existing two will be migrated separately. Read the legacy files as reference, but do not extend them in place.

### Identity tag

Pick a stable plural slug for the resource and use it everywhere:

- List filter: `tag.startsWith("iac:foos:")`
- Identity tag: `iac:foos:<key>`
- Hash tag (shared, do not duplicate): `iac:hash:<hex>`

Match the existing convention: lowercase, plural, colon-separated. The slug becomes part of every tagged record in the user's project, so it is effectively a public API — pick once, change never.

### API response validation with Zod

New resources must validate every response from the PostHog API with a Zod schema. The PostHog API is the only external boundary in this codebase and is the right place to fail loudly when the shape we expect drifts. Casting `JSON.parse(text) as ServerFoo` (what the existing dashboard/insight client does, see `src/client/http.ts:139`) is the *legacy* path — do not extend it. Eventually those will be migrated; new resources start on the validated path.

If `zod` is not yet in `package.json`, add it: `pnpm add zod`. One-time cost for the first resource that adopts this.

Pattern for `src/resources/foo/client.ts`:

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

Reuse `specHash` from `src/apply/hash.ts` on a canonical projection of the desired spec, exported from `pipeline.ts` as `fooPayloadHash`. The projection must:

- Include every field the API round-trips.
- Exclude server-only fields (`id`, `created_at`, …).
- Exclude managed tags (the `iac:*` ones) — they are not user-authored.
- Be stable under key reordering (the hash function canonicalises, but don't rely on it for arrays of objects — sort by a stable key if order is irrelevant).

If hashing misses a field, that field will silently fail to sync on update. If it includes a server-generated field, every apply will be marked dirty. The legacy dashboard implementation in `dashboardSpecForHash` at `src/apply/diff.ts:88` is the canonical example to copy from.

### Cross-resource references

If `Foo` references another resource by key (e.g. a survey references a feature flag), do **not** include the referenced server id in the hash — it is environment-specific. Include the *key* and resolve to the id at execute time, the way dashboards resolve insight ids via `insightIdByKey` in the legacy `src/apply/execute.ts`.

Plan the execute ordering: dependencies must be created before dependents. The simplest model is two passes: create all `Foo`s first if other resources reference them, then move on.

## Validation

In `pipeline.ts`, export `validateFoos(state): string[]` returning all issues. Cover at minimum:

- `key` is required and unique.
- `name` is required.
- Any resource-specific invariants (e.g. survey must have at least one question).
- Cross-resource references resolve.

Push every error into the returned array — do not bail on the first. The generic pipeline driver aggregates issues across resources and throws `ValidationError` once at the end. The CLI shows all problems at once.

## Plan rendering

In `pipeline.ts`, also export:

- A `displayFoo` and `displayFooFromServer` pair returning a `DisplayValue` tree.
- A `renderFooOp` matching the legacy `renderInsightOp` / `renderDashboardOp`.

The generic plan formatter calls `renderFooOp` for each op and stacks them with the per-resource counts.

The shape that comes out of `displayFooFromServer` must match `displayFoo` (same field order, same value coercions), otherwise the diff renderer will show spurious changes on `unchanged` rows.

## Registration (no CLI change)

The CLI does not change. Each resource exports a registration object from its `index.ts` that the generic driver picks up:

```ts
// src/resources/foo/index.ts
import { foo, type Foo } from "./sdk.js";
import { listManagedFoos, getFoo } from "./client.js";
import {
  fooTag,
  fooKeyFromTags,
  fooPayloadHash,
  diffFoos,
  runFooOp,
  validateFoos,
  renderFooOp,
} from "./pipeline.js";

export { foo, type Foo };

export const fooResource = {
  name: "foos",
  identityPrefix: "iac:foos:",
  list: listManagedFoos,
  get: getFoo,
  diff: diffFoos,
  execute: runFooOp,
  validate: validateFoos,
  render: renderFooOp,
} as const;
```

Then add it to the registry:

```ts
// src/resources/index.ts
export const RESOURCES = [insightResource, dashboardResource, fooResource];
```

That is the only place the new resource becomes visible to the pipeline.

## Unit tests (required for new resources)

The pipeline's pure functions are testable with no mocking; the test budget per new resource is small but non-negotiable. Use Node's built-in test runner — no test framework dependency. Run with `pnpm test`.

Two reference test files exist in the legacy layout:

- `src/apply/hash.test.ts` — `specHash` determinism, key-order invariance, leaf sensitivity.
- `src/apply/diff.test.ts` — op selection (create / update / unchanged / orphan) for insights and dashboards, plus the **safety invariant** test confirming server rows without an `iac:*` tag are ignored entirely.

For a new resource `Foo`, add `src/resources/foo/pipeline.test.ts` covering:

1. `create` when desired exists and server is empty.
2. `unchanged` when desired hash matches the server's `iac:hash:` tag.
3. `update` when the server hash differs.
4. `orphan` when a server row has `iac:foos:<key>` but no matching spec.
5. **Safety invariant:** a server row without any `iac:*` tag produces zero ops *and* zero orphans. This is the test that protects hand-built resources in a shared project.

The factory pattern (`serverInsight` in `src/apply/diff.test.ts`) builds a server row with the right `iac:foos:<key>` and `iac:hash:<hex>` tags — copy it. The hash for "unchanged" cases must come from `fooPayloadHash`; call it from the test rather than hard-coding a hex.

If the Zod schema for `Foo` is non-trivial, also add `src/resources/foo/client.test.ts` with two cases:

1. Real-shaped fixture parses cleanly.
2. Fixture with a missing required field throws.

Fixtures should be hand-authored from an actual `curl` against the PostHog API, not invented — the whole point of the Zod schema is to catch drift from the real wire format.

**Do not** write tests for HTTP wrappers, plan rendering, or filesystem loading. The manual dev-project flow covers those at the right level.

Test files run under a 500ms per-case timeout (`--test-timeout=500` in the `test` script). Anything slower means a hang — fix the test, do not raise the cap.

## Verification (manual, end-to-end)

Unit tests catch the easy failures; the manual flow catches everything else. Run against the dev project:

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

## Deletes

`apply` is non-destructive by default: orphans (server rows tagged `iac:foos:<key>` with no matching spec in code) are listed in the plan but left alone. With the `--prune` flag, `apply` deletes them.

Pruning must follow the same safety invariant as updates:

1. **Refetch + assert tag.** Before issuing `DELETE`, refetch the row and confirm `iac:foos:<key>` is still on it. If the tag has been removed in the UI between fetch and write, abort with `SafetyViolationError`. The legacy reference is `pruneDashboard` and `pruneInsight` at `src/apply/execute.ts:141, 157` — both call `assertManagedDashboard` / `assertManagedInsight` first.
2. **Tolerate `404`.** If the row was deleted out-of-band between list and delete, treat it as a successful no-op and continue. The legacy helpers use `isNotFound(err)` to handle this.
3. **Use the API's "delete" verb faithfully.** PostHog's dashboard/insight delete is a `PATCH {deleted: true}` (soft delete), not a `DELETE`. Many other resources use real `DELETE`. Check what the API does and mirror it.

In `pipeline.ts`, export `runFooPrune(config, orphan, options): Promise<boolean>` returning `true` if a row was deleted, `false` if it was already gone. The generic driver iterates orphans when `--prune` is set.

## Out-of-scope (do not bundle in)

- **Multi-environment.** One project per `apply` run.
- **State files.** Identity lives in tags on the server, not on disk.
- **`dev` command.** Out of MVP scope.

If the resource needs any of these, raise it with the user before writing code — they are roadmap items, not free additions.
