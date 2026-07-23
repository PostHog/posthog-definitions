// A reusable email template the campaigns team drops into onboarding flows.
// `email` is the content bag — `subject`/`text`/`html` are Liquid-templated
// (tags like {{ person.name }} pass through verbatim), and `design` is the
// visual-editor document. The whole thing round-trips as one blob; templating
// is always "liquid".
import { messageTemplate } from "@posthog/definitions";

export default messageTemplate({
  key: "welcome-email",
  name: "Welcome email",
  description: "Sent to new workspaces on day zero.",
  email: {
    subject: "Welcome to Acme, {{ person.properties.first_name }}!",
    text: "Thanks for signing up. Here's how to get started…",
    html: "<h1>Welcome!</h1><p>Thanks for signing up, {{ person.properties.first_name }}.</p>",
    design: {
      // The visual editor stores its own tree here; kept as an opaque bag.
      body: { rows: [] },
    },
  },
});
