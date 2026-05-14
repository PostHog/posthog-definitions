import createClient, { type Client } from "openapi-fetch";
import type { paths } from "../generated/api.js";
import type { ClientConfig } from "./config.js";

export type ApiClient = Client<paths>;

/**
 * Prototype typed PostHog API client backed by `openapi-fetch` and the
 * generated OpenAPI types in `src/generated/api.d.ts`.
 *
 * Sits next to the hand-written `request()` in http.ts while we evaluate
 * the codegen approach; nothing depends on it yet.
 */
export function createApiClient(config: ClientConfig): ApiClient {
  return createClient<paths>({
    baseUrl: config.host,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
  });
}
