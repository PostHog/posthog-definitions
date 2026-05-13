export class SafetyViolationError extends Error {
  constructor(kind: string, id: number | string, key: string) {
    super(
      `Refusing to write to ${kind} ${id} (key="${key}"): the managed iac:* identity marker is gone. This usually means it was removed in the UI between fetch and write. Aborting.`,
    );
    this.name = "SafetyViolationError";
  }
}
