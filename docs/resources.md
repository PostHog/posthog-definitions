# Resource support

What PostHog exposes via API vs. what `posthog-definitions` can manage as code.

Legend: ✅ supported · 🟡 partial / read-only / inline-only · ❌ not supported (yet) · — not applicable for IaC

Source of truth for the API column: the prod OpenAPI schema at [`https://us.posthog.com/api/schema/`](https://us.posthog.com/api/schema/) (1224 paths). Last refreshed on 2026-07-23. The schema documents every collection under the `projects/{id}/` router; environment-scoped products (endpoints, logs, tracing, LLM analytics, vision, error tracking, …) are also served under the newer `environments/{id}/` router and are shown that way below, matching how the clients call them.

## Analytics & visualization

| Resource                    | PostHog API                                    | posthog-definitions | Notes                                                                          |
| --------------------------- | ---------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| Dashboards                  | ✅ `projects/{id}/dashboards`                  | ✅                  | Tag-identified via `iac:dashboards:<key>`                                      |
| Insights                    | ✅ `projects/{id}/insights`                    | ✅                  | Standalone or inlined inside a dashboard tile                                  |
| Dashboard templates         | ✅ `projects/{id}/dashboard_templates`         | ❌                  |                                                                                |
| Annotations                 | ✅ `projects/{id}/annotations`                 | ❌                  |                                                                                |
| Notebooks                   | ✅ `projects/{id}/notebooks`                   | ❌                  |                                                                                |
| Alerts                      | ✅ `environments/{id}/alerts`                  | ❌                  |                                                                                |
| Insight variables           | ✅ `environments/{id}/insight_variables`       | ❌                  |                                                                                |
| Subscriptions               | ✅ `environments/{id}/subscriptions`           | ❌                  | Scheduled delivery of an insight/dashboard                                     |
| Session recording playlists | ✅ `projects/{id}/session_recording_playlists` | ❌                  | Filter-based (dynamic) playlists are declarative; pinned membership is runtime |
| Comments                    | ✅ `projects/{id}/comments`                    | —                   | Ephemeral by nature                                                            |

## Behavior & experimentation

| Resource                 | PostHog API                                 | posthog-definitions | Notes                                                                                                                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature flags            | ✅ `projects/{id}/feature_flags`            | ✅                  | Tag-identified via `iac:feature-flags:<key>`; dependent flags and encrypted payloads not yet supported                                                                                                                                                                                                               |
| Experiments              | ✅ `projects/{id}/experiments`              | ✅                  | Identity via `iac:experiments:<key>` marker in `description`. Lifecycle (`draft` / `running` / `paused` / `stopped`) is declarative — apply drives the launch / pause / resume / end transitions to match. References the experiment's feature flag, optional holdout, and shared saved metrics by object reference. |
| Experiment holdouts      | ✅ `projects/{id}/experiment_holdouts`      | ✅                  | Identity via `iac:experiment-holdouts:<key>` marker in `description`.                                                                                                                                                                                                                                                |
| Experiment saved metrics | ✅ `projects/{id}/experiment_saved_metrics` | ✅                  | Identity via `iac:experiment-saved-metrics:<key>` marker in `description`. Attached to experiments as primary or secondary.                                                                                                                                                                                          |
| Cohorts                  | ✅ `projects/{id}/cohorts`                  | ✅                  | Identity via `iac:cohorts:<key>` marker in `description`. Supports behavioral (`filters`), HogQL (`query`), and static (`is_static: true`) cohorts. Static membership is managed out-of-band — IaC only creates the container.                                                                                       |
| Actions                  | ✅ `projects/{id}/actions`                  | ✅                  | Tag-identified via `iac:actions:<key>`. Multiple steps OR-ed together; each step matches an event by name, properties, URL, or autocapture element attributes.                                                                                                                                                       |
| Surveys                  | ✅ `projects/{id}/surveys`                  | ❌                  |                                                                                                                                                                                                                                                                                                                      |
| Early access features    | ✅ `projects/{id}/early_access_feature`     | ❌                  |                                                                                                                                                                                                                                                                                                                      |
| Web experiments          | ✅ `projects/{id}/web_experiments`          | ❌                  |                                                                                                                                                                                                                                                                                                                      |
| Product tours            | ✅ `projects/{id}/product_tours`            | ❌                  | GA — has a draft / publish lifecycle (`draft` / `publish_draft` / `discard_draft`)                                                                                                                                                                                                                                   |
| Scheduled changes        | ✅ `projects/{id}/scheduled_changes`        | ❌                  | Time-bound flag/cohort rollout changes                                                                                                                                                                                                                                                                               |

## Data & taxonomy

| Resource                    | PostHog API                                    | posthog-definitions | Notes                                                                                                                      |
| --------------------------- | ---------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Event definitions           | ✅ `projects/{id}/event_definitions`           | ✅                  | Tag-identified via `iac:event-definitions:<key>`. Feeds `createTypedPostHog` for compile-time type-safe `.capture()` calls |
| Property definitions        | ✅ `projects/{id}/property_definitions`        | ❌                  |                                                                                                                            |
| Schema property groups      | ✅ `projects/{id}/schema_property_groups`      | ✅                  | Identity via `iac:property-groups:<key>` marker in `description`. Reusable bundles of properties attached to events        |
| Data color themes           | ✅ `environments/{id}/data_color_themes`       | 🟡                  | Referenced by dashboards via `dataColorThemeKey`, not synced                                                               |
| Tags                        | ✅ `projects/{id}/tags`                        | 🟡                  | Used internally for IaC identity (`iac:dashboards:*`)                                                                      |
| Groups types                | ✅ `projects/{id}/groups_types`                | ❌                  |                                                                                                                            |
| Custom property definitions | ✅ `projects/{id}/custom_property_definitions` | ❌                  | Computed/derived person & group properties                                                                                 |
| Custom property sources     | ✅ `projects/{id}/custom_property_sources`     | ❌                  | Backfill/sync config feeding custom property definitions                                                                   |
| Datasets                    | ✅ `projects/{id}/datasets`                    | ❌                  | Container for evaluation datasets; `dataset_items` are runtime data                                                        |

## Data warehouse & pipelines

| Resource                     | PostHog API                                    | posthog-definitions | Notes                                                                                                                       |
| ---------------------------- | ---------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Warehouse tables             | ✅ `environments/{id}/warehouse_tables`        | ❌                  |                                                                                                                             |
| Warehouse saved queries      | ✅ `environments/{id}/warehouse_saved_queries` | ❌                  |                                                                                                                             |
| Warehouse view links         | ✅ `environments/{id}/warehouse_view_links`    | ❌                  |                                                                                                                             |
| Batch exports                | ✅ `environments/{id}/batch_exports`           | ❌                  |                                                                                                                             |
| Managed migrations (imports) | ✅ `projects/{id}/managed_migrations`          | ❌                  |                                                                                                                             |
| Endpoints                    | ✅ `environments/{id}/endpoints`               | ✅                  | Saved HogQL queries served as a URL. No `tags` field — identity tracked via a trailing HTML comment marker in `description` |

## CDP & messaging

| Resource              | PostHog API                                  | posthog-definitions | Notes                           |
| --------------------- | -------------------------------------------- | ------------------- | ------------------------------- |
| Hog functions         | ✅ `environments/{id}/hog_functions`         | ❌                  | Destinations / transformations  |
| Hog flows             | ✅ `environments/{id}/hog_flows`             | ❌                  | Campaign builder                |
| Messaging templates   | ✅ `environments/{id}/messaging_templates`   | ❌                  |                                 |
| Messaging categories  | ✅ `environments/{id}/messaging_categories`  | ❌                  |                                 |
| Messaging preferences | ✅ `environments/{id}/messaging_preferences` | ❌                  |                                 |
| Links                 | ✅ `projects/{id}/links`                     | ❌                  | Short-link service              |
| Loops                 | ✅ `projects/{id}/loops`                     | ❌                  | Scheduled/triggered agent loops |

## Error tracking

| Resource               | PostHog API                                                  | posthog-definitions | Notes                                      |
| ---------------------- | ------------------------------------------------------------ | ------------------- | ------------------------------------------ |
| Releases               | ✅ `environments/{id}/error_tracking/releases`               | ❌                  |                                            |
| Symbol sets            | ✅ `environments/{id}/error_tracking/symbol_sets`            | ❌                  |                                            |
| Assignment rules       | ✅ `environments/{id}/error_tracking/assignment_rules`       | ❌                  |                                            |
| Grouping rules         | ✅ `environments/{id}/error_tracking/grouping_rules`         | ❌                  |                                            |
| Suppression rules      | ✅ `environments/{id}/error_tracking/suppression_rules`      | ❌                  |                                            |
| Bypass rules           | ✅ `environments/{id}/error_tracking/bypass_rules`           | ❌                  | New since May; order-sensitive (`reorder`) |
| Spike detection config | ✅ `environments/{id}/error_tracking/spike_detection_config` | ❌                  | Singleton — PATCH via `update_config`      |
| Settings               | ✅ `environments/{id}/error_tracking/settings`               | ❌                  |                                            |

## Logs & tracing

New products since the last refresh. All environment-scoped.

| Resource            | PostHog API                                | posthog-definitions | Notes                                                            |
| ------------------- | ------------------------------------------ | ------------------- | ---------------------------------------------------------------- |
| Logs views          | ✅ `environments/{id}/logs/views`          | ❌                  | Saved log views. Natural key `name`                              |
| Logs alerts         | ✅ `environments/{id}/logs/alerts`         | ❌                  | Destinations reference integrations; `simulate` for back-testing |
| Logs metric rules   | ✅ `environments/{id}/logs/metric_rules`   | ❌                  | Derive metrics from log streams                                  |
| Logs sampling rules | ✅ `environments/{id}/logs/sampling_rules` | ❌                  | Order-sensitive (`reorder`) — diff must be order-aware           |
| Tracing views       | ✅ `environments/{id}/tracing/views`       | ❌                  | Saved span/trace views                                           |

## LLM analytics

| Resource          | PostHog API                                            | posthog-definitions | Notes                                          |
| ----------------- | ------------------------------------------------------ | ------------------- | ---------------------------------------------- |
| Score definitions | ✅ `environments/{id}/llm_analytics/score_definitions` | ❌                  | Versioned (`new_version`)                      |
| Evaluations       | ✅ `projects/{id}/evaluations`                         | ❌                  | `hog` / `llm_judge` / `sentiment` online evals |
| Review queues     | ✅ `environments/{id}/llm_analytics/review_queues`     | ❌                  | Trace/generation review workflow config        |
| Provider keys     | ✅ `environments/{id}/llm_analytics/provider_keys`     | —                   | Secret material — not IaC                      |

## Signals & agents

| Resource                 | PostHog API                                   | posthog-definitions | Notes                                      |
| ------------------------ | --------------------------------------------- | ------------------- | ------------------------------------------ |
| Scout configs            | ✅ `environments/{id}/signals/scout/configs`  | ❌                  | Scheduled scanning agents; `run` on demand |
| Signal source configs    | ✅ `environments/{id}/signals/source_configs` | ❌                  |                                            |
| Pulse brief configs      | ✅ `environments/{id}/pulse/brief_configs`    | ❌                  | Recurring AI brief schedules               |
| Taggers                  | ✅ `projects/{id}/taggers`                    | ❌                  | Hog-based auto-taggers (`test_hog`)        |
| MCP server installations | ✅ `projects/{id}/mcp_server_installations`   | ❌                  | Watchlist — API may still be moving        |

## Replay vision

| Resource        | PostHog API                            | posthog-definitions | Notes                                                                                                  |
| --------------- | -------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| Vision scanners | ✅ `environments/{id}/vision/scanners` | ❌                  | Scheduled replay scanners; `observations` are runtime data. Quota-sensitive (`estimate` before create) |

## Customer data platform

| Resource                         | PostHog API                                         | posthog-definitions | Notes                        |
| -------------------------------- | --------------------------------------------------- | ------------------- | ---------------------------- |
| Customer profile configs         | ✅ `projects/{id}/customer_profile_configs`         | ❌                  |                              |
| Customer journeys                | ✅ `projects/{id}/customer_journeys`                | ❌                  |                              |
| Account relationship definitions | ✅ `projects/{id}/account_relationship_definitions` | ❌                  | Schema for B2B account graph |
| Accounts                         | ✅ `projects/{id}/accounts`                         | —                   | CRM records — runtime data   |

## Data catalog

| Resource        | PostHog API                                    | posthog-definitions | Notes                                          |
| --------------- | ---------------------------------------------- | ------------------- | ---------------------------------------------- |
| Catalog metrics | ✅ `projects/{id}/data_catalog/metrics`        | ❌                  | Governed metric definitions; `run` / `approve` |
| Certifications  | ✅ `projects/{id}/data_catalog/certifications` | ❌                  | Certify/deprecate governance markers on assets |

## Project & org configuration

| Resource                | PostHog API                                    | posthog-definitions | Notes                                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project settings        | ✅ `projects/{id}/environments/{id}/`          | ✅                  | Singleton — one row per project. Declare any subset of writable `PatchedTeam` fields; undeclared fields are left alone. Removing a previously-declared field abandons it (server value persists). |
| Project secret API keys | ✅ `environments/{id}/project_secret_api_keys` | ❌                  | Secret material — likely never IaC                                                                                                                                                                |
| Quick filters           | ✅ `environments/{id}/quick_filters`           | ❌                  |                                                                                                                                                                                                   |
| File system / shortcuts | ✅ `environments/{id}/file_system`             | —                   | UI-state, not a sync target                                                                                                                                                                       |
| Persisted folders       | ✅ `environments/{id}/persisted_folder`        | —                   | UI-state                                                                                                                                                                                          |
| Organization members    | ✅ `organizations/{id}/members`                | —                   | Out of scope                                                                                                                                                                                      |
| Org invites             | ✅ `organizations/{id}/invites`                | —                   | Out of scope                                                                                                                                                                                      |
| Org domains             | ✅ `organizations/{id}/domains`                | —                   | Out of scope                                                                                                                                                                                      |
| Integrations            | ✅ `organizations/{id}/integrations`           | —                   | OAuth — not declarative                                                                                                                                                                           |

## Summary

Currently shipped: **12 resource types** — Dashboards, Insights, Feature flags, Endpoints, Schema property groups, Event definitions, Experiments, Experiment holdouts, Experiment saved metrics, Project settings, Cohorts, and Actions. Event definitions and property groups together feed `createTypedPostHog`, which wraps any `posthog-js`-shaped client and type-checks `.capture(name, properties)` at compile time against the same specs synced via `apply`. Experiments are declarative across the full lifecycle (draft / running / paused / stopped) — apply drives the launch / pause / resume / end transitions to match. Project settings is the first singleton resource: declared as one block, field-level diff against the live row, declared-only PATCH. Cohorts run before feature flags in the apply order, leaving the door open for cohort-by-key references inside flag conditions.

Reasonable IaC targets across the API surface: **~35–45** and growing — the 2026-07-23 refresh added whole product families (logs, tracing, LLM analytics, replay vision, signals/scouts, customer data platform, data catalog) on top of the previously-tracked set (surveys, annotations, alerts, hog functions/flows, error-tracking rules, warehouse queries, batch exports, …). See `docs/implementation/parity-plan.md` for the wave-by-wave plan and per-resource identity design.

Likely next candidates: surveys and early access features (description-marker identity, references feature flags), then insight variables and session recording playlists (natural-key identity).
