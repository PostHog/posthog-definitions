export class SafetyViolationError extends Error {
  constructor(kind: string, id: number, key: string) {
    super(
      `Refusing to write to ${kind} ${id} (key="${key}"): its tags no longer include the managed iac:* identity tag. This usually means the tag was removed in the UI between fetch and write. Aborting.`,
    );
    this.name = "SafetyViolationError";
  }
}
