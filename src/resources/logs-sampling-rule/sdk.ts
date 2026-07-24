import { markResourceKind } from "../types.js";

export type LogsSamplingRuleType = "severity_sampling" | "path_drop" | "rate_limit";

export type LogsSamplingRule = {
  key: string;
  /**
   * Human-readable label shown in the sampling-rules settings list. Also
   * carries the identity marker (a trailing HTML comment). Capped at 255 chars
   * including the marker — a validation guard fails fast if exceeded.
   */
  name: string;
  /** Rule kind. Determines the shape of `config`. */
  ruleType: LogsSamplingRuleType;
  /**
   * Type-specific configuration, passed through verbatim. Shape depends on
   * `ruleType`:
   * - `rate_limit`: `{ logs_per_second }` or `{ kb_per_second }` (+ optional
   *   `burst_*`, `filter_group`).
   * - `path_drop`: `{ filter_group }` and/or legacy `{ patterns, match_attribute_key }`.
   * - `severity_sampling`: `{ actions, always_keep? }`.
   */
  config: Record<string, unknown>;
  /**
   * When false (the SDK default), ingestion ignores the rule. Author rules
   * disabled and flip them on deliberately.
   */
  enabled?: boolean;
  /**
   * Evaluation priority — **lower is evaluated first, and the first matching
   * rule wins**. This collection is order-sensitive; set `priority` explicitly
   * on every rule when order matters, and renumber to reorder. Omit to let the
   * server append after existing rules (order then undefined relative to peers).
   */
  priority?: number;
  /** Optional legacy service-name scope; prefer `config.filter_group`. */
  scopeService?: string | null;
  /** Optional regex matched against a path-like log attribute. */
  scopePathPattern?: string | null;
  /** Optional predicates over string attributes, e.g. `[{ key, op, value }]`. */
  scopeAttributeFilters?: Record<string, unknown>[];
};

export function logsSamplingRule(spec: LogsSamplingRule): LogsSamplingRule {
  return markResourceKind(spec, "logs-sampling-rule");
}
