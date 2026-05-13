#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const vercelEnv = process.env.VERCEL_ENV;
const isProduction = vercelEnv === "production";
const dryRun = !isProduction;

const args = ["apply", "--dir", "posthog"];
if (dryRun) args.push("--dry-run");

const label = dryRun
  ? `[posthog-sync] VERCEL_ENV=${vercelEnv ?? "<unset>"} — running posthog-definitions in DRY-RUN mode`
  : `[posthog-sync] VERCEL_ENV=production — applying posthog-definitions for real`;
console.log(label);

// Resolve the CLI through the pnpm workspace symlink at node_modules/@posthog/definitions.
// We avoid the package.json `bin` link because pnpm fails to create it on first install
// (the bin target dist/cli/index.js doesn't exist until the lib's build step runs).
const here = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(here, "..", "node_modules", "@posthog", "definitions", "dist", "cli", "index.js");

const result = spawnSync(process.execPath, [cliPath, ...args], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`[posthog-sync] failed to spawn ${cliPath}: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
