/**
 * Acceptance-style example for `createTypedPostHog`.
 *
 * Imports the same event-definition + property-group specs that
 * `posthog-definitions apply` syncs to PostHog, wraps a fake
 * posthog-js-shaped client, and exercises a few captures. The compile-time
 * narrowing is the assertion: this file must type-check.
 *
 * Run it with `pnpm tsx examples/typed-client/index.ts`.
 */
import { createTypedPostHog } from "../../src/index.js";

import userSignedUp from "../posthog/events/user_signed_up.js";
import userUpgraded from "../posthog/events/user_upgraded.js";

// Pretend this is `import posthog from "posthog-js"`. Anything with a
// `capture(name, properties?, options?)` method works — node SDK, browser SDK,
// or this stub for the example.
const fakeClient = {
  capture(name: string, properties?: Record<string, unknown> | null) {
    console.log(`capture: ${name}`, properties ?? {});
  },
  identify(distinctId: string) {
    console.log(`identify: ${distinctId}`);
  },
};

// The events array is the single source of truth for the typed surface:
// add an event here (and ship the spec via apply) and `.capture()` instantly
// knows about it.
const posthog = createTypedPostHog(fakeClient, [userSignedUp, userUpgraded]);

posthog.identify("user_42");

posthog.capture("user_signed_up", {
  user_id: "user_42",
  source: "web",
});

posthog.capture("user_upgraded", {
  user_id: "user_42",
  source: "web",
  plan: "pro",
  seats: 5,
  trial: false,
});

// Unknown event: falls back to permissive `posthog-js`-style capture.
posthog.capture("custom_event", { whatever: 1 });

// Escape hatch for legacy untyped tracking.
posthog.unsafeCapture("legacy_event", { anything: "goes" });

// ---------------------------------------------------------------------------
// Compile-time assertions — uncomment any line to confirm the typed client
// rejects it. Verified end-to-end with `pnpm typecheck:examples`.
// ---------------------------------------------------------------------------
// posthog.capture("user_upgraded", { plan: "pro" });
//                                 // ^ Properties 'seats' and 'user_id' are missing.
// posthog.capture("user_upgraded", { user_id: "u", plan: "pro", seats: "five" });
//                                 // ^ Type 'string' is not assignable to type 'number'.
// posthog.capture("user_signed_up");
//                 // ^ Expected 2 arguments — `user_id` is required (via `identity`).
