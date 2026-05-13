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
  assert.equal(wrapper?.kind, "InsightVizNode");
  assert.equal(wrapper?.source?.kind, "TrendsQuery");
  const series = wrapper?.source?.series as Array<{ event?: string }> | undefined;
  assert.equal(series?.[0]?.event, event);
}

describe("insight client (integration)", () => {
  let config: ClientConfig;

  before(async () => {
    config = loadAcceptanceConfig();
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

      assert.ok(typeof created.id === "number" && created.id > 0, "id should be a positive number");
      assert.ok(typeof created.short_id === "string" && created.short_id.length > 0);
      assert.equal(created.name, payload.name);
      assert.equal(created.description, payload.description);
      assert.deepEqual(created.tags?.filter((t) => t === insightTag(key)), [insightTag(key)]);
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
      assert.equal(fetched.id, created.id);
      assert.equal(fetched.short_id, created.short_id);
      assert.equal(fetched.name, created.name);
      assert.equal(fetched.description, created.description);
      assert.ok(fetched.tags?.includes(insightTag(key)));
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
      assert.ok(listed, "listManagedInsights should include the new insight");
      assert.equal(insightKeyFromTags(listed.tags), key);
      assert.equal(listed.name, created.name);
      assert.ok(listed.tags?.every((t) => typeof t === "string"));
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
      assert.equal(updated.name, newName);
      assert.equal(updated.description, created.description);
      assertTrendsEvent(updated, "user signed up");
      assert.ok(updated.tags?.includes(insightTag(key)));

      const refetched = await getInsight(config, created.id);
      assert.equal(refetched.name, newName);
      assert.equal(refetched.description, created.description);
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

      assert.equal(updated.name, `Integration insight ${key} (rewritten)`);
      assert.equal(updated.description, "Rewritten description");
      assertTrendsEvent(updated, "user logged in");
      assert.ok(updated.tags?.includes(insightTag(key)));
      assert.ok(updated.tags?.includes("extra-tag"));
    });
  });
});
