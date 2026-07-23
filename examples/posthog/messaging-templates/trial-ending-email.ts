// A second template — the "your trial ends soon" nudge. A minimal template
// can skip the visual `design` tree entirely and just ship subject + html.
import { messageTemplate } from "@posthog/definitions";

export default messageTemplate({
  key: "trial-ending-email",
  name: "Trial ending soon",
  description: "Reminder a few days before a trial lapses.",
  email: {
    subject: "Your Acme trial ends in 3 days",
    html: "<p>Add a payment method to keep your workspace, {{ person.properties.first_name }}.</p>",
  },
});
