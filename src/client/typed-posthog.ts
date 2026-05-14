/**
 * Generic typed wrapper around a posthog-js-shaped capture client.
 *
 * No codegen. Inference flows from the same `eventDefinition()` / `propertyGroup()`
 * factories that drive `apply` — pass the array of events you've defined, and
 * `.capture()` becomes a discriminated union of `(name, propertyShape)` tuples
 * for known events plus a wildcard for everything else.
 *
 *     const ph = createTypedPostHog(posthog, [userUpgraded, userSignedUp]);
 *     ph.capture("user_upgraded", { plan: "pro", seats: 5 }); // typed
 *     ph.capture("unknown", { whatever: 1 });                 // falls back
 *     ph.unsafeCapture("anything", { … });                       // bypass
 *
 * Runtime is a thin Proxy delegating to the wrapped instance; the type story
 * is the whole point. Compatible with any object that exposes a
 * `capture(name, properties?, options?)` method — posthog-js, posthog-node, or
 * a mock.
 */
import type { EventDefinition } from "../resources/event-definition/sdk.js";
import type {
  PropertyDef,
  PropertyGroup,
  PropertyMap,
} from "../resources/property-group/sdk.js";

// ---------- type-level utilities ----------

type PropertyTypeMap = {
  String: string;
  Numeric: number;
  Boolean: boolean;
  DateTime: string | Date;
  Object: Record<string, unknown>;
};

type TsTypeOf<P extends PropertyDef> = PropertyTypeMap[P["type"]];

type RequiredKeys<TProps extends PropertyMap> = {
  [K in keyof TProps]: TProps[K]["required"] extends true
    ? TProps[K]["is_optional_in_types"] extends true
      ? never
      : K
    : never;
}[keyof TProps];

type OptionalKeys<TProps extends PropertyMap> = Exclude<keyof TProps, RequiredKeys<TProps>>;

/** TS shape derived from a single property group's `properties` map. */
type GroupShape<TGroup extends PropertyGroup<PropertyMap>> = TGroup extends PropertyGroup<
  infer TProps
>
  ? { [K in RequiredKeys<TProps>]: TsTypeOf<TProps[K]> } & {
      [K in OptionalKeys<TProps>]?: TsTypeOf<TProps[K]>;
    }
  : Record<string, unknown>;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/** Merged TS shape across every property group attached to one event. */
type MergeGroupShapes<TGroups extends ReadonlyArray<PropertyGroup<PropertyMap>>> =
  UnionToIntersection<GroupShape<TGroups[number]>>;

/**
 * Force `T` to render as a flat object literal in TS hover/error messages
 * rather than as a chain of intersections.
 */
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type EventPropertiesOf<TEvent> = TEvent extends EventDefinition<string, infer TGroups>
  ? TGroups["length"] extends 0
    ? Record<string, unknown>
    : Prettify<MergeGroupShapes<TGroups>>
  : Record<string, unknown>;

/** Map from event name (the wire-level string) to its property shape. */
type EventSchemaMap<TEvents extends ReadonlyArray<{ name: string }>> = {
  [E in TEvents[number] as E["name"]]: EventPropertiesOf<E>;
};

type HasRequired<TProps> = {} extends TProps ? false : true;

// ---------- runtime ----------

type CaptureOptions = Record<string, unknown>;
type CaptureResult = unknown;

type BaseProperties = Record<string, unknown> | null | undefined;

export interface CaptureCapableClient {
  capture(
    event_name: string,
    properties?: BaseProperties,
    options?: CaptureOptions,
  ): CaptureResult;
}

export interface TypedPostHog<TSchemas extends Record<string, object>>
  extends Omit<CaptureCapableClient, "capture"> {
  /**
   * Type-safe `capture`. The first overload matches every known event name
   * with its declared property shape. The second overload accepts any other
   * string with arbitrary properties — same fallback behavior as
   * posthog-js's existing TypeScript output.
   */
  capture<K extends keyof TSchemas & string>(
    event_name: K,
    ...args: HasRequired<TSchemas[K]> extends true
      ? [properties: TSchemas[K], options?: CaptureOptions]
      : [properties?: TSchemas[K], options?: CaptureOptions]
  ): CaptureResult;
  capture<T extends string>(
    event_name: T extends keyof TSchemas ? never : T,
    properties?: BaseProperties,
    options?: CaptureOptions,
  ): CaptureResult;

  /** Bypass all type-checking. Use sparingly. */
  unsafeCapture(
    event_name: string,
    properties?: BaseProperties,
    options?: CaptureOptions,
  ): CaptureResult;
}

/**
 * Wrap an existing posthog-js-shaped client with compile-time type checking
 * over the supplied event definitions. The runtime simply proxies through to
 * the wrapped client's `capture` (and exposes a `unsafeCapture` escape hatch);
 * the type narrowing is the whole feature.
 *
 * `_events` is unused at runtime but is required for inference: pass the
 * same array of `eventDefinition(...)` values that you `apply` to PostHog,
 * and the result's `.capture()` will only accept matching property shapes.
 */
export function createTypedPostHog<
  TClient extends CaptureCapableClient,
  const TEvents extends ReadonlyArray<{ name: string }>,
>(
  client: TClient,
  _events: TEvents,
): Omit<TClient, "capture"> & TypedPostHog<EventSchemaMap<TEvents>> {
  type Schemas = EventSchemaMap<TEvents>;

  // The runtime overloads collapse to a single (string, props?, options?)
  // function — the per-event narrowing only exists at the type level. Cast
  // at the boundary so the wrapped object satisfies the typed overload set.
  const wrapped = {
    capture(event_name: string, properties?: BaseProperties, options?: CaptureOptions) {
      return client.capture(event_name, properties, options);
    },
    unsafeCapture(event_name: string, properties?: BaseProperties, options?: CaptureOptions) {
      return client.capture(event_name, properties, options);
    },
  } as unknown as Pick<TypedPostHog<Schemas>, "capture" | "unsafeCapture">;

  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop in wrapped) {
        return (wrapped as Record<string, unknown>)[prop as string];
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as unknown as Omit<TClient, "capture"> & TypedPostHog<Schemas>;
}
