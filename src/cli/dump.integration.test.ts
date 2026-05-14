import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildDumpResult } from "./dump.js";
import type { DumpArgs } from "./args.js";

// `dump` is purely local — it reads a definitions directory and reports
// declared resources in topo order. No server calls. We mark it as an
// integration test because it runs the full loader path (dynamic import
// of TS source files) which is the same code the apply/pull CLIs use.

function dumpArgs(dir: string, json = true): DumpArgs {
  return {
    command: "dump",
    dir,
    verbose: false,
    json,
  };
}

describe("dump (integration)", () => {
  let workDir: string;

  beforeAll(async () => {
    // Inside the repo so `@posthog/definitions` resolves for the dynamic
    // imports loadDefinitions does.
    workDir = await fs.mkdtemp(path.join(process.cwd(), ".dump-int-"));
  });

  afterAll(async () => {
    if (workDir) await fs.rm(workDir, { recursive: true, force: true });
  });

  it("lists declared keys per resource in apply order", async () => {
    await fs.mkdir(path.join(workDir, "feature-flags"), { recursive: true });
    await fs.writeFile(
      path.join(workDir, "feature-flags", "alpha.ts"),
      `import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "dump_alpha",
  name: "dump_alpha",
  active: true,
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});
`,
    );
    await fs.writeFile(
      path.join(workDir, "feature-flags", "beta.ts"),
      `import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "dump_beta",
  name: "dump_beta",
  active: false,
  filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
});
`,
    );

    const result = await buildDumpResult(dumpArgs(workDir));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.total).toBe(2);
    const flagEntry = result.resources.find((r) => r.resource === "feature-flags");
    expect(flagEntry?.keys.sort()).toEqual(["dump_alpha", "dump_beta"]);
    // Every resource kind is represented exactly once in the manifest.
    const names = result.resources.map((r) => r.resource);
    expect(new Set(names).size).toBe(names.length);
    // Empty kinds still appear with keys: [].
    const cohortEntry = result.resources.find((r) => r.resource === "cohorts");
    expect(cohortEntry).toBeDefined();
    expect(cohortEntry?.keys).toEqual([]);
  });

  it("returns total=0 for an empty definitions dir", async () => {
    const empty = await fs.mkdtemp(path.join(tmpdir(), ".dump-empty-"));
    try {
      const result = await buildDumpResult(dumpArgs(empty));
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected ok");
      expect(result.total).toBe(0);
    } finally {
      await fs.rm(empty, { recursive: true, force: true });
    }
  });

  it("returns a load-stage error for an unrecognized default export", async () => {
    const badDir = await fs.mkdtemp(path.join(tmpdir(), ".dump-bad-"));
    try {
      await fs.mkdir(path.join(badDir, "feature-flags"), { recursive: true });
      await fs.writeFile(
        path.join(badDir, "feature-flags", "bad.ts"),
        `export default { totally: "wrong shape" };\n`,
      );
      const result = await buildDumpResult(dumpArgs(badDir));
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected error");
      expect(result.stage).toBe("load");
      expect(result.error).toContain("default export does not match");
    } finally {
      await fs.rm(badDir, { recursive: true, force: true });
    }
  });
});
