import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import { getHogFunction, type ServerHogFunction, updateHogFunction } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { HogFunction } from "./sdk.js";

const MARKER_PREFIX = "iac:hog-functions:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerHogFunction,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  // Only template-based functions are representable — custom raw-hog functions
  // aren't managed by this resource.
  if (!server.template?.id) return { kept: false, reason: "no source template (custom hog)" };
  return { kept: true };
}

export function pullLabel(server: ServerHogFunction): { primary: string; secondary?: string } {
  return { primary: server.name ?? server.id, secondary: `[${server.type ?? "?"}]` };
}

export function serverIdOf(server: ServerHogFunction): string {
  return server.id;
}

/** The list is minimal (no inputs); retrieve the full row before rendering. */
export async function hydrateForPull(
  config: ClientConfig,
  server: ServerHogFunction,
  options: { verbose?: boolean } = {},
): Promise<ServerHogFunction> {
  return getHogFunction(config, server.id, options);
}

export function renderToFile(
  server: ServerHogFunction,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name ?? "") || `hog-function-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    type: stringLiteral(server.type ?? "destination"),
    name: stringLiteral(server.name ?? ""),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.templateId = stringLiteral(server.template?.id ?? "");
  if (server.enabled === false) fields.enabled = "false";

  let usesSecret = false;
  const inputEntries = Object.entries(server.inputs ?? {});
  if (inputEntries.length > 0) {
    const inputFields: Record<string, string> = {};
    for (const [key, item] of inputEntries) {
      if ((item as { secret?: boolean }).secret) {
        usesSecret = true;
        // The value is masked on read — we can't recover it. Emit a placeholder
        // env reference the operator must fill in.
        inputFields[key] = `secret(${stringLiteral(`REPLACE_ME_${key.toUpperCase()}`)})`;
        ctx.warn(
          `hog function "${server.name}" input "${key}" is a secret — its value is masked on read. Set the env var and edit the placeholder in ${slug}.ts.`,
        );
      } else {
        inputFields[key] = renderRawLiteral((item as { value?: unknown }).value, 4);
      }
    }
    fields.inputs = renderObject(inputFields, 4);
  }
  if (server.filters != null) fields.filters = renderRawLiteral(server.filters, 2);

  const imports = usesSecret
    ? `import { hogFunction, secret } from "@posthog/definitions";`
    : `import { hogFunction } from "@posthog/definitions";`;
  const contents = [imports, "", `export default hogFunction(${renderObject(fields, 2)});`, ""].join("\n");

  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerHogFunction,
  spec: HogFunction,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateHogFunction(config, server.id, { description: newDescription }, options);
}
