import { describe, expect, it } from "vitest";
import type { ClientConfig } from "../client/config.js";
import type { ApplyContext, ResourceDiff, ResourceOp } from "../resources/types.js";
import { makeFakeResource } from "../test-helpers/fake-resource.js";
import type { DiffResult } from "./diff.js";
import { execute, fetchCurrentState, SafetyViolationError } from "./execute.js";

const FAKE_CONFIG: ClientConfig = {
  host: "https://test.example",
  projectId: "1",
  apiKey: "test",
};

function diffOf(byResource: Record<string, ResourceDiff<unknown, unknown>>): DiffResult {
  return new Map(Object.entries(byResource));
}

function op(kind: "create" | "update" | "unchanged", key: string): ResourceOp<unknown, unknown> {
  const spec = { key };
  const server = { id: 1, key };
  if (kind === "create") return { kind, spec };
  return { kind, spec, server };
}

function specKeyOf(op: ResourceOp<unknown, unknown>): string {
  return (op.spec as { key: string }).key;
}

describe("execute", () => {
  it("bumps the right counter for each op kind and reports per resource", async () => {
    const alpha = makeFakeResource({ name: "alpha" });
    const summary = await execute(
      FAKE_CONFIG,
      diffOf({
        alpha: {
          ops: [op("create", "a"), op("create", "b"), op("update", "c"), op("unchanged", "d")],
          orphans: [],
        },
      }),
      {},
      [alpha],
    );
    expect(summary.get("alpha")).toEqual({ created: 2, updated: 1, unchanged: 1, pruned: 0 });
  });

  it("runs resources in the order passed and ops in the order given", async () => {
    const seen: string[] = [];
    const alpha = makeFakeResource({
      name: "alpha",
      executeOp: async (_c, o) => {
        seen.push(`alpha:${specKeyOf(o)}`);
      },
    });
    const beta = makeFakeResource({
      name: "beta",
      executeOp: async (_c, o) => {
        seen.push(`beta:${specKeyOf(o)}`);
      },
    });
    await execute(
      FAKE_CONFIG,
      diffOf({
        alpha: { ops: [op("create", "a1"), op("create", "a2")], orphans: [] },
        beta: { ops: [op("create", "b1")], orphans: [] },
      }),
      {},
      [alpha, beta],
    );
    expect(seen).toEqual(["alpha:a1", "alpha:a2", "beta:b1"]);
  });

  it("passes the same ApplyContext to every executeOp call", async () => {
    const contexts: ApplyContext[] = [];
    const alpha = makeFakeResource({
      name: "alpha",
      executeOp: async (_c, _o, ctx) => {
        contexts.push(ctx);
      },
    });
    await execute(
      FAKE_CONFIG,
      diffOf({ alpha: { ops: [op("create", "a"), op("create", "b")], orphans: [] } }),
      {},
      [alpha],
    );
    expect(contexts).toHaveLength(2);
    expect(contexts[0]).toBe(contexts[1]);
    expect(contexts[0]!.insightIdByKey).toBeInstanceOf(Map);
  });

  it("skips orphans when prune is not requested", async () => {
    let pruneCount = 0;
    const alpha = makeFakeResource({
      name: "alpha",
      prune: async () => {
        pruneCount++;
        return true;
      },
    });
    const summary = await execute(
      FAKE_CONFIG,
      diffOf({ alpha: { ops: [], orphans: [{ id: 1 }, { id: 2 }] } }),
      {},
      [alpha],
    );
    expect(pruneCount).toBe(0);
    expect(summary.get("alpha")?.pruned).toBe(0);
  });

  it("prunes orphans and counts only those the resource confirmed pruned", async () => {
    const pruneCalls: unknown[] = [];
    const alpha = makeFakeResource({
      name: "alpha",
      prune: async (_c, orphan) => {
        pruneCalls.push(orphan);
        return (orphan as { id: number }).id !== 2;
      },
    });
    const summary = await execute(
      FAKE_CONFIG,
      diffOf({
        alpha: {
          ops: [],
          orphans: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      }),
      { prune: true },
      [alpha],
    );
    expect(pruneCalls).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(summary.get("alpha")?.pruned).toBe(2);
  });

  it("returns zero counters for a resource the diff did not mention", async () => {
    const alpha = makeFakeResource({ name: "alpha" });
    const summary = await execute(FAKE_CONFIG, diffOf({}), {}, [alpha]);
    expect(summary.get("alpha")).toEqual({ created: 0, updated: 0, unchanged: 0, pruned: 0 });
  });

  it("threads the verbose flag through to executeOp and prune", async () => {
    const seen: Array<{ where: string; verbose: boolean | undefined }> = [];
    const alpha = makeFakeResource({
      name: "alpha",
      executeOp: async (_c, _o, _ctx, opts) => {
        seen.push({ where: "executeOp", verbose: opts?.verbose });
      },
      prune: async (_c, _orphan, opts) => {
        seen.push({ where: "prune", verbose: opts?.verbose });
        return true;
      },
    });
    await execute(
      FAKE_CONFIG,
      diffOf({ alpha: { ops: [op("create", "a")], orphans: [{ id: 1 }] } }),
      { verbose: true, prune: true },
      [alpha],
    );
    expect(seen).toEqual([
      { where: "executeOp", verbose: true },
      { where: "prune", verbose: true },
    ]);
  });

  it("propagates errors from executeOp and stops the resource", async () => {
    const seen: string[] = [];
    const alpha = makeFakeResource({
      name: "alpha",
      executeOp: async (_c, o) => {
        const k = specKeyOf(o);
        seen.push(k);
        if (k === "b") throw new Error("boom");
      },
    });
    await expect(
      execute(
        FAKE_CONFIG,
        diffOf({
          alpha: {
            ops: [op("create", "a"), op("create", "b"), op("create", "c")],
            orphans: [],
          },
        }),
        {},
        [alpha],
      ),
    ).rejects.toThrow("boom");
    expect(seen).toEqual(["a", "b"]);
  });
});

describe("SafetyViolationError", () => {
  it("is an Error subclass with the expected name", () => {
    const e = new SafetyViolationError("insight", 7, "growth");
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(SafetyViolationError);
    expect(e.name).toBe("SafetyViolationError");
  });

  it("interpolates kind, id, and key into the message", () => {
    const e = new SafetyViolationError("dashboard", 42, "weekly-growth");
    expect(e.message).toContain("dashboard");
    expect(e.message).toContain("42");
    expect(e.message).toContain('key="weekly-growth"');
  });

  it("explains the likely cause (managed marker removed in UI)", () => {
    const e = new SafetyViolationError("insight", 1, "k");
    expect(e.message).toMatch(/iac:\*/);
    expect(e.message).toMatch(/removed in the UI/i);
  });

  it("accepts string ids", () => {
    const e = new SafetyViolationError("endpoint", "abc-123", "k");
    expect(e.message).toContain("abc-123");
  });
});

describe("fetchCurrentState", () => {
  it("calls list on every resource and keys the result by resource name", async () => {
    const alpha = makeFakeResource({ name: "alpha", list: async () => [{ id: 1 }] });
    const beta = makeFakeResource({ name: "beta", list: async () => [{ id: 2 }, { id: 3 }] });
    const state = await fetchCurrentState(FAKE_CONFIG, {}, [alpha, beta]);
    expect(state.get("alpha")).toEqual([{ id: 1 }]);
    expect(state.get("beta")).toEqual([{ id: 2 }, { id: 3 }]);
  });

  it("threads verbose through to each resource list call", async () => {
    const seen: Array<boolean | undefined> = [];
    const alpha = makeFakeResource({
      name: "alpha",
      list: async (_c, opts) => {
        seen.push(opts?.verbose);
        return [];
      },
    });
    await fetchCurrentState(FAKE_CONFIG, { verbose: true }, [alpha]);
    expect(seen).toEqual([true]);
  });
});
