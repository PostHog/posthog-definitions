import enquirer from "enquirer";
import type { ServerDashboard } from "../resources/dashboard/client.js";

export class PickAbortedError extends Error {
  constructor() {
    super("Selection aborted.");
    this.name = "PickAbortedError";
  }
}

type Choice = {
  name: string;
  message: string;
  value: number;
  hint?: string;
  enabled: boolean;
};

export async function pickDashboardIds(dashboards: ServerDashboard[]): Promise<Set<number>> {
  if (dashboards.length === 0) return new Set();

  const choices: Choice[] = dashboards.map((d) => {
    const choice: Choice = {
      name: String(d.id),
      message: d.name || `(untitled #${d.id})`,
      value: d.id,
      enabled: true,
    };
    if (d.tags && d.tags.length > 0) {
      choice.hint = `[${d.tags.filter((t) => !t.startsWith("iac:")).join(", ")}]`;
    }
    return choice;
  });

  let answer: { dashboards: string[] };
  try {
    answer = await enquirer.prompt<{ dashboards: string[] }>({
      type: "autocomplete",
      name: "dashboards",
      message: `Select dashboards to import (${dashboards.length} total)`,
      multiple: true,
      limit: 15,
      choices,
      initial: choices.map((c) => c.name),
      footer: "type to search · space to toggle · a to toggle all · enter to confirm",
    } as Parameters<typeof enquirer.prompt>[0]);
  } catch {
    throw new PickAbortedError();
  }

  const picked = new Set<number>();
  for (const name of answer.dashboards) {
    const choice = choices.find((c) => c.name === name || c.message === name);
    if (choice) picked.add(choice.value);
  }
  return picked;
}
