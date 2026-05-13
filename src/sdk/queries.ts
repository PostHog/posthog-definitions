import type { EventsNode, HogQLQuery, TrendsQuery } from "./types.js";

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

export function hogql(query: string, values?: Record<string, unknown>): HogQLQuery {
  return {
    kind: "HogQLQuery",
    query,
    ...(values !== undefined && { values }),
  };
}
