import { markResourceKind } from "../types.js";

export type ActionStepMatching = "contains" | "regex" | "exact";

export type ActionStepProperty = {
  key: string;
  value?: unknown;
  operator?: string;
  type?: "event" | "person" | "element" | "group" | "session";
};

export type ActionStep = {
  event?: string | null;
  properties?: ActionStepProperty[];
  selector?: string | null;
  tag_name?: string | null;
  text?: string | null;
  text_matching?: ActionStepMatching | null;
  href?: string | null;
  href_matching?: ActionStepMatching | null;
  url?: string | null;
  url_matching?: ActionStepMatching | null;
};

export type Action = {
  key: string;
  name: string;
  description?: string;
  steps: ActionStep[];
  post_to_slack?: boolean;
  slack_message_format?: string;
  pinned_at?: string | null;
  tags?: string[];
};

export function action(spec: Action): Action {
  return markResourceKind(spec, "action");
}
