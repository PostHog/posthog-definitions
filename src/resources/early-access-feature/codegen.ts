import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerEarlyAccessFeature, updateEarlyAccessFeature } from "./client.js";
import type { EarlyAccessFeature } from "./sdk.js";

const MARKER_PREFIX = "iac:early-access-features:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:early-access-features:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerEarlyAccessFeature,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(server: ServerEarlyAccessFeature): { primary: string; secondary?: string } {
  return { primary: server.name, secondary: `[${server.stage}]` };
}

export function serverIdOf(server: ServerEarlyAccessFeature): string {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  server: ServerEarlyAccessFeature,
): Promise<PullDependency[]> {
  if (server.feature_flag?.id != null) {
    return [{ resourceName: "feature-flags", serverId: server.feature_flag.id }];
  }
  return [];
}

export function renderToFile(
  server: ServerEarlyAccessFeature,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `early-access-feature-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const flagId = server.feature_flag?.id;
  const flagEntry = flagId != null ? ctx.importForServerIdOptional("feature-flags", flagId) : undefined;
  if (!flagEntry) {
    ctx.warn(
      `Early access feature "${server.name}" links feature flag id=${flagId ?? "?"}, but it wasn't pulled. Re-run with cascade on.`,
    );
    return {
      skipped: true,
      reason: `feature flag for early access feature "${server.name}" not available`,
    };
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.stage = stringLiteral(server.stage);
  if (server.documentation_url) fields.documentationUrl = stringLiteral(server.documentation_url);
  if (server.payload != null && Object.keys(server.payload).length > 0) {
    fields.payload = renderRawLiteral(server.payload, 2);
  }
  fields.featureFlag = flagEntry.varName;

  const parts: string[] = [`import { earlyAccessFeature } from "@posthog/definitions";`];
  parts.push(
    `import ${flagEntry.varName} from "../feature-flags/${flagEntry.filename.replace(/\.ts$/, ".js")}";`,
  );
  parts.push("");
  parts.push(`export default earlyAccessFeature(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerEarlyAccessFeature,
  spec: EarlyAccessFeature,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateEarlyAccessFeature(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
