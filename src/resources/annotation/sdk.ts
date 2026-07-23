import { markResourceKind } from "../types.js";
import type { Insight } from "../insight/sdk.js";
import type { Dashboard } from "../dashboard/sdk.js";

/**
 * Where the annotation is visible:
 *  - `project` (default) / `organization` — a global marker on every timeline.
 *  - `dashboard_item` — attached to one insight (declare `insight`).
 *  - `dashboard` — attached to one dashboard (declare `dashboard`).
 */
export type AnnotationScope = "project" | "organization" | "dashboard" | "dashboard_item";

/** `USR` (user note) or `GIT` (bot / deployment marker). */
export type AnnotationCreationType = "USR" | "GIT";

export type Annotation = {
  key: string;
  /**
   * Annotation text shown on charts. Also carries the identity marker (a
   * trailing HTML comment), the way endpoints/surveys carry identity in a
   * free-text field. Set `hidden: true` to keep deploy markers (and their
   * marker comment) out of the UI entirely.
   */
  content: string;
  /** ISO 8601 timestamp the annotation marks on the timeline. */
  dateMarker: string;
  /** Visibility scope. Defaults to `project`. */
  scope?: AnnotationScope;
  /** The insight this annotation is attached to — required iff scope is `dashboard_item`. Resolved to an id at apply time; declare it in the same run. */
  insight?: Insight;
  /** The dashboard this annotation is attached to — required iff scope is `dashboard`. Resolved to an id at apply time; declare it in the same run. */
  dashboard?: Dashboard;
  /** Emoji shown in place of the default badge. */
  emoji?: string;
  /** Hide from the PostHog UI (still readable over the API). Ideal for high-frequency deploy markers. */
  hidden?: boolean;
  /** `USR` (default) or `GIT` for bot/deployment notes. */
  creationType?: AnnotationCreationType;
};

export function annotation(spec: Annotation): Annotation {
  return markResourceKind(spec, "annotation");
}
