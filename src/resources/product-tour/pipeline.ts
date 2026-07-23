import type { ClientConfig } from "../../client/config.js";
import { ApiError } from "../../client/typed.js";
import { specHash } from "../../apply/hash.js";
import { displayJson, obj, scalar, type DisplayValue } from "../../apply/display.js";
import { SafetyViolationError } from "../../apply/errors.js";
import { getResourceKind, type ApplyContext, type ResourceOp } from "../types.js";
import type { ProductTour } from "./sdk.js";
import {
  createProductTour,
  deleteProductTour,
  getProductTour,
  type ProductTourCreate,
  type ServerProductTour,
  updateProductTour,
} from "./client.js";

/**
 * Product tours have no `tags` field. Identity sits in a trailing HTML-comment
 * marker on `description` (surveys / endpoints pattern).
 */
export const PRODUCT_TOUR_IDENTITY_PREFIX = "iac:product-tours:";

const MARKER_REGEX = /\n*<!--\s*iac:product-tours:(\S+)\s+iac:hash:(\S+)\s*-->\s*$/;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

type ParsedMarker = { userDescription: string; key: string; hash: string };

function parseMarker(description: string | null | undefined): ParsedMarker | undefined {
  if (!description) return undefined;
  const match = description.match(MARKER_REGEX);
  if (!match || match.index === undefined) return undefined;
  return {
    userDescription: description.slice(0, match.index).replace(/\s+$/, ""),
    key: match[1]!,
    hash: match[2]!,
  };
}

function withMarker(userDescription: string | undefined, key: string, hash: string): string {
  const trailer = `<!-- iac:product-tours:${key} iac:hash:${hash} -->`;
  const trimmed = (userDescription ?? "").replace(/\s+$/, "");
  return trimmed ? `${trimmed}\n\n${trailer}` : trailer;
}

export function stripMarker(description: string | null | undefined): string | null {
  if (!description) return null;
  const parsed = parseMarker(description);
  return parsed ? parsed.userDescription || null : description;
}

export function productTourKeyFromServer(server: ServerProductTour): string | undefined {
  return parseMarker(server.description)?.key;
}

export function productTourHashFromServer(server: ServerProductTour): string | undefined {
  return parseMarker(server.description)?.hash;
}

function specForHash(spec: ProductTour): unknown {
  return {
    key: spec.key,
    name: spec.name,
    description: spec.description ?? "",
    content: spec.content ?? {},
    auto_launch: spec.autoLaunch ?? false,
    start_date: spec.startDate ?? null,
    end_date: spec.endDate ?? null,
    archived: spec.archived ?? false,
  };
}

export function productTourHash(spec: ProductTour): string {
  return specHash(specForHash(spec));
}

function buildPayload(spec: ProductTour, hash: string): ProductTourCreate {
  const payload: ProductTourCreate = {
    name: spec.name,
    description: withMarker(spec.description, spec.key, hash),
    content: (spec.content ?? {}) as Record<string, unknown>,
    auto_launch: spec.autoLaunch ?? false,
    archived: spec.archived ?? false,
  };
  if (spec.startDate !== undefined) payload.start_date = spec.startDate;
  if (spec.endDate !== undefined) payload.end_date = spec.endDate;
  return payload;
}

export function looksLikeProductTour(value: unknown): value is ProductTour {
  return getResourceKind(value) === "product-tour";
}

export function validateProductTours(specs: ProductTour[]): string[] {
  const issues: string[] = [];
  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();

  for (const spec of specs) {
    if (!spec.key) {
      issues.push("product-tour.key is required");
      continue;
    }
    if (!KEY_PATTERN.test(spec.key)) {
      issues.push(`product tour "${spec.key}" key must match ${KEY_PATTERN.source}`);
    }
    if (seenKeys.has(spec.key)) issues.push(`Duplicate product tour key "${spec.key}"`);
    seenKeys.add(spec.key);

    if (!spec.name || spec.name.trim() === "") {
      issues.push(`product tour "${spec.key}" name is required`);
    } else if (seenNames.has(spec.name)) {
      issues.push(`Duplicate product tour name "${spec.name}"`);
    } else {
      seenNames.add(spec.name);
    }

    if (!spec.content || typeof spec.content !== "object") {
      issues.push(`product tour "${spec.key}" requires a \`content\` object`);
    }
  }
  return issues;
}

async function assertManaged(
  config: ClientConfig,
  id: string,
  key: string,
  options: { verbose?: boolean },
): Promise<void> {
  const current = await getProductTour(config, id, options);
  if (productTourKeyFromServer(current) !== key) {
    throw new SafetyViolationError("product-tour", id, key);
  }
}

export async function runProductTourOp(
  config: ClientConfig,
  op: ResourceOp<ProductTour, ServerProductTour>,
  _ctx: ApplyContext,
  options: { verbose?: boolean } = {},
): Promise<void> {
  if (op.kind === "unchanged") return;

  const hash = productTourHash(op.spec);

  if (op.kind === "create") {
    await createProductTour(config, buildPayload(op.spec, hash), options);
    return;
  }

  await assertManaged(config, op.server.id, op.spec.key, options);
  await updateProductTour(config, op.server.id, buildPayload(op.spec, hash), options);
}

export async function pruneProductTour(
  config: ClientConfig,
  orphan: ServerProductTour,
  options: { verbose?: boolean } = {},
): Promise<boolean> {
  const key = productTourKeyFromServer(orphan) ?? `id:${orphan.id}`;
  try {
    await assertManaged(config, orphan.id, key, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
  await deleteProductTour(config, orphan.id, options);
  return true;
}

export function displayProductTour(spec: ProductTour): DisplayValue {
  return obj([
    ["key", scalar(spec.key)],
    ["name", scalar(spec.name)],
    ["description", scalar(spec.description ?? null)],
    ["content", displayJson(spec.content ?? {})],
    ["auto_launch", scalar(spec.autoLaunch ?? false)],
    ["start_date", scalar(spec.startDate ?? null)],
    ["end_date", scalar(spec.endDate ?? null)],
    ["archived", scalar(spec.archived ?? false)],
  ]);
}

export function displayProductTourFromServer(server: ServerProductTour): DisplayValue {
  return obj([
    ["key", scalar(productTourKeyFromServer(server) ?? null)],
    ["name", scalar(server.name)],
    ["description", scalar(stripMarker(server.description))],
    ["content", displayJson(server.content ?? {})],
    ["auto_launch", scalar(server.auto_launch ?? false)],
    ["start_date", scalar(server.start_date ?? null)],
    ["end_date", scalar(server.end_date ?? null)],
    ["archived", scalar(server.archived ?? false)],
  ]);
}
