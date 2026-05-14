/**
 * Thrown by a resource pipeline when the `iac:*` identity marker has disappeared
 * from a server-side row between fetch and write — usually because someone removed
 * the tag in the UI. Aborting prevents the CLI from clobbering a resource it no
 * longer owns. Caught by the CLI to produce a tailored error message.
 *
 * Lives in its own file (not next to `execute.ts`) so resource pipelines can
 * import it without pulling in the apply pipeline, which would create a cycle:
 *   pipeline.ts → execute.ts → resources/index.ts → pipeline.ts
 */
export class SafetyViolationError extends Error {
  constructor(kind: string, id: number | string, key: string) {
    super(
      `Refusing to write to ${kind} ${id} (key="${key}"): the managed iac:* identity marker is gone. This usually means it was removed in the UI between fetch and write. Aborting.`,
    );
    this.name = "SafetyViolationError";
  }
}
