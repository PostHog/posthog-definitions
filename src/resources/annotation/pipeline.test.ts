import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { Annotation } from "./sdk.js";
import type { ServerAnnotation } from "./client.js";
import { annotationHash, validateAnnotations } from "./pipeline.js";

function spec(key: string, overrides: Partial<Annotation> = {}): Annotation {
  return {
    key,
    content: `Deploy ${key}`,
    dateMarker: "2026-08-01T00:00:00Z",
    ...overrides,
  };
}

function serverRow(id: number, key: string, hash: string, extraContent = "Deploy"): ServerAnnotation {
  const marker = `<!-- iac:annotations:${key} iac:hash:${hash} -->`;
  return {
    id,
    content: `${extraContent}\n\n${marker}`,
    date_marker: "2026-08-01T00:00:00Z",
    scope: "project",
  };
}

function desiredFor(specs: Annotation[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "annotations",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerAnnotation[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["annotations", rows]]);
}

describe("annotation pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("deploy-1")]), currentFor([])).get("annotations")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("deploy-1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow(1, "deploy-1", annotationHash(desired), "Deploy deploy-1")]),
    ).get("annotations")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("deploy-1")]),
      currentFor([serverRow(1, "deploy-1", "stale00000000")]),
    ).get("annotations")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when the date marker or scope changes", () => {
    expect(annotationHash(spec("d"))).not.toBe(
      annotationHash(spec("d", { dateMarker: "2026-09-01T00:00:00Z" })),
    );
    expect(annotationHash(spec("d"))).not.toBe(annotationHash(spec("d", { scope: "organization" })));
  });

  it("classifies a server-only managed annotation as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow(9, "ghost", "any")])).get(
      "annotations",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerAnnotation = {
      id: 99,
      content: "A note someone left in the UI",
      date_marker: "2026-08-01T00:00:00Z",
      scope: "project",
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("annotations")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("annotation validation", () => {
  const empty: DesiredState = new Map();

  it("requires content and dateMarker", () => {
    const issues = validateAnnotations(
      [{ key: "x", content: "", dateMarker: "" } as Annotation],
      empty,
    );
    expect(issues.some((m) => m.includes("content is required"))).toBeTruthy();
    expect(issues.some((m) => m.includes("dateMarker"))).toBeTruthy();
  });

  it("scope dashboard_item requires an insight reference", () => {
    const issues = validateAnnotations([spec("x", { scope: "dashboard_item" })], empty);
    expect(issues.some((m) => m.includes('scope "dashboard_item" requires an `insight`'))).toBeTruthy();
  });

  it("scope dashboard requires a dashboard reference", () => {
    const issues = validateAnnotations([spec("x", { scope: "dashboard" })], empty);
    expect(issues.some((m) => m.includes('scope "dashboard" requires a `dashboard`'))).toBeTruthy();
  });

  it("project scope must not declare a ref", () => {
    const issues = validateAnnotations(
      [spec("x", { insight: { key: "i" } as Annotation["insight"] })],
      empty,
    );
    expect(issues.some((m) => m.includes("must not declare"))).toBeTruthy();
  });

  it("accepts a minimal project-scoped annotation", () => {
    expect(validateAnnotations([spec("ok")], empty)).toEqual([]);
  });
});
