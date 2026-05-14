import { ConfigError, loadConfig } from "../client/config.js";
import { type LoadFailure, loadDefinitions } from "../apply/load.js";
import { RESOURCES } from "../resources/index.js";
import { topoOrder } from "../resources/order.js";
import type { CollectionResourceModule } from "../resources/types.js";
import type { DumpArgs } from "./args.js";
import {
  type DumpErr,
  type DumpResult,
  exitCodeForError,
} from "./result.js";

/**
 * `dump` lists every declared resource in apply order. No server calls; reads
 * the same definitions directory the apply command does. Used by smoke tests
 * to assert on a stable, diffable manifest.
 */
export async function runDump(args: DumpArgs): Promise<number> {
  // The config load only matters when the user supplied --project / --host;
  // we still call it so dump fails the same way apply would if the env is
  // misconfigured.
  const overrides: { host?: string; projectId?: string } = {};
  if (args.host !== undefined) overrides.host = args.host;
  if (args.project !== undefined) overrides.projectId = args.project;
  try {
    loadConfig(overrides);
  } catch (err) {
    if (err instanceof ConfigError) {
      return emitAndExit(args, { ok: false, stage: "config", error: err.message });
    }
    throw err;
  }

  const result = await buildDumpResult(args);
  if (!result.ok) return emitAndExit(args, result);

  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return 0;
  }
  emitDumpProse(result);
  return 0;
}

export async function buildDumpResult(args: DumpArgs): Promise<DumpResult> {
  const loaded = await loadDefinitions(args.dir);
  if (!loaded.ok) {
    return { ok: false, stage: "load", error: describeLoadFailure(loaded.error) };
  }
  const desired = loaded.value;

  const ordered = topoOrder(RESOURCES.slice());
  const resources: Array<{
    resource: string;
    displayName: string;
    kind: "collection" | "singleton";
    keys: string[];
  }> = [];
  let total = 0;
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
    resources.push({
      resource: resource.name,
      displayName: resource.displayName,
      kind: resource.kind,
      keys,
    });
    total += keys.length;
  }

  return { ok: true, dir: args.dir, total, resources };
}

function emitAndExit(args: DumpArgs, result: DumpErr): number {
  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    console.error(`error: ${result.error}`);
  }
  return exitCodeForError(result);
}

function emitDumpProse(result: Extract<DumpResult, { ok: true }>): void {
  if (result.total === 0) {
    console.log(`No resources declared in ${result.dir}/.`);
    return;
  }
  let kindsWithSpecs = 0;
  for (const entry of result.resources) {
    if (entry.keys.length === 0) continue;
    kindsWithSpecs++;
    console.log(`${entry.resource} (${entry.kind}): ${entry.keys.length}`);
    for (const key of entry.keys) console.log(`  - ${key}`);
  }
  console.log(`\n${result.total} resource(s) across ${kindsWithSpecs} kind(s).`);
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
