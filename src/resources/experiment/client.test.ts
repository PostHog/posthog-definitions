import { afterEach, describe, expect, it, vi } from "vitest";
import { listManagedExperiments } from "./client.js";

const config = { host: "https://posthog.example.com", projectId: "1", apiKey: "phx_test" };

const exposure = {
  exposure_config: {
    kind: "ExperimentEventExposureConfig",
    event: "checkout_viewed",
    properties: [{ key: "id", type: "cohort", value: 2, operator: "not_in" }],
  },
};

function basicRow(id: number, description: string) {
  return {
    id,
    name: `Experiment ${id}`,
    description,
    feature_flag_key: `flag-${id}`,
    archived: false,
  };
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("listManagedExperiments", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reads each managed experiment in full, since the list leaves out metrics and exposure criteria", async () => {
    const requested: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const path = new URL(url).pathname;
        requested.push(path);
        if (path === "/api/projects/1/experiments/") {
          return json({
            count: 2,
            next: null,
            previous: null,
            results: [
              basicRow(7, "<!-- iac:experiments:checkout iac:hash:abc -->"),
              basicRow(8, "made in the UI"),
            ],
          });
        }
        if (path === "/api/projects/1/experiments/7/") {
          return json({
            ...basicRow(7, "<!-- iac:experiments:checkout iac:hash:abc -->"),
            metrics: [{ kind: "ExperimentMetric", metric_type: "mean" }],
            exposure_criteria: exposure,
          });
        }
        return new Response("not found", { status: 404 });
      }),
    );

    const rows = await listManagedExperiments(config);

    expect(rows).toHaveLength(1);
    expect(rows[0]!.exposure_criteria).toEqual(exposure);
    expect(rows[0]!.metrics).toHaveLength(1);
    expect(requested).not.toContain("/api/projects/1/experiments/8/");
  });
});
