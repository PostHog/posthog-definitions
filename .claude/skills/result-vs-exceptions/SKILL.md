---
name: result-vs-exceptions
description: Code review guide for choosing between Result types and thrown exceptions. Recoverable, expected failures should be returned as Result values; only unrecoverable bugs and broken invariants should throw. Use when reviewing code that introduces a new error class, a new `throw`, a new `try/catch`, or a function whose failure path the caller is expected to handle.
---

# Result types vs. exceptions

A code-review lens for the question: *should this failure be a `Result<T, E>` or a `throw`?*

The convention in this repo: **recoverable, expected failures return a `Result`. Unrecoverable bugs throw.**

## Why this matters

Exceptions are invisible in the type signature. A function that throws looks pure from the outside — the caller has no compiler-enforced reminder that failure is possible, no list of failure kinds, no exhaustiveness check. That's fine for "the runtime is broken" failures (out-of-memory, broken invariants, programmer mistakes), because no caller can sensibly recover and the crash is the right behavior.

It's the wrong default for failures that are part of normal control flow. Invalid user input, validation issues, parse errors, "not found" lookups, expected network outcomes (4xx, rate limits) — these are not exceptional. They are predictable branches of the API. Hiding them inside `try`/`catch` puts business logic in the catch block, lets callers forget the failure path entirely, and conflates "this might fail" with "this should never happen."

`Result<T, E>` flips both problems: failure is part of the return type, the caller is forced by the type system to discriminate, and the set of failure kinds is enumerable.

## Decision

When reviewing a new `throw` or a new error class, ask:

1. **Is failure part of this function's normal contract?** If the function is *defined* by "validate", "parse", "find", "fetch and decode", "match against a schema" — failure is part of the contract. Return `Result`. Examples in this repo: `validate(state)`, loading definitions, decoding API responses.
2. **Would a reasonable caller want to do something other than crash?** Branch on the error, retry, show a friendlier message, fall back to a default, accumulate issues across many calls. If yes — `Result`. If the only sensible reaction is "log and die," throw.
3. **Is the failure a broken invariant the program cannot reason past?** "This map should contain X but doesn't", "this branch is unreachable", "the schema generator produced an impossible shape." These should throw — they are bugs, not data.
4. **Will the failure cross many call frames?** Result types are explicit and verbose to thread; that explicitness is the feature for one or two layers, but a noise tax across ten. If a low-level invariant violation needs to escape to the top, throwing is reasonable — but only if no intermediate layer could meaningfully recover.

## Patterns to flag

- **A new `throw` for input validation.** Almost always wants to be a `Result`. The caller already knows invalid input is possible.
- **A `try`/`catch` that does `if (err instanceof FooError) { … return 1; } throw err;`.** The control flow is "if expected error, handle; otherwise propagate." That's exactly what `Result` expresses without the wrapping.
- **`throw new SomethingError("not found")`.** "Not found" is usually a value (`undefined`, `null`, `Result.err("not-found")`), not an exception. Flag unless the API explicitly promises the item exists.
- **An error class with no behavior — just a name and a string message.** It exists only so callers can `instanceof` it. That's a sign the failure is part of normal flow and would be better modeled as a `Result` variant with a string tag.
- **Mixed signaling in the same path.** A function that returns `Result` for one failure but throws for another similar-shaped failure. Pick one.
- **A `Result` whose `error` type is `Error` or `unknown`.** Defeats the point. The whole value of `Result<T, E>` is that `E` is a tight, enumerable shape — `"not-found" | "invalid-tag" | { kind: "rate-limited"; retryAfter: number }` — so callers can exhaustively switch on it.

## Patterns that are fine

- **Throwing inside `bin/`, CLI entry points, or top-level handlers** when the program genuinely cannot continue (config missing, network completely unreachable on startup). The caller is the OS; the OS handles exit codes.
- **Throwing for "this branch is unreachable" defaults.** `throw new Error("unreachable")` inside the default of an exhaustive switch is healthier than returning a fake value.
- **Throwing for I/O the function cannot meaningfully recover from** (filesystem broken, OOM) — provided no intermediate frame would have wanted to catch it.
- **Returning `T | undefined`** for binary "found / not found" cases. It's a degenerate `Result` and the convention here treats it as equivalent.

## Shape

Use the project's `Result<T, E>` from `src/result.ts`:

```ts
import { type Result, ok, err } from "../result.js";

export function parseTag(raw: string): Result<Tag, "empty" | "missing-prefix"> {
  if (raw.length === 0) return err("empty");
  if (!raw.startsWith("iac:")) return err("missing-prefix");
  return ok({ raw });
}
```

Prefer narrow string-literal or tagged-union `E` shapes to opaque `Error` objects. The caller benefits from the type system telling them every failure case; downgrading to `Error` throws that away.

## Reference

See `src/apply/validate.ts` for the canonical example in this repo: `validate` returns `Result<ValidationOk, string[]>` so the CLI can format the issues and exit with code 1 without a `try`/`catch`.
