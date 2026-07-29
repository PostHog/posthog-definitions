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

### Choosing the identity carrier (decision tree)

**The description marker is the default; a `tags` field is the lucky case.**
Wave 1 shipped 8 resources: only 2 had `tags` (dashboards, dashboard-templates),
6 carried identity in a description marker, and 1 (data color themes) had no
viable carrier and was deferred. Assume you're writing a marker resource until
the API proves otherwise. Pick the carrier in this order — the first that
applies wins:

1. **`tags` field** → `iac:<resources>:<key>` tag. The dashboards / insights /
   feature-flags / actions / event-definitions pattern. Preferred whenever the
   API round-trips a `tags` array — but confirm it round-trips live; don't
   trust the schema (see the codegen section).
2. **A natural unique key the API enforces** (e.g. endpoints' `code_name`,
   warehouse saved queries' `name`) → use it directly as the resource key. The
   hash marker still needs a home: put it in a free-text field if one exists,
   otherwise fall back to a state-comparison diff (no hash short-circuit — the
   diff compares the projected spec against the server row every apply).
3. **A free-text field the API round-trips** (`description`, `content`) →
   trailing HTML-comment marker, the endpoints pattern documented above.
4. **None of the above** → design the identity per-resource _before_ writing any
   code, and record the decision in `docs/implementation/parity-plan.md`.
   Candidates that land here: annotations, alerts, subscriptions, warehouse view
   links, some error-tracking rules. Options include treating a composite of
   natural fields as the key (e.g. `(date_marker, scope)` for annotations, or
   `(source_table, joining_table, field_name)` for view links) or a visible
   marker in a user-facing text field.

Singletons (one row per project) skip this entirely — see
`add-singleton-resource`. Order-sensitive collections (a server-side `order` /
`reorder` endpoint, e.g. logs sampling rules or error-tracking rules) need an
order-aware diff on top of whichever carrier you pick.

## Expose the API operations (codegen)

Every resource client imports its request/response types from
`src/generated/api.d.ts` (`import type { components } from "../../generated/api.js"`).
That file is **generated** — it is a trimmed projection of PostHog's OpenAPI
schema, and it only contains the operations allowlisted in
`openapi-filter.yaml`. A new resource whose operations are not in the allowlist
has no generated types, so its `client.ts` will not typecheck.

This is the first commit in the resource's series (`chore(codegen): expose
<resource> operations`), kept separate because the generated diff is large and
reviewers skip it.

1. Find the resource's `operationId`s in the spec. They follow the pattern
   `<collection>_list`, `_create`, `_retrieve`, `_partial_update`, `_destroy`
   (env-scoped collections are prefixed, e.g. `environments_endpoints_list`).
   Grep the raw schema or the prod OpenAPI JSON for the collection name.
2. Add them to `openapi-filter.yaml` under `inverseOperationIds`, in a new
   block matching the existing grouping (one blank-line-separated block per
   resource). Include only the verbs the resource actually uses — most need
   `list` / `create` / `retrieve` / `partial_update`; add `destroy` only if the
   resource supports pruning.
3. Run `pnpm codegen`. It fetches the schema
   (`https://us.posthog.com/api/schema/?format=json` by default, override with
   `POSTHOG_OPENAPI_URL`), filters to the allowlist, prunes orphaned component
   schemas, and rewrites `src/generated/api.d.ts`.
4. `pnpm typecheck` to confirm the new `components["schemas"][...]` names
   resolve, then commit **only** `openapi-filter.yaml` and
   `src/generated/api.d.ts`.

**The generated types are a floor, not a contract.** PostHog's OpenAPI schema
routinely omits writable fields that round-trip at runtime — Wave 1 hit this on
3 of 8 resources (dashboard-template `tiles` / `variables` / `dashboard_filters`,
hog-function `InputsItem.value`, and the common split where the write body is a
separate `...SerializerCreateUpdateOnly` schema). Before you design the hash or
the payload, **live-probe the real round-trip**: `curl` a create, then a GET,
and diff them field by field against what you intend to send. Trust the wire,
not the type. Carry any unmodeled-but-round-tripping fields via a `.loose()`
(passthrough) Zod schema plus a hand-written payload type — the reference is
`src/resources/hog-function/client.ts`. This is a per-resource step, not an edge
case.

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

**Strip server-computed noise out of nested blobs before hashing.** Any resource
whose spec carries a passthrough sub-object tends to get server bookkeeping
mixed into it on read: hog-function inputs gain `bytecode` / `order`, hog-flow
action nodes gain `created_at` / `updated_at`, hog-flow `config.filters` gets a
compiled `bytecode`. Author a small `cleanX()` that drops those keys, and run it
in *both* the hash projection and the write payload so a pulled-then-re-applied
spec round-trips clean. Reference: `cleanAction` in
`src/resources/hog-flow/pipeline.ts`.

**Marker-based resources hash differently from tag-based ones, and it matters.**
For a tag/marker resource the diff is a *hash short-circuit*: it compares the
`iac:hash:<hex>` recorded in the marker against `fooHash(spec)` — it **never
compares the projected spec against the live server fields**. Consequences: (a)
server-added noise in the live row can't cause a spurious diff (so the strip
above is about determinism across a pull round-trip, not about no-op
correctness), and (b) a field you forgot to hash won't show as dirty — the
"silent loss" only bites on the *write* side (the field never gets sent), never
as a visible diff. That is exactly why the live create→GET round-trip check
above is non-negotiable: the pipeline will not catch a missing field for you.

### Cross-resource references

If `Foo` references another resource by key (e.g. a survey references a feature flag), do **not** include the referenced server id in the hash — it is environment-specific. Include the _key_ and resolve to the id at execute time, the way dashboards resolve insight ids via `insightIdByKey` in the legacy `src/apply/execute.ts`.

Plan the execute ordering: dependencies must be created before dependents. The simplest model is two passes: create all `Foo`s first if other resources reference them, then move on.

### Secret inputs (masked fields)

When a field is a secret the API **masks on read** (returns `{ secret: true }`,
`"***"`, or similar instead of the value), follow the campaign's secrets
convention — established in `src/resources/hog-function/` and standard for any
masked field (Wave 3 warehouse sources / batch exports will reuse it):

- **The value comes from an environment variable, never the file.** The SDK
  takes an env-var reference (`secret("MY_ENV_VAR")`), resolved from
  `process.env` at execute time. The definition file stores only the env var
  name.
- **Exclude the value from the hash.** Hash the env var *name* (and an optional
  rotate token), never the value — you can't read the value back anyway, so a
  masked read-back must never look like a diff.
- **Send on create; omit on update.** Omitting a masked field on `PATCH`
  preserves the stored value (verify this per-API — it's the usual behavior).
  Re-send only when the user explicitly rotates: give the secret a `rotate`
  token that participates in the hash, so bumping it forces one update that
  re-reads the env var and sends the fresh value.
- **Fail loud on a missing env var** at create/rotate time (not at plan time —
  the plan only needs the name).

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

## Examples (required)

Every new resource ships with at least one example under `examples/posthog/<resources>/`. Examples are the in-repo cheat-sheet anyone reading the SDK skims before authoring their own definitions, and they double as the surface that the dry-run smoke test in the verification flow below exercises.

Match the existing style — see `examples/posthog/cohorts/`, `examples/posthog/feature-flags/`, and `examples/posthog/experiments/` for the canonical shape:

- **Generic B2B SaaS as the implied product.** Trial signups, paid plans, seats, support tickets, churn — the kind of fictional product anyone reading the repo can map onto their own. Do not invent a brand or a product name.
- **One file, one default-exported resource.** Same pattern every other example uses. File name mirrors the resource key.
- **Light dry asides, not overt jokes.** A one-line aside in the description or a top-of-file comment is plenty — "useful for spotting which acquisition channels are trending", "maintained by the growth team via the UI / CSV upload". The voice is realistic-with-a-wink, not parody.
- **2–3 examples for a collection resource, 1 for a singleton.** Cover meaningfully different SDK shapes — e.g. for cohorts, one behavioral / one static; for feature flags, one boolean kill-switch / one multivariate with payloads; for experiments, one full set (experiment + flag + holdout + saved metric).
- **Top-of-file comments explain what the _file_ demonstrates**, not what the resource is ("Reusable property group: events that touch billing share this shape so the typed client can enforce consistent property names …"). The reader already knows what a cohort is; they're skimming to learn how to author one.

Then run `pnpm dev apply --dry-run --dir examples/posthog` and confirm the new files load cleanly with no validation errors. The full examples directory is part of the verification flow below — this is just the quick local check.

## Smoke fixture (required)

`scripts/smoke.sh` seeds **one of each collection resource** against a real
project, then round-trips it through `apply → pull → verify → edit → apply`. It
is the end-to-end regression net; a new resource must join it (its own commit,
`test(smoke): seed <resource>`).

Wire in the new resource by supplying:

- **A fixture** — the `.ts` definition the seed writes and applies, keyed off
  the per-run `${STAMP}` so reruns never collide (e.g.
  `smoke-<resource>-${STAMP}`). Match the cross-resource dependency graph if the
  resource references another (create dependencies before dependents).
- **The seed wiring** — the key variable, the `SMOKE_KINDS` entry (the `--kind`
  list that both the pull and the no-op assertion are scoped to), and the
  cleanup argument passed to `scripts/smoke-cleanup.ts` (`--<resource>=<key>`)
  so the trap deletes the row on exit. `smoke-cleanup.ts` needs the resource's
  `list*` + delete wrappers imported so it can find and remove the tagged row.

  The goal state is a table-driven seed registry where these three touch-points
  collapse into a single entry alongside the fixture file — if that refactor has
  landed, add one registry row instead of editing the seed in three places.

Singletons are intentionally excluded from the smoke seed — applying them would
mutate a project-wide row the script can't restore (see the header comment in
`scripts/smoke.sh`).

Run it with `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID` set:
`pnpm smoke`. The run must end with the no-op assertion passing and the trap
cleanup deleting every row it created.

**`pull --all-rows` mutates pre-existing rows on a shared project.** Pull's job
is to bring rows under management, so `--all-rows` will tag **every** existing
row of the kind — including hand-built ones already in the dev project — writing
the `iac:` marker into their tags/description. When verifying a new resource in
isolation against a shared project (e.g. dev project 806), expect this
collateral and restore it: strip the marker back off any row you didn't create.
Wave 1 hit this twice (session-recording-playlists, and hog-functions tagging the
stock GeoIP). Isolate the kind or plan to revert.

## Verification (manual, end-to-end)

Unit tests catch the easy failures; the manual flow catches everything else. Run against the dev project:

1. `pnpm typecheck` — must pass.
2. The example(s) from the "Examples" section above are what we'll dry-run against in the next step.
3. `npx posthog-definitions apply --dry-run --dir examples/posthog` against the dev project. Inspect the plan output: counts make sense, no spurious diffs, no orphan listing of hand-built resources.
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
3. **Probe the delete verb live — it's a trichotomy, and the schema lies about it.** Wave 1 split almost evenly and there is no way to guess from the OpenAPI spec (messaging-templates *advertised* a `destroy` op that returns 405). `curl -X DELETE` the row and see:
   - **204** → real `DELETE`; call it (actions, hog-flows, product-tours, cohorts).
   - **405 or 403** → `DELETE` is disabled; soft-delete via `PATCH {deleted: true}` (dashboards, insights, surveys, hog-functions, messaging-templates, playlists — note some 405, some 403, inconsistently).
   Mirror whichever the live API does. If it's PATCH-soft-delete, also drop `destroy` from the `openapi-filter.yaml` block — you won't call it.

In `pipeline.ts`, export `runFooPrune(config, orphan, options): Promise<boolean>` returning `true` if a row was deleted, `false` if it was already gone. The generic driver iterates orphans when `--prune` is set.

## Out-of-scope (do not bundle in)

- **Multi-environment.** One project per `apply` run.
- **State files.** Identity lives in tags on the server, not on disk.
- **`dev` command.** Out of MVP scope.

If the resource needs any of these, raise it with the user before writing code — they are roadmap items, not free additions.
