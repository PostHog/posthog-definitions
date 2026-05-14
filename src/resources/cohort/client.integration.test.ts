import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  type CohortCreate,
  createCohort,
  deleteCohort,
  getCohort,
  listManagedCohorts,
  type ServerCohort,
  updateCohort,
} from "./client.js";
import { cohortKeyFromServer } from "./pipeline.js";

const KEY_PREFIX = "integration-cohort";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function behavioralPayload(key: string): CohortCreate {
  return {
    name: `Integration cohort ${key}`,
    description: `<!-- iac:cohorts:${key} iac:hash:integrationtest -->`,
    filters: {
      properties: {
        type: "AND",
        values: [
          { type: "person", key: "email", operator: "icontains", value: "@example.com" },
        ],
      },
    },
  };
}

function staticPayload(key: string): CohortCreate {
  return {
    name: `Integration static ${key}`,
    description: `<!-- iac:cohorts:${key} iac:hash:integrationtest -->`,
    is_static: true,
  };
}

describe("cohort client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerCohort, number>(
      config,
      listManagedCohorts,
      deleteCohort,
      (row) => row.id,
      (row) => cohortKeyFromServer(row),
      PURGE_PREFIX,
    );
  });

  it("creates a behavioral cohort with the description marker", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createCohort(config, behavioralPayload(key));
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      expect(typeof created.id).toBe("number");
      expect(created.name).toBe(`Integration cohort ${key}`);
      expect((created.description ?? "").includes(`iac:cohorts:${key}`)).toBeTruthy();
      expect(created.is_static).toBe(false);
    });
  });

  it("creates a static cohort", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createCohort(config, staticPayload(key));
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      expect(created.is_static).toBe(true);
    });
  });

  it("fetches a created cohort", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createCohort(config, behavioralPayload(key));
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const fetched = await getCohort(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(cohortKeyFromServer(fetched)).toBe(key);
    });
  });

  it("lists managed cohorts and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createCohort(config, behavioralPayload(key));
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const managed = await listManagedCohorts(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("updates a cohort's filters", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createCohort(config, behavioralPayload(key));
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      const newFilters = {
        properties: {
          type: "AND" as const,
          values: [
            { type: "person", key: "email", operator: "icontains", value: "@posthog.com" },
          ],
        },
      };
      const updated = await updateCohort(config, created.id, { filters: newFilters });
      expect(updated.id).toBe(created.id);
    });
  });

  it("soft-deletes a cohort and removes it from the managed list", async () => {
    const key = uniqueKey(KEY_PREFIX);
    const created = await createCohort(config, behavioralPayload(key));
    await deleteCohort(config, created.id);
    const managed = await listManagedCohorts(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
