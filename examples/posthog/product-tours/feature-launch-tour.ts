// A time-boxed tour announcing a new feature — scheduled with an explicit
// window and NOT auto-launched (users open it from a "What's new" prompt). The
// dates are literal ISO strings, so re-applying is a clean no-op (no drift from
// an injected "now").
import { productTour } from "@posthog/definitions";

export default productTour({
  key: "feature-launch-tour",
  name: "Reports 2.0 announcement",
  description: "Walk existing users through the reporting revamp during launch week.",
  autoLaunch: false,
  startDate: "2026-09-01T00:00:00Z",
  endDate: "2026-09-14T00:00:00Z",
  content: {
    steps: [
      { title: "Reports got an upgrade", body: "Faster, filterable, shareable." },
      { title: "Try a saved view", body: "Pin the reports your team checks daily." },
    ],
  },
});
