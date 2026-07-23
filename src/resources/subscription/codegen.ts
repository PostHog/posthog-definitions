import type { ClientConfig } from "../../client/config.js";
import { renderObject, stringLiteral } from "../../pull/render.js";
import { slugify } from "../../pull/slug.js";
import type { PullDependency, PullRenderContext, RenderedFile } from "../../pull/types.js";
import { type ServerSubscription, updateSubscription } from "./client.js";
import { stripMarker } from "./pipeline.js";
import type { Subscription } from "./sdk.js";

const MARKER_PREFIX = "iac:subscriptions:";
const HASH_MARKER_PREFIX = "iac:hash:";

export function pullFilter(
  server: ServerSubscription,
): { kept: true } | { kept: false; reason: string } {
  if (server.deleted) return { kept: false, reason: "deleted" };
  return { kept: true };
}

export function pullLabel(server: ServerSubscription): { primary: string; secondary?: string } {
  const title = stripMarker(server.title) ?? "(untitled)";
  return { primary: title.slice(0, 48), secondary: `[${server.frequency ?? "?"} ${server.target_type ?? ""}]` };
}

export function serverIdOf(server: ServerSubscription): number {
  return server.id;
}

export async function pullDependencies(
  _config: ClientConfig,
  server: ServerSubscription,
): Promise<PullDependency[]> {
  const deps: PullDependency[] = [];
  if (server.insight != null) deps.push({ resourceName: "insights", serverId: server.insight });
  if (server.dashboard != null) deps.push({ resourceName: "dashboards", serverId: server.dashboard });
  return deps;
}

export function renderToFile(
  server: ServerSubscription,
  ctx: PullRenderContext,
): RenderedFile | { skipped: true; reason: string } {
  const title = stripMarker(server.title) ?? "";
  const baseSlug = slugify(title) || `subscription-${server.id}`;
  const slug = ctx.uniqueSlug(baseSlug);

  const insightImport =
    server.insight != null ? ctx.importForServerIdOptional("insights", server.insight) : undefined;
  const dashboardImport =
    server.dashboard != null
      ? ctx.importForServerIdOptional("dashboards", server.dashboard)
      : undefined;

  const fields: Record<string, string> = {
    key: stringLiteral(slug),
    title: stringLiteral(title),
  };
  if (insightImport) fields.insight = insightImport.varName;
  if (dashboardImport) fields.dashboard = dashboardImport.varName;
  if (server.target_type) fields.targetType = stringLiteral(server.target_type);
  if (server.target_value) fields.target = stringLiteral(server.target_value);
  if (server.frequency) fields.frequency = stringLiteral(server.frequency);
  if (server.interval != null && server.interval !== 1) fields.interval = String(server.interval);
  if (server.start_date) fields.startDate = stringLiteral(server.start_date);
  if (server.enabled === false) fields.enabled = "false";
  if (server.integration_id != null) fields.integrationId = String(server.integration_id);
  if (server.summary_enabled) fields.summaryEnabled = "true";

  const parts: string[] = [`import { subscription } from "@posthog/definitions";`];
  if (insightImport) {
    parts.push(`import ${insightImport.varName} from "../insights/${insightImport.filename.replace(/\.ts$/, ".js")}";`);
  }
  if (dashboardImport) {
    parts.push(`import ${dashboardImport.varName} from "../dashboards/${dashboardImport.filename.replace(/\.ts$/, ".js")}";`);
  }
  parts.push("");
  parts.push(`export default subscription(${renderObject(fields, 2)});`);
  parts.push("");

  return { filename: `${slug}.ts`, contents: parts.join("\n"), specKey: slug };
}

export async function tagOnServer(
  config: ClientConfig,
  server: ServerSubscription,
  spec: Subscription,
  hash: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const userTitle = stripMarker(server.title) ?? "";
  const marker = `<!-- ${MARKER_PREFIX}${spec.key} ${HASH_MARKER_PREFIX}${hash} -->`;
  const newTitle = userTitle ? `${userTitle}\n\n${marker}` : marker;
  // send_test_now:false — a title-only edit doesn't trigger delivery, but never
  // rely on that default.
  await updateSubscription(config, server.id, { title: newTitle, send_test_now: false }, options);
}
