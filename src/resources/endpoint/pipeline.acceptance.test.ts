import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import { newApplyContext, type DesiredState, type ResourceOp } from "../types.js";
import {
  loadAcceptanceConfig,
  purgeStaleByRow,
  uniqueKey,
  withCleanup,
} from "../../test-helpers/acceptance.js";
import {
  deleteEndpoint,
  getEndpoint,
  listManagedEndpoints,
  type ServerEndpoint,
} from "./client.js";
import {
  endpointHash,
  endpointHashFromServer,
  endpointKeyFromServer,
  pruneEndpoint,
  runEndpointOp,
} from "./pipeline.js";
import { type Endpoint } from "./sdk.js";

function uniqueName(prefix: string): string {
  return uniqueKey(prefix).replace(/-/g, "_");
}

function build(key: string, query: string): Endpoint {
  return {
    key,
    name: key,
    description: "Created by pipeline.acceptance.test.ts",
    query: { kind: "HogQLQuery", query },
  };
}

function desiredFor(endpoints: Endpoint[]): DesiredState {
  const state: DesiredState = new Map();
  state.set("insights", []);
  state.set("dashboards", []);
  state.set("feature-flags", []);
  state.set(
    "endpoints",
    endpoints.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("endpoint pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real endpoint", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerEndpoint, string>(
      config,
      listManagedEndpoints,
      (cfg, _id) => deleteEndpoint(cfg, _id),
      (row) => row.name,
      (row) => endpointKeyFromServer(row),
      "acceptance_endpoint_",
    );

    const key = uniqueName("acceptance_endpoint");
    const initial = build(key, "SELECT 1");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runEndpointOp(config, { kind: "create", spec: initial }, ctx);
      registerCleanup(async () => {
        await deleteEndpoint(config, key);
      });

      const afterCreate = await getEndpoint(config, key);
      expect(endpointKeyFromServer(afterCreate)).toBe(key);
      expect(endpointHashFromServer(afterCreate)).toBe(endpointHash(initial));

      // Re-diff against fresh server state — should be unchanged.
      const managed = await listManagedEndpoints(config);
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", managed],
        ]),
      );
      const op1 = result1.get("endpoints")!.ops.find((o) => (o.spec as Endpoint).key === key);
      expect(op1?.kind).toBe("unchanged");

      // Update the query body.
      const updated = build(key, "SELECT 2");
      const updateOp: ResourceOp<Endpoint, ServerEndpoint> = {
        kind: "update",
        spec: updated,
        server: afterCreate,
      };
      await runEndpointOp(config, updateOp, ctx);

      const afterUpdate = await getEndpoint(config, key);
      expect(endpointHashFromServer(afterUpdate)).toBe(endpointHash(updated));
      expect(endpointHashFromServer(afterUpdate)).not.toBe(endpointHash(initial));

      const pruned = await pruneEndpoint(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedEndpoints(config);
      expect(afterPrune.find((row) => endpointKeyFromServer(row) === key)).toBe(undefined);
    });
  });
});
