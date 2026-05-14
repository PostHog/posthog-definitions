import { defineConfig } from "vitest/config";

type Mode = "unit" | "integration" | "acceptance";

const mode: Mode = (process.env.VITEST_MODE as Mode) ?? "unit";

type ModeConfig = {
  include: string[];
  exclude: string[];
  testTimeout: number;
  hookTimeout: number;
  /**
   * When true, only one test file runs at a time. Required for integration /
   * acceptance suites that mutate live state on a single shared project:
   * concurrent file workers race on PATCH/DELETE and trigger spurious
   * cleanup-stale conflicts. Unit tests don't touch external state, so
   * parallelism stays on for them.
   */
  fileParallelism: boolean;
};

const configs: Record<Mode, ModeConfig> = {
  unit: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.integration.test.ts", "src/**/*.acceptance.test.ts"],
    testTimeout: 500,
    hookTimeout: 5_000,
    fileParallelism: true,
  },
  integration: {
    include: ["src/**/*.integration.test.ts"],
    exclude: [],
    testTimeout: 60_000,
    // beforeAll purges scan all managed rows on the dev project; the default
    // 10s budget is tight when the project has accumulated test residue.
    hookTimeout: 60_000,
    fileParallelism: false,
  },
  acceptance: {
    include: ["src/**/*.{integration,acceptance}.test.ts"],
    exclude: [],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
};

const selected = configs[mode];

export default defineConfig({
  test: {
    include: selected.include,
    exclude: ["node_modules/**", "dist/**", ...selected.exclude],
    testTimeout: selected.testTimeout,
    hookTimeout: selected.hookTimeout,
    fileParallelism: selected.fileParallelism,
    environment: "node",
  },
});
