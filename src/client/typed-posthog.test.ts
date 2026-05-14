import { describe, expect, it } from "vitest";
import { createTypedPostHog } from "./typed-posthog.js";
import { propertyGroup } from "../resources/property-group/sdk.js";
import { eventDefinition } from "../resources/event-definition/sdk.js";

const billing = propertyGroup({
  key: "billing",
  properties: {
    plan: { type: "String", required: true },
    seats: { type: "Numeric", required: true },
    trial: { type: "Boolean" },
  },
});

const userUpgraded = eventDefinition({
  key: "user_upgraded",
  name: "user_upgraded",
  propertyGroups: [billing],
});

const userSignedUp = eventDefinition({
  key: "user_signed_up",
  name: "user_signed_up",
});

type Captured = { name: string; properties?: Record<string, unknown> | null };

function fakeClient() {
  const captures: Captured[] = [];
  return {
    captures,
    capture(name: string, properties?: Record<string, unknown> | null) {
      captures.push({ name, properties });
      return undefined;
    },
  };
}

describe("createTypedPostHog runtime", () => {
  it("forwards typed captures to the wrapped client", () => {
    const fake = fakeClient();
    const ph = createTypedPostHog(fake, [userUpgraded, userSignedUp]);
    ph.capture("user_upgraded", { plan: "pro", seats: 5, trial: false });
    ph.capture("user_signed_up");
    expect(fake.captures).toEqual([
      { name: "user_upgraded", properties: { plan: "pro", seats: 5, trial: false } },
      { name: "user_signed_up", properties: undefined },
    ]);
  });

  it("unsafeCapture bypasses the typed signature", () => {
    const fake = fakeClient();
    const ph = createTypedPostHog(fake, [userUpgraded]);
    ph.unsafeCapture("anything", { whatever: 1 });
    expect(fake.captures).toEqual([{ name: "anything", properties: { whatever: 1 } }]);
  });

  it("non-capture methods on the wrapped client pass through", () => {
    const fake = {
      capture: (..._args: unknown[]) => undefined,
      identify: (id: string) => `identified:${id}`,
    };
    const ph = createTypedPostHog(fake, [userUpgraded]);
    expect(ph.identify("u1")).toBe("identified:u1");
  });
});

describe("createTypedPostHog types (compile-time)", () => {
  it("type-narrows known event names — the test compiling is the assertion", () => {
    const fake = fakeClient();
    const ph = createTypedPostHog(fake, [userUpgraded, userSignedUp]);

    ph.capture("user_upgraded", { plan: "pro", seats: 5 });
    ph.capture("user_signed_up");
    ph.capture("unknown_event", { whatever: 1 });

    // @ts-expect-error — missing required prop `seats`.
    ph.capture("user_upgraded", { plan: "pro" });

    // @ts-expect-error — wrong type on `seats`.
    ph.capture("user_upgraded", { plan: "pro", seats: "five" });

    // @ts-expect-error — unknown property.
    ph.capture("user_upgraded", { plan: "pro", seats: 5, bogus: true });

    expect(true).toBe(true);
  });
});
