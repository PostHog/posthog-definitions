/**
 * A discriminated union for operations whose failure is part of normal control flow.
 *
 * Use `Result<T, E>` when failure is expected (invalid user input, validation
 * issues, parse errors, "not found" lookups, recoverable network outcomes) and
 * the caller is expected to handle it. Throw exceptions only for unrecoverable
 * bugs — broken invariants, programmer errors, "this should never happen".
 *
 * See `.claude/skills/result-vs-exceptions/SKILL.md` for the convention.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T, E = never>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function err<E, T = never>(error: E): Result<T, E> {
  return { ok: false, error };
}
