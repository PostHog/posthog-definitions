import { describe, expect, it } from "vitest";
import { diff } from "../../apply/diff.js";
import type { DesiredState } from "../types.js";
import type { MessageTemplate } from "./sdk.js";
import type { ServerMessageTemplate } from "./client.js";
import { messageTemplateHash, validateMessageTemplates } from "./pipeline.js";

function spec(key: string, overrides: Partial<MessageTemplate> = {}): MessageTemplate {
  return {
    key,
    name: `Template ${key}`,
    email: { subject: "Hi {{ person.name }}", html: "<p>Hi</p>" },
    ...overrides,
  };
}

function serverRow(
  id: string,
  key: string,
  hash: string,
  extraDescription = "",
): ServerMessageTemplate {
  const marker = `<!-- iac:messaging-templates:${key} iac:hash:${hash} -->`;
  return {
    id,
    name: `Template ${key}`,
    description: extraDescription ? `${extraDescription}\n\n${marker}` : marker,
    type: "email",
    content: { templating: "liquid", email: { subject: "Hi", html: "<p>Hi</p>" } },
  };
}

function desiredFor(specs: MessageTemplate[]): DesiredState {
  const state: DesiredState = new Map();
  state.set(
    "messaging-templates",
    specs.map((spec) => ({ path: "<test>", spec })),
  );
  return state;
}

function currentFor(rows: ServerMessageTemplate[]): Map<string, unknown[]> {
  return new Map<string, unknown[]>([["messaging-templates", rows]]);
}

describe("messaging-template pipeline", () => {
  it("emits create when desired has no matching server row", () => {
    const slice = diff(desiredFor([spec("welcome")]), currentFor([])).get("messaging-templates")!;
    expect(slice.ops[0]!.kind).toBe("create");
  });

  it("emits unchanged when server hash matches", () => {
    const desired = spec("welcome");
    const op = diff(
      desiredFor([desired]),
      currentFor([serverRow("m1", "welcome", messageTemplateHash(desired))]),
    ).get("messaging-templates")!.ops[0]!;
    expect(op.kind).toBe("unchanged");
  });

  it("emits update when server hash differs", () => {
    const op = diff(
      desiredFor([spec("welcome")]),
      currentFor([serverRow("m1", "welcome", "stale00000000")]),
    ).get("messaging-templates")!.ops[0]!;
    expect(op.kind).toBe("update");
  });

  it("hash changes when the email content changes", () => {
    expect(messageTemplateHash(spec("welcome"))).not.toBe(
      messageTemplateHash(spec("welcome", { email: { subject: "Different" } })),
    );
  });

  it("classifies a server-only managed template as an orphan", () => {
    const slice = diff(desiredFor([]), currentFor([serverRow("gh", "ghost", "any")])).get(
      "messaging-templates",
    )!;
    expect(slice.orphans.length).toBe(1);
  });

  it("safety invariant: ignores server rows without the identity marker", () => {
    const handBuilt: ServerMessageTemplate = {
      id: "hb",
      name: "Hand-built",
      description: "a template someone built in the UI",
      type: "email",
      content: { templating: "liquid", email: {} },
    };
    const slice = diff(desiredFor([]), currentFor([handBuilt])).get("messaging-templates")!;
    expect(slice.ops.length).toBe(0);
    expect(slice.orphans.length).toBe(0);
  });
});

describe("messaging-template validation", () => {
  it("rejects a non-email type", () => {
    const issues = validateMessageTemplates([
      spec("sms", { type: "sms" as MessageTemplate["type"] }),
    ]);
    expect(issues.some((m) => m.includes('type must be "email"'))).toBeTruthy();
  });

  it("requires an email content object", () => {
    const issues = validateMessageTemplates([
      spec("noemail", { email: undefined as unknown as MessageTemplate["email"] }),
    ]);
    expect(issues.some((m) => m.includes("requires an `email`"))).toBeTruthy();
  });

  it("rejects duplicate keys", () => {
    const issues = validateMessageTemplates([spec("dup"), spec("dup")]);
    expect(issues.some((m) => m.includes("Duplicate"))).toBeTruthy();
  });

  it("accepts a minimal valid spec", () => {
    expect(validateMessageTemplates([spec("ok")])).toEqual([]);
  });
});
