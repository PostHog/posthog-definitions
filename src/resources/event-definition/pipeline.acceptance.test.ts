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
  listManagedPropertyGroups,
  type ServerPropertyGroup,
} from "../property-group/client.js";
import {
  propertyGroupKeyFromServer,
  runPropertyGroupOp,
} from "../property-group/pipeline.js";
import { propertyGroup, type PropertyGroup } from "../property-group/sdk.js";
import {
  deleteEventDefinition,
  getEventDefinition,
  listEventSchemas,
  listManagedEventDefinitions,
  type ServerEventDefinition,
} from "./client.js";
import {
  eventDefinitionHash,
  eventDefinitionHashFromTags,
  eventDefinitionKeyFromTags,
  pruneEventDefinition,
  runEventDefinitionOp,
} from "./pipeline.js";
import { eventDefinition, type EventDefinition } from "./sdk.js";

function uniqueName(prefix: string): string {
  return uniqueKey(prefix).replace(/-/g, "_");
}

function buildGroup(key: string): PropertyGroup {
  return propertyGroup({
    key,
    properties: { plan: { type: "String", required: true } },
  });
}

function buildEvent(
  key: string,
  groups: PropertyGroup[],
  description: string,
): EventDefinition {
  return eventDefinition({
    key,
    name: key,
    description,
    propertyGroups: groups,
  });
}

function desiredFor(args: {
  groups?: PropertyGroup[];
  events?: EventDefinition[];
}): DesiredState {
  const state: DesiredState = new Map();
  for (const k of ["insights", "dashboards", "feature-flags", "endpoints"]) {
    state.set(k, []);
  }
  state.set(
    "property-groups",
    (args.groups ?? []).map((spec) => ({ path: "<acceptance>", spec })),
  );
  state.set(
    "event-definitions",
    (args.events ?? []).map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("event-definition pipeline (acceptance)", () => {
  it("creates an event def linked to a property group, then reconciles links on update", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerEventDefinition, string>(
      config,
      listManagedEventDefinitions,
      deleteEventDefinition,
      (row) => row.id,
      (row) => eventDefinitionKeyFromTags(row.tags),
      "acceptance_evtdef_",
    );
    await purgeStaleByRow<ServerPropertyGroup, string>(
      config,
      listManagedPropertyGroups,
      deletePropertyGroup,
      (row) => row.id,
      (row) => propertyGroupKeyFromServer(row),
      "acceptance-evtdef-pg-",
    );

    const groupKey = uniqueKey("acceptance-evtdef-pg");
    const evKey = uniqueName("acceptance_evtdef");
    const group = buildGroup(groupKey);
    const initial = buildEvent(evKey, [group], "v1");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      // First create the prerequisite property group so the event-def link
      // resolution can find its id.
      await runPropertyGroupOp(config, { kind: "create", spec: group }, ctx);
      const groupServerId = ctx.propertyGroupIdByKey.get(groupKey)!;
      registerCleanup(async () => {
        await deletePropertyGroup(config, groupServerId);
      });

      // Now the event definition.
      await runEventDefinitionOp(config, { kind: "create", spec: initial }, ctx);
      const managed = await listManagedEventDefinitions(config);
      const created = managed.find((row) => eventDefinitionKeyFromTags(row.tags) === evKey);
      if (!created) throw new Error(`event def ${evKey} not visible after create`);
      registerCleanup(async () => {
        await deleteEventDefinition(config, created.id);
      });

      expect(eventDefinitionHashFromTags(created.tags)).toBe(eventDefinitionHash(initial));

      // The EventSchema link should exist now.
      const schemasAfterCreate = (await listEventSchemas(config)).filter(
        (s) => s.event_definition === created.id,
      );
      expect(schemasAfterCreate.length).toBe(1);
      expect(schemasAfterCreate[0]!.property_group.id).toBe(groupServerId);

      // Re-diff against fresh state — unchanged.
      const result1 = diff(
        desiredFor({ groups: [group], events: [initial] }),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["property-groups", []],
          ["event-definitions", managed],
        ]),
      );
      const op1 = result1
        .get("event-definitions")!
        .ops.find((o) => (o.spec as EventDefinition).key === evKey);
      expect(op1?.kind).toBe("unchanged");

      // Update: change description, then verify the link is still there (no
      // group change → no reconcile).
      const updated = buildEvent(evKey, [group], "v2");
      const updateOp: ResourceOp<EventDefinition, ServerEventDefinition> = {
        kind: "update",
        spec: updated,
        server: created,
      };
      await runEventDefinitionOp(config, updateOp, ctx);

      const afterUpdate = await getEventDefinition(config, created.id);
      expect(eventDefinitionHashFromTags(afterUpdate.tags)).toBe(eventDefinitionHash(updated));

      const schemasAfterUpdate = (await listEventSchemas(config)).filter(
        (s) => s.event_definition === created.id,
      );
      expect(schemasAfterUpdate.length).toBe(1);

      // Update: detach the property group — reconcile should delete the link.
      const detached = buildEvent(evKey, [], "v3");
      await runEventDefinitionOp(
        config,
        { kind: "update", spec: detached, server: afterUpdate },
        ctx,
      );

      const schemasAfterDetach = (await listEventSchemas(config)).filter(
        (s) => s.event_definition === created.id,
      );
      expect(schemasAfterDetach.length).toBe(0);

      const finalRow = await getEventDefinition(config, created.id);
      const pruned = await pruneEventDefinition(config, finalRow);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedEventDefinitions(config);
      expect(afterPrune.find((row) => eventDefinitionKeyFromTags(row.tags) === evKey)).toBe(
        undefined,
      );
    });
  });
});
