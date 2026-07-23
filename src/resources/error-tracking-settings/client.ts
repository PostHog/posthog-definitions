import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient } from "../../client/typed.js";

/**
 * Server shape for the error-tracking settings singleton. All four fields are
 * nullable integers (null = "no limit").
 */
export const ServerErrorTrackingSettingsSchema = z
  .object({
    project_rate_limit_value: z.number().nullable().optional(),
    project_rate_limit_bucket_size_minutes: z.number().nullable().optional(),
    per_issue_rate_limit_value: z.number().nullable().optional(),
    per_issue_rate_limit_bucket_size_minutes: z.number().nullable().optional(),
  })
  .loose();

export type ServerErrorTrackingSettings = z.infer<typeof ServerErrorTrackingSettingsSchema>;

export type ErrorTrackingSettingsPayload = Partial<
  components["schemas"]["PatchedErrorTrackingSettings"]
>;

/** GET the settings via the custom `retrieve_settings` action route. */
export async function getErrorTrackingSettings(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerErrorTrackingSettings> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET(
    "/api/projects/{project_id}/error_tracking/settings/retrieve_settings/",
    { params: { path: { project_id: config.projectId } } },
  );
  return ServerErrorTrackingSettingsSchema.parse(data);
}

/** PATCH the declared fields via the custom `update_settings` action route. */
export async function patchErrorTrackingSettings(
  config: ClientConfig,
  payload: ErrorTrackingSettingsPayload,
  options: { verbose?: boolean } = {},
): Promise<ServerErrorTrackingSettings> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH(
    "/api/projects/{project_id}/error_tracking/settings/update_settings/",
    {
      params: { path: { project_id: config.projectId } },
      body: payload as unknown as components["schemas"]["PatchedErrorTrackingSettings"],
    },
  );
  return ServerErrorTrackingSettingsSchema.parse(data);
}
