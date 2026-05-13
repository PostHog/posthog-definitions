/**
 * Pull a single OpenAPI component (plus its transitive dependencies) out of
 * the full `openapi-zod-client` codegen output. The output of the tool itself
 * is too large to commit (1.6MB for the PostHog spec), so the scaffolder runs
 * the CLI on demand and extracts only what each resource needs.
 *
 * The parser is line-oriented and depth-tracked: openapi-zod-client emits
 * prettier-formatted code with top-level declarations starting at column 0,
 * so we can split it into declaration blocks reliably without a full TS parser.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

type DeclKind = "const" | "type";

type Decl = {
  name: string;
  kind: DeclKind;
  /** Distinct id since `const X` and `type X` can coexist. */
  id: string;
  source: string;        // full source text including the trailing `;`
  deps: Set<string>;     // ids referenced by this declaration (after self-removal)
};

/**
 * Synthesized helpers we don't want to pull in as dependencies. These are
 * lowercase top-level consts openapi-zod-client emits for path-parameter
 * unions like `const id = z.union([z.number(), z.string()]);` — never
 * referenced by component schemas, but collide with field keys (`id:`).
 */
function isComponentName(name: string): boolean {
  return /^[A-Z]/.test(name);
}

/**
 * Cache key: a hash of the OpenAPI file's path + mtime. Re-running the CLI
 * is slow (≈5s for the PostHog spec) so we cache the parsed declaration map.
 */
const _cache = new Map<string, Map<string, Decl>>();

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(__filename), "..", "..");

export function loadAllDecls(openapiPath: string): Map<string, Decl> {
  const abs = resolve(process.cwd(), openapiPath);
  const stat = statSync(abs);
  const key = `${abs}:${stat.mtimeMs}`;
  const hit = _cache.get(key);
  if (hit) return hit;

  const generated = generateOnce(abs, stat.mtimeMs);
  const parsed = parseDecls(generated);
  _cache.set(key, parsed);
  return parsed;
}

function generateOnce(openapiAbs: string, mtimeMs: number): string {
  // Persistent cache across runs, keyed on input mtime.
  const hash = createHash("sha1").update(`${openapiAbs}:${mtimeMs}`).digest("hex").slice(0, 12);
  const cacheDir = join(tmpdir(), "posthog-definitions-codegen");
  mkdirSync(cacheDir, { recursive: true });
  const cached = join(cacheDir, `oz-${hash}.ts`);

  if (existsSync(cached)) return readFileSync(cached, "utf8");

  const bin = join(REPO_ROOT, "node_modules", ".bin", "openapi-zod-client");
  if (!existsSync(bin)) {
    throw new Error(
      `openapi-zod-client not installed. Run: pnpm add -D openapi-zod-client`,
    );
  }
  execFileSync(bin, [openapiAbs, "-o", cached, "--export-schemas"], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  return readFileSync(cached, "utf8");
}

/** Parse the prettier-formatted output into top-level declarations. */
function parseDecls(source: string): Map<string, Decl> {
  const out = new Map<string, Decl>();
  const lines = source.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const m = /^(const|type)\s+(\w+)/.exec(line);
    if (!m) { i++; continue; }
    const kind = m[1] as DeclKind;
    const name = m[2]!;

    // Find the end of this declaration by tracking brace/paren depth.
    let depth = 0;
    const startIdx = i;
    let endIdx = i;
    let inString: '"' | "'" | "`" | null = null;
    let escape = false;

    outer: for (let j = i; j < lines.length; j++) {
      const ln = lines[j]!;
      for (let k = 0; k < ln.length; k++) {
        const ch = ln[k]!;
        if (escape) { escape = false; continue; }
        if (inString) {
          if (ch === "\\") { escape = true; continue; }
          if (ch === inString) inString = null;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
        if (ch === "{" || ch === "(" || ch === "[") depth++;
        else if (ch === "}" || ch === ")" || ch === "]") depth--;
      }
      // End: at depth 0 AND line ends with `;`.
      if (depth === 0 && /;\s*$/.test(ln)) { endIdx = j; break outer; }
      // Defensive: if depth bottoms out and the line ends with `}` (`type X = {...}` with no trailing `;`).
      if (depth === 0 && /[}\]]\s*$/.test(ln) && j > i) { endIdx = j; break outer; }
    }

    const srcLines = lines.slice(startIdx, endIdx + 1);
    const src = srcLines.join("\n");
    // Drop lowercase top-level consts entirely (path-param helpers — see isComponentName).
    if (kind === "const" && !isComponentName(name)) { i = endIdx + 1; continue; }
    const id = `${kind}:${name}`;
    out.set(id, { name, kind, id, source: src, deps: new Set() });
    i = endIdx + 1;
  }

  // Resolve deps: for each declaration, scan source for component-name references.
  // Match longest-first so e.g. `CohortFilterGroup` resolves before `CohortFilter`.
  const componentNames = [...new Set([...out.values()].map((d) => d.name))]
    .filter(isComponentName)
    .sort((a, b) => b.length - a.length);

  // For each const, find which other component names it references. For type
  // decls we only consider references *between types*, because the TS type
  // namespace is separate and most types we'd otherwise pull in are redundant
  // with what zod infers from the const decl.
  for (const decl of out.values()) {
    // The `z.ZodType<X>` annotation on a recursive const requires the matching `type X`.
    const lazyRefs = [...decl.source.matchAll(/z\.ZodType<(\w+)>/g)].map((m) => m[1]!);
    for (const ref of lazyRefs) {
      if (out.has(`type:${ref}`)) decl.deps.add(`type:${ref}`);
    }

    if (decl.kind === "const") {
      for (const other of componentNames) {
        if (other === decl.name) continue;
        const re = new RegExp(`\\b${other}\\b`);
        if (!re.test(decl.source)) continue;
        if (out.has(`const:${other}`)) decl.deps.add(`const:${other}`);
      }
    } else {
      // type decl → pull in type deps (TS-only chain, only needed when a const
      // pulled this type in via a `z.ZodType<X>` annotation).
      for (const other of componentNames) {
        if (other === decl.name) continue;
        const re = new RegExp(`\\b${other}\\b`);
        if (!re.test(decl.source)) continue;
        if (out.has(`type:${other}`)) decl.deps.add(`type:${other}`);
      }
    }
  }

  return out;
}

/**
 * Return the source for `root` plus all transitively referenced declarations,
 * ordered for top-down emission. Recursive cycles are tolerated because
 * `openapi-zod-client` uses `z.ZodType<Name> = z.lazy(...)` for self-refs,
 * which doesn't need forward declarations.
 */
export function extractSubset(
  decls: Map<string, Decl>,
  rootName: string,
): { needed: string[]; order: string[] } {
  const rootId = `const:${rootName}`;
  if (!decls.has(rootId)) {
    throw new Error(`Component not found in generated schemas: ${rootName}`);
  }
  const needed = new Set<string>();
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    if (needed.has(id)) continue;
    needed.add(id);
    const decl = decls.get(id);
    if (!decl) continue;
    for (const dep of decl.deps) if (!needed.has(dep)) stack.push(dep);
  }

  // Topological sort: declarations without remaining deps first.
  // Cycles (recursive types) get emitted in arbitrary order — `z.lazy()` covers it.
  const remaining = new Map<string, Set<string>>();
  for (const id of needed) {
    const decl = decls.get(id)!;
    remaining.set(id, new Set([...decl.deps].filter((d) => needed.has(d) && d !== id)));
  }
  const order: string[] = [];
  while (remaining.size) {
    let progressed = false;
    for (const [id, deps] of remaining) {
      if (deps.size === 0) {
        order.push(id);
        remaining.delete(id);
        for (const others of remaining.values()) others.delete(id);
        progressed = true;
      }
    }
    if (!progressed) {
      // Cycle: emit remaining `type:X` decls first (they're forward-ref-safe in TS),
      // then the const decls. The `const X = z.ZodType<X> = z.lazy(...)` pattern
      // handles the value-level cycle.
      const remIds = [...remaining.keys()];
      remIds.sort((a, b) => (a.startsWith("type:") ? -1 : 1));
      for (const id of remIds) order.push(id);
      break;
    }
  }

  return { needed: [...needed], order };
}

/**
 * Build the inlined Zod source for a resource's `client.ts`.
 *
 * `rootName`: the OpenAPI component name (e.g. "Cohort").
 * `exportName`: what to rename the root declaration to (e.g. "ServerCohortSchema").
 */
export function buildInlinedSchema(
  openapiPath: string,
  rootName: string,
  exportName: string,
): { source: string; inferredTypeName: string } {
  const decls = loadAllDecls(openapiPath);
  const { order } = extractSubset(decls, rootName);

  const inferredTypeName = exportName.replace(/Schema$/, "");

  const lines: string[] = [];
  for (const id of order) {
    const decl = decls.get(id)!;
    if (id === `const:${rootName}`) {
      // Rename `const Cohort = ...` → `export const ServerCohortSchema = ...`
      const renamed = decl.source.replace(
        new RegExp(`^const\\s+${rootName}\\b`),
        `export const ${exportName}`,
      );
      lines.push(makeZod4Friendly(renamed));
      lines.push(`export type ${inferredTypeName} = z.infer<typeof ${exportName}>;`);
    } else {
      lines.push(makeZod4Friendly(decl.source));
    }
  }
  return { source: lines.join("\n\n"), inferredTypeName };
}

/**
 * openapi-zod-client emits Zod-3-style code that the Zod 4 strict typings
 * reject. Two post-processing rewrites cover the cases we hit:
 *
 *   1. `const X: z.ZodType<X> = z.lazy(...)` — Zod 4 can't statically verify
 *      that the `z.lazy()` output is assignable to `z.ZodType<X>` when the
 *      inner schema recursively references `X`. Strip the annotation, append
 *      `as z.ZodType<X>` to the RHS.
 *
 *   2. `z.discriminatedUnion("type", [..., X])` where one of the alternatives
 *      is a `z.ZodType<...>` (recursive ref) doesn't satisfy `$ZodTypeDiscriminable`.
 *      Downgrade to `z.union([...])` — slower (linear option scan) but
 *      functionally equivalent for our parse-only path.
 */
function makeZod4Friendly(source: string): string {
  // Pattern 1: per-declaration. Each `decl.source` is the full `const X: z.ZodType<X> = ...;`.
  // Strip the type annotation and append a cast.
  const m = /^const\s+(\w+)\s*:\s*z\.ZodType<(\w+)>\s*=\s*/.exec(source);
  if (m && source.endsWith(";")) {
    const name = m[1]!;
    const typeArg = m[2]!;
    const rhs = source.slice(m[0].length, -1); // strip trailing `;`
    source = `const ${name} = (${rhs}) as z.ZodType<${typeArg}>;`;
  }

  // Pattern 2: discriminatedUnion → union. Naive but safe.
  source = source.replace(/z\.discriminatedUnion\("[^"]*",\s*/g, "z.union(");

  return source;
}
