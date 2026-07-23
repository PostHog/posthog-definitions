// Onboarding review queue: long sessions from trial accounts. The growth team
// watches a few of these each week to see where new workspaces get stuck.
// Duration + person-property filters combine into one saved view.
import { sessionRecordingPlaylist } from "@posthog/definitions";

export default sessionRecordingPlaylist({
  key: "long-trial-sessions",
  name: "Long trial sessions",
  description: "Trials that spent 5+ minutes in one sitting — the ones worth watching.",
  filters: {
    date_from: "-14d",
    duration: [{ type: "recording", key: "duration", value: 300, operator: "gt" }],
    filter_group: {
      type: "AND",
      values: [
        {
          type: "AND",
          values: [
            { key: "plan", value: ["trial"], operator: "exact", type: "person" },
          ],
        },
      ],
    },
  },
});
