import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { type HogFunction, secret } from "./sdk.js";
import type { ServerHogFunction } from "./client.js";
import { hogFunctionHash, validateHogFunctions } from "./pipeline.js";

function spec(key: string, overrides: Partial<HogFunction> = {}): HogFunction {
  return {
    key,
    type: "destination",
    name: `Fn ${key}`,
    templateId: "template-activecampaign",
    inputs: { accountName: "acme" },
    ...overrides,
  };
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  extraDescription = "",
): ServerHogFunction {
  const marker = `<!-- iac:hog-functions:${key} iac:hash:${hash} -->`;
  return {
    id,
    type: "destination",
    name: `Fn ${key}`,
    description: extraDescription ? `${extraDescription}\n\n${marker}` : marker,
    enabled: true,
    template: { id: "template-activecampaign" },
  };
}

function desiredFor(specs: HogFunction[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "hog-functions",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerHogFunction[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["hog-functions", rows]]);
}

describe("hog-function pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("ac")]), currentFor([])).get("hog-functions")!;
    expect(slice.ops.length).toBe(1);
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("ac");
    const server = serverRow("u1", "ac", hogFunctionHash(desired));
    const op = diff(desiredFor([desired]), currentFor([server])).get("hog-functions")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const desired = spec("ac");
    const server = serverRow("u1", "ac", "stalehash00000000");
    const op = diff(desiredFor([desired]), currentFor([server])).get("hog-functions")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("classifies a server-only managed function as an orphan", () => {
    const server = serverRow("gh", "ghost", "any");
    const slice = diff(desiredFor([]), currentFor([server])).get("hog-functions")!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerHogFunction = {
      id: "hb",
      type: "transformation",
      name: "GeoIP",
      description: "Adds geoip data",
      enabled: true,
      template: { id: "template-geoip" },
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("hog-functions")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("hog-function secret hashing", () => {
  it("never depends on the secret's env VALUE — only its declaration", () => {
    const a = spec("ac", { inputs: { apiKey: secret("MY_KEY") } });
    process.env.MY_KEY = "value-one";
    const h1 = hogFunctionHash(a);
    process.env.MY_KEY = "value-two";
    const h2 = hogFunctionHash(a);
    delete process.env.MY_KEY;
    expect(h1).toBe(h2);
  });

  it("changes when a rotate token is bumped (rotation is a declared change)", () => {
    const noRotate = spec("ac", { inputs: { apiKey: secret("MY_KEY") } });
    const rotated = spec("ac", { inputs: { apiKey: secret("MY_KEY", { rotate: "v2" }) } });
    expect(hogFunctionHash(noRotate)).not.toBe(hogFunctionHash(rotated));
  });

  it("changes when the secret points at a different env var", () => {
    const a = spec("ac", { inputs: { apiKey: secret("KEY_A") } });
    const b = spec("ac", { inputs: { apiKey: secret("KEY_B") } });
    expect(hogFunctionHash(a)).not.toBe(hogFunctionHash(b));
  });

  it("changes when a plain input changes", () => {
    expect(hogFunctionHash(spec("ac", { inputs: { accountName: "acme" } }))).not.toBe(
      hogFunctionHash(spec("ac", { inputs: { accountName: "globex" } })),
    );
  });

  it("changes when templateId changes", () => {
    expect(hogFunctionHash(spec("ac", { templateId: "template-a" }))).not.toBe(
      hogFunctionHash(spec("ac", { templateId: "template-b" })),
    );
  });
});

describe("hog-function validation", () => {
  it("requires a templateId", () => {
    const issues = validateHogFunctions([spec("ok", { templateId: "" })]);
    expect(issues.some((m) => m.includes("templateId"))).toBeTruthy();
  });

  it("rejects an unknown type", () => {
    const issues = validateHogFunctions([spec("ok", { type: "banana" as HogFunction["type"] })]);
    expect(issues.some((m) => m.includes("unknown type"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateHogFunctions([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validateHogFunctions([spec("ok")])).toEqual([]);
  });
});
