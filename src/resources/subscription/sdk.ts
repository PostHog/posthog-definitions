import { markResourceKind } from "../types.js";
import type { Insight } from "../insight/sdk.js";
import type { Dashboard } from "../dashboard/sdk.js";

export type SubscriptionTargetType = "email" | "slack";
export type SubscriptionFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type Subscription = {
  key: string;
  /**
   * Human-readable subscription title. Also carries the identity marker (a
   * trailing HTML comment), the way endpoints/surveys carry identity in a
   * free-text field.
   */
  title: string;
  /** The insight this subscription delivers. Declare exactly one of `insight` / `dashboard`. */
  insight?: Insight;
  /** The dashboard this subscription delivers. Declare exactly one of `insight` / `dashboard`. */
  dashboard?: Dashboard;
  /** Delivery channel. */
  targetType: SubscriptionTargetType;
  /**
   * Recipient(s): comma-separated email addresses for `email`, or a Slack
   * channel name/ID for `slack`.
   *
   * Side effect: applying an email subscription **invites the recipients**
   * (PostHog emails them). Use real addresses only when you intend that.
   */
  target: string;
  frequency: SubscriptionFrequency;
  /** Every `interval` periods (e.g. every 2 weeks). Defaults to 1. */
  interval?: number;
  /** ISO 8601 datetime the schedule anchors to. */
  startDate: string;
  /** Recurrence: weekday indices for weekly/monthly schedules. */
  byweekday?: string[];
  bysetpos?: number;
  count?: number;
  untilDate?: string;
  enabled?: boolean;
  /**
   * Slack integration id for `slack` targets. **Environment-specific** — the
   * id is per-project and does not port across projects. It round-trips and is
   * part of the hash; note the non-portability when copying definitions between
   * projects.
   */
  integrationId?: number;
  /** Attach an AI-generated summary to each delivery. */
  summaryEnabled?: boolean;
  /** Free-text guidance for the AI summary. */
  summaryPromptGuide?: string;
  /** Free-text prompt for an AI-only subscription. */
  prompt?: string;
};

export function subscription(spec: Subscription): Subscription {
  return markResourceKind(spec, "subscription");
}
