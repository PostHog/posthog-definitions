// An incident marker, visible in the UI (not hidden) with an emoji badge so it
// stands out on charts during a post-mortem. Organization-scoped so it shows up
// across every project's timelines. A human note, so the default creationType
// (USR) is fine.
//
// (To pin an annotation to one insight or dashboard instead, set
// `scope: "dashboard_item"` + `insight: <imported insight>` — or
// `scope: "dashboard"` + `dashboard: <imported dashboard>` — and declare that
// resource in the same run.)
import { annotation } from "@posthog/definitions";

export default annotation({
  key: "incident-checkout-outage",
  content: "Checkout outage — payments provider degraded",
  dateMarker: "2026-08-03T09:12:00Z",
  scope: "organization",
  emoji: "🔥",
});
