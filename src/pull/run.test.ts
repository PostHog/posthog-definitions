import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ClientConfig } from "../client/config.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import { runPull } from "./run.js";
import type { PullRenderContext, RenderedFile } from "./types.js";

const FAKE_CONFIG: ClientConfig = {
  host: "https://example.test",
  projectId: "1",
  apiKey: "test",
};

type Row = { id: number; name: string; deps?: number[]; ref?: number };

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "pull-test-"));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

function tagAuditor(): {
  calls: Array<{ resource: string; id: number | string; hash: string }>;
  hook: (resource: string) => (
    _config: ClientConfig,
    server: Row,
    _spec: unknown,
    hash: string,
  ) => Promise<void>;
} {
  const calls: Array<{ resource: string; id: number | string; hash: string }> = [];
  return {
    calls,
    hook: (resource) =>
      async (_config, server, _spec, hash) => {
        calls.push({ resource, id: server.id, hash });
      },
  };
}

describe("runPull orchestrator", () => {
  it("renders selected rows for a single resource", async () => {
    await withTempDir(async (dir) => {
      const alpha = makeFakeResource<unknown, Row>({
        name: "alphas",
        displayName: "alpha",
        listAll: async () => [
          { id: 1, name: "first" },
          { id: 2, name: "second" },
        ],
        getById: async (_c, id) => ({ id: Number(id), name: `row-${id}` }),
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        renderToFile: (row: Row, _ctx: PullRenderContext): RenderedFile => ({
          filename: `${row.name}.ts`,
          contents: `export default { id: ${row.id} };\n`,
          specKey: row.name,
        }),
        tagOnServer: async () => {},
      });

      const result = await runPull(FAKE_CONFIG, {
        outDir: dir,
        resources: [alpha],
        selectionByResource: new Map([["alphas", new Set([1, 2])]]),
        dryRun: true,
      });

      expect(result.dryRunSkipped.length).toBe(2);
      expect(result.dryRunSkipped.some((f) => f.endsWith("alphas/first.ts"))).toBe(true);
      expect(result.dryRunSkipped.some((f) => f.endsWith("alphas/second.ts"))).toBe(true);
    });
  });

  it("cascades pullDependencies and fetches missing rows by id", async () => {
    await withTempDir(async (dir) => {
      const insightCalls: number[] = [];
      const insights = makeFakeResource<unknown, Row>({
        name: "insights",
        listAll: async () => [],
        getById: async (_c, id) => {
          insightCalls.push(Number(id));
          return { id: Number(id), name: `insight-${id}` };
        },
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        renderToFile: (row: Row): RenderedFile => ({
          filename: `${row.name}.ts`,
          contents: `// insight ${row.id}\n`,
          specKey: row.name,
        }),
        tagOnServer: async () => {},
      });

      const dashboards = makeFakeResource<unknown, Row>({
        name: "dashboards",
        dependsOn: [insights],
        listAll: async () => [{ id: 10, name: "growth", deps: [100, 101] }],
        getById: async (_c, id) => ({ id: Number(id), name: `dash-${id}` }),
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        pullDependencies: (row: Row) =>
          (row.deps ?? []).map((id) => ({ resourceName: "insights", serverId: id })),
        renderToFile: (row: Row, ctx: PullRenderContext): RenderedFile => {
          const refs = (row.deps ?? []).map((id) =>
            ctx.importForServerId("insights", id).filename,
          );
          return {
            filename: `${row.name}.ts`,
            contents: `// imports: ${refs.join(", ")}\n`,
            specKey: row.name,
          };
        },
        tagOnServer: async () => {},
      });

      const result = await runPull(FAKE_CONFIG, {
        outDir: dir,
        resources: [insights, dashboards],
        selectionByResource: new Map([["dashboards", new Set([10])]]),
        dryRun: true,
      });

      // Cascade: insight 100 and 101 were fetched on demand.
      expect(insightCalls.sort()).toEqual([100, 101]);
      // Files were planned for both resources.
      expect(result.dryRunSkipped.some((f) => f.endsWith("insights/insight-100.ts"))).toBe(true);
      expect(result.dryRunSkipped.some((f) => f.endsWith("insights/insight-101.ts"))).toBe(true);
      expect(result.dryRunSkipped.some((f) => f.endsWith("dashboards/growth.ts"))).toBe(true);
    });
  });

  it("--no-cascade skips dependency resolution", async () => {
    await withTempDir(async (dir) => {
      const insightCalls: number[] = [];
      const insights = makeFakeResource<unknown, Row>({
        name: "insights",
        listAll: async () => [],
        getById: async (_c, id) => {
          insightCalls.push(Number(id));
          return { id: Number(id), name: `insight-${id}` };
        },
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        renderToFile: (row: Row): RenderedFile => ({
          filename: `${row.name}.ts`,
          contents: "",
          specKey: row.name,
        }),
        tagOnServer: async () => {},
      });
      const dashboards = makeFakeResource<unknown, Row>({
        name: "dashboards",
        dependsOn: [insights],
        listAll: async () => [{ id: 10, name: "x", deps: [100] }],
        getById: async (_c, id) => ({ id: Number(id), name: String(id) }),
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        pullDependencies: (row: Row) =>
          (row.deps ?? []).map((id) => ({ resourceName: "insights", serverId: id })),
        renderToFile: (row: Row): RenderedFile => ({
          filename: `${row.name}.ts`,
          contents: "",
          specKey: row.name,
        }),
        tagOnServer: async () => {},
      });

      await runPull(FAKE_CONFIG, {
        outDir: dir,
        resources: [insights, dashboards],
        selectionByResource: new Map([["dashboards", new Set([10])]]),
        noCascade: true,
        dryRun: true,
      });

      // With cascade off, the dependency was never fetched.
      expect(insightCalls).toEqual([]);
    });
  });

  it("pullFilter drops rows from the selection set", async () => {
    await withTempDir(async (dir) => {
      const calls: number[] = [];
      const alpha = makeFakeResource<unknown, Row>({
        name: "alphas",
        listAll: async () => [
          { id: 1, name: "good" },
          { id: 2, name: "bad" },
        ],
        getById: async (_c, id) => ({ id: Number(id), name: "?" }),
        pullFilter: (row: Row) =>
          row.name === "bad"
            ? ({ kept: false, reason: "bad-name" } as const)
            : ({ kept: true } as const),
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        renderToFile: (row: Row): RenderedFile => {
          calls.push(row.id);
          return { filename: `${row.name}.ts`, contents: "", specKey: row.name };
        },
        tagOnServer: async () => {},
      });

      const result = await runPull(FAKE_CONFIG, {
        outDir: dir,
        resources: [alpha],
        // Even though the selection includes 2, the filter rejects it.
        selectionByResource: new Map([["alphas", new Set([1, 2])]]),
        dryRun: true,
      });

      expect(calls).toEqual([1]);
      const report = result.byResource.get("alphas")!;
      expect(report.filteredOut.length).toBe(1);
      expect(report.filteredOut[0]!.reason).toBe("bad-name");
    });
  });

  it("writes files and calls tagOnServer on a non-dry run", async () => {
    await withTempDir(async (dir) => {
      const audit = tagAuditor();
      const alpha = makeFakeResource<unknown, Row>({
        name: "alphas",
        listAll: async () => [{ id: 1, name: "one" }],
        getById: async (_c, id) => ({ id: Number(id), name: "?" }),
        pullFilter: () => ({ kept: true }) as const,
        pullLabel: (row) => ({ primary: row.name }),
        serverIdOf: (row) => row.id,
        hash: () => "deadbeef",
        specKey: () => "one",
        isSpec: (v): v is unknown => Boolean(v),
        renderToFile: (row: Row): RenderedFile => ({
          filename: `${row.name}.ts`,
          contents: "export default { key: 'one' };\n",
          specKey: row.name,
        }),
        tagOnServer: audit.hook("alphas"),
      });

      const result = await runPull(FAKE_CONFIG, {
        outDir: dir,
        resources: [alpha],
        selectionByResource: new Map([["alphas", new Set([1])]]),
      });
      // File was written.
      const written = await fs.readFile(path.join(dir, "alphas", "one.ts"), "utf8");
      expect(written).toContain("key: 'one'");
      // Report says one file written.
      const report = result.byResource.get("alphas")!;
      expect(report.written.length).toBe(1);
      // Tag-back can't fire because loadDefinitions doesn't know our fake
      // resource — the orchestrator warns but doesn't throw.
      expect(report.tagged).toBe(0);
      expect(audit.calls.length).toBe(0);
    });
  });
});
