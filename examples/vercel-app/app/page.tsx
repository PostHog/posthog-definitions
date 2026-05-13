"use client";

import posthog from "posthog-js";

export default function Page() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32, maxWidth: 640 }}>
      <h1>posthog-definitions demo</h1>
      <p>
        Click the button to fire a <code>button_clicked</code> event. The dashboard counting these
        events is defined in <code>posthog/dashboards/vercel-demo.ts</code> and synced during the
        Vercel build step.
      </p>
      <button
        type="button"
        onClick={() => posthog.capture("button_clicked", { source: "vercel-demo" })}
        style={{ padding: "8px 16px", fontSize: 16, cursor: "pointer" }}
      >
        Throw event
      </button>
    </main>
  );
}
