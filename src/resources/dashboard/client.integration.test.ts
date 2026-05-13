import { strict as assert } from "node:assert";
import { before, describe, it } from "node:test";
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

  before(async () => {
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
        await deleteDashboard(config, created.id).catch(() => undefined);
      });

      assert.ok(typeof created.id === "number" && created.id > 0, "id should be a positive number");
      assert.equal(created.name, payload.name);
      assert.equal(created.description, payload.description);
      assert.equal(created.pinned, true);
      assert.equal(created.restriction_level, RESTRICTION_COLLABORATORS);
      assert.ok(created.tags?.includes(dashboardTag(key)));
    });
  });

  it("fetches a created dashboard with all fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id).catch(() => undefined);
      });

      const fetched = await getDashboard(config, created.id);
      assert.equal(fetched.id, created.id);
      assert.equal(fetched.name, created.name);
      assert.equal(fetched.description, created.description);
      assert.equal(fetched.pinned, false);
      assert.ok(fetched.tags?.includes(dashboardTag(key)));
      assert.ok(Array.isArray(fetched.tiles), "tiles should be an array on the detail response");
    });
  });

  it("lists managed dashboards and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id).catch(() => undefined);
      });

      const managed = await listManagedDashboards(config);
      const listed = managed.find((row) => row.id === created.id);
      assert.ok(listed, "listManagedDashboards should include the new dashboard");
      assert.equal(dashboardKeyFromTags(listed.tags), key);
      assert.equal(listed.name, created.name);
      assert.equal(listed.deleted ?? false, false);
    });
  });

  it("partially updates a dashboard and preserves other fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createDashboard(config, basePayload(key));
      registerCleanup(async () => {
        await deleteDashboard(config, created.id).catch(() => undefined);
      });

      const newName = `${created.name} (renamed)`;
      const updated = await updateDashboard(config, created.id, { name: newName });
      assert.equal(updated.name, newName);
      assert.equal(updated.description, created.description);
      assert.equal(updated.pinned, false);
      assert.ok(updated.tags?.includes(dashboardTag(key)));

      const refetched = await getDashboard(config, created.id);
      assert.equal(refetched.name, newName);
      assert.equal(refetched.description, created.description);
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
        await deleteDashboard(config, created.id).catch(() => undefined);
      });

      assert.equal(created.pinned, false);
      assert.equal(created.restriction_level, RESTRICTION_EVERYONE);

      const updated = await updateDashboard(config, created.id, {
        pinned: true,
        restriction_level: RESTRICTION_COLLABORATORS,
      });
      assert.equal(updated.pinned, true);
      assert.equal(updated.restriction_level, RESTRICTION_COLLABORATORS);

      const refetched = await getDashboard(config, created.id);
      assert.equal(refetched.pinned, true);
      assert.equal(refetched.restriction_level, RESTRICTION_COLLABORATORS);
    });
  });
});
