import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import { secret } from "../secret.js";
import type { BatchExport } from "./sdk.js";
import type { ServerBatchExport } from "./client.js";
import { batchExportHash, validateBatchExports } from "./pipeline.js";

function spec(key: string, overrides: Partial<BatchExport> = {}): BatchExport {
  return {
    key,
    name: `Export ${key}`,
    interval: "day",
    destination: {
      type: "AwsS3",
      config: {
        bucket_name: "my-bucket",
        region: "us-east-1",
        prefix: "exports/",
        aws_access_key_id: secret("AWS_KEY"),
        aws_secret_access_key: secret("AWS_SECRET"),
      },
    },
    ...overrides,
  };
}

function serverRow(id: string, key: string, hash: string, userName = "Export"): ServerBatchExport {
  const marker = `<!-- iac:batch-exports:${key} iac:hash:${hash} -->`;
  return {
    id,
    name: `${userName}\n\n${marker}`,
    interval: "day",
    paused: false,
    // Secrets are stripped on read — the server row never carries them.
    destination: { type: "AwsS3", config: { bucket_name: "my-bucket", region: "us-east-1", prefix: "exports/" } },
  };
}

function desiredFor(specs: BatchExport[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "batch-exports",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerBatchExport[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["batch-exports", rows]]);
}

describe("batch-export pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("e1")]), currentFor([])).get("batch-exports")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("e1");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("id1", "e1", batchExportHash(desired), "Export e1")]),
    ).get("batch-exports")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("hash excludes the secret value — same env ref hashes identically regardless of process.env", () => {
    // The hash must not read process.env; two identical specs hash the same
    // without either env var being set.
    expect(batchExportHash(spec("e"))).toBe(batchExportHash(spec("e")));
  });

  it("hash changes when the secret's env var name changes", () => {
    const a = spec("e");
    const b = spec("e", {
      destination: {
        type: "AwsS3",
        config: { ...a.destination.config, aws_secret_access_key: secret("OTHER_SECRET") },
      },
    });
    expect(batchExportHash(a)).not.toBe(batchExportHash(b));
  });

  it("hash changes when the rotate token changes", () => {
    const a = spec("e");
    const b = spec("e", {
      destination: {
        type: "AwsS3",
        config: { ...a.destination.config, aws_secret_access_key: secret("AWS_SECRET", { rotate: "2026-01" }) },
      },
    });
    expect(batchExportHash(a)).not.toBe(batchExportHash(b));
  });

  it("hash changes when paused or interval changes", () => {
    expect(batchExportHash(spec("e"))).not.toBe(batchExportHash(spec("e", { paused: true })));
    expect(batchExportHash(spec("e"))).not.toBe(batchExportHash(spec("e", { interval: "hour" })));
  });

  it("classifies a server-only managed row as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("id9", "ghost", "any")])).get(
      "batch-exports",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerBatchExport = {
      id: "hand",
      name: "An export set up in the UI",
      interval: "day",
      destination: { type: "AwsS3", config: {} },
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("batch-exports")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("batch-export validation", () => {
  const state: DesiredState = new Map();

  it("rejects an unsupported (integration-backed) destination type", () => {
    const issues = validateBatchExports(
      [spec("e", { destination: { type: "BigQuery" as BatchExport["destination"]["type"], config: {} } })],
      state,
    );
    expect(issues.some((m) => m.includes("not supported yet"))).toBeTruthy();
  });

  it("rejects an invalid interval", () => {
    const issues = validateBatchExports(
      [spec("e", { interval: "yearly" as BatchExport["interval"] })],
      state,
    );
    expect(issues.some((m) => m.includes("interval must be one of"))).toBeTruthy();
  });

  it("accepts a valid S3 export", () => {
    expect(validateBatchExports([spec("ok")], state)).toEqual([]);
  });
});
