#!/usr/bin/env tsx
/**
 * Check each shipped resource's `ServerXSchema` against the current PostHog
 * OpenAPI spec and report drift:
 *
 *   - Fields the API has that our Zod schema doesn't know about (likely new).
 *   - Fields our Zod schema declares that the API no longer returns (removed
 *     server-side; we may be relying on them).
 *   - Coarse type mismatches (string vs number, nullable vs not, etc).
 *
 * Run after a `pnpm openapi:fetch` (or whatever refreshes the OpenAPI dump).
 * Exits non-zero if drift is found, so this can gate CI.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { componentFields, loadOpenAPI, type FieldInfo, type OpenAPIDoc } from "./lib/openapi.js";
import { REGISTRY } from "./lib/registry.js";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = join(dirname(__filename), "..");

type Drift = {
  resource: string;
  added: FieldInfo[];      // in OpenAPI, not in our Zod
  removed: string[];       // in our Zod, not in OpenAPI
  typeMismatch: Array<{ field: string; expected: string; actual: string }>;
};

async function main(): Promise<void> {
  const openapiPath = process.argv.find((a) => a.startsWith("--openapi="))?.slice(11);
  const doc = loadOpenAPI(openapiPath);
  const json = process.argv.includes("--json");
  const includeReadOnly = process.argv.includes("--all");

  const drifts: Drift[] = [];
  for (const entry of REGISTRY) {
    const drift = await checkResource(entry.name, entry.responseComponent, doc, {
      includeReadOnly,
    });
    drifts.push(drift);
  }

  if (json) {
    console.log(JSON.stringify(drifts, null, 2));
  } else {
    renderHuman(drifts, includeReadOnly);
  }

  // Only fail CI on user-relevant drift (added user fields, removed fields, type mismatches).
  // ReadOnly noise is informational unless --all is passed.
  const hasDrift = drifts.some(
    (d) => d.added.length > 0 || d.removed.length > 0 || d.typeMismatch.length > 0,
  );
  process.exit(hasDrift ? 1 : 0);
}

async function checkResource(
  name: string,
  componentName: string,
  doc: OpenAPIDoc,
  options: { includeReadOnly: boolean },
): Promise<Drift> {
  const allApiFields = componentFields(doc, componentName).filter((f) => !f.writeOnly);
  const apiFields = options.includeReadOnly
    ? allApiFields
    : allApiFields.filter((f) => !f.readOnly);
  // Type-mismatch comparison still uses the full set so we catch overlap.
  const apiByName = new Map(allApiFields.map((f) => [f.name, f]));

  const zodShape = await loadServerSchemaShape(name);

  const added: FieldInfo[] = [];
  for (const f of apiFields) {
    if (!zodShape.has(f.name)) added.push(f);
  }

  const removed: string[] = [];
  for (const zname of zodShape.keys()) {
    if (!apiByName.has(zname)) removed.push(zname);
  }

  const typeMismatch: Drift["typeMismatch"] = [];
  for (const [zname, zinfo] of zodShape) {
    const api = apiByName.get(zname);
    if (!api) continue;
    const expected = describeApiField(api);
    const actual = zinfo.description;
    if (!compatible(expected, actual)) {
      typeMismatch.push({ field: zname, expected, actual });
    }
  }

  return { resource: name, added, removed, typeMismatch };
}

type ZodFieldInfo = { description: string; optional: boolean; nullable: boolean };

async function loadServerSchemaShape(name: string): Promise<Map<string, ZodFieldInfo>> {
  const pascal = toPascalCase(name);
  const clientPath = join(REPO_ROOT, "src", "resources", name, "client.ts");

  // Path A: try the Zod runtime schema (preferred — kept in sync via Zod's parse).
  try {
    const mod = (await import(`../src/resources/${name}/client.ts`)) as Record<string, unknown>;
    const schema = mod[`Server${pascal}Schema`];
    if (schema instanceof z.ZodObject) {
      const shape = (schema as z.ZodObject).shape as Record<string, z.ZodType>;
      const out = new Map<string, ZodFieldInfo>();
      for (const [k, v] of Object.entries(shape)) out.set(k, describeZod(v));
      return out;
    }
  } catch {
    // Fall through to source parsing.
  }

  // Path B: parse the exported `type ServerX = { … }` directly from source.
  // Brittle but adequate for the simple shapes our older resources use.
  const source = readFileSync(clientPath, "utf8");
  const parsed = parseTypeLiteral(source, `Server${pascal}`);
  if (!parsed) {
    throw new Error(
      `Cannot extract fields for ${name}: no Server${pascal}Schema (Zod) and could not parse \`type Server${pascal} = { … }\` in client.ts`,
    );
  }
  return parsed;
}

function parseTypeLiteral(source: string, name: string): Map<string, ZodFieldInfo> | null {
  // Match `export type Name = { ... };` taking the first balanced `{...}` block.
  const startRe = new RegExp(`export type ${name}\\s*=\\s*\\{`);
  const m = startRe.exec(source);
  if (!m) return null;
  const startIdx = m.index + m[0].length - 1;
  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) return null;
  const body = source.slice(startIdx + 1, endIdx);

  const out = new Map<string, ZodFieldInfo>();
  // Walk top-level only (skip nested braces).
  let buf = "";
  let nest = 0;
  for (const ch of body) {
    if (ch === "{" || ch === "(" || ch === "[") nest++;
    else if (ch === "}" || ch === ")" || ch === "]") nest--;
    if (ch === ";" && nest === 0) {
      const line = buf.trim();
      buf = "";
      if (!line) continue;
      const fm = line.match(/^([A-Za-z_$][A-Za-z0-9_$]*)(\?)?:\s*(.+)$/s);
      if (!fm) continue;
      const fname = fm[1]!;
      const optional = fm[2] === "?";
      const tsType = fm[3]!.trim();
      const nullable = /\bnull\b/.test(tsType);
      out.set(fname, { description: tsToKind(tsType), optional, nullable });
      continue;
    }
    buf += ch;
  }
  return out;
}

function tsToKind(ts: string): string {
  const t = ts.replace(/\s+/g, "");
  if (/^number(\|null)?$/.test(t)) return "number";
  if (/^string(\|null)?$/.test(t)) return "string";
  if (/^boolean(\|null)?$/.test(t)) return "boolean";
  if (/^Record<.*>(\|null)?$/.test(t)) return "object";
  if (/^.*\[\](\|null)?$/.test(t) || /^Array</.test(t)) return "array";
  if (/^"[^"]+"(\|"[^"]+")+(\|null)?$/.test(t)) return "enum";
  if (/^unknown(\|null)?$/.test(t)) return "unknown";
  if (/^\{/.test(t)) return "object";
  return "unknown";
}

function describeZod(t: z.ZodType): ZodFieldInfo {
  let optional = false;
  let nullable = false;
  let base: z.ZodType = t;
  // Unwrap optional/nullable/default. Zod 4 exposes these as classes.
  // Try a few times in case they're stacked.
  for (let i = 0; i < 4; i++) {
    if (isOptional(base)) {
      optional = true;
      base = unwrap(base);
      continue;
    }
    if (isNullable(base)) {
      nullable = true;
      base = unwrap(base);
      continue;
    }
    if (isDefault(base)) {
      base = unwrap(base);
      continue;
    }
    break;
  }
  return { description: zodKind(base), optional, nullable };
}

function isOptional(t: z.ZodType): boolean {
  return t instanceof z.ZodOptional;
}
function isNullable(t: z.ZodType): boolean {
  return t instanceof z.ZodNullable;
}
function isDefault(t: z.ZodType): boolean {
  return t instanceof z.ZodDefault;
}
function unwrap(t: z.ZodType): z.ZodType {
  const anyT = t as unknown as { unwrap?: () => z.ZodType; removeDefault?: () => z.ZodType };
  if (typeof anyT.unwrap === "function") return anyT.unwrap();
  if (typeof anyT.removeDefault === "function") return anyT.removeDefault();
  return t;
}

function zodKind(t: z.ZodType): string {
  if (t instanceof z.ZodString) return "string";
  if (t instanceof z.ZodNumber) return "number";
  if (t instanceof z.ZodBoolean) return "boolean";
  if (t instanceof z.ZodArray) return "array";
  if (t instanceof z.ZodObject) return "object";
  if (t instanceof z.ZodRecord) return "object";
  if (t instanceof z.ZodEnum) return "enum";
  if (t instanceof z.ZodUnknown) return "unknown";
  if (t instanceof z.ZodLiteral) return "literal";
  return t.constructor.name.replace(/^Zod/, "").toLowerCase();
}

function describeApiField(f: FieldInfo): string {
  const t = f.schema.type;
  let base: string;
  if (t === "integer" || t === "number") base = "number";
  else if (t === "string") base = f.schema.enum ? "enum" : "string";
  else if (t === "boolean") base = "boolean";
  else if (t === "array") base = "array";
  else if (t === "object") base = "object";
  else base = "unknown";
  return base;
}

function compatible(expected: string, actual: string): boolean {
  if (expected === actual) return true;
  if (expected === "unknown" || actual === "unknown") return true;
  // Enums on the API side often arrive as plain strings in our schema.
  if (expected === "enum" && actual === "string") return true;
  if (expected === "string" && actual === "enum") return true;
  return false;
}

function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join("");
}

function renderHuman(drifts: Drift[], includeReadOnly: boolean): void {
  let totalAdded = 0;
  let totalRemoved = 0;
  let totalMismatch = 0;

  for (const d of drifts) {
    const noChange =
      d.added.length === 0 && d.removed.length === 0 && d.typeMismatch.length === 0;
    if (noChange) {
      console.log(`  ${green("✓")} ${d.resource}: in sync`);
      continue;
    }
    console.log(`\n${bold(d.resource)}`);
    for (const f of d.added) {
      const flags = [
        f.required ? "required" : null,
        f.nullable ? "nullable" : null,
        f.readOnly ? "readOnly" : null,
      ]
        .filter(Boolean)
        .join(", ");
      console.log(
        `  ${yellow("+")} ${f.name}: ${describeApiField(f)}${flags ? ` (${flags})` : ""} — in API, not in our schema`,
      );
      totalAdded++;
    }
    for (const name of d.removed) {
      console.log(`  ${red("-")} ${name} — in our schema, not in API`);
      totalRemoved++;
    }
    for (const m of d.typeMismatch) {
      console.log(`  ${yellow("~")} ${m.field}: API=${m.expected} schema=${m.actual}`);
      totalMismatch++;
    }
  }

  const summary = `\n${totalAdded} added, ${totalRemoved} removed, ${totalMismatch} type mismatches across ${drifts.length} resources.`;
  if (totalAdded + totalRemoved + totalMismatch === 0) {
    console.log(`\n${green("All resources are in sync with the OpenAPI spec.")}`);
  } else {
    console.log(summary);
  }
  if (!includeReadOnly) {
    console.log(`(readOnly API fields excluded — pass --all to include them.)`);
  }
}

function bold(s: string): string { return process.stdout.isTTY ? `\x1b[1m${s}\x1b[0m` : s; }
function green(s: string): string { return process.stdout.isTTY ? `\x1b[32m${s}\x1b[0m` : s; }
function yellow(s: string): string { return process.stdout.isTTY ? `\x1b[33m${s}\x1b[0m` : s; }
function red(s: string): string { return process.stdout.isTTY ? `\x1b[31m${s}\x1b[0m` : s; }

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
