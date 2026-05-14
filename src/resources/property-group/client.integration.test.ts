import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createPropertyGroup,
  deletePropertyGroup,
  getPropertyGroup,
  listManagedPropertyGroups,
  type PropertyGroupCreate,
  type ServerPropertyGroup,
  updatePropertyGroup,
} from "./client.js";
import { propertyGroupKeyFromServer } from "./pipeline.js";

const KEY_PREFIX = "integration-pg";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function basePayload(key: string): PropertyGroupCreate {
  return {
    name: key,
    description: `<!-- iac:property-groups:${key} iac:hash:integrationtest -->`,
    properties: [
      {
        name: "plan",
        property_type: "String",
        is_required: true,
        is_optional_in_types: false,
        description: "",
      },
    ],
  };
}

describe("property-group client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerPropertyGroup, string>(
      config,
      listManagedPropertyGroups,
      deletePropertyGroup,
      (row) => row.id,
      (row) => propertyGroupKeyFromServer(row),
      PURGE_PREFIX,
    );
  });

  it("creates a property group with one property", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createPropertyGroup(config, basePayload(key));
      registerCleanup(async () => {
        await deletePropertyGroup(config, created.id).catch(() => undefined);
      });

      expect(typeof created.id).toBe("string");
      expect(created.name).toBe(key);
      expect(created.properties.length).toBe(1);
      expect(created.properties[0]!.name).toBe("plan");
      expect((created.description ?? "").includes(`iac:property-groups:${key}`)).toBeTruthy();
    });
  });

  it("fetches a created property group", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createPropertyGroup(config, basePayload(key));
      registerCleanup(async () => {
        await deletePropertyGroup(config, created.id).catch(() => undefined);
      });

      const fetched = await getPropertyGroup(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(propertyGroupKeyFromServer(fetched)).toBe(key);
    });
  });

  it("lists managed groups and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createPropertyGroup(config, basePayload(key));
      registerCleanup(async () => {
        await deletePropertyGroup(config, created.id).catch(() => undefined);
      });

      const managed = await listManagedPropertyGroups(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("partially updates the properties array", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createPropertyGroup(config, basePayload(key));
      registerCleanup(async () => {
        await deletePropertyGroup(config, created.id).catch(() => undefined);
      });

      const updated = await updatePropertyGroup(config, created.id, {
        properties: [
          {
            name: "plan",
            property_type: "String",
            is_required: true,
            is_optional_in_types: false,
            description: "Subscription tier",
          },
          {
            name: "seats",
            property_type: "Numeric",
            is_required: false,
            is_optional_in_types: false,
            description: "",
          },
        ],
      });
      expect(updated.properties.length).toBe(2);
      expect(updated.properties.find((p) => p.name === "seats")?.property_type).toBe("Numeric");
    });
  });

  it("deletes a property group and removes it from the managed list", async () => {
    const key = uniqueKey(KEY_PREFIX);
    const created = await createPropertyGroup(config, basePayload(key));
    await deletePropertyGroup(config, created.id);
    const managed = await listManagedPropertyGroups(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
