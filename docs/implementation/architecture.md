# Architecture

## Components

```
                ┌─────────────────────────────────────┐
                │  user repo                          │
                │                                     │
                │  posthog/                           │
                │  └── dashboards/*.ts                │
                │       (imports @posthog/definitions)│
                └──────────────┬──────────────────────┘
                               │
                  npx posthog-definitions apply
                               │
                               ▼
   ┌───────────────────────────────────────────────────────┐
   │  CLI (this package)                                   │
   │                                                       │
   │  ┌───────────┐  ┌──────────┐  ┌────────┐  ┌────────┐  │
   │  │ Loader    │→ │ Validator│→ │ Differ │→ │Executor│  │
   │  │ (glob+tsx)│  │          │  │        │  │ (HTTP) │  │
   │  └───────────┘  └──────────┘  └────────┘  └────────┘  │
   │                                            │          │
   └────────────────────────────────────────────┼──────────┘
                                                ▼
                                  ┌───────────────────────┐
                                  │  PostHog REST API     │
                                  │                       │
                                  │  /api/projects/<id>/  │
                                  │    dashboards/        │
                                  │    insights/          │
                                  └───────────────────────┘
```

## Boundaries

| Component                        | Responsibility                                                                      | Talks to                                |
| -------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------- |
| **SDK** (`@posthog/definitions`) | Define types and constructors. Returns plain objects. No I/O.                       | Nothing. Pure.                          |
| **Loader**                       | Discover and import user files. Collect default exports.                            | Filesystem + TS runtime.                |
| **Validator**                    | Run structural checks before any API call.                                          | Nothing. Pure on the loaded spec graph. |
| **API client**                   | Typed wrapper over PostHog's REST API. Generated from OpenAPI.                      | PostHog API.                            |
| **Differ**                       | Compare desired (from user files) vs current (from API). Produce an operation list. | Reads from API client.                  |
| **Executor**                     | Apply the operation list. Order ops correctly. Stop on first error.                 | API client.                             |

The loader, validator, differ, and executor are independent and tested in isolation. The differ never makes mutations; the executor never reads beyond what the differ told it to do.

## Data flow

1. **Discover**: `glob("<dir>/**/*.ts")` → list of file paths.
2. **Load**: import each via a TS runtime (`tsx`/`jiti`) → `{ path, default: spec }[]`.
3. **Normalize**: walk specs, collect referenced insights, dedupe by key → `{ dashboards, insights }`.
4. **Validate**: structural checks. Abort on failure.
5. **Fetch current state**: GET dashboards + insights filtered by `iac:*` tag.
6. **Diff**: pair desired and current by key. For each: `create | update | unchanged`.
7. **Execute**: ordered (insights first, then dashboards), per-resource HTTP calls.
8. **Report**: counts + errors.

## Authentication

Personal API key read from `POSTHOG_PERSONAL_API_KEY` env var, sent as `Authorization: Bearer <key>`. No OAuth, no token refresh — the CLI is a thin wrapper. The key is never accepted via flag (would leak into shell history); env var only.

Project selection: `POSTHOG_PROJECT_ID` env var, overridable per-invocation via `--project`. Host: `POSTHOG_HOST` env var, defaults to `https://us.posthog.com`, overridable via `--host`.

The CLI fails fast (exit 3) if `POSTHOG_PERSONAL_API_KEY` or `POSTHOG_PROJECT_ID` is missing — no API calls attempted.

## API client generation

PostHog already publishes an OpenAPI spec via drf-spectacular. The CLI uses that spec to generate a typed TypeScript client at build time (Orval or openapi-fetch). No hand-written `fetch` calls.

## Why a custom CLI and not Terraform

| Concern             | Terraform                         | This CLI                                  |
| ------------------- | --------------------------------- | ----------------------------------------- |
| Identity            | `.tfstate` file (lockable, lossy) | Tag on the resource (`iac:key=...`)       |
| Authoring language  | HCL                               | TypeScript                                |
| Audience            | Infra teams                       | App developers                            |
| Dev loop            | `plan` / `apply`                  | `apply` (one-shot, idempotent)            |
| Codegen for callers | None                              | Possible (typed flag keys, etc.) post-MVP |

The state file is the single biggest reason to avoid Terraform here. Tagging the resource works because PostHog already supports tags on dashboards and insights.
