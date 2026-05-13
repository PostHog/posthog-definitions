import type { HogQLQuery, Query } from "../insight/sdk.js";
import { markResourceKind } from "../types.js";

export type Endpoint = {
  key: string;
  /**
   * URL-safe identifier used in the endpoint's path: must match
   * `^[a-zA-Z][a-zA-Z0-9_-]*$` and be unique per project. Surfaced in the
   * public `/api/endpoints/{name}/` URL.
   */
  name: string;
  description?: string;
  query: Query;
  is_active?: boolean;
  is_materialized?: boolean;
  /** Short ID of an insight whose query this endpoint mirrors. */
  derived_from_insight?: string;
  /** One of: 900, 1800, 3600, 21600, 43200, 86400, 604800 (seconds). */
  data_freshness_seconds?: number;
  bucket_overrides?: Record<string, unknown>;
};

export function endpoint(spec: Endpoint): Endpoint {
  return markResourceKind(spec, "endpoint");
}

export type { HogQLQuery, Query };
