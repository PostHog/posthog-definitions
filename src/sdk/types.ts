export type Layout = { x: number; y: number; w: number; h: number };

export type Filters = Record<string, unknown>;

export type EventsNode = {
  kind?: "EventsNode";
  event?: string | null;
  name?: string;
  math?: string;
  math_property?: string;
  properties?: unknown[];
  [key: string]: unknown;
};

export type TrendsQuery = {
  kind: "TrendsQuery";
  series: EventsNode[];
  interval?: "hour" | "day" | "week" | "month";
  dateRange?: { date_from?: string; date_to?: string };
  breakdownFilter?: Record<string, unknown>;
  trendsFilter?: Record<string, unknown>;
  properties?: unknown[];
  [key: string]: unknown;
};

export type HogQLQuery = {
  kind: "HogQLQuery";
  query: string;
  values?: Record<string, unknown>;
  [key: string]: unknown;
};

export type InsightVizNode = {
  kind: "InsightVizNode";
  source: TrendsQuery;
};

export type Query = TrendsQuery | HogQLQuery;

export type Insight = {
  key: string;
  name: string;
  description?: string;
  query: Query;
  tags?: string[];
};

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
