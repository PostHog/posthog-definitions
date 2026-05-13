import { defineConfig } from "vitest/config";

type Mode = "unit" | "integration" | "acceptance";

const mode: Mode = (process.env.VITEST_MODE as Mode) ?? "unit";

const configs: Record<Mode, { include: string[]; exclude: string[]; testTimeout: number }> = {
  unit: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.integration.test.ts", "src/**/*.acceptance.test.ts"],
    testTimeout: 500,
  },
  integration: {
    include: ["src/**/*.integration.test.ts"],
    exclude: [],
    testTimeout: 60_000,
  },
  acceptance: {
    include: ["src/**/*.{integration,acceptance}.test.ts"],
    exclude: [],
    testTimeout: 60_000,
  },
};

const selected = configs[mode];

export default defineConfig({
  test: {
    include: selected.include,
    exclude: ["node_modules/**", "dist/**", ...selected.exclude],
    testTimeout: selected.testTimeout,
    environment: "node",
  },
});
