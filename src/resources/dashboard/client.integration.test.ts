import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createDashboard,
  type DashboardCreate,
  deleteDashboard,
  getDashboard,
  listManagedDashboards,
  updateDashboard,
} from "./client.js";
import { dashboardKeyFromTags, dashboardTag } from "./pipeline.js";

const KEY_PREFIX = "integration-dashboard";
const PURGE_PREFIX = `${KEY_PREFIX}-`;
const RESTRICTION_EVERYONE = 21;
const RESTRICTION_COLLABORATORS = 37;

function basePayload(key: string): DashboardCreate {
  return {
    name: `Integration dashboard ${key}`,
    description: `Created for ${key}`,
    pinned: false,
    tags: [dashboardTag(key)],
  };
}

describe("dashboard client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStale(
      config,
      listManagedDashboards,
      deleteDashboard,
      dashboardKeyFromTags,
      PURGE_PREFIX,
    );
  });

  it("creates a dashboard with name, description, pinned, tags, and restriction_level", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const payload: DashboardCreate = {
        ...basePayload(key),
        pinned: true,
        restriction_level: RESTRICTION_COLLABORATORS,
      };
      const created = await createDashboard(config, payload);
      registerCleanup(async () => {
        await deleteDashboard(config, created.id);
      });

      expect(typeof created.id === "number" && created.id > 0).toBeTruthy();
      expect(created.name).toBe(payload.name);
      expect(created.description).toBe(payload.description);
      expect(created.pinned).toBe(true);
      expect(created.restriction_level).toBe(RESTRICTION_COLLABORATORS);
      expect(created.tags?.includes(dashboardTag(key))).toBeTruthy();
    });
  });

  it("fetches a created dashboard with all fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id);
      });

      const fetched = await getDashboard(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(fetched.name).toBe(created.name);
      expect(fetched.description).toBe(created.description);
      expect(fetched.pinned).toBe(false);
      expect(fetched.tags?.includes(dashboardTag(key))).toBeTruthy();
      expect(Array.isArray(fetched.tiles)).toBeTruthy();
    });
  });

  it("lists managed dashboards and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id);
      });

      const managed = await listManagedDashboards(config);
      const listed = managed.find((row) => row.id === created.id);
      expect(listed).toBeDefined();
      expect(dashboardKeyFromTags(listed!.tags)).toBe(key);
      expect(listed!.name).toBe(created.name);
      expect(listed!.deleted ?? false).toBe(false);
    });
  });

  it("partially updates a dashboard and preserves other fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id);
      });

      const newName = `${created.name} (renamed)`;
      const updated = await updateDashboard(config, created.id, { name: newName });
      expect(updated.name).toBe(newName);
      expect(updated.description).toBe(created.description);
      expect(updated.pinned).toBe(false);
      expect(updated.tags?.includes(dashboardTag(key))).toBeTruthy();

      const refetched = await getDashboard(config, created.id);
      expect(refetched.name).toBe(newName);
      expect(refetched.description).toBe(created.description);
    });
  });

  it("toggles pinned state and restriction_level via update", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, {
        ...basePayload(key),
        pinned: false,
        restriction_level: RESTRICTION_EVERYONE,
      });
      registerCleanup(async () => {
        await deleteDashboard(config, created.id);
      });

      expect(created.pinned).toBe(false);
      expect(created.restriction_level).toBe(RESTRICTION_EVERYONE);

      const updated = await updateDashboard(config, created.id, {
        pinned: true,
        restriction_level: RESTRICTION_COLLABORATORS,
      });
      expect(updated.pinned).toBe(true);
      expect(updated.restriction_level).toBe(RESTRICTION_COLLABORATORS);

      const refetched = await getDashboard(config, created.id);
      expect(refetched.pinned).toBe(true);
      expect(refetched.restriction_level).toBe(RESTRICTION_COLLABORATORS);
    });
  });
});
