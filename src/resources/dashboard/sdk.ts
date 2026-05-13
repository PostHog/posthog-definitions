import type { Insight } from "../insight/sdk.js";

export type Layout = { x: number; y: number; w: number; h: number };

export type Filters = Record<string, unknown>;

export type InsightTile = {
  insight: Insight;
  layout: Layout;
  color?: string;
  filtersOverride?: Filters;
  showDescription?: boolean;
  transparent?: boolean;
};

export type TextTile = {
  kind: "text";
  body: string;
  layout: Layout;
};

export type ButtonTile = {
  kind: "button";
  url: string;
  text: string;
  placement?: "left" | "right";
  style?: "primary" | "secondary";
  layout: Layout;
};

export type Tile = InsightTile | TextTile | ButtonTile;

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
  return spec;
}

export function text(spec: { body: string; layout: Layout }): TextTile {
  return { kind: "text", body: spec.body, layout: spec.layout };
}

export function button(spec: {
  url: string;
  text: string;
  layout: Layout;
  placement?: "left" | "right";
  style?: "primary" | "secondary";
}): ButtonTile {
  return {
    kind: "button",
    url: spec.url,
    text: spec.text,
    layout: spec.layout,
    placement: spec.placement,
    style: spec.style,
  };
}
