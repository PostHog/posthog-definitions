import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createEndpoint,
  deleteEndpoint,
  type EndpointCreate,
  getEndpoint,
  listManagedEndpoints,
  type ServerEndpoint,
  updateEndpoint,
} from "./client.js";
import { endpointKeyFromServer } from "./pipeline.js";

const KEY_PREFIX = "integration_endpoint";
const PURGE_PREFIX = `${KEY_PREFIX}_`;

function uniqueName(prefix: string): string {
  // Endpoint names are URL-safe — restrict to letters/digits/underscore.
  return uniqueKey(prefix).replace(/-/g, "_");
}

function basePayload(key: string): EndpointCreate {
  return {
    name: key,
    description: `<!-- iac:endpoints:${key} iac:hash:integrationtest -->`,
    query: { kind: "HogQLQuery", query: "SELECT 1" },
  };
}

describe("endpoint client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerEndpoint, string>(
      config,
      listManagedEndpoints,
      (cfg, _id) => deleteEndpoint(cfg, _id), // id == name for our purge purpose
      (row) => row.name,
      (row) => endpointKeyFromServer(row),
      PURGE_PREFIX,
    );
  });

  it("creates an endpoint with the description marker", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEndpoint(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEndpoint(config, created.name);
      });

      expect(created.name).toBe(key);
      expect((created.description ?? "").includes(`iac:endpoints:${key}`)).toBeTruthy();
      expect((created.query as { kind?: string })?.kind).toBe("HogQLQuery");
    });
  });

  it("fetches a created endpoint by name", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEndpoint(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEndpoint(config, created.name);
      });

      const fetched = await getEndpoint(config, created.name);
      expect(fetched.name).toBe(created.name);
      expect(endpointKeyFromServer(fetched)).toBe(key);
    });
  });

  it("lists managed endpoints and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEndpoint(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEndpoint(config, created.name);
      });

      const managed = await listManagedEndpoints(config);
      const listed = managed.find((row) => row.name === created.name);
      expect(listed).toBeDefined();
    });
  });

  it("partially updates an endpoint's query and preserves other fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueName(KEY_PREFIX);
      const created = await createEndpoint(config, basePayload(key));
      registerCleanup(async () => {
        await deleteEndpoint(config, created.name);
      });

      const newQuery = { kind: "HogQLQuery", query: "SELECT 2" };
      const updated = await updateEndpoint(config, created.name, { query: newQuery });
      expect((updated.query as { query?: string })?.query).toBe("SELECT 2");
      expect(updated.description).toBe(created.description);
    });
  });

  it("deletes an endpoint and removes it from the managed list", async () => {
    const key = uniqueName(KEY_PREFIX);
    const created = await createEndpoint(config, basePayload(key));
    await deleteEndpoint(config, created.name);

    const managed = await listManagedEndpoints(config);
    expect(managed.find((row) => row.name === created.name)).toBe(undefined);
  });
});
