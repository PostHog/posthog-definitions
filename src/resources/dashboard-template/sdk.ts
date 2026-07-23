import { markResourceKind } from "../types.js";

/**
 * Scope of a dashboard template. Only `team` (project-scoped) templates are
 * managed by posthog-definitions — `global` / `organization` / `feature_flag`
 * templates are read-only surface owned elsewhere (validation rejects them).
 */
export type DashboardTemplateScope = "team";

/**
 * A single tile in the template. Tiles are round-tripped verbatim — the
 * template stores each tile's `query` inline (unlike a live dashboard, whose
 * tiles link to standalone insights), so the whole array is a passthrough bag
 * that posthog-definitions canonically hashes but does not enumerate field by
 * field. Shape mirrors the dashboard-template editor: `{ type, name, query,
 * layouts, color, … }`.
 */
export type DashboardTemplateTile = Record<string, unknown>;

/** A template variable placeholder — passthrough, same treatment as tiles. */
export type DashboardTemplateVariable = Record<string, unknown>;

export type DashboardTemplate = {
  key: string;
  /** Display name — maps to the server's `template_name`. */
  name: string;
  /** Free-text blurb — maps to the server's `dashboard_description`. */
  description?: string;
  /** The tiles that get instantiated when the template is applied. */
  tiles: DashboardTemplateTile[];
  /** Default dashboard-level filters — maps to `dashboard_filters`. */
  filters?: Record<string, unknown>;
  /** Optional template variables users fill in when instantiating. */
  variables?: DashboardTemplateVariable[];
  /** Whether the UI highlights this template. Maps to `is_featured`. */
  featured?: boolean;
  /**
   * Project-scoped by default; only `team` is accepted. Declaring any other
   * scope is a validation error (global/official templates are read-only).
   */
  scope?: DashboardTemplateScope;
  tags?: string[];
};

export function dashboardTemplate(spec: DashboardTemplate): DashboardTemplate {
  return markResourceKind(spec, "dashboard-template");
}
