// A saved-filter playlist the support team lives in: every recording where a
// user rage-clicked in the last week. Filter-based (dynamic) — membership is
// recomputed from `filters` on every visit, so you never curate it by hand.
// (Manually-pinned "collection" playlists aren't managed here; that pinned
// membership is runtime data, like static-cohort members.)
import { sessionRecordingPlaylist } from "@posthog/definitions";

export default sessionRecordingPlaylist({
  key: "rage-clicks",
  name: "Rage clicks (last 7d)",
  description: "Sessions with a rage click — triage frustration before it churns.",
  filters: {
    date_from: "-7d",
    filter_test_accounts: true,
    events: [
      {
        id: "$rageclick",
        name: "$rageclick",
        type: "events",
        order: 0,
      },
    ],
  },
});
