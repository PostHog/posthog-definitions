# Resource support

What PostHog exposes via API vs. what `posthog-definitions` can manage as code.

Legend: ✅ supported · 🟡 partial / read-only / inline-only · ❌ not supported (yet) · — not applicable for IaC

Source of truth for the API column: registered viewsets in [`posthog/posthog/api/__init__.py`](https://github.com/PostHog/posthog/blob/master/posthog/api/__init__.py). Last refreshed against `master` on 2026-05-13.

## Analytics & visualization

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Dashboards | ✅ `projects/{id}/dashboards` | ✅ | Tag-identified via `iac:dashboards:<key>` |
| Insights | ✅ `projects/{id}/insights` | ✅ | Standalone or inlined inside a dashboard tile |
| Dashboard templates | ✅ `projects/{id}/dashboard_templates` | ❌ | |
| Annotations | ✅ `projects/{id}/annotations` | ❌ | |
| Notebooks | ✅ `projects/{id}/notebooks` | ❌ | |
| Alerts | ✅ `environments/{id}/alerts` | ❌ | |
| Insight variables | ✅ `environments/{id}/insight_variables` | ❌ | |
| Comments | ✅ `projects/{id}/comments` | — | Ephemeral by nature |

## Behavior & experimentation

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Feature flags | ✅ `projects/{id}/feature_flags` | ✅ | Tag-identified via `iac:feature-flags:<key>`; dependent flags and encrypted payloads not yet supported |
| Experiments | ✅ `projects/{id}/experiments` | ❌ | Enterprise viewset |
| Experiment holdouts | ✅ `projects/{id}/experiment_holdouts` | ❌ | |
| Experiment saved metrics | ✅ `projects/{id}/experiment_saved_metrics` | ❌ | |
| Cohorts | ✅ `projects/{id}/cohorts` | ❌ | |
| Actions | ✅ `projects/{id}/actions` | ❌ | |
| Surveys | ✅ `projects/{id}/surveys` | ❌ | |
| Early access features | ✅ `projects/{id}/early_access_feature` | ❌ | |
| Web experiments | ✅ `projects/{id}/web_experiments` | ❌ | |
| Product tours | ✅ `projects/{id}/product_tours` | ❌ | |
| Scheduled changes | ✅ `projects/{id}/scheduled_changes` | ❌ | Time-bound flag/cohort rollout changes |

## Data & taxonomy

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Event definitions | ✅ `projects/{id}/event_definitions` | ❌ | Metadata; usually emergent from ingest |
| Property definitions | ✅ `projects/{id}/property_definitions` | ❌ | |
| Schema property groups | ✅ `projects/{id}/schema_property_groups` | ❌ | |
| Data color themes | ✅ `environments/{id}/data_color_themes` | 🟡 | Referenced by dashboards via `dataColorThemeKey`, not synced |
| Tags | ✅ `projects/{id}/tags` | 🟡 | Used internally for IaC identity (`iac:dashboards:*`) |
| Groups types | ✅ `projects/{id}/groups_types` | ❌ | |

## Data warehouse & pipelines

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Warehouse tables | ✅ `environments/{id}/warehouse_tables` | ❌ | |
| Warehouse saved queries | ✅ `environments/{id}/warehouse_saved_queries` | ❌ | |
| Warehouse view links | ✅ `environments/{id}/warehouse_view_links` | ❌ | |
| Batch exports | ✅ `environments/{id}/batch_exports` | ❌ | |
| Managed migrations (imports) | ✅ `projects/{id}/managed_migrations` | ❌ | |
| Endpoints | ✅ `environments/{id}/endpoints` | ✅ | Saved HogQL queries served as a URL. No `tags` field — identity tracked via a trailing HTML comment marker in `description` |

## CDP & messaging

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Hog functions | ✅ `environments/{id}/hog_functions` | ❌ | Destinations / transformations |
| Hog flows | ✅ `environments/{id}/hog_flows` | ❌ | Campaign builder |
| Messaging templates | ✅ `environments/{id}/messaging_templates` | ❌ | |
| Messaging categories | ✅ `environments/{id}/messaging_categories` | ❌ | |
| Messaging preferences | ✅ `environments/{id}/messaging_preferences` | ❌ | |
| Links | ✅ `projects/{id}/links` | ❌ | Short-link service |

## Error tracking

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Releases | ✅ `environments/{id}/error_tracking/releases` | ❌ | |
| Symbol sets | ✅ `environments/{id}/error_tracking/symbol_sets` | ❌ | |
| Assignment rules | ✅ `environments/{id}/error_tracking/assignment_rules` | ❌ | |
| Grouping rules | ✅ `environments/{id}/error_tracking/grouping_rules` | ❌ | |
| Suppression rules | ✅ `environments/{id}/error_tracking/suppression_rules` | ❌ | |
| Spike detection config | ✅ `environments/{id}/error_tracking/spike_detection_config` | ❌ | |
| Settings | ✅ `environments/{id}/error_tracking/settings` | ❌ | |

## Project & org configuration

| Resource | PostHog API | posthog-definitions | Notes |
| --- | --- | --- | --- |
| Project secret API keys | ✅ `environments/{id}/project_secret_api_keys` | ❌ | Secret material — likely never IaC |
| Quick filters | ✅ `environments/{id}/quick_filters` | ❌ | |
| File system / shortcuts | ✅ `environments/{id}/file_system` | — | UI-state, not a sync target |
| Persisted folders | ✅ `environments/{id}/persisted_folder` | — | UI-state |
| Organization members | ✅ `organizations/{id}/members` | — | Out of scope |
| Org invites | ✅ `organizations/{id}/invites` | — | Out of scope |
| Org domains | ✅ `organizations/{id}/domains` | — | Out of scope |
| Integrations | ✅ `organizations/{id}/integrations` | — | OAuth — not declarative |

## Summary

Currently shipped: **4 resource types** (Dashboards, Insights, Feature flags, Endpoints).
Reasonable IaC targets across the API surface: **~25–30** (flags, cohorts, actions, surveys, experiments, annotations, alerts, hog functions/flows, error-tracking rules, warehouse queries, batch exports, …).

Next likely candidates per `implementation/mvp-roadmap.md`: feature flags, then actions and cohorts.
