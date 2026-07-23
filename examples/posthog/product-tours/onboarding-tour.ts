// A first-run product tour: a few steps the app shows new users, auto-launched
// the moment they land. `content` is the step tree from the tour builder,
// round-tripped as an opaque bag. Scheduling is declarative — `autoLaunch`
// turns it on; `startDate` / `endDate` bound the window if you want one.
import { productTour } from "@posthog/definitions";

export default productTour({
  key: "onboarding-tour",
  name: "First-run onboarding",
  description: "Point new workspaces at the three things that matter on day one.",
  autoLaunch: true,
  content: {
    steps: [
      { title: "Welcome to Acme", body: "Let's get your workspace set up." },
      { title: "Invite your team", body: "Acme is better with teammates." },
      { title: "Connect your data", body: "Send us your first events." },
    ],
  },
});
