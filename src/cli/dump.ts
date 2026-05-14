import { ConfigError, loadConfig } from "../client/config.js";
import { type LoadFailure, loadDefinitions } from "../apply/load.js";
import { RESOURCES } from "../resources/index.js";
import { topoOrder } from "../resources/order.js";
import type { CollectionResourceModule, ResourceModule } from "../resources/types.js";
import type { DumpArgs } from "./args.js";

/**
 * `dump` lists every declared resource in apply order. No server calls; reads
 * the same definitions directory the apply command does. Used to drive smoke
 * tests that round-trip apply → pull and want a stable diffable manifest.
 */
export async function runDump(args: DumpArgs): Promise<number> {
  // The config load only matters when the user supplied --project / --host;
  // we still call it so dump fails the same way apply would if the env is
  // misconfigured. If the user just wants to inspect their tree they can
  // run with `POSTHOG_PERSONAL_API_KEY=x POSTHOG_PROJECT_ID=1 dump --dir x`.
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;
  try {
    loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(`error: ${err.message}`);
      return 3;
    }
    throw err;
  }

  const loaded = await loadDefinitions(args.dir);
  if (!loaded.ok) {
    console.error(`error: ${describeLoadFailure(loaded.error)}`);
    return 1;
  }
  const desired = loaded.value;

  const ordered = topoOrder(RESOURCES.slice());
  type Entry = { resource: string; displayName: string; kind: "collection" | "singleton"; keys: string[] };
  const entries: Entry[] = [];
  for (const resource of ordered) {
    const specs = desired.get(resource.name) ?? [];
    const keys: string[] = [];
    if (resource.kind === "collection") {
      const cr = resource as CollectionResourceModule<unknown, unknown>;
      for (const { spec } of specs) {
        try {
          keys.push(cr.specKey(spec as never));
        } catch {
          keys.push("(unknown key)");
        }
      }
    } else if (specs.length > 0) {
      keys.push("(singleton)");
    }
    entries.push({
      resource: resource.name,
      displayName: resource.displayName,
      kind: resource.kind,
      keys,
    });
  }

  if (args.json) {
    const total = entries.reduce((sum, e) => sum + e.keys.length, 0);
    process.stdout.write(
      JSON.stringify(
        {
          dir: args.dir,
          total,
          resources: entries,
        },
        null,
        2,
      ) + "\n",
    );
    return 0;
  }

  let total = 0;
  for (const entry of entries) {
    if (entry.keys.length === 0) continue;
    console.log(`${entry.resource} (${entry.kind}): ${entry.keys.length}`);
    for (const key of entry.keys) console.log(`  - ${key}`);
    total += entry.keys.length;
  }
  if (total === 0) {
    console.log(`No resources declared in ${args.dir}/.`);
  } else {
    console.log(`\n${total} resource(s) across ${entries.filter((e) => e.keys.length > 0).length} kind(s).`);
  }
  return 0;
}

function describeLoadFailure(failure: LoadFailure): string {
  if (failure.kind === "unknown-shape") {
    return `${failure.file}: default export does not match any known resource shape. Got: ${failure.sample}`;
  }
  if (failure.kind === "inline-collision") {
    return `${failure.resourceDisplayName} key "${failure.key}" is defined in multiple places (${failure.firstPath} and inline in ${failure.secondPath}). Keys must be unique.`;
  }
  return `${failure.resourceDisplayName} is a singleton but was declared in multiple files (${failure.firstPath} and ${failure.secondPath}). Declare it in exactly one place.`;
}

// Imported but unused without a default export — silence the linter.
export type { ResourceModule };
