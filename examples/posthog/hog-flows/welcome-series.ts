// A campaign (hog flow) is an event-triggered graph of action nodes wired by
// edges. This one fires when a workspace activates, waits a day, then hands off
// to a destination that sends a welcome email. Action `id`s are author-chosen
// and referenced by the edges; `type: "trigger"` and `type: "exit"` bookend
// every flow. The whole graph round-trips verbatim.
import { hogFlow } from "@posthog/definitions";

export default hogFlow({
  key: "welcome-series",
  name: "Welcome series",
  description: "Nudge freshly-activated workspaces one day in.",
  status: "draft",
  exitCondition: "exit_only_at_end",
  actions: [
    {
      id: "trigger",
      type: "trigger",
      name: "Workspace activated",
      config: {
        type: "event",
        filters: {
          events: [{ id: "workspace_activated", name: "workspace_activated", type: "events" }],
        },
      },
    },
    {
      id: "wait_a_day",
      type: "delay",
      name: "Wait 1 day",
      config: { delay_duration: "1d" },
    },
    {
      id: "exit",
      type: "exit",
      name: "Exit",
      config: { reason: "completed" },
    },
  ],
  edges: [
    { from: "trigger", to: "wait_a_day", type: "continue" },
    { from: "wait_a_day", to: "exit", type: "continue" },
  ],
});
