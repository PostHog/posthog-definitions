import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
} from "../test-helpers/acceptance.js";
import {
  deleteFeatureFlag,
  listManagedFeatureFlags,
} from "../resources/feature-flag/client.js";
import { featureFlagKeyFromTags } from "../resources/feature-flag/pipeline.js";
import { RESOURCES } from "../resources/index.js";
import type { ResourceModule } from "../resources/types.js";
import { buildApplyResult } from "./apply.js";
import { buildPullResult } from "./pull.js";
import type { ApplyArgs, PullArgs } from "./args.js";

const KEY_PREFIX = "integration-pull";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function applyArgs(dir: string): ApplyArgs {
  return {
    command: "apply",
    dir,
    dryRun: false,
    verbose: false,
    prune: false,
    json: true,
  };
}

function pullArgs(dir: string, overrides: Partial<PullArgs> = {}): PullArgs {
  return {
    command: "pull",
    dir,
    dryRun: false,
    verbose: false,
    kinds: ["feature-flags"],
    all: false,
    allRows: true,
    noCascade: false,
    json: true,
    ...overrides,
  };
}

function flagOnlyTargets(): ReadonlyArray<ResourceModule<unknown, unknown>> {
  const r = RESOURCES.find((rr) => rr.name === "feature-flags");
  if (!r) throw new Error("feature-flags resource missing");
  return [r];
}

describe("pull (integration)", () => {
  let config: ClientConfig;
  let seedDir: string;
  let pullDir: string;
  let flagKey: string;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      (row) => row.id,
      (row) => featureFlagKeyFromTags(row.tags),
      PURGE_PREFIX,
    );

    // Working dirs inside the repo so `@posthog/definitions` self-imports
    // resolve when loadDefinitions dynamic-imports the pulled files.
    seedDir = await fs.mkdtemp(path.join(process.cwd(), ".pull-int-seed-"));
    pullDir = await fs.mkdtemp(path.join(process.cwd(), ".pull-int-pull-"));
    flagKey = uniqueKey(KEY_PREFIX);

    // Seed: write a flag and apply it.
    await fs.mkdir(path.join(seedDir, "feature-flags"), { recursive: true });
    await fs.writeFile(
      path.join(seedDir, "feature-flags", "flag.ts"),
      `import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "${flagKey}",
  name: "${flagKey}",
  active: true,
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});
`,
    );
    const applied = await buildApplyResult(config, applyArgs(seedDir));
    if (!applied.ok || !applied.applied || applied.totals.created !== 1) {
      throw new Error(
        `seed apply did not create exactly one flag: ${JSON.stringify(applied)}`,
      );
    }
  });

  afterAll(async () => {
    try {
      const flags = await listManagedFeatureFlags(config);
      const target = flags.find((f) => featureFlagKeyFromTags(f.tags) === flagKey);
      if (target) await deleteFeatureFlag(config, target.id);
    } catch {
      // Cleanup is best-effort.
    }
    if (seedDir) await fs.rm(seedDir, { recursive: true, force: true });
    if (pullDir) await fs.rm(pullDir, { recursive: true, force: true });
  });

  it("writes pulled file, tags the server, and a dry-run apply is a no-op", async () => {
    const targets = flagOnlyTargets();

    // allRows=true → empty selectionByResource means "pull every filtered row".
    const pulled = await buildPullResult(config, pullArgs(pullDir), targets, new Map());
    expect(pulled.ok).toBe(true);
    if (!pulled.ok) throw new Error("expected ok");
    expect(pulled.dryRun).toBe(false);
    expect(pulled.totals.written).toBeGreaterThanOrEqual(1);
    expect(pulled.totals.tagged).toBeGreaterThanOrEqual(1);
    const flagRep = pulled.byResource["feature-flags"];
    expect(flagRep).toBeDefined();
    expect(flagRep!.written.some((p) => p.includes(flagKey))).toBe(true);

    // Round-trip check: applying the pulled tree must produce no changes.
    const dry = await buildApplyResult(config, {
      ...applyArgs(pullDir),
      dryRun: true,
    });
    expect(dry.ok).toBe(true);
    if (!dry.ok || !dry.dryRun) throw new Error("expected dry-run");
    const flagSlice = dry.plan.byResource.find((r) => r.resource === "feature-flags");
    expect(flagSlice?.create ?? 0).toBe(0);
    expect(flagSlice?.update ?? 0).toBe(0);
  });

  it("--dry-run reports planned files without writing or tagging", async () => {
    const planDir = await fs.mkdtemp(path.join(process.cwd(), ".pull-int-plan-"));
    try {
      const pulled = await buildPullResult(
        config,
        pullArgs(planDir, { dryRun: true }),
        flagOnlyTargets(),
        new Map(),
      );
      expect(pulled.ok).toBe(true);
      if (!pulled.ok) throw new Error("expected ok");
      expect(pulled.dryRun).toBe(true);
      expect(pulled.totals.written).toBe(0);
      expect(pulled.totals.tagged).toBe(0);
      expect(pulled.totals.dryRunPlanned).toBeGreaterThanOrEqual(1);
      // No file should exist on disk.
      const entries = await fs.readdir(planDir).catch(() => []);
      expect(entries.length).toBe(0);
    } finally {
      await fs.rm(planDir, { recursive: true, force: true });
    }
  });

  it("respects pre-selected server ids via selectionByResource", async () => {
    // Find the flag id we created in beforeAll.
    const flags = await listManagedFeatureFlags(config);
    const our = flags.find((f) => featureFlagKeyFromTags(f.tags) === flagKey);
    if (!our) throw new Error("seeded flag not found on server");
    const selection = new Map<string, Set<number | string>>([
      ["feature-flags", new Set([our.id])],
    ]);

    const oneDir = await fs.mkdtemp(path.join(process.cwd(), ".pull-int-one-"));
    try {
      const pulled = await buildPullResult(
        config,
        pullArgs(oneDir, { dryRun: true }),
        flagOnlyTargets(),
        selection,
      );
      expect(pulled.ok).toBe(true);
      if (!pulled.ok) throw new Error("expected ok");
      expect(pulled.totals.dryRunPlanned).toBe(1);
      expect(pulled.dryRunPlanned.some((p) => p.includes(flagKey))).toBe(true);
    } finally {
      await fs.rm(oneDir, { recursive: true, force: true });
    }
  });
});
