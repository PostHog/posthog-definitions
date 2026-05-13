import type { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "posthog-definitions Vercel demo",
  description: "Minimal Next.js app that fires events into PostHog and manages its dashboards via posthog-definitions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
