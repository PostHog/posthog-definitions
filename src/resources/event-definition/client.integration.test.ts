import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createEventDefinition,
  deleteEventDefinition,
  type EventDefinitionCreate,
  getEventDefinition,
  listManagedEventDefinitions,
  type ServerEventDefinition,
  updateEventDefinition,
} from "./client.js";
import { eventDefinitionKeyFromTags, eventDefinitionTag } from "./pipeline.js";

const KEY_PREFIX = "integration_evtdef";
const PURGE_PREFIX = `${KEY_PREFIX}_`;

function uniqueName(prefix: string): string {
  return uniqueKey(prefix).replace(/-/g, "_");
}

function basePayload(key: string): EventDefinitionCreate {
  return {
    name: key,
    description: `Created by client.integration.test.ts for ${key}`,
    tags: [eventDefinitionTag(key)],
  };
}

describe("event-definition client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerEventDefinition, string>(
      config,
      listManagedEventDefinitions,
      deleteEventDefinition,
      (row) => row.id,
      (row) => eventDefinitionKeyFromTags(row.tags),
      PURGE_PREFIX,
    );
  });

  it("creates an event definition with the iac:* tag", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEventDefinition(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEventDefinition(config, created.id).catch(() => undefined);
      });

      expect(typeof created.id).toBe("string");
      expect(created.name).toBe(key);
      expect(created.tags?.includes(eventDefinitionTag(key))).toBeTruthy();
    });
  });

  it("fetches a created event definition", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEventDefinition(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEventDefinition(config, created.id).catch(() => undefined);
      });

      const fetched = await getEventDefinition(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(eventDefinitionKeyFromTags(fetched.tags)).toBe(key);
    });
  });

  it("lists managed event definitions and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEventDefinition(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEventDefinition(config, created.id).catch(() => undefined);
      });

      const managed = await listManagedEventDefinitions(config);
      expect(managed.find((row) => row.id === created.id)).toBeDefined();
    });
  });

  it("partially updates the description", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEventDefinition(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEventDefinition(config, created.id).catch(() => undefined);
      });

      const newDesc = "Rewritten description";
      const updated = await updateEventDefinition(config, created.id, { description: newDesc });
      expect(updated.description).toBe(newDesc);
      expect(updated.tags?.includes(eventDefinitionTag(key))).toBeTruthy();
    });
  });

  it("deletes an event definition and removes it from the managed list", async () => {
    const key = uniqueName(KEY_PREFIX);
    const created = await createEventDefinition(config, basePayload(key));
    await deleteEventDefinition(config, created.id);
    const managed = await listManagedEventDefinitions(config);
    expect(managed.find((row) => row.id === created.id)).toBe(undefined);
  });
});
