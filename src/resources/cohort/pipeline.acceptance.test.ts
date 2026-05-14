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
  deleteCohort,
  getCohort,
  listManagedCohorts,
  type ServerCohort,
} from "./client.js";
import {
  cohortHash,
  cohortHashFromServer,
  cohortKeyFromServer,
  pruneCohort,
  runCohortOp,
} from "./pipeline.js";
import { cohort, type Cohort } from "./sdk.js";

function build(key: string, value: string): Cohort {
  return cohort({
    key,
    name: `Acceptance cohort ${key}`,
    description: "Created by pipeline.acceptance.test.ts",
    filters: {
      properties: {
        type: "AND",
        values: [{ type: "person", key: "email", operator: "icontains", value }],
      },
    },
  });
}

function desiredFor(cohorts: Cohort[]): DesiredState {
  const state: DesiredState = new Map();
  for (const k of ["insights", "dashboards", "feature-flags", "endpoints"]) {
    state.set(k, []);
  }
  state.set(
    "cohorts",
    cohorts.map((spec) => ({ path: "<acceptance>", spec })),
  );
  return state;
}

describe("cohort pipeline (acceptance)", () => {
  it("creates, updates, re-diffs unchanged, then prunes a real cohort", async () => {
    const config = loadAcceptanceConfig();
    await purgeStaleByRow<ServerCohort, number>(
      config,
      listManagedCohorts,
      deleteCohort,
      (row) => row.id,
      (row) => cohortKeyFromServer(row),
      "acceptance-cohort-",
    );

    const key = uniqueKey("acceptance-cohort");
    const initial = build(key, "@example.com");

    await withCleanup(async (registerCleanup) => {
      const ctx = newApplyContext();

      await runCohortOp(config, { kind: "create", spec: initial }, ctx);
      const managed = await listManagedCohorts(config);
      const created = managed.find((row) => cohortKeyFromServer(row) === key);
      if (!created) throw new Error(`cohort ${key} not visible after create`);
      registerCleanup(async () => {
        await deleteCohort(config, created.id).catch((err) => console.error("cleanup failed:", err));
      });

      expect(cohortHashFromServer(created)).toBe(cohortHash(initial));

      // Re-diff fresh state — unchanged.
      const result1 = diff(
        desiredFor([initial]),
        new Map<string, unknown[]>([
          ["insights", []],
          ["dashboards", []],
          ["feature-flags", []],
          ["endpoints", []],
          ["cohorts", managed],
        ]),
      );
      const op1 = result1.get("cohorts")!.ops.find((o) => (o.spec as Cohort).key === key);
      expect(op1?.kind).toBe("unchanged");

      // Update filter value.
      const updated = build(key, "@posthog.com");
      const updateOp: ResourceOp<Cohort, ServerCohort> = {
        kind: "update",
        spec: updated,
        server: created,
      };
      await runCohortOp(config, updateOp, ctx);

      const afterUpdate = await getCohort(config, created.id);
      expect(cohortHashFromServer(afterUpdate)).toBe(cohortHash(updated));

      const pruned = await pruneCohort(config, afterUpdate);
      expect(pruned).toBe(true);

      const afterPrune = await listManagedCohorts(config);
      expect(afterPrune.find((row) => cohortKeyFromServer(row) === key)).toBe(undefined);
    });
  });
});
