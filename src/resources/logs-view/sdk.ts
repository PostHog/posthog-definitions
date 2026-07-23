import { markResourceKind } from "../types.js";

export type LogsViewColumnType =
  | "timestamp"
  | "level"
  | "source"
  | "trace_id"
  | "span_id"
  | "message"
  | "custom";

/**
 * One column in a logs-table view. `id` is a client-generated stable handle
 * (React key / reorder anchor) the server never interprets — pick any stable
 * string. `expression` is only meaningful for `type: "custom"`.
 */
export type LogsViewColumn = {
  id: string;
  type: LogsViewColumnType;
  /** Header label override. Defaults to the built-in type's label. */
  name?: string;
  /** Source-prefixed shorthand or HogQL expression; only for `type: "custom"`. */
  expression?: string;
  /** Column width in pixels (1–2000). */
  width?: number;
};

export type LogsView = {
  key: string;
  /**
   * Human-readable view name shown in the saved-views picker. Also carries the
   * identity marker (a trailing HTML comment), the way subscriptions carry
   * identity in their `title`. The server caps `name` at 400 chars including
   * the marker — a validation guard fails fast if the budget is exceeded.
   */
  name: string;
  /**
   * Filter criteria — a passthrough subset of the logs viewer's filters. May
   * contain `severityLevels`, `serviceNames`, `searchTerm`, `filterGroup`,
   * `dateRange`, and other keys. Sent verbatim; not interpreted here.
   */
  filters?: Record<string, unknown>;
  /** Ordered column configuration for the logs table. Order is array index. */
  columns?: LogsViewColumn[];
  /** Whether the view is pinned in the picker. */
  pinned?: boolean;
};

export function logsView(spec: LogsView): LogsView {
  return markResourceKind(spec, "logs-view");
}
