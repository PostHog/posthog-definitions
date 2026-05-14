#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runApply } from "./apply.js";
import { ArgError, HELP_TEXT, parseArgs } from "./args.js";
import { runPullCli } from "./pull.js";

export async function main(argv: string[]): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (err) {
    if (err instanceof ArgError) {
      console.error(`error: ${err.message}`);
      process.exit(3);
    }
    throw err;
  }

  if (parsed.command === "help") {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  const code = parsed.command === "apply" ? await runApply(parsed) : await runPullCli(parsed);
  process.exit(code);
}

// Resolve both sides through realpath so symlinked invocations (pnpm workspace,
// npx, global installs) match the same file as ESM's import.meta.url.
function isDirectInvocation(): boolean {
  const argv1 = process.argv[1];
  if (argv1 === undefined) return false;
  let modulePath: string;
  let invokedPath: string;
  try {
    modulePath = realpathSync(fileURLToPath(import.meta.url));
    invokedPath = realpathSync(argv1);
  } catch {
    return import.meta.url.endsWith(argv1) || import.meta.url === `file://${argv1}`;
  }
  return modulePath === invokedPath;
}

if (isDirectInvocation()) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
    process.exit(2);
  });
}
