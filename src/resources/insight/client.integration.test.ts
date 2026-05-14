import { beforeAll, describe, expect, it } from "vitest";
import type { ClientConfig } from "../../client/config.js";
import {
  loadAcceptanceConfig,
  purgeStale,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  createInsight,
  deleteInsight,
  getInsight,
  type InsightCreate,
  listManagedInsights,
  type ServerInsight,
  updateInsight,
} from "./client.js";
import { insightKeyFromTags, insightTag } from "./pipeline.js";

const KEY_PREFIX = "integration-insight";
const PURGE_PREFIX = `${KEY_PREFIX}-`;

function trendsQuery(event: string): unknown {
  return {
    kind: "InsightVizNode",
    source: { kind: "TrendsQuery", series: [{ kind: "EventsNode", event }] },
  };
}

function basePayload(key: string, event: string): InsightCreate {
  return {
    name: `Integration insight ${key}`,
    description: `Created for ${key}`,
    query: trendsQuery(event),
    tags: [insightTag(key)],
  };
}

function assertTrendsEvent(server: ServerInsight, event: string): void {
  const wrapper = server.query as { kind?: string; source?: { kind?: string; series?: unknown[] } };
  expect(wrapper?.kind).toBe("InsightVizNode");
  expect(wrapper?.source?.kind).toBe("TrendsQuery");
  const series = wrapper?.source?.series as Array<{ event?: string }> | undefined;
  expect(series?.[0]?.event).toBe(event);
}

describe("insight client (integration)", () => {
  let config: ClientConfig;

  beforeAll(async () => {
    config = await loadAcceptanceConfig();
    await purgeStale(config, listManagedInsights, deleteInsight, insightKeyFromTags, PURGE_PREFIX);
  });

  it("creates an insight with all fields populated", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const payload = basePayload(key, "user signed up");
      const created = await createInsight(config, payload);
      registerCleanup(async () => {
        await deleteInsight(config, created.id).catch(() => undefined);
      });

      expect(typeof created.id === "number" && created.id > 0).toBeTruthy();
      expect(typeof created.short_id === "string" && created.short_id.length > 0).toBeTruthy();
      expect(created.name).toBe(payload.name);
      expect(created.description).toBe(payload.description);
      expect(created.tags?.filter((t) => t === insightTag(key))).toEqual([insightTag(key)]);
      assertTrendsEvent(created, "user signed up");
    });
  });

  it("fetches a created insight with all fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createInsight(config, basePayload(key, "user logged in"));
      registerCleanup(async () => {
        await deleteInsight(config, created.id).catch(() => undefined);
      });

      const fetched = await getInsight(config, created.id);
      expect(fetched.id).toBe(created.id);
      expect(fetched.short_id).toBe(created.short_id);
      expect(fetched.name).toBe(created.name);
      expect(fetched.description).toBe(created.description);
      expect(fetched.tags?.includes(insightTag(key))).toBeTruthy();
      assertTrendsEvent(fetched, "user logged in");
    });
  });

  it("lists managed insights and includes the created row", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createInsight(config, basePayload(key, "$pageview"));
      registerCleanup(async () => {
        await deleteInsight(config, created.id).catch(() => undefined);
      });

      const managed = await listManagedInsights(config);
      const listed = managed.find((row) => row.id === created.id);
      expect(listed).toBeDefined();
      expect(insightKeyFromTags(listed!.tags)).toBe(key);
      expect(listed!.name).toBe(created.name);
      expect(listed!.tags?.every((t) => typeof t === "string")).toBeTruthy();
    });
  });

  it("partially updates an insight and preserves other fields", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createInsight(config, basePayload(key, "user signed up"));
      registerCleanup(async () => {
        await deleteInsight(config, created.id).catch(() => undefined);
      });

      const newName = `${created.name} (renamed)`;
      const updated = await updateInsight(config, created.id, { name: newName });
      expect(updated.name).toBe(newName);
      expect(updated.description).toBe(created.description);
      assertTrendsEvent(updated, "user signed up");
      expect(updated.tags?.includes(insightTag(key))).toBeTruthy();

      const refetched = await getInsight(config, created.id);
      expect(refetched.name).toBe(newName);
      expect(refetched.description).toBe(created.description);
      assertTrendsEvent(refetched, "user signed up");
    });
  });

  it("fully updates name, description, query, and tags together", async () => {
    await withCleanup(async (registerCleanup) => {
      const key = uniqueKey(KEY_PREFIX);
      const created = await createInsight(config, basePayload(key, "user signed up"));
      registerCleanup(async () => {
        await deleteInsight(config, created.id).catch(() => undefined);
      });

      const updated = await updateInsight(config, created.id, {
        name: `Integration insight ${key} (rewritten)`,
        description: "Rewritten description",
        query: trendsQuery("user logged in"),
        tags: [insightTag(key), "extra-tag"],
      });

      expect(updated.name).toBe(`Integration insight ${key} (rewritten)`);
      expect(updated.description).toBe("Rewritten description");
      assertTrendsEvent(updated, "user logged in");
      expect(updated.tags?.includes(insightTag(key))).toBeTruthy();
      expect(updated.tags?.includes("extra-tag")).toBeTruthy();
    });
  });
});
