---
name: add-resource
description: Add support for a new PostHog resource type (feature flag, cohort, action, survey, annotation, alert, …) to posthog-definitions. Walks through the eight files that must change, the tag-based identity convention, the load/diff/execute pipeline wiring, and the non-negotiable safety invariant. Use when the user wants to extend posthog-definitions beyond dashboards and insights.
---

# Adding a new resource to posthog-definitions

This skill is the playbook for extending posthog-definitions with a new PostHog resource type. It covers the _what to change and why_, not the line-by-line code — copy the existing dashboard/insight pair as a reference and adapt.

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

- `src/resources/insight/sdk.ts` — the `Insight` type and `insight()` factory.
- `src/resources/insight/client.ts` — `ServerInsight` plus the HTTP wrappers, including `listManagedInsights`.
- `src/resources/insight/pipeline.ts` — tag/key/hash/payload, validate, execute, prune, and display functions.
- `src/resources/insight/index.ts` — public exports plus the `insightResource` registration object.

If the new resource has _references to other resources_ (the way dashboards reference insights via tiles), study the dashboard pair as well — it shows the cross-resource id resolution pattern (`ctx.insightIdByKey`, populated by the insight module's executor and read by the dashboard module).

## The safety invariant (non-negotiable)

**The CLI must never read, modify, or delete a resource it did not tag.** Hand-built resources in the same project must be byte-identical before and after `apply`.

Two mechanisms enforce this — both must be replicated for the new resource:

1. **List filter.** `list<Resource>` only returns rows whose tags contain `iac:<resource>:<...>`. See `listManagedInsights` in `src/resources/insight/client.ts`.
2. **Pre-write assertion.** Before any `PATCH` or `DELETE`, refetch the row and confirm its `iac:<resource>:<key>` tag is still there. If it's been removed (e.g. an operator stripped it in the UI), abort with `SafetyViolationError`. See `assertManagedInsight` in `src/resources/insight/pipeline.ts`.

If the resource's API has no `tags` field, the identity carrier changes but the invariant doesn't:

- **Singleton resources** (one row per project, e.g. project settings) → use the sibling skill `add-singleton-resource`. No identity needed; field-level diff, PATCH-only.
- **Collection resources without tags** (e.g. endpoints) → carry identity in the `description` (or another free-form text field the API round-trips). Append a trailing HTML comment marker, anchored to end-of-string:

  ```
  <user description>

  <!-- iac:<resources>:<key> iac:hash:<hex> -->
  ```

  List filter: `description.includes("<!-- iac:<resources>:")`. Pre-write assertion: refetch, confirm the marker is still the trailing content. Display functions must strip the marker before rendering so spec ↔ server diffs line up. See `src/resources/endpoint/pipeline.ts` for the reference.

The safety invariant survives because rows without the marker (or with the marker no longer at end-of-string) are invisible to the CLI.

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

| #   | File                            | What it contains                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/resources/foo/sdk.ts`      | The `Foo` user-facing type and the `foo(spec): Foo` factory helper.                                                                                                                                                                                                                                                          |
| 2   | `src/resources/foo/client.ts`   | `ServerFooSchema` (Zod, with `ServerFoo` derived via `z.infer`) + `list/get/create/update` HTTP wrappers that `.parse()` every response. `listManagedFoos` filters by `iac:foos:` tag.                                                                                                                                       |
| 3   | `src/resources/foo/pipeline.ts` | `fooTag(key)`, `fooKeyFromTags(tags)`, `fooHashFromTags(tags)`, `looksLikeFoo(value)`, `fooHash(spec)`, `fooPayload(spec, hash)`, `validateFoos(specs, state)`, `assertManagedFoo` (private), `runFooOp(config, op, ctx, options)`, `pruneFoo(config, orphan, options)`, `displayFoo(spec)`, `displayFooFromServer(server)`. |
| 4   | `src/resources/foo/index.ts`    | Re-export `foo` and `Foo` for users; export a `fooResource` registration object that the generic pipeline picks up.                                                                                                                                                                                                          |
| 5   | `src/resources/index.ts`        | Add `fooResource` to the `RESOURCES` array.                                                                                                                                                                                                                                                                                  |
| 6   | `src/index.ts`                  | Re-export `foo` and the `Foo` type for SDK users.                                                                                                                                                                                                                                                                            |

Each resource is fully self-contained: SDK types live next to its `sdk.ts`, never in a shared `sdk/` directory. If two resources need to share a type, the dependent resource imports from the producer's `sdk.ts` directly (the way dashboard tiles import `Insight` from `src/resources/insight/sdk.ts`). Generic pipeline orchestration (hash, file load, the apply driver, plan formatter) stays in `src/apply/`. The CLI does not change — it iterates the registry.

### Resource-kind discriminator

The loader routes each loaded default export to the resource whose `isSpec(value)` returns true. Several resources share a structural shape (insights, endpoints, and dashboards all have `{key, name, query | tiles}`), so `isSpec` cannot rely on shape alone.

Every user-facing factory must install a non-enumerable kind marker, and every `looksLike<Resource>` must check it first:

```ts
// sdk.ts
import { markResourceKind } from "../types.js";

export function foo(spec: Foo): Foo {
  return markResourceKind(spec, "foo");
}

// pipeline.ts
import { getResourceKind } from "../types.js";

export function looksLikeFoo(value: unknown): value is Foo {
  return getResourceKind(value) === "foo";
}
```

If the resource may also appear inline inside another resource's spec (the way insights appear inside dashboard tiles) and could bypass the factory, fall back to a structural check when `getResourceKind` returns `undefined` — but the marker check must come first so factory-produced specs route deterministically.

### Server ids

`ResourceOp.serverId` is `number | string`. Cast to the concrete type your API uses at the call site. For resources addressed by something other than a numeric id (e.g. endpoints, which are keyed by `name` in the URL), use `op.server.<field>` in `executeOp` and `prune` rather than `op.serverId`.

### Identity tag

Pick a stable plural slug for the resource and use it everywhere:

- List filter: `tag.startsWith("iac:foos:")`
- Identity tag: `iac:foos:<key>`
- Hash tag (shared, do not duplicate): `iac:hash:<hex>`

Match the existing convention: lowercase, plural, colon-separated. The slug becomes part of every tagged record in the user's project, so it is effectively a public API — pick once, change never.

### API response validation with Zod

New resources must validate every response from the PostHog API with a Zod schema. The PostHog API is the only external boundary in this codebase and is the right place to fail loudly when the shape we expect drifts. Casting `JSON.parse(text) as ServerFoo` (what the dashboard/insight client modules still do, via `request<T>` in `src/client/http.ts`) is the _legacy_ path — do not extend it. Those two will be migrated to Zod separately; new resources start on the validated path.

If `zod` is not yet in `package.json`, add it: `pnpm add zod`. One-time cost for the first resource that adopts this.

Pattern for `src/resources/foo/client.ts`:

```ts
import { z } from "zod";

export const ServerFooSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).default([]),
    // … only the fields posthog-definitions actually reads
  })
  .passthrough();

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
- **Be strict on the fields you _do_ read.** No `z.unknown()` or `z.any()` for those — that defeats the whole point.
- **Mirror server nullability faithfully.** PostHog often returns `null` rather than omitting a field. Use `.nullable()` (allows `null`) vs `.optional()` (allows missing) deliberately — they mean different things on the wire.
- **No defaults that mask bugs.** Use `.default([])` only when the API genuinely may omit the field; otherwise let the parse fail.
- **Parse, don't `safeParse` in the happy path.** A schema failure is a bug (ours or PostHog's), not a recoverable runtime condition. Let it throw; the CLI's existing error handling will surface it.
- **Inline-validate the paginated wrapper too.** `paginate<T>` in `src/client/http.ts` currently casts — wrap it for new resources by parsing the page schema at the call site.

What _not_ to schema:

- Outgoing request bodies. They are constructed from typed `Foo` specs we already control; Zod adds nothing.
- Response fields posthog-definitions never reads. Keeping them in `.passthrough()` is enough.

### Hashing

Reuse `specHash` from `src/apply/hash.ts` on a canonical projection of the desired spec, exported from `pipeline.ts` as `fooPayloadHash`. The projection must:

- Include every field the API round-trips.
- Exclude server-only fields (`id`, `created_at`, …).
- Exclude managed tags (the `iac:*` ones) — they are not user-authored.
- Be stable under key reordering (the hash function canonicalises, but don't rely on it for arrays of objects — sort by a stable key if order is irrelevant).

If hashing misses a field, that field will silently fail to sync on update. If it includes a server-generated field, every apply will be marked dirty. The canonical examples to copy from are `dashboardSpecForHash` in `src/resources/dashboard/pipeline.ts` and `insightSpecForHash` in `src/resources/insight/pipeline.ts`.

### Cross-resource references

If `Foo` references another resource by key (e.g. a survey references a feature flag), do **not** include the referenced server id in the hash — it is environment-specific. Include the _key_ and resolve to the id at execute time, the way dashboards resolve insight ids via `insightIdByKey` in the legacy `src/apply/execute.ts`.

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
import type { ApplyContext, ResourceModule } from "../types.js";
import { listManagedFoos, type ServerFoo } from "./client.js";
import {
  FOO_TAG_PREFIX,
  displayFoo,
  displayFooFromServer,
  fooHash,
  fooHashFromTags,
  fooKeyFromTags,
  looksLikeFoo,
  pruneFoo,
  runFooOp,
  validateFoos,
} from "./pipeline.js";

export { foo } from "./sdk.js";
export type { Foo } from "./sdk.js";

export const fooResource: ResourceModule<Foo, ServerFoo> = {
  name: "foos",
  displayName: "foo",
  identityPrefix: FOO_TAG_PREFIX,

  isSpec: looksLikeFoo,
  specKey: (spec) => spec.key,

  list: listManagedFoos,
  keyFromServer: (server) => fooKeyFromTags(server.tags),
  hashFromServer: (server) => fooHashFromTags(server.tags),

  hash: fooHash,
  validate: (specs, state) => validateFoos(specs, state),
  executeOp: runFooOp,
  prune: pruneFoo,

  displaySpec: (spec, _ctx: ApplyContext) => displayFoo(spec),
  displayServer: (server, _ctx: ApplyContext) => displayFooFromServer(server),
};
```

Then add it to the registry, in the order it should run relative to other resources (dependencies before dependents):

```ts
// src/resources/index.ts
export const RESOURCES = [insightResource, dashboardResource, fooResource];
```

That is the only place the new resource becomes visible to the pipeline. `apply`'s load, validate, diff, execute, and plan-render steps all iterate `RESOURCES` and dispatch through each module's hooks.

## Unit tests (required for new resources)

The pipeline's pure functions are testable with no mocking; the test budget per new resource is small but non-negotiable. Use Node's built-in test runner — no test framework dependency. Run with `pnpm test`.

Three reference test files exist:

- `src/apply/hash.test.ts` — `specHash` determinism, key-order invariance, leaf sensitivity (shared across all resources).
- `src/resources/insight/pipeline.test.ts` — op selection (create / update / unchanged / orphan) plus the **safety invariant** test for insights.
- `src/resources/dashboard/pipeline.test.ts` — same coverage for dashboards.

For a new resource `Foo`, add `src/resources/foo/pipeline.test.ts` covering:

1. `create` when desired exists and server is empty.
2. `unchanged` when desired hash matches the server's `iac:hash:` tag.
3. `update` when the server hash differs.
4. `orphan` when a server row has `iac:foos:<key>` but no matching spec.
5. **Safety invariant:** a server row without any `iac:*` tag produces zero ops _and_ zero orphans. This is the test that protects hand-built resources in a shared project.

The factory pattern (`serverRow` in either `pipeline.test.ts`) builds a server row with the right `iac:foos:<key>` and `iac:hash:<hex>` tags — copy it. The hash for "unchanged" cases must come from `fooHash`; call it from the test rather than hard-coding a hex.

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
7. Delete the spec file, re-apply. Confirm the resource appears as an _orphan_ (left alone, not deleted — MVP doesn't do deletes).
8. Manually create a _hand-built_ `Foo` in the UI without any `iac:` tags. Re-apply. Confirm the hand-built one is untouched.

The last step is the safety invariant smoke test. Do not skip it.

## Update the support matrix

After the resource ships, flip its row from ❌ to ✅ in `docs/resources.md`.

## Update the README

The top-level `README.md` lists supported resources in its intro sentence and the required API scopes in the "Authenticate" step. Add the new resource to the intro list and append its `read`/`write` scope(s) to the bullet list. If the resource reuses an existing scope (e.g. holdouts under `experiment:*`), note it inline rather than duplicating the bullet.

## Deletes

`apply` is non-destructive by default: orphans (server rows tagged `iac:foos:<key>` with no matching spec in code) are listed in the plan but left alone. With the `--prune` flag, `apply` deletes them.

Pruning must follow the same safety invariant as updates:

1. **Refetch + assert tag.** Before issuing `DELETE`, refetch the row and confirm `iac:foos:<key>` is still on it. If the tag has been removed in the UI between fetch and write, abort with `SafetyViolationError`. The reference is `pruneInsight` and `pruneDashboard` in their respective `src/resources/<name>/pipeline.ts` — both call `assertManagedXxx` first.
2. **Tolerate `404`.** If the row was deleted out-of-band between list and delete, treat it as a successful no-op and continue. The legacy helpers use `isNotFound(err)` to handle this.
3. **Use the API's "delete" verb faithfully.** PostHog's dashboard/insight delete is a `PATCH {deleted: true}` (soft delete), not a `DELETE`. Many other resources use real `DELETE`. Check what the API does and mirror it.

In `pipeline.ts`, export `runFooPrune(config, orphan, options): Promise<boolean>` returning `true` if a row was deleted, `false` if it was already gone. The generic driver iterates orphans when `--prune` is set.

## Out-of-scope (do not bundle in)

- **Multi-environment.** One project per `apply` run.
- **State files.** Identity lives in tags on the server, not on disk.
- **`dev` command.** Out of MVP scope.

If the resource needs any of these, raise it with the user before writing code — they are roadmap items, not free additions.
