import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "tinyglobby";
import { tsImport } from "tsx/esm/api";
import { RESOURCES } from "../resources/index.js";
import type { DesiredState, LoadedSpec, ResourceModule } from "../resources/types.js";
import { err, ok, type Result } from "../result.js";

/**
 * A load failure is always a user mistake in the definitions directory —
 * a malformed default export or a duplicate key. Modeled as a discriminated
 * union so the CLI can render a tailored message per kind without parsing
 * strings.
 *
 * See `.claude/skills/result-vs-exceptions/SKILL.md` for the convention.
 */
export type LoadFailure =
  | { kind: "unknown-shape"; file: string; sample: string }
  | {
      kind: "inline-collision";
      resourceDisplayName: string;
      key: string;
      firstPath: string;
      secondPath: string;
    };

export async function loadDefinitions(
  dir: string,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): Promise<Result<DesiredState, LoadFailure>> {
  const absDir = path.resolve(dir);
  const files = await glob("**/*.ts", { cwd: absDir, absolute: true });

  const state: DesiredState = new Map();
  for (const resource of resources) {
    state.set(resource.name, []);
  }

  for (const file of files.sort()) {
    const module = await tsImport(pathToFileURL(file).href, import.meta.url);
    const exported = (module as { default?: unknown }).default;
    if (exported === undefined) continue;

    const resource = resources.find((r) => r.isSpec(exported));
    if (!resource) {
      return err({
        kind: "unknown-shape",
        file,
        sample: JSON.stringify(exported).slice(0, 200),
      });
    }
    state.get(resource.name)!.push({ path: file, spec: exported });
  }

  return mergeInlineSpecs(state, resources);
}

/**
 * Second pass: each resource can pull dependency specs out of its loaded items
 * (e.g. inline insights inside dashboard tiles). Inline specs are deduped by
 * key against anything already loaded by the resource that owns them.
 *
 * Pure given the inputs — exported for direct unit testing.
 */
export function mergeInlineSpecs(
  state: DesiredState,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>>,
): Result<DesiredState, LoadFailure> {
  for (const resource of resources) {
    if (!resource.extractInlineSpecs) continue;
    for (const loaded of state.get(resource.name) ?? []) {
      for (const dep of resource.extractInlineSpecs(loaded.spec)) {
        const target = resources.find((r) => r.name === dep.resourceName);
        if (!target) continue;
        const bucket = state.get(target.name) ?? [];
        if (!state.has(target.name)) state.set(target.name, bucket);
        const depKey = target.specKey(dep.spec);
        const existing = bucket.find((b) => target.specKey(b.spec) === depKey);
        if (existing) {
          if (existing.spec !== dep.spec) {
            return err({
              kind: "inline-collision",
              resourceDisplayName: target.displayName,
              key: depKey,
              firstPath: existing.path,
              secondPath: loaded.path,
            });
          }
          continue;
        }
        bucket.push({ path: "<inline>", spec: dep.spec });
      }
    }
  }
  return ok(state);
}

export type { LoadedSpec, DesiredState };
