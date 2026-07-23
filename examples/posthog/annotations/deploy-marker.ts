// The canonical IaC annotation: a deployment marker. It drops a vertical line
// on every timeline at `dateMarker` so spikes line up with releases. Because
// deploys are high-frequency, it's `hidden` (kept out of the charts UI but
// readable over the API) and tagged `GIT` (a bot/deployment note, not a human
// one). Project-scoped, so no insight/dashboard reference.
import { annotation } from "@posthog/definitions";

export default annotation({
  key: "deploy-2026-08-01",
  content: "Deployed web v2.3.1",
  dateMarker: "2026-08-01T14:30:00Z",
  scope: "project",
  creationType: "GIT",
  hidden: true,
});
