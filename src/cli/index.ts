#!/usr/bin/env node
import { runApply } from "./apply.js";
import { ArgError, HELP_TEXT, parseArgs } from "./args.js";

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

  const code = await runApply(parsed);
  process.exit(code);
}

const isDirectInvocation =
  process.argv[1] !== undefined &&
  (import.meta.url.endsWith(process.argv[1]) ||
    import.meta.url === `file://${process.argv[1]}`);

if (isDirectInvocation) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.stack ?? err.message : String(err));
    process.exit(2);
  });
}
