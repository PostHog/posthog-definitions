import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient } from "../../client/typed.js";

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

export type ProjectSettingsPayload = Partial<components["schemas"]["PatchedTeam"]>;

/**
 * Resolve which environment row to GET/PATCH. In a single-environment project
 * (the common case), `project_id` and the environment `id` coincide — both
 * come from `config.projectId`. For multi-env projects, a future config field
 * would supply a distinct env id.
 */
function envId(config: ClientConfig): number {
  return Number(config.projectId);
}

export async function getProjectSettings(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerProjectSettings> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/environments/{id}/", {
    params: { path: { project_id: config.projectId, id: envId(config) } },
  });
  return ServerProjectSettingsSchema.parse(data);
}

export async function patchProjectSettings(
  config: ClientConfig,
  payload: ProjectSettingsPayload,
  options: { verbose?: boolean } = {},
): Promise<ServerProjectSettings> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/environments/{id}/", {
    params: { path: { project_id: config.projectId, id: envId(config) } },
    body: payload as unknown as components["schemas"]["PatchedTeam"],
  });
  return ServerProjectSettingsSchema.parse(data);
}
