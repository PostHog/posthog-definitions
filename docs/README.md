# posthog-definitions

Infrastructure-as-code for PostHog resources — define dashboards, insights, and (eventually) feature flags in TypeScript, push them to a PostHog project with one command.

```ts
// posthog/dashboards/growth.ts
import { dashboard, insight, trends } from "@posthog/definitions";

export default dashboard({
  key: "growth",
  name: "Growth",
  tiles: [
    {
      insight: insight({
        key: "weekly-signups",
        name: "Weekly signups",
        query: trends({ series: [{ event: "user signed up" }], interval: "week" }),
      }),
      layout: { x: 0, y: 0, w: 6, h: 4 },
    },
  ],
});
```

```
$ npx posthog-definitions apply
```

## Audience

Vercel / full-stack TypeScript developers. Not Terraform users. Familiarity with `convex dev`, `vercel deploy`, or `prisma db push` is the right reference frame.

## Docs layout

Interface and implementation are documented separately so a contributor can read one without the other.

```
docs/
├── interface/         what users write and what the CLI does
│   ├── getting-started.md
│   ├── sdk.md         dashboard, insight, trends, ...
│   └── cli.md         apply
└── implementation/    how it works
    ├── architecture.md
    ├── identity.md    key → server resource mapping
    ├── apply.md       load → diff → execute algorithm
    ├── mvp-roadmap.md sequenced plan to ship `apply` for dashboards
    └── risks.md       open questions blocking the plan
```

## Current status

Pre-MVP. The MVP scope is **dashboard synchronization via `npx posthog-definitions apply`** — see [`implementation/mvp-roadmap.md`](implementation/mvp-roadmap.md).
