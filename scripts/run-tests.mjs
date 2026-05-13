#!/usr/bin/env node
import { spawn } from "node:child_process";
import { glob } from "tinyglobby";

const mode = process.argv[2] ?? "unit";

const ONLINE_SUFFIXES = ["acceptance", "integration"];
const onlineNegations = ONLINE_SUFFIXES.map((s) => `!src/**/*.${s}.test.ts`);
const onlinePatterns = ONLINE_SUFFIXES.map((s) => `src/**/*.${s}.test.ts`);

const config = {
  unit: {
    patterns: ["src/**/*.test.ts", ...onlineNegations],
    timeoutMs: 500,
  },
  acceptance: {
    patterns: onlinePatterns,
    timeoutMs: 60_000,
  },
  integration: {
    patterns: ["src/**/*.integration.test.ts"],
    timeoutMs: 60_000,
  },
};

const selected = config[mode];
if (!selected) {
  console.error(`Unknown test mode "${mode}". Use "unit", "acceptance", or "integration".`);
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
