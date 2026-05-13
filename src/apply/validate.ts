import type { DesiredState } from "./load.js";
import { isButtonTile, isInsightTile, isTextTile } from "../sdk/types.js";
import type { Layout, Tile } from "../sdk/types.js";

export class ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Validation failed:\n - ${issues.join("\n - ")}`);
    this.name = "ValidationError";
  }
}

const GRID_WIDTH = 12;

export function validate(state: DesiredState): void {
  const issues: string[] = [];

  const dashboardKeys = new Map<string, string>();
  for (const { path, spec } of state.dashboards) {
    if (!spec.key) issues.push(`${path}: dashboard.key is required`);
    if (!spec.name) issues.push(`${path}: dashboard.name is required`);
    if (!spec.tiles || spec.tiles.length === 0) {
      issues.push(`${path}: dashboard "${spec.key}" must have at least one tile`);
    } else {
      spec.tiles.forEach((tile, index) => validateTile(issues, path, spec.key, index, tile));
    }

    const existingPath = dashboardKeys.get(spec.key);
    if (existingPath) {
      issues.push(`Duplicate dashboard key "${spec.key}" in ${existingPath} and ${path}`);
    } else {
      dashboardKeys.set(spec.key, path);
    }
  }

  const insightKeys = new Set<string>();
  for (const { path, spec } of state.insights) {
    if (!spec.key) issues.push(`${path}: insight.key is required`);
    if (!spec.name) issues.push(`${path}: insight.name is required`);
    if (!spec.query) issues.push(`${path}: insight "${spec.key}" is missing query`);
    if (insightKeys.has(spec.key)) {
      issues.push(`Duplicate insight key "${spec.key}"`);
    }
    insightKeys.add(spec.key);
  }

  const knownInsightKeys = new Set(state.insights.map((i) => i.spec.key));
  for (const { path, spec } of state.dashboards) {
    for (const tile of spec.tiles) {
      if (isInsightTile(tile) && !knownInsightKeys.has(tile.insight.key)) {
        issues.push(
          `${path}: dashboard "${spec.key}" references unknown insight "${tile.insight.key}"`,
        );
      }
    }
  }

  if (issues.length > 0) throw new ValidationError(issues);
}

function validateTile(
  issues: string[],
  path: string,
  dashboardKey: string,
  index: number,
  tile: Tile,
): void {
  const where = `${path}: dashboard "${dashboardKey}" tile[${index}]`;
  if (isInsightTile(tile)) {
    if (!tile.insight) issues.push(`${where}: missing insight`);
    validateLayout(issues, where, tile.layout);
  } else if (isTextTile(tile)) {
    if (!tile.body) issues.push(`${where}: text tile body is empty`);
    validateLayout(issues, where, tile.layout);
  } else if (isButtonTile(tile)) {
    if (!tile.url) issues.push(`${where}: button tile url is empty`);
    if (!tile.text) issues.push(`${where}: button tile text is empty`);
    validateLayout(issues, where, tile.layout);
  } else {
    issues.push(`${where}: unknown tile shape`);
  }
}

function validateLayout(issues: string[], where: string, layout: Layout | undefined): void {
  if (!layout) {
    issues.push(`${where}: layout is required`);
    return;
  }
  if (layout.x < 0 || layout.y < 0) issues.push(`${where}: layout x/y must be >= 0`);
  if (layout.w <= 0 || layout.h <= 0) issues.push(`${where}: layout w/h must be > 0`);
  if (layout.x + layout.w > GRID_WIDTH) {
    issues.push(`${where}: layout overflows the ${GRID_WIDTH}-column grid (x=${layout.x}, w=${layout.w})`);
  }
}
