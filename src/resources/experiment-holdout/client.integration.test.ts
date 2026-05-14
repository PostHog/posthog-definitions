import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createExperimentHoldout,
  deleteExperimentHoldout,
  type ExperimentHoldoutCreate,
  getExperimentHoldout,
  listManagedExperimentHoldouts,
  type ServerExperimentHoldout,
  updateExperimentHoldout,
} from "./client.js";
import { experimentHoldoutKeyFromServer } from "./pipeline.js";

const KEY_PREFIX = "integration-holdout";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function basePayload(key: string): ExperimentHoldoutCreate {
  return {
    name: `Integration holdout ${key}`,
    description: `<!-- iac:experiment-holdouts:${key} iac:hash:integrationtest -->`,
    filters: [{ properties: [], rollout_percentage: 10 }],
  };
}

describe("experiment-holdout client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperimentHoldout, number>(
      config,
      listManagedExperimentHoldouts,
      deleteExperimentHoldout,
      (row) => row.id,
      (row) => experimentHoldoutKeyFromServer(row),
      PURGE_PREFIX,
    );
  });

  it("creates a holdout with the description marker", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentHoldout(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentHoldout(config, created.id);
      });

      expect(typeof created.id).toBe("number");
      expect(created.name).toBe(`Integration holdout ${key}`);
      expect((created.description ?? "").includes(`iac:experiment-holdouts:${key}`)).toBeTruthy();
    });
  });

  it("fetches a created holdout", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentHoldout(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentHoldout(config, created.id);
      });

      const fetched = await getExperimentHoldout(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(experimentHoldoutKeyFromServer(fetched)).toBe(key);
    });
  });

  it("lists managed holdouts and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentHoldout(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentHoldout(config, created.id);
      });

      const managed = await listManagedExperimentHoldouts(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("updates the rollout percentage", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentHoldout(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentHoldout(config, created.id);
      });

      const updated = await updateExperimentHoldout(config, created.id, {
        filters: [{ properties: [], rollout_percentage: 25 }],
      });
      expect((updated.filters as Array<{ rollout_percentage: number }>)[0]!.rollout_percentage).toBe(25);
    });
  });

  it("deletes a holdout and removes it from the managed list", async () => {
    const key = uniqueKey(KEY_PREFIX);
    const created = await createExperimentHoldout(config, basePayload(key));
    await deleteExperimentHoldout(config, created.id);
    const managed = await listManagedExperimentHoldouts(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
