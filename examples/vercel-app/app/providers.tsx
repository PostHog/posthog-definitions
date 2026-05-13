"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    if (!key) {
      console.warn("NEXT_PUBLIC_POSTHOG_KEY is not set; posthog-js will not be initialized.");
      return;
    }
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        person_profiles: "always",
      });
    }
  }, []);
  return <>{children}</>;
}
