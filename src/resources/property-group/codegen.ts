import type { ClientConfig } from "../../client/config.js";
import { renderObject, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullRenderContext, RenderedFile } from "../../pull/types.js";
import {
  type ServerPropertyGroup,
  type ServerPropertyGroupProperty,
  updatePropertyGroup,
} from "./client.js";
import type { PropertyGroup } from "./sdk.js";

const MARKER_PREFIX = "iac:property-groups:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:property-groups:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  _server: ServerPropertyGroup,
): { kept: true } | { kept: false; reason: string } {
  return { kept: true };
}

export function pullLabel(server: ServerPropertyGroup): { primary: string; secondary?: string } {
  const propCount = (server.properties ?? []).length;
  return {
    primary: server.name,
    secondary: propCount > 0 ? `[${propCount} props]` : undefined,
  };
}

export function serverIdOf(server: ServerPropertyGroup): string {
  return server.id;
}

export function renderToFile(
  server: ServerPropertyGroup,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `property-group-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const properties = [...(server.properties ?? [])].sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );

  if (properties.length === 0) {
    return {
      skipped: true,
      reason: `property group "${server.name}" has no properties`,
    };
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.properties = renderProperties(properties, 4);

  const body = renderObject(fields, 2);
  const contents =
    `import { propertyGroup } from "@posthog/definitions";\n\n` +
    `export default propertyGroup(${body});\n`;
  return { filename: `${slug}.ts`, contents, specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerPropertyGroup,
  spec: PropertyGroup,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updatePropertyGroup(config, server.id, { description: newDescription }, options);
}

function renderProperties(
  properties: ServerPropertyGroupProperty[],
  indent: number,
): string {
  const indentStr = " ".repeat(indent);
  const closeIndent = " ".repeat(indent - 2);
  const lines: string[] = ["{"];
  for (const prop of properties) {
    const propFields: Record<string, string> = {
      type: stringLiteral(prop.property_type),
    };
    if (prop.is_required) propFields.required = "true";
    if (prop.is_optional_in_types) propFields.is_optional_in_types = "true";
    if (prop.description) propFields.description = stringLiteral(prop.description);
    lines.push(`${indentStr}${formatPropertyKey(prop.name)}: ${renderObject(propFields, indent + 2)},`);
  }
  lines.push(`${closeIndent}}`);
  return lines.join("\n");
}

function formatPropertyKey(name: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : stringLiteral(name);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
