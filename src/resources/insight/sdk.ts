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

export type FunnelsQuery = {
  kind: "FunnelsQuery";
  series: EventsNode[];
  interval?: "hour" | "day" | "week" | "month";
  dateRange?: { date_from?: string; date_to?: string };
  breakdownFilter?: Record<string, unknown>;
  funnelsFilter?: Record<string, unknown>;
  filterTestAccounts?: boolean;
  samplingFactor?: number | null;
  properties?: unknown[];
  aggregation_group_type_index?: number | null;
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
  source: TrendsQuery | FunnelsQuery;
};

export type Query = TrendsQuery | FunnelsQuery | HogQLQuery;

export type Insight = {
  key: string;
  name: string;
  description?: string;
  query: Query;
  tags?: string[];
};

import { markResourceKind } from "../types.js";

export function insight(spec: Insight): Insight {
  return markResourceKind(spec, "insight");
}

export function trends(spec: {
  series: EventsNode[];
  interval?: TrendsQuery["interval"];
  dateRange?: TrendsQuery["dateRange"];
  breakdownFilter?: TrendsQuery["breakdownFilter"];
  trendsFilter?: TrendsQuery["trendsFilter"];
  properties?: TrendsQuery["properties"];
}): TrendsQuery {
  return {
    kind: "TrendsQuery",
    series: spec.series.map((node) => ({ kind: "EventsNode", ...node })),
    ...(spec.interval !== undefined && { interval: spec.interval }),
    ...(spec.dateRange !== undefined && { dateRange: spec.dateRange }),
    ...(spec.breakdownFilter !== undefined && { breakdownFilter: spec.breakdownFilter }),
    ...(spec.trendsFilter !== undefined && { trendsFilter: spec.trendsFilter }),
    ...(spec.properties !== undefined && { properties: spec.properties }),
  };
}

export function funnels(spec: {
  series: EventsNode[];
  interval?: FunnelsQuery["interval"];
  dateRange?: FunnelsQuery["dateRange"];
  breakdownFilter?: FunnelsQuery["breakdownFilter"];
  funnelsFilter?: FunnelsQuery["funnelsFilter"];
  filterTestAccounts?: FunnelsQuery["filterTestAccounts"];
  samplingFactor?: FunnelsQuery["samplingFactor"];
  properties?: FunnelsQuery["properties"];
  aggregation_group_type_index?: FunnelsQuery["aggregation_group_type_index"];
}): FunnelsQuery {
  return {
    kind: "FunnelsQuery",
    series: spec.series.map((node) => ({ kind: "EventsNode", ...node })),
    ...(spec.interval !== undefined && { interval: spec.interval }),
    ...(spec.dateRange !== undefined && { dateRange: spec.dateRange }),
    ...(spec.breakdownFilter !== undefined && { breakdownFilter: spec.breakdownFilter }),
    ...(spec.funnelsFilter !== undefined && { funnelsFilter: spec.funnelsFilter }),
    ...(spec.filterTestAccounts !== undefined && { filterTestAccounts: spec.filterTestAccounts }),
    ...(spec.samplingFactor !== undefined && { samplingFactor: spec.samplingFactor }),
    ...(spec.properties !== undefined && { properties: spec.properties }),
    ...(spec.aggregation_group_type_index !== undefined && {
      aggregation_group_type_index: spec.aggregation_group_type_index,
    }),
  };
}

export function hogql(query: string, values?: Record<string, unknown>): HogQLQuery {
  return {
    kind: "HogQLQuery",
    query,
    ...(values !== undefined && { values }),
  };
}
