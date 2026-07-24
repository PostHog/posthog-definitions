import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerBatchExport, updateBatchExport } from "./client.js";
import { stripMarker, withMarker } from "./pipeline.js";
import type { BatchExport } from "./sdk.js";

export function pullFilter(
  server: ServerBatchExport,
): { kept: true } | { kept: false; reason: string } {
  // Only inline-credential destination types are supported by the SDK.
  const type = server.destination?.type;
  if (type && !["AwsS3", "S3Compatible", "Snowflake"].includes(type)) {
    return { kept: false, reason: `unsupported destination type ${type}` };
  }
  return { kept: true };
}

export function pullLabel(server: ServerBatchExport): { primary: string; secondary?: string } {
  const name = stripMarker(server.name) ?? "(unnamed)";
  return { primary: name.slice(0, 48), secondary: `[${server.destination?.type ?? "?"}]` };
}

export function serverIdOf(server: ServerBatchExport): string {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  _server: ServerBatchExport,
): Promise<PullDependency[]> {
  return [];
}

export function renderToFile(
  server: ServerBatchExport,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const name = stripMarker(server.name) ?? "";
  const baseSlug = slugify(name) || `batch-export-${server.id.slice(0, 8)}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const destType = server.destination?.type ?? "AwsS3";
  const maskedConfig = server.destination?.config ?? {};
  ctx.warn(
    `batch export "${name}": destination credentials are masked on read and cannot be pulled — ` +
      `replace them with secret("ENV_VAR") in ${slug}.ts before applying.`,
  );

  const destination = `{\n    type: ${stringLiteral(destType)},\n    config: ${renderRawLiteral(maskedConfig, 6)},\n  }`;

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(name),
    interval: stringLiteral(server.interval ?? "day"),
    destination,
  };
  if (server.model && server.model !== "events") fields.model = stringLiteral(server.model);
  if (server.paused) fields.paused = "true";
  if (server.timezone) fields.timezone = stringLiteral(server.timezone);

  const parts: string[] = [
    `import { batchExport, secret } from "@posthog/definitions";`,
    "",
    `export default batchExport(${renderObject(fields, 2)});`,
    "",
  ];

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerBatchExport,
  spec: BatchExport,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userName = stripMarker(server.name) ?? "";
  const newName = withMarker(userName, spec.key, hash);
  // Name-only PATCH — no destination, so no secrets are touched.
  await updateBatchExport(config, server.id, { name: newName }, options);
}
