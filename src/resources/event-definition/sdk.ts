import { markResourceKind } from "../types.js";
import type { PropertyGroup, PropertyMap } from "../property-group/sdk.js";

/**
 * Server-side enforcement mode. The OpenAPI schema currently advertises just
 * `"allow" | "reject"`; the Django model also accepts other values but we
 * mirror what the typed API claims to support.
 */
export type EnforcementMode = "allow" | "reject";

export type EventDefinition<
  TName extends string = string,
  TGroups extends ReadonlyArray<PropertyGroup<PropertyMap>> = ReadonlyArray<
    PropertyGroup<PropertyMap>
  >,
> = {
  /** IaC identity key — used in the `iac:event-definitions:<key>` tag. Must be unique within the project. */
  key: string;
  /** The actual event name as it appears on the wire (`posthog.capture(name, …)`). */
  name: TName;
  description?: string;
  enforcementMode?: EnforcementMode;
  primaryProperty?: string;
  /**
   * Reusable property groups attached to this event. Passed as a tuple so
   * `createTypedPostHog()` can infer the merged property shape at compile
   * time without runtime metadata.
   */
  propertyGroups?: TGroups;
  /** Free-form user tags. The `iac:*` namespace is reserved. */
  tags?: string[];
};

export function eventDefinition<
  const TName extends string,
  const TGroups extends ReadonlyArray<PropertyGroup<PropertyMap>>,
>(spec: EventDefinition<TName, TGroups>): EventDefinition<TName, TGroups> {
  return markResourceKind(spec, "event-definition");
}
