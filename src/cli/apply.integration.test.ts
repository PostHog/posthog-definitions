import { promises as fs } from "node:fs";
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
import { buildApplyResult } from "./apply.js";
import type { ApplyArgs } from "./args.js";

const KEY_PREFIX = "integration-apply";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function applyArgs(dir: string, overrides: Partial<ApplyArgs> = {}): ApplyArgs {
  return {
    command: "apply",
    dir,
    dryRun: false,
    verbose: false,
    prune: false,
    json: true,
    kinds: [],
    ...overrides,
  };
}

/**
 * Each call writes to a fresh basename so loadDefinitions' dynamic
 * import doesn't return a cached module. (tsx caches by URL — same
 * path + edited contents still yields the stale module.)
 */
async function writeSeed(
  dir: string,
  flagKey: string,
  active: boolean,
  basename = "flag.ts",
): Promise<void> {
  await fs.mkdir(path.join(dir, "feature-flags"), { recursive: true });
  await fs.writeFile(
    path.join(dir, "feature-flags", basename),
    `import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "${flagKey}",
  name: "${flagKey}",
  active: ${active ? "true" : "false"},
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});
`,
  );
}

describe("apply (integration)", () => {
  let config: ClientConfig;
  let workDir: string;
  let flagKey: string;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    // Sweep any leftover apply-integration flags from prior runs.
    await purgeStaleByRow(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      (row) => row.id,
      (row) => featureFlagKeyFromTags(row.tags),
      PURGE_PREFIX,
    );
    workDir = await fs.mkdtemp(path.join(process.cwd(), ".apply-int-"));
    flagKey = uniqueKey(KEY_PREFIX);
  });

  afterAll(async () => {
    if (workDir) await fs.rm(workDir, { recursive: true, force: true });
    // Best-effort: delete the flag we created so the dev project doesn't
    // accumulate residue. List-and-find rather than memoizing the id so
    // partial runs still clean up.
    try {
      const flags = await listManagedFeatureFlags(config);
      const target = flags.find((f) => featureFlagKeyFromTags(f.tags) === flagKey);
      if (target) await deleteFeatureFlag(config, target.id);
    } catch {
      // Ignore cleanup failures; the next run's beforeAll will purge.
    }
  });

  it("creates a flag, then a re-apply reports it unchanged", async () => {
    await writeSeed(workDir, flagKey, true);

    // First apply — create.
    const first = await buildApplyResult(config, applyArgs(workDir));
    expect(first.ok).toBe(true);
    if (!first.ok || !first.applied) throw new Error("expected applied result");
    expect(first.totals.created).toBe(1);
    expect(first.totals.updated).toBe(0);
    expect(first.byResource["feature-flags"]?.created).toBe(1);

    // Second apply — same spec, must report unchanged (idempotent).
    const second = await buildApplyResult(config, applyArgs(workDir));
    expect(second.ok).toBe(true);
    if (!second.ok || !second.applied) throw new Error("expected applied result");
    expect(second.totals.created).toBe(0);
    expect(second.totals.updated).toBe(0);
    expect(second.totals.unchanged).toBe(1);
  });

  it("dry-run reports a planned update for an edited flag", async () => {
    // Use a fresh subdir + filename so the loader doesn't return the cached
    // module from the previous test. (tsx caches by URL — overwriting the
    // same path still yields the stale module.)
    const editDir = await fs.mkdtemp(path.join(process.cwd(), ".apply-int-edit-"));
    try {
      await writeSeed(editDir, flagKey, false, "edited.ts");
      const dryRun = await buildApplyResult(config, applyArgs(editDir, { dryRun: true }));
      expect(dryRun.ok).toBe(true);
      if (!dryRun.ok || !dryRun.dryRun) throw new Error("expected dryRun result");
      expect(dryRun.plan.totalOps).toBe(1);
      const slice = dryRun.plan.byResource.find((r) => r.resource === "feature-flags");
      expect(slice?.update).toBe(1);
      expect(slice?.create).toBe(0);
    } finally {
      await fs.rm(editDir, { recursive: true, force: true });
    }
  });

  it("returns a validate-stage error for an invalid spec", async () => {
    const badDir = await fs.mkdtemp(path.join(process.cwd(), ".apply-int-bad-"));
    try {
      await fs.mkdir(path.join(badDir, "feature-flags"), { recursive: true });
      await fs.writeFile(
        path.join(badDir, "feature-flags", "bad.ts"),
        `import { featureFlag } from "@posthog/definitions";
// Missing required filters → validation should reject.
export default featureFlag({ key: "x_bad", name: "bad" } as any);
`,
      );
      const result = await buildApplyResult(config, applyArgs(badDir, { dryRun: true }));
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected validate error");
      expect(result.stage).toBe("validate");
      expect(result.issues).toBeDefined();
      expect(result.issues?.length ?? 0).toBeGreaterThan(0);
    } finally {
      await fs.rm(badDir, { recursive: true, force: true });
    }
  });
});
