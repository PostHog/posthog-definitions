import { RESOURCES } from "../resources/index.js";
import type { DesiredState, ResourceModule } from "../resources/types.js";

export class ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Validation failed:\n - ${issues.join("\n - ")}`);
    this.name = "ValidationError";
  }
}

export function validate(
  state: DesiredState,
  resources: ReadonlyArray<ResourceModule<unknown, unknown>> = RESOURCES,
): void {
  const issues: string[] = [];
  for (const resource of resources) {
    const loaded = state.get(resource.name) ?? [];
    const specs = loaded.map((l) => l.spec);
    issues.push(...resource.validate(specs, state));
  }
  if (issues.length > 0) throw new ValidationError(issues);
}
