import { markResourceKind } from "../types.js";
import type { FeatureFlag } from "../feature-flag/sdk.js";

export type SurveyType = "popover" | "widget" | "external_survey" | "api";

/**
 * Declarative lifecycle, mapped to the survey's `start_date`/`end_date` and
 * the `launch`/`stop` endpoints (mirrors experiments):
 *  - `draft`   — not started (`start_date` null).
 *  - `running` — started, not ended (`launch`, or clear `end_date` to resume).
 *  - `stopped` — ended (`stop`).
 */
export type SurveyStatus = "draft" | "running" | "stopped";

type BaseQuestion = {
  question: string;
  description?: string;
  optional?: boolean;
  buttonText?: string;
};

export type OpenQuestion = BaseQuestion & { type: "open" };
export type LinkQuestion = BaseQuestion & { type: "link"; link: string };
export type RatingQuestion = BaseQuestion & {
  type: "rating";
  display: "number" | "emoji";
  scale: number;
  lowerBoundLabel?: string;
  upperBoundLabel?: string;
};
export type SingleChoiceQuestion = BaseQuestion & {
  type: "single_choice";
  choices: string[];
  shuffleOptions?: boolean;
  hasOpenChoice?: boolean;
};
export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  choices: string[];
  shuffleOptions?: boolean;
  hasOpenChoice?: boolean;
};

export type SurveyQuestion =
  | OpenQuestion
  | LinkQuestion
  | RatingQuestion
  | SingleChoiceQuestion
  | MultipleChoiceQuestion;

/**
 * Display + targeting conditions. The `linked`/`targeting` feature flags are
 * declared on the survey itself (below); `conditions` covers URL / selector /
 * device / wait-period gating.
 */
export type SurveyConditions = {
  url?: string;
  urlMatchType?: string;
  selector?: string;
  deviceTypes?: string[];
  deviceTypesMatchType?: string;
  seenSurveyWaitPeriodInDays?: number;
  linkedFlagVariant?: string;
};

/**
 * Cosmetic appearance config — a passthrough bag (backgroundColor,
 * submitButtonText, displayThankYouMessage, whiteLabel, position, …). It is
 * round-tripped verbatim and canonically hashed; posthog-definitions does not
 * enumerate every field.
 */
export type SurveyAppearance = Record<string, unknown>;

export type Survey = {
  key: string;
  name: string;
  description?: string;
  type: SurveyType;
  questions: SurveyQuestion[];
  appearance?: SurveyAppearance;
  conditions?: SurveyConditions;
  /**
   * Reference an existing feature flag by key — the survey is shown only to
   * users the flag is enabled for. Resolved to `linked_flag_id` at apply time;
   * the flag must be declared in the same run (validation enforces this).
   */
  linkedFlag?: FeatureFlag;
  /** Reference an existing feature flag by key as the targeting flag. */
  targetingFlag?: FeatureFlag;
  status?: SurveyStatus;
  archived?: boolean;
  responsesLimit?: number;
  enablePartialResponses?: boolean;
  schedule?: string;
};

export function survey(spec: Survey): Survey {
  return markResourceKind(spec, "survey");
}
