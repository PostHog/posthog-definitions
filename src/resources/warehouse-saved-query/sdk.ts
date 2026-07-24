import { markResourceKind } from "../types.js";

export type WarehouseSavedQuery = {
  key: string;
  /**
   * Unique name for the view — this is the table name it's queried by in HogQL
   * (e.g. `SELECT * FROM my_view`). Max 128 chars, unique per project.
   */
  name: string;
  /**
   * The HogQL `SELECT` that defines the view. Authored as a plain string;
   * wrapped as `{ kind: "HogQLQuery", query }` on the wire.
   */
  query: string;
  /**
   * Human-readable description of what this view represents. Also carries the
   * identity marker (a trailing HTML comment), the endpoints pattern. Optional
   * — when omitted the description is just the marker.
   */
  description?: string;
  /** Optional folder id to organize the view in the SQL editor sidebar. */
  folderId?: string;
};

export function warehouseSavedQuery(spec: WarehouseSavedQuery): WarehouseSavedQuery {
  return markResourceKind(spec, "warehouse-saved-query");
}
