/**
 * Smoke test for the typed PostHog API client.
 *
 *   pnpm tsx scripts/typed-client-smoke.ts
 *
 * Requires POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID in the env
 * (or in `.envrc` if you `direnv allow`-ed this dir).
 */
import { loadConfig } from "../src/client/config.js";
import { createApiClient } from "../src/client/typed.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const api = createApiClient(config);

  // Simplest read endpoint: list insights, capped.
  const { data, response } = await api.GET("/api/projects/{project_id}/insights/", {
    params: {
      path: { project_id: config.projectId },
      query: { limit: 3 },
    },
  });
  if (!data) {
    console.error(`request failed: HTTP ${response.status}`);
    process.exit(1);
  }

  console.log(`status:    ${response.status}`);
  console.log(`count:     ${data.count}`);
  console.log(`page size: ${data.results?.length ?? 0}`);
  const sample = data.results?.[0];
  if (sample) {
    console.log("first row:");
    console.log(`  id:    ${sample.id}`);
    console.log(`  name:  ${sample.name ?? "<unnamed>"}`);
    console.log(`  tags:  ${(sample.tags ?? []).join(", ") || "<none>"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
