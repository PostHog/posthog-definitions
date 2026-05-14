import enquirer from "enquirer";
import type { CollectionResourceModule } from "../resources/types.js";

export class PickAbortedError extends Error {
  constructor() {
    super("Selection aborted.");
    this.name = "PickAbortedError";
  }
}

type Choice = {
  name: string;
  message: string;
  value: string;
  hint?: string;
  enabled: boolean;
};

/**
 * Interactive multi-select over a resource's filtered server rows. Returns a
 * Set of stringified server ids (Map-friendly across number / string types).
 * Throws `PickAbortedError` on ctrl-c.
 */
export async function pickServerIds(
  resource: CollectionResourceModule<unknown, unknown>,
  rows: ReadonlyArray<unknown>,
): Promise<Set<number | string>> {
  if (rows.length === 0) return new Set();

  const idOf =
    resource.serverIdOf ?? ((row: unknown) => (row as { id: number | string }).id);

  const choices: Choice[] = rows.map((row) => {
    const id = idOf(row);
    const label = resource.pullLabel
      ? resource.pullLabel(row)
      : { primary: String(id) };
    const choice: Choice = {
      name: String(id),
      message: label.primary,
      value: String(id),
      enabled: true,
    };
    if (label.secondary) choice.hint = label.secondary;
    return choice;
  });

  let answer: { picked: string[] };
  try {
    answer = await enquirer.prompt<{ picked: string[] }>({
      type: "autocomplete",
      name: "picked",
      message: `Select ${resource.displayName}(s) to import (${rows.length} total)`,
      multiple: true,
      limit: 15,
      choices,
      initial: choices.map((c) => c.name),
      footer: "type to search · space to toggle · a to toggle all · enter to confirm",
      format(value: unknown) {
        const n = Array.isArray(value) ? value.length : 0;
        return `${n} of ${choices.length} selected`;
      },
    } as Parameters<typeof enquirer.prompt>[0]);
  } catch {
    throw new PickAbortedError();
  }

  const picked = new Set<number | string>();
  for (const name of answer.picked) {
    const choice = choices.find((c) => c.name === name || c.message === name);
    if (!choice) continue;
    // Recover the original id type by looking up the row.
    const row = rows.find((r) => String(idOf(r)) === choice.value);
    if (row) picked.add(idOf(row));
  }
  return picked;
}
