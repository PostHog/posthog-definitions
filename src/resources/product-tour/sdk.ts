import { markResourceKind } from "../types.js";

/**
 * Tour content — a passthrough bag. Shape: `{ steps: [...] }`, the step tree
 * authored in the tour builder. Round-tripped verbatim and canonically hashed;
 * posthog-definitions does not enumerate the step schema.
 */
export type TourContent = Record<string, unknown>;

export type ProductTour = {
  key: string;
  name: string;
  description?: string;
  /** The tour step tree. Round-tripped verbatim. */
  content: TourContent;
  /**
   * Whether the tour launches automatically for matching users.
   *
   * Scheduling / lifecycle is expressed directly through the writable
   * `autoLaunch` / `startDate` / `endDate` / `archived` fields — unlike surveys
   * (which need launch/stop endpoints because `start_date` is server-managed),
   * a product tour's schedule dates are set on the row itself, so they are
   * declared as plain fields with no injected "now" (which would drift).
   */
  autoLaunch?: boolean;
  /** ISO datetime the tour becomes active, or null. */
  startDate?: string | null;
  /** ISO datetime the tour stops, or null. */
  endDate?: string | null;
  archived?: boolean;
};

export function productTour(spec: ProductTour): ProductTour {
  return markResourceKind(spec, "product-tour");
}
