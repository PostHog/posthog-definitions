#!/usr/bin/env node
import { spawn } from "node:child_process";
import { glob } from "tinyglobby";

const mode = process.argv[2] ?? "unit";

const config = {
  unit: {
    patterns: ["src/**/*.test.ts", "!src/**/*.acceptance.test.ts"],
    timeoutMs: 500,
  },
  acceptance: {
    patterns: ["src/**/*.acceptance.test.ts"],
    timeoutMs: 60_000,
  },
};

const selected = config[mode];
if (!selected) {
  console.error(`Unknown test mode "${mode}". Use "unit" or "acceptance".`);
  process.exit(2);
}

const files = await glob(selected.patterns);
if (files.length === 0) {
  console.error(`No tests matched ${selected.patterns.join(", ")}`);
  process.exit(0);
}

const child = spawn(
  process.execPath,
  [
    "--import",
    "tsx",
    "--test",
    `--test-timeout=${selected.timeoutMs}`,
    ...files,
  ],
  { stdio: "inherit" },
);
child.on("exit", (code) => process.exit(code ?? 1));
