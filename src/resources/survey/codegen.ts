import type { ClientConfig } from "../../client/config.js";
import { renderObject, renderRawLiteral, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerSurvey, updateSurvey } from "./client.js";
import type { Survey } from "./sdk.js";

const MARKER_PREFIX = "iac:surveys:";
const HASH_MARKER_PREFIX = "iac:hash:";
const MARKER_REGEX = /\n*<!--\s*iac:surveys:\S+\s+iac:hash:\S+\s*-->\s*$/;

export function pullFilter(
  server: ServerSurvey,
): { kept: true } | { kept: false; reason: string } {
  if ((server as { deleted?: boolean }).deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerSurvey): { primary: string; secondary?: string } {
  const status = server.end_date ? "stopped" : server.start_date ? "running" : "draft";
  return { primary: server.name, secondary: `[${server.type} · ${status}]` };
}

export function serverIdOf(server: ServerSurvey): string {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  server: ServerSurvey,
): Promise<PullDependency[]> {
  const deps: PullDependency[] = [];
  if (server.linked_flag_id != null) {
    deps.push({ resourceName: "feature-flags", serverId: server.linked_flag_id });
  }
  if (server.targeting_flag?.id != null) {
    deps.push({ resourceName: "feature-flags", serverId: server.targeting_flag.id });
  }
  return deps;
}

function flagImport(
  ctx: PullRenderContext,
  id: number | null | undefined,
): { varName: string; filename: string } | undefined {
  if (id == null) return undefined;
  const entry = ctx.importForServerIdOptional("feature-flags", id);
  if (!entry) return undefined;
  return { varName: entry.varName, filename: entry.filename };
}

export function renderToFile(
  server: ServerSurvey,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const baseSlug = slugify(server.name) || `survey-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const linked = flagImport(ctx, server.linked_flag_id);
  if (server.linked_flag_id != null && !linked) {
    ctx.warn(
      `Survey "${server.name}" links feature flag id=${server.linked_flag_id}, but it wasn't pulled. Re-run with cascade on.`,
    );
  }
  const targeting = flagImport(ctx, server.targeting_flag?.id);
  if (server.targeting_flag?.id != null && !targeting) {
    ctx.warn(
      `Survey "${server.name}" targets feature flag id=${server.targeting_flag.id}, but it wasn't pulled.`,
    );
  }

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    name: stringLiteral(server.name),
  };
  const userDescription = stripMarker(server.description);
  if (userDescription) fields.description = stringLiteral(userDescription);
  fields.type = stringLiteral(server.type);
  fields.questions = renderRawLiteral(server.questions ?? [], 2);
  if (server.appearance != null) fields.appearance = renderRawLiteral(server.appearance, 2);
  if (server.conditions != null) fields.conditions = renderRawLiteral(server.conditions, 2);
  if (linked) fields.linkedFlag = linked.varName;
  if (targeting) fields.targetingFlag = targeting.varName;
  const status = server.end_date ? "stopped" : server.start_date ? "running" : "draft";
  if (status !== "draft") fields.status = stringLiteral(status);
  if (server.archived) fields.archived = "true";
  if (server.responses_limit != null) fields.responsesLimit = String(server.responses_limit);
  if (server.enable_partial_responses != null) {
    fields.enablePartialResponses = server.enable_partial_responses ? "true" : "false";
  }
  if (server.schedule) fields.schedule = stringLiteral(server.schedule);

  const parts: string[] = [`import { survey } from "@posthog/definitions";`];
  for (const imp of [linked, targeting]) {
    if (imp) {
      parts.push(
        `import ${imp.varName} from "../feature-flags/${imp.filename.replace(/\.ts$/, ".js")}";`,
      );
    }
  }
  parts.push("");
  parts.push(`export default survey(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerSurvey,
  spec: Survey,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userDescription = stripMarker(server.description);
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newDescription = userDescription ? `${userDescription}\n\n${marker}` : marker;
  await updateSurvey(config, server.id, { description: newDescription }, options);
}

function stripMarker(description: string | null | undefined): string {
  if (!description) return "";
  const m = description.match(MARKER_REGEX);
  if (!m || m.index === undefined) return description;
  return description.slice(0, m.index).replace(/\s+$/, "");
}
