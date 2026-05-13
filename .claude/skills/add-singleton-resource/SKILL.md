---
name: add-singleton-resource
description: Add support for a PostHog resource that exists exactly once per project (project settings, organization billing config, plugin enablement flags, …). Singletons do not fit the tag-based identity model — they have no collection to filter, no key to disambiguate, and no orphans to track. This skill is the playbook for the *other* shape: one declarative block, field-level diff, PATCH-only execution. Use when the user wants to manage a resource where the project itself is the only "row".
---

# Adding a singleton resource to posthog-definitions

This skill is the playbook for resources that exist exactly **once per project** — there's a single row and no collection, so the identity, safety, and lifecycle story is fundamentally different from `add-resource`. Examples: project settings (`/api/projects/<id>/`), billing config, default-event property allowlists, anything keyed by the project itself.

## When to use this skill vs `add-resource`

| Signal                      | This skill                                      | `add-resource`                        |
| --------------------------- | ----------------------------------------------- | ------------------------------------- |
| API endpoint                | `PATCH /api/projects/<id>/` (no sub-collection) | `POST /api/projects/<id>/<resource>/` |
| Number of rows per project  | exactly 1                                       | 0..N                                  |
| User declares               | one block (`projectSettings({...})`)            | many blocks across many files         |
| Has a writable `tags` field | usually no                                      | yes (required)                        |
| Can be deleted              | no — always exists                              | yes                                   |

If you're unsure: list the API. If you GET a single object (not a paginated list of objects), it's a singleton. If you'd need a `key` field on the spec to tell two of them apart in code, it's not.

## Before you touch anything

Re-read the same three architecture docs as `add-resource`:

1. `docs/implementation/architecture.md`
2. `docs/implementation/identity.md` — note the gaps: this skill replaces the tag identity model.
3. `docs/implementation/apply.md` — note the gaps: this skill replaces the create/update/orphan/prune lifecycle with PATCH-only.

Then re-read the legacy insight pair (`src/sdk/insight.ts`, `src/client/insights.ts`, the insight-relevant blocks in `src/apply/{diff,execute,serialize,validate}.ts`) — not because singletons follow that shape, but because the pipeline plumbing is the same shape you'll register against.

## The safety story (no tags — fundamentally different)

Collection resources protect hand-built rows with a tag invariant: _if it doesn't have my tag, I don't touch it._ That mechanism is unavailable here — the project always exists, and we always have to write to it.

Singletons instead enforce a **field-scoping invariant:**

> **A singleton apply only ever writes the fields the user explicitly declared.**

The PATCH body must contain only the keys present in the user's spec. Fields the user did not mention must not appear in the request payload, even with `undefined` or `null` values — the request shape itself is the safety contract. PostHog's `PATCH` is a true partial update, so an absent key means "leave alone."

Concretely, this means:

- The spec accepts a `Partial<Settings>` rather than a `Settings`.
- The diff phase enumerates only the keys present in the spec — never the union of spec ∪ server.
- The execute phase serializes only those same keys.
- If the user undeclares a previously-declared field, the field is **abandoned**, not reset. The server value persists. This is intentional: there is no "previously applied" state to recover from, and the safety invariant outranks reset semantics.

State this contract in the user-facing JSDoc on the factory. Users who want to reset a field must explicitly set it to the desired value — there is no "remove" verb.

## Directory layout

Singletons use the same per-resource directory pattern as collections, with fewer files:

```
src/resources/<singleton>/
├── sdk.ts               user-facing factory + the spec type
├── client.ts            ServerXSchema (Zod) + get/patch wrappers
├── pipeline.ts          validate, diff (field-level), execute (PATCH), format
├── pipeline.test.ts     field-diff selection, unchanged-when-equal, untouched-fields invariant
├── client.test.ts       Zod schema parses a real fixture (only if schema is non-trivial)
└── index.ts             public surface + registration object
```

Note: there is no `serialize` step in the same sense — payload construction is "spread the declared keys" — but it's tiny, so it goes in `pipeline.ts` rather than its own file.

| #   | File                                    | What it contains                                                                                                                                             |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `src/resources/<singleton>/sdk.ts`      | The `XSettings` (or similar) user-facing type and the `xSettings(spec): XSettings` factory. The spec type is a `Partial` over the full configurable surface. |
| 2   | `src/resources/<singleton>/client.ts`   | `ServerXSchema` (Zod) + `getX(config)` and `patchX(config, partial)` wrappers. No `list*` — there's nothing to list.                                         |
| 3   | `src/resources/<singleton>/pipeline.ts` | `validateX(spec)`, `XDiff` shape (per-field), `diffX(spec, server)`, `runXOp(config, op)`, `renderXOp(op)`, `xPayload(spec)`.                                |
| 4   | `src/resources/<singleton>/index.ts`    | Re-export `xSettings` and `XSettings`; export an `xResource` registration object.                                                                            |
| 5   | `src/resources/index.ts`                | Add `xResource` to the `RESOURCES` array.                                                                                                                    |
| 6   | `src/index.ts`                          | Re-export `xSettings` and `XSettings`.                                                                                                                       |

### Identity (or rather, the lack of it)

A singleton has no key, no slug, no tag. Its identity is the project itself, addressed by `config.projectId`. There is no list filter, no `iac:*` namespace, and no orphan concept.

Plural slug picking, hash-in-tag, `iac:hash:<hex>` — none of these apply.

### API response validation with Zod

Same rules as `add-resource` — every response goes through a Zod schema with `.passthrough()` on the root and strict typing on the fields posthog-definitions actually reads. Singletons typically have **many** configurable fields (project settings can have ~50). Schema only the ones the user can declare via the factory; let `.passthrough()` carry the rest.

```ts
import { z } from "zod";

export const ServerXSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    timezone: z.string(),
    week_start_day: z.number().int().min(0).max(6),
    autocapture_opt_out: z.boolean().nullable(),
    // … only the declarable fields
  })
  .passthrough();

export type ServerX = z.infer<typeof ServerXSchema>;
```

If a declarable field is `null`-on-the-wire, mirror that with `.nullable()`. The factory type may still expose it as `boolean | undefined` (user-side undeclared is different from server-side null) — see "Nullability mapping" below.

### Nullability mapping

Three states need to stay distinct:

| Where           | State                                        | Meaning                                                                 |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| User spec       | field absent (`undefined`)                   | "I do not manage this." Field is excluded from PATCH and from the diff. |
| User spec       | field present with a value, including `null` | "Set the server field to this value." Included in PATCH and diff.       |
| Server response | `null`                                       | The field is unset on the server.                                       |

The factory accepts `field?: T \| null`. The diff treats `undefined` as "skip this field entirely" and `null` as "set to null." Document this in the factory JSDoc — it's the trickiest bit of the surface.

## Diff (field-level, not row-level)

`diffX` returns a list of per-field operations:

```ts
type XFieldChange = {
  field: keyof XSettings;
  before: unknown;
  after: unknown;
};

type XDiff = { kind: "unchanged" } | { kind: "patch"; changes: XFieldChange[] };
```

The diff routine:

1. Iterate the keys present in the spec (use `Object.keys(spec)` — only declared keys, never the server keys).
2. For each declared key `k`, compare `spec[k]` to `server[k]`.
3. Equality: deep equal. Use a structural comparison that mirrors `specHash`'s canonicalization — sorted keys for objects, exact array order. Reuse `specHash` to compute per-value hashes if the value is a non-primitive; for primitives, `===` is fine.
4. If any field differs, return `{ kind: "patch", changes }`. Otherwise `{ kind: "unchanged" }`.

There is **no `iac:hash:*` tag**. The server's current value is the source of truth and we always GET it before diffing. Hashing is a per-field comparison aid, not a stored marker.

## Validation

In `pipeline.ts`, export `validateX(spec): string[]`. The validator runs purely on the declared fields. Cover at minimum:

- Each declared field passes its own per-field constraint (timezone is a known string, ratios are 0..1, etc.).
- Cross-field invariants (if any) hold _only when both fields are declared_ — never reject because an undeclared field is "missing." That would violate the field-scoping invariant.

Push every error into the returned array — the generic pipeline driver aggregates and throws `ValidationError` once.

## Plan rendering

`renderXOp(op)` formats the singleton like this:

```
Project settings
  timezone:        "UTC"           → "Europe/London"
  week_start_day:  0               → 1
  (2 fields changed)
```

When `op.kind === "unchanged"`, render a single line:

```
Project settings (unchanged)
```

There is no per-row "create / update / orphan" breakdown to surface in the summary line. Treat the singleton as a single update in the summary counts.

## Registration

Singletons register the same way as collections, but the registration object's hooks reflect the different lifecycle:

```ts
// src/resources/<singleton>/index.ts
import { xSettings, type XSettings } from "./sdk.js";
import { getX, patchX } from "./client.js";
import { validateX, diffX, runXOp, renderXOp } from "./pipeline.js";

export { xSettings, type XSettings };

export const xResource = {
  name: "<singleton>",
  kind: "singleton", // ← distinguishes from "collection"
  fetch: getX, // ← single GET, not a list
  diff: diffX, // ← takes (spec, server), returns XDiff
  execute: runXOp, // ← PATCH with declared fields only
  validate: validateX,
  render: renderXOp,
} as const;
```

The generic driver branches on `kind`: collections iterate, singletons fetch once. The CLI does not change.

If the generic driver in this codebase does not yet support `kind: "singleton"`, you need to add that branch — the existing pipeline assumes collection lifecycle. Look at `src/apply/{load,diff,execute,format-plan}.ts` and add a parallel path that:

1. Loads at most one declared spec of the singleton's type.
2. Fetches one server object.
3. Calls `diff(spec, server) → XDiff`.
4. Calls `execute` if `kind === "patch"`.

Loader: a singleton's user-facing factory should be detectable by a `kind: "singleton"` discriminator on the returned object (mirror `looksLikeDashboard` / `looksLikeInsight` in `src/apply/load.ts`). If multiple files default-export the same singleton type, that's a user error — reject with a clear message, do not merge.

## Unit tests (required)

The pipeline's pure functions are testable with no mocking. Cover at minimum, in `src/resources/<singleton>/pipeline.test.ts`:

1. **Unchanged when declared fields match.** Spec declares `{ timezone: "UTC" }`, server returns `{ timezone: "UTC", week_start_day: 0, autocapture_opt_out: null, … }` → `kind: "unchanged"`.
2. **Patch when a declared field differs.** Spec declares `{ timezone: "UTC" }`, server returns `{ timezone: "Europe/London", … }` → `kind: "patch"` with `[{ field: "timezone", before: "Europe/London", after: "UTC" }]`.
3. **Undeclared fields are never patched.** Spec declares `{ timezone: "UTC" }`, server returns `{ timezone: "UTC", week_start_day: 6 }` → `kind: "unchanged"`. The fact that `week_start_day` is 6 (and the server's default is 0) does not produce a change.
4. **`null` and `undefined` are distinct.** Spec declares `{ autocapture_opt_out: null }`, server returns `{ autocapture_opt_out: true }` → `kind: "patch"`. Spec omits `autocapture_opt_out` entirely, server returns `{ autocapture_opt_out: true }` → no change for that field.
5. **Validation rejects invalid declared values.** A declared field with an out-of-range value produces a validation issue.

Reuse the 500ms test budget. Build the server fixture with a `serverX(overrides)` factory.

If the Zod schema is non-trivial, add `src/resources/<singleton>/client.test.ts` with the same two cases as the collection skill: real fixture parses, fixture with required-field missing throws. Fixtures should come from a real `curl` against PostHog, not be invented.

## Verification (manual, end-to-end)

Same shape as the collection flow, adapted:

1. `pnpm typecheck` — must pass.
2. Add an example file under `examples/` exercising the singleton.
3. `npx posthog-definitions apply --dry-run` against the dev project. Inspect the plan: declared fields appear in the diff, undeclared fields do not.
4. `npx posthog-definitions apply`. Confirm the targeted fields changed in the UI; confirm no other settings drifted.
5. Re-apply with no spec changes. The plan must show `(unchanged)`. **If anything is listed as a field change on a no-op apply, the equality check is wrong** — fix it before moving on.
6. Edit one declared field, re-apply. Confirm only that one field appears in the PATCH (use `--verbose` to inspect the request body).
7. Remove a previously-declared field from the spec, re-apply. Confirm the plan is `(unchanged)` — the server value persists. This is the **abandoned-field smoke test**.
8. Manually change an _undeclared_ setting in the UI, re-apply. The CLI must leave it alone. This is the **field-scoping invariant smoke test**.

Steps 7 and 8 are the singleton equivalent of the safety invariant. Do not skip them.

## Update the support matrix

Flip the singleton's row from ❌ to ✅ in `docs/resources.md`. Note in the entry that it is a singleton — users coming from feature flags or cohorts will expect a key.

## Deletes / prune

Singletons cannot be deleted. `--prune` is a no-op for them. The registration object has no `prune` hook.

## Out-of-scope (do not bundle in)

Same as the collection skill — multi-environment, state files, `dev` command — plus one singleton-specific item:

- **Auto-reset.** "When the user undeclares a field, reset it to PostHog's default." This requires either (a) knowing every field's default (brittle), or (b) keeping a "previously applied" record (a state file). MVP punts and persists. Raise it with the user if it comes up; it's not a free addition.
