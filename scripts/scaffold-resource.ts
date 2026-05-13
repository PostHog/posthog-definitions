#!/usr/bin/env tsx
/**
 * Scaffold a new posthog-definitions resource from the PostHog OpenAPI spec.
 *
 *   pnpm scaffold-resource \
 *     --name cohort \
 *     --path /api/projects/{project_id}/cohorts/ \
 *     --key-field name
 *
 * Generates 5 files under `src/resources/<name>/` and wires the resource
 * into `src/resources/index.ts`, `src/index.ts`, `docs/resources.md`, and
 * `scripts/lib/registry.ts`. The generated `client.ts` is near-complete; the
 * `pipeline.ts` and `pipeline.test.ts` are templates with `TODO(human)`
 * markers covering the per-resource judgment calls (hash projection, validation,
 * test fixtures). The intent is: scaffold, then hand-edit the pipeline.
 */
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentFields,
  findEndpointComponents,
  loadOpenAPI,
  type FieldInfo,
} from "./lib/openapi.js";
import { toCamelCase, toPascalCase } from "./lib/names.js";
import { buildInlinedSchema } from "./lib/extract-zod.js";

type Args = {
  name: string;
  path: string;
  keyField: string;
  openapiPath?: string;
};

function parseArgs(argv: string[]): Args {
  const out: Partial<Args> = { keyField: "name" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    const next = argv[i + 1];
    if (a === "--name" && next) { out.name = next; i++; }
    else if (a === "--path" && next) { out.path = next; i++; }
    else if (a === "--key-field" && next) { out.keyField = next; i++; }
    else if (a === "--openapi" && next) { out.openapiPath = next; i++; }
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown arg: ${a}`);
      printHelp();
      process.exit(1);
    }
  }
  if (!out.name || !out.path || !out.keyField) {
    printHelp();
    process.exit(1);
  }
  return out as Args;
}

function printHelp(): void {
  console.error(
    `Usage: pnpm scaffold-resource --name <singular> --path <list-path> [--key-field <field>] [--openapi <path>]\n\n` +
      `  --name        resource singular, kebab-case (e.g. cohort, feature-flag)\n` +
      `  --path        OpenAPI list endpoint path (e.g. /api/projects/{project_id}/cohorts/)\n` +
      `  --key-field   field on the API response that identifies the resource (default: name)\n` +
      `  --openapi     path to openapi.json (default: ../posthog/frontend/tmp/openapi.json)\n`,
  );
}

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = join(dirname(__filename), "..");

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const doc = loadOpenAPI(args.openapiPath);

  const components = findEndpointComponents(doc, args.path);
  if (!components.responseComponent) {
    console.error(
      `Could not find a response component for ${args.path}. ` +
        `Make sure the path matches an entry in openapi.json/paths and that GET returns a Paginated<Foo>List.`,
    );
    process.exit(1);
  }

  const ctx = buildContext(args, components.responseComponent, doc);

  ensureDir(ctx.dir);
  writeIfNew(join(ctx.dir, "client.ts"), renderClient(ctx, args));
  writeIfNew(join(ctx.dir, "sdk.ts"), renderSdk(ctx));
  writeIfNew(join(ctx.dir, "pipeline.ts"), renderPipeline(ctx));
  writeIfNew(join(ctx.dir, "pipeline.test.ts"), renderPipelineTest(ctx));
  writeIfNew(join(ctx.dir, "index.ts"), renderIndex(ctx));

  appendToResourcesIndex(ctx);
  appendToSdkIndex(ctx);
  appendToRegistry(ctx);
  flipDocsTable(ctx);

  console.log(`\nScaffolded ${ctx.singular} at ${ctx.dir}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Open src/resources/${ctx.dir.split("/").pop()}/pipeline.ts and fill the TODO(human) markers.`);
  console.log(`  2. Run pnpm typecheck and pnpm test.`);
  console.log(`  3. Run pnpm pull and pnpm apply against a project that has ${ctx.plural}.`);
}

type Ctx = {
  dirName: string;           // "feature-flag"
  singular: string;          // "featureFlag"
  pascal: string;            // "FeatureFlag"
  plural: string;            // "feature-flags" (used in iac: prefix and registry)
  pluralPath: string;        // "feature_flags" (URL segment)
  containerKey: string;      // "projects" or "environments"
  containerParam: string;    // "project_id" or "environment_id" (informational)
  basePath: string;          // /api/projects/{project_id}/feature_flags/
  responseComponent: string;
  keyField: string;
  fields: FieldInfo[];        // raw response component fields
  hasTags: boolean;
  dir: string;
};

function buildContext(args: Args, responseComponent: string, doc: ReturnType<typeof loadOpenAPI>): Ctx {
  const dirName = args.name;
  const singular = toCamelCase(args.name);
  const pascal = toPascalCase(args.name);

  // Derive plural URL segment from the path (e.g. .../feature_flags/ → "feature_flags").
  const segs = args.path.split("/").filter(Boolean);
  const pluralPath = segs[segs.length - 1] ?? args.name;
  const plural = pluralizeKebab(args.name);

  const containerKey = args.path.includes("/environments/") ? "environments" : "projects";
  const containerParam = containerKey === "environments" ? "environment_id" : "project_id";

  const fields = componentFields(doc, responseComponent);
  const hasTags = fields.some((f) => f.name === "tags");

  return {
    dirName,
    singular,
    pascal,
    plural,
    pluralPath,
    containerKey,
    containerParam,
    basePath: args.path,
    responseComponent,
    keyField: args.keyField,
    fields,
    hasTags,
    dir: join(REPO_ROOT, "src", "resources", dirName),
  };
}

function pluralizeKebab(name: string): string {
  if (name.endsWith("s")) return name;
  if (name.endsWith("y")) return `${name.slice(0, -1)}ies`;
  return `${name}s`;
}

// -- File renderers --------------------------------------------------------

function renderClient(ctx: Ctx, args: Args): string {
  // Generate the deep ServerXSchema (with all transitive component refs inlined)
  // by extracting the openapi-zod-client output for this component.
  const { source: schemaSource } = buildInlinedSchema(
    args.openapiPath ?? "../posthog/frontend/tmp/openapi.json",
    ctx.responseComponent,
    `Server${ctx.pascal}Schema`,
  );

  const pluralCap = toPascalCase(ctx.plural);
  const idType = idTypeFromFields(ctx.fields);

  // Create-input fields: skip readOnly (server-set).
  const createFields = ctx.fields.filter((f) => !f.readOnly);
  const createLines = createFields.map((f) => {
    const opt = f.required ? "" : "?";
    const tsType = openapiToTsType(f);
    return `  ${f.name}${opt}: ${tsType};`;
  });

  return `import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import { request } from "../../client/http.js";

// Schemas below are generated from the OpenAPI spec via scripts/scaffold-resource.ts.
// Regenerate with: pnpm scaffold-resource (will overwrite local edits — keep them in pipeline.ts).
${schemaSource}

const Paginated${ctx.pascal}Schema = z.object({
  count: z.number().optional(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(Server${ctx.pascal}Schema),
});

export type ${ctx.pascal}Create = {
${createLines.join("\n")}
};

export type ${ctx.pascal}Update = Partial<${ctx.pascal}Create>;

function ${ctx.singular}sPath(projectId: string, suffix = ""): string {
  return \`/api/${ctx.containerKey}/\${projectId}/${ctx.pluralPath}/\${suffix}\`;
}

const MANAGED_TAG_PREFIX = "iac:${ctx.plural}:";

export async function listManaged${pluralCap}(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<Server${ctx.pascal}[]> {
  const collected: Server${ctx.pascal}[] = [];
  let nextPath: string | null = \`\${${ctx.singular}sPath(config.projectId)}?limit=100\`;
  while (nextPath) {
    const raw: unknown = await request<unknown>(config, nextPath, {
      verbose: options.verbose,
    });
    const page = Paginated${ctx.pascal}Schema.parse(raw);
    for (const row of page.results) {
${ctx.hasTags
        ? `      if (row.tags?.some((tag) => typeof tag === "string" && tag.startsWith(MANAGED_TAG_PREFIX))) {\n        collected.push(row);\n      }`
        : `      // TODO(human): no \`tags\` field on this resource — fall back to a description-marker filter\n      // (see src/resources/endpoint/client.ts) or pick another identity mechanism.\n      collected.push(row);`}
    }
    if (page.next) {
      const url = new URL(page.next);
      nextPath = \`\${url.pathname}\${url.search}\`;
    } else {
      nextPath = null;
    }
  }
  return collected;
}

export async function get${ctx.pascal}(
  config: ClientConfig,
  id: ${idType},
  options: { verbose?: boolean } = {},
): Promise<Server${ctx.pascal}> {
  const raw: unknown = await request<unknown>(
    config,
    ${ctx.singular}sPath(config.projectId, \`\${id}/\`),
    { verbose: options.verbose },
  );
  return Server${ctx.pascal}Schema.parse(raw);
}

export async function create${ctx.pascal}(
  config: ClientConfig,
  payload: ${ctx.pascal}Create,
  options: { verbose?: boolean } = {},
): Promise<Server${ctx.pascal}> {
  const raw: unknown = await request<unknown>(config, ${ctx.singular}sPath(config.projectId), {
    method: "POST",
    body: payload,
    verbose: options.verbose,
  });
  return Server${ctx.pascal}Schema.parse(raw);
}

export async function update${ctx.pascal}(
  config: ClientConfig,
  id: ${idType},
  payload: ${ctx.pascal}Update,
  options: { verbose?: boolean } = {},
): Promise<Server${ctx.pascal}> {
  const raw: unknown = await request<unknown>(
    config,
    ${ctx.singular}sPath(config.projectId, \`\${id}/\`),
    {
      method: "PATCH",
      body: payload,
      verbose: options.verbose,
    },
  );
  return Server${ctx.pascal}Schema.parse(raw);
}

export async function delete${ctx.pascal}(
  config: ClientConfig,
  id: ${idType},
  options: { verbose?: boolean } = {},
): Promise<void> {
  await request<void>(config, ${ctx.singular}sPath(config.projectId, \`\${id}/\`), {
    method: "DELETE",
    verbose: options.verbose,
  });
}
`;
}

function renderSdk(ctx: Ctx): string {
  // Build a permissive user-facing input type from create fields (readOnly excluded).
  // This is a starting point — humans typically narrow it.
  const createFields = ctx.fields.filter((f) => !f.readOnly);
  const lines = createFields.map((f) => {
    const opt = f.required ? "" : "?";
    return `  ${f.name}${opt}: ${openapiToTsType(f)};`;
  });

  return `import { markResourceKind } from "../types.js";

/**
 * TODO(human): narrow this type. The scaffold starts from the OpenAPI create
 * request body, which often includes more fields than the IaC layer should
 * expose (e.g. fields the server overwrites, deprecated aliases, …).
 */
export type ${ctx.pascal} = {
${lines.join("\n")}
};

export function ${ctx.singular}(spec: ${ctx.pascal}): ${ctx.pascal} {
  return markResourceKind(spec, "${ctx.singular}");
}
`;
}

function renderPipeline(ctx: Ctx): string {
  const tagPrefix = `iac:${ctx.plural}:`;
  const pluralCap = toPascalCase(ctx.plural);
  const idType = idTypeFromFields(ctx.fields);

  return `import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/http.js";
import { specHash } from "../../apply/hash.js";
import {
  arr,
  displayJson,
  filterUserTags,
  obj,
  scalar,
  type DisplayValue,
} from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/safety.js";
import type { ApplyContext, ResourceOp } from "../types.js";
import { getResourceKind } from "../types.js";
import type { ${ctx.pascal} } from "./sdk.js";
import {
  create${ctx.pascal},
  delete${ctx.pascal},
  type ${ctx.pascal}Create,
  get${ctx.pascal},
  type Server${ctx.pascal},
  update${ctx.pascal},
} from "./client.js";

export const ${constName(ctx.singular)}_TAG_PREFIX = "${tagPrefix}";
export const HASH_TAG_PREFIX = "iac:hash:";

export function ${ctx.singular}Tag(key: string): string {
  return \`\${${constName(ctx.singular)}_TAG_PREFIX}\${key}\`;
}

${ctx.hasTags ? `export function ${ctx.singular}KeyFromTags(tags: unknown[] | undefined): string | undefined {
  const tag = tags?.find(
    (t): t is string => typeof t === "string" && t.startsWith(${constName(ctx.singular)}_TAG_PREFIX),
  );
  return tag?.slice(${constName(ctx.singular)}_TAG_PREFIX.length);
}

export function ${ctx.singular}HashFromTags(tags: unknown[] | undefined): string | undefined {
  return tags
    ?.find((t): t is string => typeof t === "string" && t.startsWith(HASH_TAG_PREFIX))
    ?.slice(HASH_TAG_PREFIX.length);
}

function hashTag(hex: string): string {
  return \`\${HASH_TAG_PREFIX}\${hex}\`;
}

function mergeTags(userTags: unknown[] | undefined, managedTags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of managedTags) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  for (const tag of userTags ?? []) {
    if (typeof tag !== "string") continue;
    if (tag.startsWith("iac:")) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}
` : `// TODO(human): this resource does not have a \`tags\` array. Choose an
// identity mechanism — e.g. a description-marker like src/resources/endpoint
// uses — and implement \`<key|hash>From<Marker>\`.
export function ${ctx.singular}KeyFromTags(_tags: unknown): string | undefined {
  throw new Error("not implemented — pick an identity mechanism");
}
export function ${ctx.singular}HashFromTags(_tags: unknown): string | undefined {
  throw new Error("not implemented — pick an identity mechanism");
}
`}

/**
 * TODO(human): confirm this projection includes every user-intent field and
 * excludes every server-set field (id, created_at, created_by, version, iac:* tags).
 * Getting this wrong means every apply rewrites unchanged resources, or skips
 * real changes. See src/resources/feature-flag/pipeline.ts for a worked example.
 */
function ${ctx.singular}SpecForHash(spec: ${ctx.pascal}): unknown {
  return spec;
}

export function ${ctx.singular}Hash(spec: ${ctx.pascal}): string {
  return specHash(${ctx.singular}SpecForHash(spec));
}

export function ${ctx.singular}Payload(spec: ${ctx.pascal}, hash: string): ${ctx.pascal}Create {
  // TODO(human): construct the create/update payload. If this resource is
  // tag-identified, merge \`${ctx.singular}Tag(spec.${ctx.keyField})\` and \`hashTag(hash)\` into spec.tags.
  ${ctx.hasTags ? `return { ...spec, tags: mergeTags((spec as { tags?: unknown[] }).tags, [${ctx.singular}Tag(spec.${ctx.keyField} as string), hashTag(hash)]) } as ${ctx.pascal}Create;` : `void hash;\n  return spec as ${ctx.pascal}Create;`}
}

export function looksLike${ctx.pascal}(value: unknown): value is ${ctx.pascal} {
  if (getResourceKind(value) === "${ctx.singular}") return true;
  // TODO(human): optional structural fallback for inline specs not produced by the SDK factory.
  return false;
}

export function validate${pluralCap}(specs: ${ctx.pascal}[]): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const spec of specs) {
    const key = (spec as Record<string, unknown>).${ctx.keyField};
    if (typeof key !== "string" || !key) {
      issues.push("${ctx.singular}.${ctx.keyField} is required");
      continue;
    }
    if (seen.has(key)) issues.push(\`Duplicate ${ctx.singular} ${ctx.keyField} "\${key}"\`);
    seen.add(key);
    // TODO(human): add resource-specific validation rules.
  }
  return issues;
}

${ctx.hasTags ? `async function assertManaged${ctx.pascal}(
  config: ClientConfig,
  id: ${idType},
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await get${ctx.pascal}(config, id, options);
  const tags = (current as { tags?: unknown[] }).tags;
  const ok = tags?.some((t) => t === ${ctx.singular}Tag(key));
  if (!ok) throw new SafetyViolationError("${ctx.singular}", id, key);
}
` : `async function assertManaged${ctx.pascal}(
  _config: ClientConfig,
  _id: ${idType},
  _key: string,
  _options: { verbose?: boolean },
): Promise<void> {
  // TODO(human): refetch and assert this id still bears our managed marker
  // before any mutating call. Throw SafetyViolationError otherwise.
}
`}
export async function run${ctx.pascal}Op(
  config: ClientConfig,
  op: ResourceOp<${ctx.pascal}, Server${ctx.pascal}>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;
  const payload = ${ctx.singular}Payload(op.spec, op.hash);
  if (op.kind === "create") {
    await create${ctx.pascal}(config, payload, options);
    return;
  }
  await assertManaged${ctx.pascal}(config, op.serverId as ${idType}, op.key, options);
  await update${ctx.pascal}(config, op.serverId as ${idType}, payload, options);
}

export async function prune${ctx.pascal}(
  config: ClientConfig,
  orphan: Server${ctx.pascal},
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const id = (orphan as { id?: ${idType} }).id;
  if (id === undefined) return false;
  ${ctx.hasTags ? `const key = ${ctx.singular}KeyFromTags((orphan as { tags?: unknown[] }).tags) ?? \`id:\${id}\`;` : `const key = "TODO";`}
  try {
    await assertManaged${ctx.pascal}(config, id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await delete${ctx.pascal}(config, id, options);
  return true;
}

export function display${ctx.pascal}(spec: ${ctx.pascal}): DisplayValue {
  // TODO(human): list user-intent fields explicitly (scalar/obj/arr) for readable diffs.
  return displayJson(spec as unknown);
}

export function display${ctx.pascal}FromServer(server: Server${ctx.pascal}): DisplayValue {
  // TODO(human): mirror the displaySpec field order. \`filterUserTags\` strips iac:* tags.
  void arr; void obj; void scalar; void filterUserTags;
  return displayJson(server as unknown);
}
`;
}

function renderPipelineTest(ctx: Ctx): string {
  return `import { describe, it } from "node:test";
import assert from "node:assert";
import { ${ctx.singular}Hash, looksLike${ctx.pascal}, validate${toPascalCase(ctx.plural)} } from "./pipeline.js";
import { ${ctx.singular} } from "./sdk.js";

describe("${ctx.singular} pipeline (TODO: replace fixtures)", () => {
  it("validates a minimal spec", () => {
    const spec = ${ctx.singular}({ ${ctx.keyField}: "demo" } as Parameters<typeof ${ctx.singular}>[0]);
    const issues = validate${toPascalCase(ctx.plural)}([spec]);
    assert.deepEqual(issues, []);
  });

  it("computes a stable hash", () => {
    const spec = ${ctx.singular}({ ${ctx.keyField}: "demo" } as Parameters<typeof ${ctx.singular}>[0]);
    const h1 = ${ctx.singular}Hash(spec);
    const h2 = ${ctx.singular}Hash(spec);
    assert.equal(h1, h2);
    assert.match(h1, /^[a-f0-9]{16}$/);
  });

  it("recognizes its own specs", () => {
    const spec = ${ctx.singular}({ ${ctx.keyField}: "demo" } as Parameters<typeof ${ctx.singular}>[0]);
    assert.equal(looksLike${ctx.pascal}(spec), true);
    assert.equal(looksLike${ctx.pascal}({ ${ctx.keyField}: "demo" }), false);
  });

  // TODO(human): add tests for:
  //   - create / update / unchanged / orphan ops via runFooOp
  //   - safety invariant (refuse to mutate a row whose managed marker has been removed)
});
`;
}

function renderIndex(ctx: Ctx): string {
  const pluralCap = toPascalCase(ctx.plural);
  return `import type { ApplyContext, ResourceModule } from "../types.js";
import type { ${ctx.pascal} } from "./sdk.js";
import {
  display${ctx.pascal},
  display${ctx.pascal}FromServer,
  ${constName(ctx.singular)}_TAG_PREFIX,
  ${ctx.singular}Hash,
  ${ctx.singular}HashFromTags,
  ${ctx.singular}KeyFromTags,
  looksLike${ctx.pascal},
  prune${ctx.pascal},
  run${ctx.pascal}Op,
  validate${pluralCap},
} from "./pipeline.js";
import { listManaged${pluralCap}, type Server${ctx.pascal} } from "./client.js";

export { ${ctx.singular} } from "./sdk.js";
export type { ${ctx.pascal} } from "./sdk.js";

export const ${ctx.singular}Resource: ResourceModule<${ctx.pascal}, Server${ctx.pascal}> = {
  name: "${ctx.plural}",
  displayName: "${ctx.singular}",
  identityPrefix: ${constName(ctx.singular)}_TAG_PREFIX,

  isSpec: looksLike${ctx.pascal},
  specKey: (spec) => (spec as Record<string, unknown>).${ctx.keyField} as string,

  list: listManaged${pluralCap},
  keyFromServer: (server) => ${ctx.singular}KeyFromTags((server as { tags?: unknown[] }).tags),
  hashFromServer: (server) => ${ctx.singular}HashFromTags((server as { tags?: unknown[] }).tags),

  hash: ${ctx.singular}Hash,
  validate: (specs) => validate${pluralCap}(specs),
  executeOp: run${ctx.pascal}Op,
  prune: prune${ctx.pascal},

  displaySpec: (spec, _ctx: ApplyContext) => display${ctx.pascal}(spec),
  displayServer: (server, _ctx: ApplyContext) => display${ctx.pascal}FromServer(server),
};
`;
}

// -- Index updates ---------------------------------------------------------

function appendToResourcesIndex(ctx: Ctx): void {
  const file = join(REPO_ROOT, "src", "resources", "index.ts");
  let src = readFileSync(file, "utf8");
  const importLine = `import { ${ctx.singular}Resource } from "./${ctx.dirName}/index.js";`;
  const reexportLine = `export { ${ctx.singular}Resource } from "./${ctx.dirName}/index.js";`;
  if (src.includes(importLine)) {
    console.log(`Skipping src/resources/index.ts (already wired).`);
    return;
  }
  // Insert import at end of import block (last `import ... from "./...index.js"`).
  src = src.replace(
    /(import \{ insightResource \} from "\.\/insight\/index\.js";)/,
    `${importLine}\n$1`,
  );
  // Add to RESOURCES array — append before closing bracket.
  src = src.replace(
    /(\];\n\nexport \{ insightResource \})/,
    `  ${ctx.singular}Resource as ResourceModule<unknown, unknown>,\n$1`,
  );
  // Append re-export.
  if (!src.includes(reexportLine)) {
    src = src.replace(
      /(export type \{ ResourceModule.*?\n)/,
      `${reexportLine}\n$1`,
    );
  }
  writeFileSync(file, src);
  console.log(`Wired src/resources/index.ts`);
}

function appendToSdkIndex(ctx: Ctx): void {
  const file = join(REPO_ROOT, "src", "index.ts");
  let src = readFileSync(file, "utf8");
  const block = `\nexport { ${ctx.singular} } from "./resources/${ctx.dirName}/index.js";\nexport type { ${ctx.pascal} } from "./resources/${ctx.dirName}/index.js";\n`;
  if (src.includes(`./resources/${ctx.dirName}/index.js`)) {
    console.log(`Skipping src/index.ts (already wired).`);
    return;
  }
  writeFileSync(file, src + block);
  console.log(`Wired src/index.ts`);
}

function appendToRegistry(ctx: Ctx): void {
  const file = join(REPO_ROOT, "scripts", "lib", "registry.ts");
  let src = readFileSync(file, "utf8");
  if (src.includes(`name: "${ctx.dirName}"`)) {
    console.log(`Skipping scripts/lib/registry.ts (already wired).`);
    return;
  }
  const entry = `  {
    name: "${ctx.dirName}",
    openapiPath: "${ctx.basePath}",
    responseComponent: "${ctx.responseComponent}",
  },
];`;
  src = src.replace(/\n\];\s*$/, `\n${entry}\n`);
  writeFileSync(file, src);
  console.log(`Wired scripts/lib/registry.ts`);
}

function flipDocsTable(ctx: Ctx): void {
  const file = join(REPO_ROOT, "docs", "resources.md");
  if (!existsSync(file)) return;
  let src = readFileSync(file, "utf8");
  // Heuristic: find a row that mentions the path segment.
  const pathHint = ctx.pluralPath;
  const rowRe = new RegExp(`(\\| [^|]+ \\| ✅ \`[^\`]*${escapeRegex(pathHint)}[^\`]*\` \\| )❌( \\|[^\\n]*)`);
  if (!rowRe.test(src)) {
    console.log(`Could not find a docs/resources.md row to flip for ${pathHint}.`);
    return;
  }
  src = src.replace(rowRe, `$1✅$2`);
  writeFileSync(file, src);
  console.log(`Flipped docs/resources.md row for ${pathHint}.`);
}

// -- helpers ---------------------------------------------------------------

function idTypeFromFields(fields: FieldInfo[]): string {
  const id = fields.find((f) => f.name === "id");
  if (!id) return "number | string";
  if (id.schema.type === "integer" || id.schema.type === "number") return "number";
  return "string";
}

function openapiToTsType(f: FieldInfo): string {
  const t = f.schema.type;
  let base: string;
  if (t === "string") {
    if (f.schema.enum && Array.isArray(f.schema.enum) && f.schema.enum.every((v) => typeof v === "string")) {
      base = (f.schema.enum as string[]).map((v) => JSON.stringify(v)).join(" | ");
    } else base = "string";
  } else if (t === "integer" || t === "number") base = "number";
  else if (t === "boolean") base = "boolean";
  else if (t === "array") base = "unknown[]";
  else if (t === "object") base = "Record<string, unknown>";
  else base = "unknown";
  return f.nullable ? `${base} | null` : base;
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeIfNew(path: string, content: string): void {
  if (existsSync(path)) {
    console.log(`Skipping ${shortPath(path)} (already exists).`);
    return;
  }
  writeFileSync(path, content);
  console.log(`Wrote ${shortPath(path)}`);
}

function shortPath(p: string): string {
  return p.replace(REPO_ROOT + "/", "");
}

function constName(camel: string): string {
  return camel.replace(/([A-Z])/g, "_$1").toUpperCase();
}

function safeKey(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
