import { RESOURCES } from "../resources/index.js";
import type { DesiredState, ResourceModule } from "../resources/types.js";
import { err, ok, type Result } from "../result.js";

/**
 * Validation collects issues from each resource module. Invalid state is a
 * normal outcome — see `.claude/skills/result-vs-exceptions/SKILL.md` — so the
 * function returns a `Result` and the caller decides how to surface failure.
 */
export type ValidationOk = { resourceCount: number };

export function validate(
  state: DesiredState,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): Result<ValidationOk, string[]> {
  const issues: string[] = [];
  for (const resource of resources) {
    const loaded = state.get(resource.name) ?? [];
    const specs = loaded.map((l) => l.spec);
    issues.push(...resource.validate(specs, state));
  }
  if (issues.length > 0) return err(issues);
  return ok({ resourceCount: resources.length });
}
