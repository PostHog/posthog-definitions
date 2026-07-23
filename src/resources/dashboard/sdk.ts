import type { Insight } from "../insight/sdk.js";
import { markResourceKind } from "../types.js";

export type Layout = { x: number; y: number; w: number; h: number };

export type Filters = Record<string, unknown>;

/**
 * Insight tile. Note there is intentionally NO `layout` or `color` here: the
 * 2026-07-23 PostHog API cannot set an insight tile's position or color
 * (`Dashboard.tiles` is read-only, `update_text_tile` rejects insight tiles,
 * and `reorder_tiles` only offers the coarse `insightLayout` modes below).
 * Only *which* insight appears on the dashboard is persistable, so only that
 * is expressible. Text and button tiles keep full layout — the API supports
 * those with fidelity via `create_text_tile`.
 */
export type InsightTile = {
  insight: Insight;
  // Explicitly forbidden (not merely absent): the API can't persist an insight
  // tile's layout/color, so declaring them is silent loss. `?: never` turns
  // that into a compile error pointing at the new reality. Use the
  // dashboard-level `insightLayout` for coarse packing instead.
  layout?: never;
  color?: never;
};

export type TextTile = {
  kind: "text";
  body: string;
  layout: Layout;
  color?: string;
};

export type ButtonTile = {
  kind: "button";
  url: string;
  text: string;
  placement?: "left" | "right";
  style?: "primary" | "secondary";
  layout: Layout;
  color?: string;
};

export type Tile = InsightTile | TextTile | ButtonTile;

/**
 * How PostHog packs insight tiles. Maps to the `reorder_tiles` endpoint's
 * `layout` enum — the only insight-tile positioning the API exposes.
 * "preserve" (default) issues no reorder call.
 */
export type InsightLayout = "preserve" | "two_column" | "full_width";

export type Dashboard = {
  key: string;
  name: string;
  description?: string;
  pinned?: boolean;
  tags?: string[];
  filters?: Filters;
  variables?: Record<string, unknown>;
  restriction?: "everyone" | "collaborators";
  breakdownColors?: Array<{ value: string; color: string }>;
  dataColorThemeKey?: string;
  insightLayout?: InsightLayout;
  tiles: Tile[];
};

export function isInsightTile(tile: Tile): tile is InsightTile {
  return "insight" in tile;
}

export function isTextTile(tile: Tile): tile is TextTile {
  return "kind" in tile && tile.kind === "text";
}

export function isButtonTile(tile: Tile): tile is ButtonTile {
  return "kind" in tile && tile.kind === "button";
}

export function dashboard(spec: Dashboard): Dashboard {
  return markResourceKind(spec, "dashboard");
}

export function text(spec: { body: string; layout: Layout; color?: string }): TextTile {
  return { kind: "text", body: spec.body, layout: spec.layout, color: spec.color };
}

export function button(spec: {
  url: string;
  text: string;
  layout: Layout;
  placement?: "left" | "right";
  style?: "primary" | "secondary";
  color?: string;
}): ButtonTile {
  return {
    kind: "button",
    url: spec.url,
    text: spec.text,
    layout: spec.layout,
    placement: spec.placement,
    style: spec.style,
    color: spec.color,
  };
}
