import { markResourceKind } from "../types.js";

export type HogFlowStatus = "draft" | "active" | "archived";

export type HogFlowExitCondition =
  | "exit_on_conversion"
  | "exit_on_trigger_not_matched"
  | "exit_on_trigger_not_matched_or_conversion"
  | "exit_only_at_end";

/**
 * A node in the flow graph — passthrough. Shape (per the API):
 * `{ id, type, name?, config, filters?, on_error?, output_variable? }`.
 * `id` is author-chosen and referenced by edges. `type` is one of trigger /
 * exit / delay / conditional_branch / wait_until_condition / function* / …;
 * `config` is type-specific. Round-tripped verbatim and canonically hashed —
 * posthog-definitions does not enumerate every action type.
 */
export type HogFlowAction = Record<string, unknown>;

/**
 * A graph edge — passthrough: `{ from, to, type: "continue" | "branch",
 * index? }`. `from`/`to` are action ids; `branch` edges carry an `index`.
 */
export type HogFlowEdge = Record<string, unknown>;

export type HogFlow = {
  key: string;
  name: string;
  description?: string;
  /** draft (default) / active / archived. */
  status?: HogFlowStatus;
  /** When the person leaves the flow. Defaults to `exit_only_at_end`. */
  exitCondition?: HogFlowExitCondition;
  /**
   * Ordered action nodes. Exactly one `type: "trigger"` is required; an
   * `type: "exit"` node is typical. Author-defined `id`s wire the graph.
   */
  actions: HogFlowAction[];
  /** Graph edges connecting action ids. */
  edges: HogFlowEdge[];
  triggerMasking?: Record<string, unknown>;
  conversion?: Record<string, unknown>;
  variables?: unknown[];
};

export function hogFlow(spec: HogFlow): HogFlow {
  return markResourceKind(spec, "hog-flow");
}
