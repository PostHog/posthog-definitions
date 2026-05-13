import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "tinyglobby";
import { tsImport } from "tsx/esm/api";
import { RESOURCES } from "../resources/index.js";
import type { DesiredState, LoadedSpec } from "../resources/types.js";

export class LoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoadError";
  }
}

export async function loadDefinitions(dir: string): Promise<DesiredState> {
  const absDir = path.resolve(dir);
  const files = await glob("**/*.ts", { cwd: absDir, absolute: true });

  const state: DesiredState = new Map();
  for (const resource of RESOURCES) {
    state.set(resource.name, []);
  }

  for (const file of files.sort()) {
    const module = await tsImport(pathToFileURL(file).href, import.meta.url);
    const exported = (module as { default?: unknown }).default;
    if (exported === undefined) continue;

    const resource = RESOURCES.find((r) => r.isSpec(exported));
    if (!resource) {
      throw new LoadError(
        `${file}: default export does not match any known resource shape. Got: ${JSON.stringify(exported).slice(0, 200)}`,
      );
    }
    state.get(resource.name)!.push({ path: file, spec: exported });
  }

  // Second pass: each resource can pull dependency specs out of its loaded items
  // (e.g. inline insights inside dashboard tiles). Inline specs are deduped by key
  // against anything already loaded by the resource that owns them.
  for (const resource of RESOURCES) {
    if (!resource.extractInlineSpecs) continue;
    for (const loaded of state.get(resource.name) ?? []) {
      for (const dep of resource.extractInlineSpecs(loaded.spec)) {
        const target = RESOURCES.find((r) => r.name === dep.resourceName);
        if (!target) continue;
        const bucket = state.get(target.name)!;
        const depKey = target.specKey(dep.spec);
        const existing = bucket.find((b) => target.specKey(b.spec) === depKey);
        if (existing) {
          if (existing.spec !== dep.spec) {
            throw new LoadError(
              `${target.displayName} key "${depKey}" is defined in multiple places (${existing.path} and inline in ${loaded.path}). Keys must be unique.`,
            );
          }
          continue;
        }
        bucket.push({ path: "<inline>", spec: dep.spec });
      }
    }
  }

  return state;
}

export type { LoadedSpec, DesiredState };
