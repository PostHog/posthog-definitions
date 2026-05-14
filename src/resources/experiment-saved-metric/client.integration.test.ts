import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createExperimentSavedMetric,
  deleteExperimentSavedMetric,
  type ExperimentSavedMetricCreate,
  getExperimentSavedMetric,
  listManagedExperimentSavedMetrics,
  type ServerExperimentSavedMetric,
  updateExperimentSavedMetric,
} from "./client.js";
import { experimentSavedMetricKeyFromServer } from "./pipeline.js";

const KEY_PREFIX = "integration-savedmetric";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function basePayload(key: string): ExperimentSavedMetricCreate {
  return {
    name: `Integration metric ${key}`,
    description: `<!-- iac:experiment-saved-metrics:${key} iac:hash:integrationtest -->`,
    query: {
      kind: "ExperimentMetric",
      metric_type: "mean",
      source: { kind: "EventsNode", event: "user_signed_up" },
    },
  };
}

describe("experiment-saved-metric client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerExperimentSavedMetric, number>(
      config,
      listManagedExperimentSavedMetrics,
      deleteExperimentSavedMetric,
      (row) => row.id,
      (row) => experimentSavedMetricKeyFromServer(row),
      PURGE_PREFIX,
    );
  });

  it("creates a saved metric with the description marker", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentSavedMetric(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentSavedMetric(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      expect(typeof created.id).toBe("number");
      expect(created.name).toBe(`Integration metric ${key}`);
      expect((created.description ?? "").includes(`iac:experiment-saved-metrics:${key}`)).toBeTruthy();
    });
  });

  it("fetches a created saved metric", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentSavedMetric(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentSavedMetric(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const fetched = await getExperimentSavedMetric(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(experimentSavedMetricKeyFromServer(fetched)).toBe(key);
    });
  });

  it("lists managed saved metrics and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentSavedMetric(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentSavedMetric(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const managed = await listManagedExperimentSavedMetrics(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("updates the query body", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createExperimentSavedMetric(config, basePayload(key));
      registerCleanup(async () => {
        await deleteExperimentSavedMetric(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const newQuery = {
        kind: "ExperimentMetric",
        metric_type: "mean",
        source: { kind: "EventsNode", event: "user_logged_in" },
      };
      const updated = await updateExperimentSavedMetric(config, created.id, { query: newQuery });
      expect((updated.query as { source?: { event?: string } }).source?.event).toBe("user_logged_in");
    });
  });

  it("deletes a saved metric and removes it from the managed list", async () => {
    const key = uniqueKey(KEY_PREFIX);
    const created = await createExperimentSavedMetric(config, basePayload(key));
    await deleteExperimentSavedMetric(config, created.id);
    const managed = await listManagedExperimentSavedMetrics(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
