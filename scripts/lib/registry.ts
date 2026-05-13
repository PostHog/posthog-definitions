/**
 * Maps each shipped resource to its OpenAPI source so `check-resources.ts`
 * can compare our `ServerXSchema` against the current PostHog API surface.
 *
 * When you ship a new resource, add a row here.
 */
export type ResourceRegistryEntry = {
  /** Matches the directory name under `src/resources/`. */
  name: string;
  /** OpenAPI list-endpoint path (used to derive request/response components). */
  openapiPath: string;
  /** OpenAPI component name for the GET response body (single item). */
  responseComponent: string;
};

export const REGISTRY: ResourceRegistryEntry[] = [
  {
    name: "insight",
    openapiPath: "/api/environments/{environment_id}/insights/",
    responseComponent: "Insight",
  },
  {
    name: "dashboard",
    openapiPath: "/api/environments/{environment_id}/dashboards/",
    responseComponent: "Dashboard",
  },
  {
    name: "feature-flag",
    openapiPath: "/api/projects/{project_id}/feature_flags/",
    responseComponent: "FeatureFlag",
  },
  {
    name: "endpoint",
    openapiPath: "/api/environments/{environment_id}/endpoints/",
    responseComponent: "EndpointResponse",
  },
];
