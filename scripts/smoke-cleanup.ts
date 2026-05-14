/**
 * Smoke-test cleanup: delete the uniquely-keyed feature flag, cohort, and
 * endpoint that the smoke run created.
 *
 *   pnpm tsx scripts/smoke-cleanup.ts --flag=<key> --cohort=<key> --endpoint=<key>
 *
 * Uses each resource's pipeline prune helper, which does an identity check
 * before deleting — so a misclick can't nuke unrelated rows. Missing rows
 * are silently skipped (already-cleaned-up state is fine).
 */
import { loadConfig } from "../src/client/config.js";
import { listManagedFeatureFlags } from "../src/resources/feature-flag/client.js";
import {
  featureFlagKeyFromTags,
  pruneFeatureFlag,
} from "../src/resources/feature-flag/pipeline.js";
import { listManagedCohorts } from "../src/resources/cohort/client.js";
import { cohortKeyFromServer, pruneCohort } from "../src/resources/cohort/pipeline.js";
import { listManagedEndpoints } from "../src/resources/endpoint/client.js";
import {
  endpointKeyFromServer,
  pruneEndpoint,
} from "../src/resources/endpoint/pipeline.js";

type Args = { flag?: string; cohort?: string; endpoint?: string };

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  for (const a of argv) {
    const m = a.match(/^--(flag|cohort|endpoint)=(.*)$/);
    if (!m) continue;
    out[m[1] as keyof Args] = m[2];
  }
  return out;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig();

  if (args.flag) {
    const flags = await listManagedFeatureFlags(config);
    const target = flags.find((f) => featureFlagKeyFromTags(f.tags) === args.flag);
    if (target) {
      const ok = await pruneFeatureFlag(config, target);
      console.log(`feature-flag ${args.flag}: ${ok ? "deleted" : "skipped"}`);
    } else {
      console.log(`feature-flag ${args.flag}: not found`);
    }
  }

  if (args.cohort) {
    const cohorts = await listManagedCohorts(config);
    const target = cohorts.find((c) => cohortKeyFromServer(c) === args.cohort);
    if (target) {
      try {
        const ok = await pruneCohort(config, target);
        console.log(`cohort ${args.cohort}: ${ok ? "deleted" : "skipped"}`);
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        console.log(`cohort ${args.cohort}: delete blocked (${reason.split("\n")[0]})`);
      }
    } else {
      console.log(`cohort ${args.cohort}: not found`);
    }
  }

  if (args.endpoint) {
    const endpoints = await listManagedEndpoints(config);
    const target = endpoints.find((e) => endpointKeyFromServer(e) === args.endpoint);
    if (target) {
      const ok = await pruneEndpoint(config, target);
      console.log(`endpoint ${args.endpoint}: ${ok ? "deleted" : "skipped"}`);
    } else {
      console.log(`endpoint ${args.endpoint}: not found`);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
