# Resource support

What PostHog exposes via API vs. what `posthog-definitions` can manage as code.

Legend: ✅ supported · 🟡 partial / read-only / inline-only · ❌ not supported (yet) · — not applicable for IaC

Source of truth for the API column: registered viewsets in [`posthog/posthog/api/__init__.py`](https://github.com/PostHog/posthog/blob/master/posthog/api/__init__.py). Last refreshed against `master` on 2026-05-13.

## Analytics & visualization

| Resource            | PostHog API                              | posthog-definitions | Notes                                         |
| ------------------- | ---------------------------------------- | ------------------- | --------------------------------------------- |
| Dashboards          | ✅ `projects/{id}/dashboards`            | ✅                  | Tag-identified via `iac:dashboards:<key>`     |
| Insights            | ✅ `projects/{id}/insights`              | ✅                  | Standalone or inlined inside a dashboard tile |
| Dashboard templates | ✅ `projects/{id}/dashboard_templates`   | ❌                  |                                               |
| Annotations         | ✅ `projects/{id}/annotations`           | ✅                  | Identity via `iac:annotations:<key>` marker in `content`. `scope` project/organization/dashboard_item(insight)/dashboard; insight/dashboard refs by key. `hidden` keeps deploy markers (and the marker comment) out of the UI. Full matrix refresh tracked in #78. |
| Notebooks           | ✅ `projects/{id}/notebooks`             | ❌                  |                                               |
| Alerts              | ✅ `environments/{id}/alerts`            | ❌                  |                                               |
| Insight variables   | ✅ `environments/{id}/insight_variables` | ❌                  |                                               |
| Comments            | ✅ `projects/{id}/comments`              | —                   | Ephemeral by nature                           |

## Behavior & experimentation

| Resource                 | PostHog API                                 | posthog-definitions | Notes                                                                                                  |
| ------------------------ | ------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| Feature flags            | ✅ `projects/{id}/feature_flags`            | ✅                  | Tag-identified via `iac:feature-flags:<key>`; dependent flags and encrypted payloads not yet supported |
| Experiments              | ✅ `projects/{id}/experiments`              | ✅                  | Identity via `iac:experiments:<key>` marker in `description`. Lifecycle (`draft` / `running` / `paused` / `stopped`) is declarative — apply drives the launch / pause / resume / end transitions to match. References the experiment's feature flag, optional holdout, and shared saved metrics by object reference. |
| Experiment holdouts      | ✅ `projects/{id}/experiment_holdouts`      | ✅                  | Identity via `iac:experiment-holdouts:<key>` marker in `description`.                                  |
| Experiment saved metrics | ✅ `projects/{id}/experiment_saved_metrics` | ✅                  | Identity via `iac:experiment-saved-metrics:<key>` marker in `description`. Attached to experiments as primary or secondary. |
| Cohorts                  | ✅ `projects/{id}/cohorts`                  | ✅                  | Identity via `iac:cohorts:<key>` marker in `description`. Supports behavioral (`filters`), HogQL (`query`), and static (`is_static: true`) cohorts. Static membership is managed out-of-band — IaC only creates the container. |
| Actions                  | ✅ `projects/{id}/actions`                  | ✅                  | Tag-identified via `iac:actions:<key>`. Multiple steps OR-ed together; each step matches an event by name, properties, URL, or autocapture element attributes. |
| Surveys                  | ✅ `projects/{id}/surveys`                  | ❌                  |                                                                                                        |
| Early access features    | ✅ `projects/{id}/early_access_feature`     | ❌                  |                                                                                                        |
| Web experiments          | ✅ `projects/{id}/web_experiments`          | ❌                  |                                                                                                        |
| Product tours            | ✅ `projects/{id}/product_tours`            | ❌                  |                                                                                                        |
| Scheduled changes        | ✅ `projects/{id}/scheduled_changes`        | ❌                  | Time-bound flag/cohort rollout changes                                                                 |

## Data & taxonomy

| Resource               | PostHog API                               | posthog-definitions | Notes                                                        |
| ---------------------- | ----------------------------------------- | ------------------- | ------------------------------------------------------------ |
| Event definitions      | ✅ `projects/{id}/event_definitions`      | ✅                  | Tag-identified via `iac:event-definitions:<key>`. Feeds `createTypedPostHog` for compile-time type-safe `.capture()` calls |
| Property definitions   | ✅ `projects/{id}/property_definitions`   | ❌                  |                                                              |
| Schema property groups | ✅ `projects/{id}/schema_property_groups` | ✅                  | Identity via `iac:property-groups:<key>` marker in `description`. Reusable bundles of properties attached to events |
| Data color themes      | ✅ `environments/{id}/data_color_themes`  | 🟡                  | Referenced by dashboards via `dataColorThemeKey`, not synced |
| Tags                   | ✅ `projects/{id}/tags`                   | 🟡                  | Used internally for IaC identity (`iac:dashboards:*`)        |
| Groups types           | ✅ `projects/{id}/groups_types`           | ❌                  |                                                              |

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

| Resource              | PostHog API                                  | posthog-definitions | Notes                          |
| --------------------- | -------------------------------------------- | ------------------- | ------------------------------ |
| Hog functions         | ✅ `environments/{id}/hog_functions`         | ❌                  | Destinations / transformations |
| Hog flows             | ✅ `environments/{id}/hog_flows`             | ❌                  | Campaign builder               |
| Messaging templates   | ✅ `environments/{id}/messaging_templates`   | ❌                  |                                |
| Messaging categories  | ✅ `environments/{id}/messaging_categories`  | ❌                  |                                |
| Messaging preferences | ✅ `environments/{id}/messaging_preferences` | ❌                  |                                |
| Links                 | ✅ `projects/{id}/links`                     | ❌                  | Short-link service             |

## Error tracking

| Resource               | PostHog API                                                  | posthog-definitions | Notes |
| ---------------------- | ------------------------------------------------------------ | ------------------- | ----- |
| Releases               | ✅ `environments/{id}/error_tracking/releases`               | ❌                  |       |
| Symbol sets            | ✅ `environments/{id}/error_tracking/symbol_sets`            | ❌                  |       |
| Assignment rules       | ✅ `environments/{id}/error_tracking/assignment_rules`       | ❌                  |       |
| Grouping rules         | ✅ `environments/{id}/error_tracking/grouping_rules`         | ❌                  |       |
| Suppression rules      | ✅ `environments/{id}/error_tracking/suppression_rules`      | ❌                  |       |
| Spike detection config | ✅ `environments/{id}/error_tracking/spike_detection_config` | ❌                  |       |
| Settings               | ✅ `environments/{id}/error_tracking/settings`               | ❌                  |       |

## Project & org configuration

| Resource                | PostHog API                                    | posthog-definitions | Notes                              |
| ----------------------- | ---------------------------------------------- | ------------------- | ---------------------------------- |
| Project settings        | ✅ `projects/{id}/environments/{id}/`          | ✅                  | Singleton — one row per project. Declare any subset of writable `PatchedTeam` fields; undeclared fields are left alone. Removing a previously-declared field abandons it (server value persists). |
| Project secret API keys | ✅ `environments/{id}/project_secret_api_keys` | ❌                  | Secret material — likely never IaC |
| Quick filters           | ✅ `environments/{id}/quick_filters`           | ❌                  |                                    |
| File system / shortcuts | ✅ `environments/{id}/file_system`             | —                   | UI-state, not a sync target        |
| Persisted folders       | ✅ `environments/{id}/persisted_folder`        | —                   | UI-state                           |
| Organization members    | ✅ `organizations/{id}/members`                | —                   | Out of scope                       |
| Org invites             | ✅ `organizations/{id}/invites`                | —                   | Out of scope                       |
| Org domains             | ✅ `organizations/{id}/domains`                | —                   | Out of scope                       |
| Integrations            | ✅ `organizations/{id}/integrations`           | —                   | OAuth — not declarative            |

## Summary

Currently shipped: **12 resource types** — Dashboards, Insights, Feature flags, Endpoints, Schema property groups, Event definitions, Experiments, Experiment holdouts, Experiment saved metrics, Project settings, Cohorts, and Actions. Event definitions and property groups together feed `createTypedPostHog`, which wraps any `posthog-js`-shaped client and type-checks `.capture(name, properties)` at compile time against the same specs synced via `apply`. Experiments are declarative across the full lifecycle (draft / running / paused / stopped) — apply drives the launch / pause / resume / end transitions to match. Project settings is the first singleton resource: declared as one block, field-level diff against the live row, declared-only PATCH. Cohorts run before feature flags in the apply order, leaving the door open for cohort-by-key references inside flag conditions.

Reasonable IaC targets across the API surface: **~25–30** (cohorts, actions, surveys, annotations, alerts, hog functions/flows, error-tracking rules, warehouse queries, batch exports, …).

Likely next candidates: annotations (operational metadata on charts) and alerts (declarative monitoring on shipped insights).
