import { beforeAll, describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  deleteFeatureFlag,
  listManagedFeatureFlags,
} from "../feature-flag/client.js";
import { featureFlagKeyFromTags, runFeatureFlagOp } from "../feature-flag/pipeline.js";
import { featureFlag, type FeatureFlag } from "../feature-flag/sdk.js";
import {
  deleteExperiment,
  getExperiment,
  listManagedExperiments,
  type ServerExperiment,
} from "./client.js";
import {
  experimentHash,
  experimentHashFromServer,
  experimentKeyFromServer,
  pruneExperiment,
  runExperimentOp,
} from "./pipeline.js";
import { experiment, type Experiment, type ExperimentLifecycle } from "./sdk.js";

function buildFlag(key: string): FeatureFlag {
  return featureFlag({
    key,
    name: `Flag for ${key}`,
    active: true,
    filters: {
      groups: [{ properties: [], rollout_percentage: 100 }],
      multivariate: {
        variants: [
          { key: "control", rollout_percentage: 50 },
          { key: "test", rollout_percentage: 50 },
        ],
      },
    },
  });
}

function buildExperiment(
  key: string,
  flag: FeatureFlag,
  lifecycle: ExperimentLifecycle = "draft",
): Experiment {
  return experiment({
    key,
    name: `Acceptance experiment ${key}`,
    description: "Created by pipeline.acceptance.test.ts",
    featureFlag: flag,
    lifecycle,
    parameters: {
      feature_flag_variants: [
        { key: "control", rollout_percentage: 50 },
        { key: "test", rollout_percentage: 50 },
      ],
    },
  });
}

function desiredFor(args: {
  flags: FeatureFlag[];
  experiments: Experiment[];
}): DesiredState {
  const state: DesiredState = new Map();
  for (const k of [
    "insights",
    "dashboards",
    "endpoints",
    "property-groups",
    "event-definitions",
    "experiment-holdouts",
    "experiment-saved-metrics",
  ]) {
    state.set(k, []);
  }
  state.set(
    "feature-flags",
    args.flags.map((spec) => ({ path: "<acceptance>", spec })),
  );
  state.set(
    "experiments",
    args.experiments.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("experiment pipeline (acceptance)", () => {
  beforeAll(async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperiment, number>(
      config,
      listManagedExperiments,
      deleteExperiment,
      (row) => row.id,
      (row) => experimentKeyFromServer(row),
      "acceptance-exp-",
    );
    await purgeStale(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      featureFlagKeyFromTags,
      "acceptance-exp-flag-",
    );
  });

  it("creates a draft experiment, updates fields, re-diffs unchanged, then prunes", async () => {
    const config = loadAcceptanceConfig();
    const flagKey = uniqueKey("acceptance-exp-flag");
    const expKey = uniqueKey("acceptance-exp");
    const flag = buildFlag(flagKey);
    const initial = buildExperiment(expKey, flag);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      // Prereq: feature flag.
      await runFeatureFlagOp(config, { kind: "create", spec: flag }, ctx);
      const flagsAfterCreate = await listManagedFeatureFlags(config);
      const flagRow = flagsAfterCreate.find((row) => featureFlagKeyFromTags(row.tags) === flagKey);
      if (!flagRow) throw new Error(`flag ${flagKey} not visible after create`);
      registerCleanup(async () => {
        await deleteFeatureFlag(config, flagRow.id);
      });

      // Create experiment.
      await runExperimentOp(config, { kind: "create", spec: initial }, ctx);
      const managed = await listManagedExperiments(config);
      const created = managed.find((row) => experimentKeyFromServer(row) === expKey);
      if (!created) throw new Error(`experiment ${expKey} not visible after create`);
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      expect(experimentHashFromServer(created)).toBe(experimentHash(initial));
      expect(created.status).toBe("draft");

      // Re-diff fresh state — unchanged.
      const result1 = diff(
        desiredFor({ flags: [flag], experiments: [initial] }),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", flagsAfterCreate],
          ["endpoints", []],
          ["property-groups", []],
          ["event-definitions", []],
          ["experiment-holdouts", []],
          ["experiment-saved-metrics", []],
          ["experiments", managed],
        ]),
      );
      const op1 = result1
        .get("experiments")!
        .ops.find((o) => (o.spec as Experiment).key === expKey);
      expect(op1?.kind).toBe("unchanged");

      // Update description (no lifecycle change).
      const updated = experiment({
        ...initial,
        description: "Updated description",
      });
      const updateOp: ResourceOp<Experiment, ServerExperiment> = {
        kind: "update",
        spec: updated,
        server: created,
      };
      await runExperimentOp(config, updateOp, ctx);

      const afterUpdate = await getExperiment(config, created.id);
      expect(experimentHashFromServer(afterUpdate)).toBe(experimentHash(updated));

      const pruned = await pruneExperiment(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedExperiments(config);
      expect(afterPrune.find((row) => experimentKeyFromServer(row) === expKey)).toBe(undefined);
    });
  });

  it("transitions lifecycle declaratively: draft → running → stopped", async () => {
    const config = loadAcceptanceConfig();

    const flagKey = uniqueKey("acceptance-exp-flag");
    const expKey = uniqueKey("acceptance-exp");
    const flag = buildFlag(flagKey);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runFeatureFlagOp(config, { kind: "create", spec: flag }, ctx);
      const flagRow = (await listManagedFeatureFlags(config)).find(
        (row) => featureFlagKeyFromTags(row.tags) === flagKey,
      );
      if (!flagRow) throw new Error(`flag ${flagKey} not visible after create`);
      registerCleanup(async () => {
        await deleteFeatureFlag(config, flagRow.id);
      });

      // Create as draft.
      const draft = buildExperiment(expKey, flag, "draft");
      await runExperimentOp(config, { kind: "create", spec: draft }, ctx);
      const created = (await listManagedExperiments(config)).find(
        (row) => experimentKeyFromServer(row) === expKey,
      );
      if (!created) throw new Error(`experiment ${expKey} not visible after create`);
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });
      expect(created.status).toBe("draft");

      // Update to running — apply should launch it.
      const running = buildExperiment(expKey, flag, "running");
      await runExperimentOp(
        config,
        { kind: "update", spec: running, server: created },
        ctx,
      );
      const afterLaunch = await getExperiment(config, created.id);
      expect(afterLaunch.status).toBe("running");

      // Update to stopped with a conclusion — apply should end it.
      const stopped = experiment({ ...buildExperiment(expKey, flag, "stopped"), conclusion: "won" });
      await runExperimentOp(
        config,
        { kind: "update", spec: stopped, server: afterLaunch },
        ctx,
      );
      const afterEnd = await getExperiment(config, created.id);
      expect(afterEnd.status).toBe("stopped");
      expect(afterEnd.conclusion).toBe("won");
    });
  });
});
