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
  deletePropertyGroup,
  getPropertyGroup,
  listManagedPropertyGroups,
  type ServerPropertyGroup,
} from "./client.js";
import {
  propertyGroupHash,
  propertyGroupHashFromServer,
  propertyGroupKeyFromServer,
  prunePropertyGroup,
  runPropertyGroupOp,
} from "./pipeline.js";
import { type PropertyGroup } from "./sdk.js";

function build(key: string, withSeats: boolean): PropertyGroup {
  return {
    key,
    description: "Created by pipeline.acceptance.test.ts",
    properties: {
      plan: { type: "String", required: true },
      ...(withSeats ? { seats: { type: "Numeric", required: true } } : {}),
    },
  };
}

function desiredFor(groups: PropertyGroup[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of ["insights", "dashboards", "feature-flags", "endpoints"]) {
    state.set(k, []);
  }
  state.set(
    "property-groups",
    groups.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("property-group pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real property group", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerPropertyGroup, string>(
      config,
      listManagedPropertyGroups,
      deletePropertyGroup,
      (row) => row.id,
      (row) => propertyGroupKeyFromServer(row),
      "acceptance-pg-",
    );

    const key = uniqueKey("acceptance-pg");
    const initial = build(key, false);

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runPropertyGroupOp(config, { kind: "create", spec: initial }, ctx);

      const serverId = ctx.propertyGroupIdByKey.get(key);
      expect(serverId).toBeDefined();
      registerCleanup(async () => {
        await deletePropertyGroup(config, serverId!);
      });

      const afterCreate = await getPropertyGroup(config, serverId!);
      expect(propertyGroupKeyFromServer(afterCreate)).toBe(key);
      expect(propertyGroupHashFromServer(afterCreate)).toBe(propertyGroupHash(initial));
      expect(afterCreate.properties.length).toBe(1);

      // Re-diff against fresh server — unchanged.
      const managed = await listManagedPropertyGroups(config);
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["property-groups", managed],
        ]),
      );
      const op1 = result1
        .get("property-groups")!
        .ops.find((o) => (o.spec as PropertyGroup).key === key);
      expect(op1?.kind).toBe("unchanged");

      // Update: add a new property.
      const updated = build(key, true);
      const updateOp: ResourceOp<PropertyGroup, ServerPropertyGroup> = {
        kind: "update",
        spec: updated,
        server: afterCreate,
      };
      await runPropertyGroupOp(config, updateOp, ctx);

      const afterUpdate = await getPropertyGroup(config, serverId!);
      expect(propertyGroupHashFromServer(afterUpdate)).toBe(propertyGroupHash(updated));
      expect(afterUpdate.properties.length).toBe(2);

      const pruned = await prunePropertyGroup(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedPropertyGroups(config);
      expect(afterPrune.find((row) => propertyGroupKeyFromServer(row) === key)).toBe(undefined);
    });
  });
});
