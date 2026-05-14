/**
 * Regenerate src/generated/api.d.ts from PostHog's OpenAPI schema, trimming
 * down to the operations listed in openapi-filter.yaml.
 *
 *   pnpm codegen           # default: https://us.posthog.com/api/schema/
 *   POSTHOG_OPENAPI_URL=… pnpm codegen
 *
 * Untrimmed schema is ~7.8 MB / 107k lines of TS; trimmed is ~500 KB / 13k.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import { openapiFilter, parseString } from "openapi-format";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_URL = process.env.POSTHOG_OPENAPI_URL ?? "https://us.posthog.com/api/schema/?format=json";
const FILTER_PATH = resolve(ROOT, "openapi-filter.yaml");
const OUTPUT_PATH = resolve(ROOT, "src/generated/api.d.ts");

async function main(): Promise<void> {
  console.log(`→ fetching ${SCHEMA_URL}`);
  const response = await fetch(SCHEMA_URL);
  if (!response.ok) {
    throw new Error(`fetch ${SCHEMA_URL} → ${response.status}`);
  }
  const schema = (await response.json()) as Record<string, unknown>;

  console.log(`→ filtering with ${FILTER_PATH}`);
  const filterSet = await parseString(await readFile(FILTER_PATH, "utf8"));
  const { data: trimmed } = await openapiFilter(schema, { filterSet });

  console.log(`→ emitting ${OUTPUT_PATH}`);
  const ast = await openapiTS(trimmed);
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, astToString(ast));

  console.log("✓ done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
