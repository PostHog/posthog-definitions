import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createFeatureFlag,
  deleteFeatureFlag,
  type FeatureFlagCreate,
  getFeatureFlag,
  listManagedFeatureFlags,
  updateFeatureFlag,
} from "./client.js";
import { featureFlagKeyFromTags, featureFlagTag } from "./pipeline.js";

const KEY_PREFIX = "integration-flag";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function basePayload(key: string): FeatureFlagCreate {
  return {
    key,
    name: `Integration flag ${key}`,
    active: true,
    filters: {
      groups: [{ properties: [], rollout_percentage: 100 }],
    },
    tags: [featureFlagTag(key)],
  };
}

describe("feature-flag client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStale(
      config,
      listManagedFeatureFlags,
      deleteFeatureFlag,
      featureFlagKeyFromTags,
      PURGE_PREFIX,
    );
  });

  it("creates a flag with the iac:* identity tag", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createFeatureFlag(config, basePayload(key));
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch(() => undefined);
      });

      expect(typeof created.id === "number" && created.id > 0).toBeTruthy();
      expect(created.key).toBe(key);
      expect(created.active).toBe(true);
      expect(created.tags?.includes(featureFlagTag(key))).toBeTruthy();
    });
  });

  it("fetches a created flag by id", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createFeatureFlag(config, basePayload(key));
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch(() => undefined);
      });

      const fetched = await getFeatureFlag(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(fetched.key).toBe(key);
      expect(fetched.tags?.includes(featureFlagTag(key))).toBeTruthy();
    });
  });

  it("lists managed flags and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createFeatureFlag(config, basePayload(key));
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch(() => undefined);
      });

      const managed = await listManagedFeatureFlags(config);
      const listed = managed.find((row) => row.id === created.id);
      expect(listed).toBeDefined();
      expect(featureFlagKeyFromTags(listed!.tags)).toBe(key);
    });
  });

  it("partially updates a flag and preserves other fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createFeatureFlag(config, basePayload(key));
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch(() => undefined);
      });

      const newName = `${created.name} (renamed)`;
      const updated = await updateFeatureFlag(config, created.id, { name: newName });
      expect(updated.name).toBe(newName);
      expect(updated.active).toBe(created.active);
      expect(updated.tags?.includes(featureFlagTag(key))).toBeTruthy();
    });
  });

  it("toggles active state via partial update", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createFeatureFlag(config, basePayload(key));
      registerCleanup(async () => {
        await deleteFeatureFlag(config, created.id).catch(() => undefined);
      });

      const off = await updateFeatureFlag(config, created.id, { active: false });
      expect(off.active).toBe(false);
      const on = await updateFeatureFlag(config, created.id, { active: true });
      expect(on.active).toBe(true);
    });
  });

  it("soft-deletes via the deleteFeatureFlag wrapper", async () => {
    const key = uniqueKey(KEY_PREFIX);
    const created = await createFeatureFlag(config, basePayload(key));
    await deleteFeatureFlag(config, created.id);
    const managed = await listManagedFeatureFlags(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
