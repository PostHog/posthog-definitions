// NPS popover: the classic "how likely are you to recommend us" rating, shown
// to everyone a few weeks in. `status: "running"` launches it on apply; drop to
// "draft" to unschedule or "stopped" to end it.
import { survey } from "../../../src/index.js";

export default survey({
  key: "nps-q3",
  name: "Quarterly NPS",
  description: "Rolling NPS check-in — the growth team reads the verbatims every Monday.",
  type: "popover",
  status: "running",
  questions: [
    {
      type: "rating",
      question: "How likely are you to recommend us to a colleague?",
      display: "number",
      scale: 10,
      lowerBoundLabel: "Not likely",
      upperBoundLabel: "Very likely",
    },
    {
      type: "open",
      question: "What's the main reason for your score?",
      optional: true,
    },
  ],
  conditions: {
    url: "/app",
    urlMatchType: "icontains",
    seenSurveyWaitPeriodInDays: 90,
  },
});
