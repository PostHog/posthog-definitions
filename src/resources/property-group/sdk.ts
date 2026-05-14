import { markResourceKind } from "../types.js";

/**
 * Server-side property types accepted by `schema_property_groups`. Mirrors the
 * Django `SchemaPropertyType` choices. `Object` exists because the TypeScript
 * generator emits `Record<string, any>` for it — we keep parity.
 */
export type PropertyType = "String" | "Numeric" | "Boolean" | "DateTime" | "Object";

/**
 * Definition of a single property within a group. The generic phantom-type on
 * `PropertyGroup` preserves `type` and `required` as literals so the typed
 * client can map them to TS types at compile time.
 */
export type PropertyDef = {
  type: PropertyType;
  required?: boolean;
  description?: string;
  /**
   * Mirrors the server's `is_optional_in_types`: when true on a required
   * property, the generated TS type still marks it optional. Used to phase in
   * new required props without breaking compile-time callers.
   */
  is_optional_in_types?: boolean;
};

export type PropertyMap = Record<string, PropertyDef>;

export type PropertyGroup<TProps extends PropertyMap = PropertyMap> = {
  key: string;
  description?: string;
  properties: TProps;
};

/**
 * User-facing factory. Pass a literal-typed `properties` object — TS infers
 * `TProps` as a record of literal types, which both `eventDefinition()` and
 * `createTypedPostHog()` consume to build compile-time event signatures.
 */
export function propertyGroup<const TProps extends PropertyMap>(
  spec: PropertyGroup<TProps>,
): PropertyGroup<TProps> {
  return markResourceKind(spec, "property-group");
}
