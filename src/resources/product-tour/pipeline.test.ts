import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { ProductTour } from "./sdk.js";
import type { ServerProductTour } from "./client.js";
import { productTourHash, validateProductTours } from "./pipeline.js";

function spec(key: string, overrides: Partial<ProductTour> = {}): ProductTour {
  return {
    key,
    name: `Tour ${key}`,
    content: { steps: [{ title: "Welcome" }] },
    ...overrides,
  };
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  extraDescription = "",
): ServerProductTour {
  const marker = `<!-- iac:product-tours:${key} iac:hash:${hash} -->`;
  return {
    id,
    name: `Tour ${key}`,
    description: extraDescription ? `${extraDescription}\n\n${marker}` : marker,
    content: { steps: [{ title: "Welcome" }] },
    auto_launch: false,
    archived: false,
  };
}

function desiredFor(specs: ProductTour[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "product-tours",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerProductTour[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["product-tours", rows]]);
}

describe("product-tour pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("welcome")]), currentFor([])).get("product-tours")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("welcome");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("p1", "welcome", productTourHash(desired))]),
    ).get("product-tours")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("welcome")]),
      currentFor([serverRow("p1", "welcome", "stale00000000")]),
    ).get("product-tours")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when a schedule field changes (no injected now)", () => {
    expect(productTourHash(spec("welcome"))).not.toBe(
      productTourHash(spec("welcome", { startDate: "2026-08-01T00:00:00Z" })),
    );
    expect(productTourHash(spec("welcome"))).not.toBe(
      productTourHash(spec("welcome", { autoLaunch: true })),
    );
  });

  it("classifies a server-only managed tour as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("gh", "ghost", "any")])).get(
      "product-tours",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerProductTour = {
      id: "hb",
      name: "Hand-built",
      description: "a tour someone built in the UI",
      content: { steps: [] },
      auto_launch: true,
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("product-tours")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("product-tour validation", () => {
  it("requires a content object", () => {
    const issues = validateProductTours([
      spec("nocontent", { content: undefined as unknown as ProductTour["content"] }),
    ]);
    expect(issues.some((m) => m.includes("requires a `content`"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateProductTours([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("requires a non-empty name", () => {
    const issues = validateProductTours([spec("ok", { name: "" })]);
    expect(issues.some((m) => m.includes("name is required"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validateProductTours([spec("ok")])).toEqual([]);
  });
});
