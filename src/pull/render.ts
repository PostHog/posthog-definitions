/**
 * Shared codegen primitives used by every resource's `codegen.ts`. Pure
 * string-builders with no awareness of any specific resource shape; the
 * resource modules drive them.
 */

export const PACKAGE_NAME = "@posthog/definitions";

/** Encode a JS string literal (with all escapes). Uses JSON which is a strict subset of JS for strings. */
export function stringLiteral(value: string): string {
  return JSON.stringify(value);
}

/**
 * Render a `{ k: v, ... }` object literal. `fields` values are pre-rendered TS
 * fragments — the caller has already converted them to strings. `indent` is
 * the column width for entry indentation; the closing brace uses `indent - 2`.
 */
export function renderObject(fields: Record<string, string>, indent: number): string {
  const entries = Object.entries(fields);
  if (entries.length === 0) return "{}";
  const pad = " ".repeat(indent);
  const outerPad = " ".repeat(Math.max(0, indent - 2));
  const lines = entries.map(([k, v]) => `${pad}${formatKey(k)}: ${v},`);
  return `{\n${lines.join("\n")}\n${outerPad}}`;
}

/** Render a `[ ... ]` array literal from pre-rendered items. */
export function renderArray(items: string[], indent: number): string {
  if (items.length === 0) return "[]";
  const pad = " ".repeat(indent);
  const outerPad = " ".repeat(Math.max(0, indent - 2));
  return `[\n${items.map((i) => `${pad}${i},`).join("\n")}\n${outerPad}]`;
}

/** Quote a key only if it's not a bare identifier. */
export function formatKey(key: string): string {
  return /^[a-zA-Z_$][\w$]*$/.test(key) ? key : stringLiteral(key);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Recursive value renderer for arbitrary JSON-ish data. Used by resources
 * that pass through opaque sub-objects (experiment metrics, cohort filters,
 * etc.) without bespoke renderers.
 */
export function renderRawLiteral(value: unknown, indent: number): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return stringLiteral(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => renderRawLiteral(v, indent + 2));
    return renderArray(items, indent);
  }
  if (isObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return "{}";
    const fields: Record<string, string> = {};
    for (const [k, v] of entries) fields[k] = renderRawLiteral(v, indent + 2);
    return renderObject(fields, indent);
  }
  return JSON.stringify(value);
}

/** Render a single top-level named-import line from `@posthog/definitions`. */
export function renderImportLine(names: ReadonlyArray<string>): string {
  if (names.length === 0) return "";
  // Deterministic order: alphabetical, deduplicated.
  const unique = Array.from(new Set(names)).sort();
  return `import { ${unique.join(", ")} } from "${PACKAGE_NAME}";`;
}

/** Convert a slug (kebab/snake mix) into a valid JS identifier (camelish). */
export function identifierFromSlug(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z0-9_]/g, "_");
  const safe = /^[a-zA-Z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
  return safe;
}
