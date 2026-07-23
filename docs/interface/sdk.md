# SDK reference

The SDK is **declarative**. Every entry point returns a plain object that the CLI serializes. No `new`, no `.build()`, no hidden state.

## File layout convention

```
posthog/
├── dashboards/
│   ├── growth.ts          default export: Dashboard
│   └── product-health.ts
└── insights/              optional — shared insights
    └── revenue.ts
```

The CLI discovers files via glob (`posthog/**/*.ts`). Each file must `export default` a single `Dashboard` or `Insight`.

## `dashboard(spec)`

```ts
type Dashboard = {
  key: string; // stable identity (required)
  name: string;
  description?: string;
  pinned?: boolean;
  tags?: string[];
  filters?: Filters; // dashboard-level filter scope
  variables?: Record<string, unknown>;
  restriction?: "everyone" | "collaborators";
  breakdownColors?: Array<{ value: string; color: string }>;
  dataColorThemeKey?: string;
  tiles: Tile[];
};
```

`key` is the only required field besides `name` and `tiles`. It is the **stable identity** of the dashboard in code — see [identity](../implementation/identity.md) for how the CLI maps `key` to a server-side dashboard.

## `insight(spec)`

```ts
type Insight = {
  key: string;
  name: string;
  description?: string;
  query: Node; // typed against posthog.schema
};
```

Insights can be defined inline inside a dashboard's `tiles`, or in their own file and imported. Two dashboards referencing the same `insight({ key: ... })` value share one server-side insight — the CLI dedupes by key.

## Query constructors

Thin typed wrappers over the generated `posthog.schema` types. They add `kind` so users don't have to.

| Constructor        | Returns           | Notes                                     |
| ------------------ | ----------------- | ----------------------------------------- |
| `trends(spec)`     | `TrendsQuery`     | series + interval + dateRange + breakdown |
| `funnel(spec)`     | `FunnelsQuery`    | step series + conversion window           |
| `retention(spec)`  | `RetentionQuery`  | post-MVP                                  |
| `paths(spec)`      | `PathsQuery`      | post-MVP                                  |
| `stickiness(spec)` | `StickinessQuery` | post-MVP                                  |
| `lifecycle(spec)`  | `LifecycleQuery`  | post-MVP                                  |
| `hogql(query)`     | `HogQLQuery`      | raw HogQL escape hatch                    |

MVP ships `trends` and `hogql`. The rest land as soon as the schema is exposed; they require no new SDK plumbing — just typed wrappers.

## Tile constructors

```ts
type Tile =
  | { insight: Insight } // no layout/color — see below
  | { kind: "text"; body: string; layout: Layout; color?: string }
  | {
      kind: "button";
      url: string;
      text: string;
      placement?: "left" | "right";
      style?: "primary" | "secondary";
      layout: Layout;
      color?: string;
    };

type Layout = { x: number; y: number; w: number; h: number };

// On the dashboard itself, for insight-tile packing:
type InsightLayout = "preserve" | "two_column" | "full_width"; // default "preserve"
```

`text({...})` and `button({...})` are helpers that fill in `kind`. Insight tiles are written as plain object literals that pair with an external `Insight`.

**Insight tiles have no `layout` or `color`.** The 2026-07-23 PostHog API cannot persist an insight tile's position or color (`Dashboard.tiles` is read-only; there is no endpoint to set an insight tile's layout). Only *which* insight appears on a dashboard is persistable, so the SDK exposes only that — declaring `layout`/`color` on an insight tile is a **compile error** (`?: never`), not silent loss. For coarse insight-tile arrangement, set the dashboard-level `insightLayout` (mapped to the `reorder_tiles` endpoint; `"preserve"` — the default — issues no reorder). A non-`preserve` `insightLayout` repacks *every* tile, so declared text-tile layouts are not preserved under it. Text and button tiles keep full `layout` and `color`.

**Migrating existing definition files:** delete `layout` and `color` from any insight tile (`{ insight: x, layout: {…} }` → `{ insight: x }`); optionally add `insightLayout: "two_column" | "full_width"` on the dashboard. Text/button tiles are unchanged.

## Validation

The SDK does not validate at construction time. Validation happens in the CLI before any API call — it checks:

- Required fields are set.
- `key` values are unique within a kind.
- `tiles` is non-empty (server rejects empty dashboards inconsistently).
- `layout` widths fit in the 12-column grid.
- Tile references point to insights that exist (either inline or as separate files).

Validation failures abort `apply` before any side effect.
