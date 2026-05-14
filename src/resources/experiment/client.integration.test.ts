import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createFeatureFlag,
  deleteFeatureFlag,
  listManagedFeatureFlags,
} from "../feature-flag/client.js";
import { featureFlagKeyFromTags, featureFlagTag } from "../feature-flag/pipeline.js";
import {
  archiveExperiment,
  createExperiment,
  deleteExperiment,
  endExperiment,
  type ExperimentCreate,
  getExperiment,
  launchExperiment,
  listManagedExperiments,
  pauseExperiment,
  resumeExperiment,
  type ServerExperiment,
  unarchiveExperiment,
  updateExperiment,
} from "./client.js";
import { experimentKeyFromServer } from "./pipeline.js";

const FLAG_PREFIX = "integration-exp-flag";
const EXP_PREFIX = "integration-exp";
const EXP_PURGE_PREFIX = `${EXP_PREFIX}-`;
const FLAG_PURGE_PREFIX = `${FLAG_PREFIX}-`;

async function createBoundFlag(
  config: ClientConfig,
  registerCleanup: (cleanup: () => Promise<void>) => void,
): Promise<string> {
  const flagKey = uniqueKey(FLAG_PREFIX);
  const flag = await createFeatureFlag(config, {
    key: flagKey,
    name: `Flag for ${flagKey}`,
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
    tags: [featureFlagTag(flagKey)],
  });
  registerCleanup(async () => {
    await deleteFeatureFlag(config, flag.id);
  });
  return flagKey;
}

function expPayload(key: string, flagKey: string): ExperimentCreate {
  return {
    name: `Integration experiment ${key}`,
    description: `<!-- iac:experiments:${key} iac:hash:integrationtest -->`,
    feature_flag_key: flagKey,
    parameters: {
      feature_flag_variants: [
        { key: "control", rollout_percentage: 50 },
        { key: "test", rollout_percentage: 50 },
      ],
    },
  };
}

describe("experiment client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperiment, number>(
      config,
      listManagedExperiments,
      deleteExperiment,
      (row) => row.id,
      (row) => experimentKeyFromServer(row),
      EXP_PURGE_PREFIX,
    );
    await purgeStale(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      featureFlagKeyFromTags,
      FLAG_PURGE_PREFIX,
    );
  });

  it("creates an experiment bound to a fresh feature flag", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      expect(typeof created.id).toBe("number");
      expect(created.feature_flag_key).toBe(flagKey);
      expect(experimentKeyFromServer(created)).toBe(expKey);
      expect(created.status).toBe("draft");
    });
  });

  it("fetches a created experiment", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      const fetched = await getExperiment(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(experimentKeyFromServer(fetched)).toBe(expKey);
    });
  });

  it("lists managed experiments and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      const managed = await listManagedExperiments(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("partially updates the experiment description", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      const newDesc = `<!-- iac:experiments:${expKey} iac:hash:newhash --> updated body`;
      const updated = await updateExperiment(config, created.id, { description: newDesc });
      expect(updated.description).toBe(newDesc);
    });
  });

  it("walks the full lifecycle: launch → pause → resume → end → archive → unarchive", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      registerCleanup(async () => {
        await deleteExperiment(config, created.id);
      });

      const launched = await launchExperiment(config, created.id);
      expect(launched.status).toBe("running");

      const paused = await pauseExperiment(config, created.id);
      expect(paused.status).toBe("paused");

      const resumed = await resumeExperiment(config, created.id);
      expect(resumed.status).toBe("running");

      const ended = await endExperiment(config, created.id, { conclusion: "won" });
      expect(ended.status).toBe("stopped");
      expect(ended.conclusion).toBe("won");

      const archived = await archiveExperiment(config, created.id);
      expect(archived.archived).toBe(true);

      const unarchived = await unarchiveExperiment(config, created.id);
      expect(unarchived.archived).toBe(false);
    });
  });

  it("deletes an experiment and removes it from the managed list", async () => {
    await withCleanup(async (registerCleanup) => {
      const flagKey = await createBoundFlag(config, registerCleanup);
      const expKey = uniqueKey(EXP_PREFIX);
      const created = await createExperiment(config, expPayload(expKey, flagKey));
      await deleteExperiment(config, created.id);

      const managed = await listManagedExperiments(config);
      expect(managed.find((row) => row.id === created.id)).toBe(undefined);
    });
  });
});
