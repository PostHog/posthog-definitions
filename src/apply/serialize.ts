import type {
  ButtonTile,
  Dashboard,
  Insight,
  InsightTile,
  Layout,
  Query,
  TextTile,
  Tile,
} from "../sdk/types.js";
import { isButtonTile, isInsightTile, isTextTile } from "../sdk/types.js";

const RESTRICTION_TO_LEVEL: Record<NonNullable<Dashboard["restriction"]>, number> = {
  everyone: 21,
  collaborators: 37,
};

export function insightTag(key: string): string {
  return `iac:insights:${key}`;
}

export function dashboardTag(key: string): string {
  return `iac:dashboards:${key}`;
}

export function hashTag(hex: string): string {
  return `iac:hash:${hex}`;
}

export function isManagedTag(tag: string): boolean {
  return tag.startsWith("iac:");
}

export function extractHash(tags: string[] | undefined): string | undefined {
  return tags?.find((t) => t.startsWith("iac:hash:"))?.slice("iac:hash:".length);
}

export function dashboardKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith("iac:dashboards:"));
  return tag?.slice("iac:dashboards:".length);
}

export function insightKeyFromTags(tags: string[] | undefined): string | undefined {
  const tag = tags?.find((t) => t.startsWith("iac:insights:"));
  return tag?.slice("iac:insights:".length);
}

function wrapQuery(query: Query): unknown {
  if (query.kind === "TrendsQuery") {
    return { kind: "InsightVizNode", source: query };
  }
  return { kind: "DataTableNode", source: query };
}

function mergeTags(userTags: string[] | undefined, managedTags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of managedTags) {
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }
  for (const tag of userTags ?? []) {
    if (isManagedTag(tag)) continue;
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }
  return result;
}

export function insightPayload(
  spec: Insight,
  hash: string,
): { name: string; description: string | null; query: unknown; tags: string[] } {
  return {
    name: spec.name,
    description: spec.description ?? null,
    query: wrapQuery(spec.query),
    tags: mergeTags(spec.tags, [insightTag(spec.key), hashTag(hash)]),
  };
}

function layoutsFor(layout: Layout): Record<string, Layout> {
  return { sm: layout, lg: layout };
}

function serializeTile(tile: Tile, insightIdByKey: Map<string, number>): unknown {
  if (isInsightTile(tile)) {
    return serializeInsightTile(tile, insightIdByKey);
  }
  if (isTextTile(tile)) {
    return serializeTextTile(tile);
  }
  if (isButtonTile(tile)) {
    return serializeButtonTile(tile);
  }
  throw new Error(`Unknown tile shape: ${JSON.stringify(tile)}`);
}

function serializeInsightTile(tile: InsightTile, insightIdByKey: Map<string, number>): unknown {
  const id = insightIdByKey.get(tile.insight.key);
  if (id === undefined) {
    throw new Error(
      `Insight "${tile.insight.key}" was not created before its dashboard tile. This is a bug in the executor ordering.`,
    );
  }
  return {
    insight: { id },
    layouts: layoutsFor(tile.layout),
    ...(tile.color !== undefined && { color: tile.color }),
    ...(tile.filtersOverride !== undefined && { filters_hash: null, filters: tile.filtersOverride }),
  };
}

function serializeTextTile(tile: TextTile): unknown {
  return {
    text: { body: tile.body },
    layouts: layoutsFor(tile.layout),
  };
}

function serializeButtonTile(tile: ButtonTile): unknown {
  return {
    text: {
      body: `[${tile.text}](${tile.url})`,
    },
    layouts: layoutsFor(tile.layout),
  };
}

export function dashboardPayload(
  spec: Dashboard,
  hash: string,
  insightIdByKey: Map<string, number>,
): {
  name: string;
  description: string | null;
  pinned: boolean;
  tags: string[];
  restriction_level?: number;
  tiles: unknown[];
} {
  return {
    name: spec.name,
    description: spec.description ?? null,
    pinned: spec.pinned ?? false,
    tags: mergeTags(spec.tags, [dashboardTag(spec.key), hashTag(hash)]),
    ...(spec.restriction !== undefined && {
      restriction_level: RESTRICTION_TO_LEVEL[spec.restriction],
    }),
    tiles: spec.tiles.map((tile) => serializeTile(tile, insightIdByKey)),
  };
}
