import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { ApiError } from "../../client/typed.js";

/**
 * Server-shape for the environment-settings singleton. `.loose()` because
 * PatchedTeam exposes ~60 fields and we only care about the ones the user
 * can declare via the factory; everything else carries through untouched.
 */
export const ServerProjectSettingsSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .loose();

export type ServerProjectSettings = z.infer<typeof ServerProjectSettingsSchema>;

export type ProjectSettingsPayload = Partial<components["schemas"]["PatchedProjectBackwardCompat"]>;

/**
 * Resolve which environment row to GET/PATCH. In a single-environment project
 * (the common case), `project_id` and the environment `id` coincide — both
 * come from `config.projectId`. For multi-env projects, a future config field
 * would supply a distinct env id.
 */
function envId(config: ClientConfig): number {
  return Number(config.projectId);
}

/**
 * The nested `/api/projects/{project_id}/environments/{id}/` path was
 * restricted server-side ("Multiple environments per project are no longer
 * available"). The flat `/api/environments/{id}/` endpoint returns the same
 * Team row and is what we use here. It's not in the generated OpenAPI types
 * yet, so we call it via plain fetch and mirror the typed client's error
 * shape (`ApiError`) so callers up the stack are unaffected.
 */
async function callEnvironment(
  config: ClientConfig,
  method: "GET" | "PATCH",
  body?: unknown,
  options: { verbose?: boolean } = {},
): Promise<ServerProjectSettings> {
  const url = `${config.host}/api/environments/${envId(config)}/`;
  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };
  if (options.verbose) console.error(`[http] → ${method} ${url}`);
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, method, response.url, text, undefined);
  }
  const data = await response.json();
  return ServerProjectSettingsSchema.parse(data);
}

export async function getProjectSettings(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerProjectSettings> {
  return callEnvironment(config, "GET", undefined, options);
}

export async function patchProjectSettings(
  config: ClientConfig,
  payload: ProjectSettingsPayload,
  options: { verbose?: boolean } = {},
): Promise<ServerProjectSettings> {
  return callEnvironment(config, "PATCH", payload, options);
}
