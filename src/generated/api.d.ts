export interface paths {
    "/api/projects/{project_id}/actions/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["actions_list"];
        put?: never;
        post: operations["actions_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/actions/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["actions_retrieve"];
        put: operations["actions_update"];
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["actions_destroy"];
        options?: never;
        head?: never;
        patch: operations["actions_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/annotations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create, Read, Update and Delete annotations. [See docs](https://posthog.com/docs/data/annotations) for more information on annotations. */
        get: operations["annotations_list"];
        put?: never;
        /** @description Create, Read, Update and Delete annotations. [See docs](https://posthog.com/docs/data/annotations) for more information on annotations. */
        post: operations["annotations_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/annotations/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create, Read, Update and Delete annotations. [See docs](https://posthog.com/docs/data/annotations) for more information on annotations. */
        get: operations["annotations_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** @description Create, Read, Update and Delete annotations. [See docs](https://posthog.com/docs/data/annotations) for more information on annotations. */
        patch: operations["annotations_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/cohorts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["cohorts_list"];
        put?: never;
        post: operations["cohorts_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/cohorts/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["cohorts_retrieve"];
        put?: never;
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["cohorts_destroy"];
        options?: never;
        head?: never;
        patch: operations["cohorts_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/dashboards/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["dashboards_list"];
        put?: never;
        post: operations["dashboards_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/dashboards/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["dashboards_retrieve"];
        put: operations["dashboards_update"];
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["dashboards_destroy"];
        options?: never;
        head?: never;
        patch: operations["dashboards_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/endpoints/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List all endpoints for the team. */
        get: operations["endpoints_list"];
        put?: never;
        /** @description Create a new endpoint. */
        post: operations["endpoints_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/endpoints/{name}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Retrieve an endpoint, or a specific version via ?version=N. */
        get: operations["endpoints_retrieve"];
        /** @description Update an existing endpoint. Parameters are optional. Pass version in body or ?version=N query param to target a specific version. */
        put: operations["endpoints_update"];
        post?: never;
        /** @description Delete an endpoint and clean up materialized query. */
        delete: operations["endpoints_destroy"];
        options?: never;
        head?: never;
        /** @description Update an existing endpoint. */
        patch: operations["endpoints_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/environments/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @deprecated
         * @description Deprecated: use /api/environments/{id}/ instead.
         */
        get: operations["environments_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * @deprecated
         * @description Deprecated: use /api/environments/{id}/ instead.
         */
        patch: operations["environments_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/event_definitions/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["event_definitions_list"];
        put?: never;
        post: operations["event_definitions_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/event_definitions/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["event_definitions_retrieve"];
        put?: never;
        post?: never;
        delete: operations["event_definitions_destroy"];
        options?: never;
        head?: never;
        patch: operations["event_definitions_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/event_schemas/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["event_schemas_list"];
        put?: never;
        post: operations["event_schemas_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/event_schemas/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["event_schemas_destroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiment_holdouts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["experiment_holdouts_list"];
        put?: never;
        post: operations["experiment_holdouts_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiment_holdouts/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["experiment_holdouts_retrieve"];
        put?: never;
        post?: never;
        delete: operations["experiment_holdouts_destroy"];
        options?: never;
        head?: never;
        patch: operations["experiment_holdouts_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/experiment_saved_metrics/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["experiment_saved_metrics_list"];
        put?: never;
        post: operations["experiment_saved_metrics_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiment_saved_metrics/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["experiment_saved_metrics_retrieve"];
        put?: never;
        post?: never;
        delete: operations["experiment_saved_metrics_destroy"];
        options?: never;
        head?: never;
        patch: operations["experiment_saved_metrics_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List experiments for the current project. Supports filtering by status and archival state. */
        get: operations["experiments_list"];
        put?: never;
        /** @description Create a new experiment in draft status with optional metrics. */
        post: operations["experiments_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Retrieve a single experiment by ID, including its current status, metrics, feature flag, and results metadata. */
        get: operations["experiments_retrieve"];
        put?: never;
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["experiments_destroy"];
        options?: never;
        head?: never;
        /** @description Update an experiment. Use this to modify experiment properties such as name, description, metrics, variants, and configuration. Metrics can be added, changed and removed at any time. Feature-flag config (variants, rollout, payloads) is sent via the feature_flag object. */
        patch: operations["experiments_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/archive/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Archive an ended experiment.
         *
         *     Hides the experiment from the default list view. The experiment can be
         *     restored at any time by updating archived=false. When the linked feature
         *     flag is still enabled, pass disable_feature_flag=true to also disable and
         *     archive it. Returns 400 if the experiment is already archived or has not
         *     ended yet.
         */
        post: operations["experiments_archive_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/end/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description End a running experiment without shipping a variant.
         *
         *     Sets end_date to now and marks the experiment as stopped. The feature
         *     flag is NOT modified — users continue to see their assigned variants
         *     and exposure events ($feature_flag_called) continue to be recorded.
         *     However, only data up to end_date is included in experiment results.
         *
         *     Use this when:
         *
         *     - You want to freeze the results window without changing which variant
         *       users see.
         *     - A variant was already shipped manually via the feature flag UI and
         *       the experiment just needs to be marked complete.
         *
         *     The end_date can be adjusted after ending via PATCH if it needs to be
         *     backdated (e.g. to match when the flag was actually paused).
         *
         *     Other options:
         *     - Use ship_variant to end the experiment AND roll out a single variant to 100%% of users.
         *     - Use pause to deactivate the flag without ending the experiment (stops variant assignment but does not freeze results).
         *
         *     Returns 400 if the experiment is not running.
         */
        post: operations["experiments_end_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/launch/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Launch a draft experiment.
         *
         *     Validates the experiment is in draft state, activates its linked feature flag,
         *     sets start_date to the current server time, and transitions the experiment to running.
         *     Returns 400 if the experiment has already been launched or if the feature flag
         *     configuration is invalid (e.g. fewer than 2 variants).
         */
        post: operations["experiments_launch_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/pause/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Pause a running experiment.
         *
         *     Deactivates the linked feature flag so it is no longer returned by the
         *     /decide endpoint. Users fall back to the application default (typically
         *     the control experience), and no new exposure events are recorded (i.e.
         *     $feature_flag_called is not fired).
         *     Returns 400 if the experiment is not running or is already paused.
         */
        post: operations["experiments_pause_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/resume/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Resume a paused experiment.
         *
         *     Reactivates the linked feature flag so it is returned by /decide again.
         *     Users are re-bucketed deterministically into the same variants they had
         *     before the pause, and exposure tracking resumes.
         *     Returns 400 if the experiment is not running or is not paused.
         */
        post: operations["experiments_resume_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/experiments/{id}/unarchive/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Unarchive an archived experiment.
         *
         *     Restores the experiment to the default list view. Returns 400 if the
         *     experiment is not currently archived.
         */
        post: operations["experiments_unarchive_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/feature_flags/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Create, read, update and delete feature flags. [See docs](https://posthog.com/docs/feature-flags) for more information on feature flags.
         *
         *     If you're looking to use feature flags on your application, you can either use our JavaScript Library or our dedicated endpoint to check if feature flags are enabled for a given user.
         */
        get: operations["feature_flags_list"];
        put?: never;
        /**
         * @description Create, read, update and delete feature flags. [See docs](https://posthog.com/docs/feature-flags) for more information on feature flags.
         *
         *     If you're looking to use feature flags on your application, you can either use our JavaScript Library or our dedicated endpoint to check if feature flags are enabled for a given user.
         */
        post: operations["feature_flags_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/feature_flags/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Create, read, update and delete feature flags. [See docs](https://posthog.com/docs/feature-flags) for more information on feature flags.
         *
         *     If you're looking to use feature flags on your application, you can either use our JavaScript Library or our dedicated endpoint to check if feature flags are enabled for a given user.
         */
        get: operations["feature_flags_retrieve"];
        /**
         * @description Create, read, update and delete feature flags. [See docs](https://posthog.com/docs/feature-flags) for more information on feature flags.
         *
         *     If you're looking to use feature flags on your application, you can either use our JavaScript Library or our dedicated endpoint to check if feature flags are enabled for a given user.
         */
        put: operations["feature_flags_update"];
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["feature_flags_destroy"];
        options?: never;
        head?: never;
        /**
         * @description Create, read, update and delete feature flags. [See docs](https://posthog.com/docs/feature-flags) for more information on feature flags.
         *
         *     If you're looking to use feature flags on your application, you can either use our JavaScript Library or our dedicated endpoint to check if feature flags are enabled for a given user.
         */
        patch: operations["feature_flags_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/insights/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description DRF ViewSet mixin that gates coalesced responses behind permission checks.
         *
         *     The QueryCoalescingMiddleware attaches cached response data to
         *     request.META["_coalesced_response"] for followers. This mixin runs DRF's
         *     initial() (auth + permissions + throttling) before returning the
         *     cached response, ensuring the request is authorized.
         */
        get: operations["insights_list"];
        put?: never;
        /**
         * @description DRF ViewSet mixin that gates coalesced responses behind permission checks.
         *
         *     The QueryCoalescingMiddleware attaches cached response data to
         *     request.META["_coalesced_response"] for followers. This mixin runs DRF's
         *     initial() (auth + permissions + throttling) before returning the
         *     cached response, ensuring the request is authorized.
         */
        post: operations["insights_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/insights/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description DRF ViewSet mixin that gates coalesced responses behind permission checks.
         *
         *     The QueryCoalescingMiddleware attaches cached response data to
         *     request.META["_coalesced_response"] for followers. This mixin runs DRF's
         *     initial() (auth + permissions + throttling) before returning the
         *     cached response, ensuring the request is authorized.
         */
        get: operations["insights_retrieve"];
        /**
         * @description DRF ViewSet mixin that gates coalesced responses behind permission checks.
         *
         *     The QueryCoalescingMiddleware attaches cached response data to
         *     request.META["_coalesced_response"] for followers. This mixin runs DRF's
         *     initial() (auth + permissions + throttling) before returning the
         *     cached response, ensuring the request is authorized.
         */
        put: operations["insights_update"];
        post?: never;
        /** @description Hard delete of this model is not allowed. Use a patch API call to set "deleted" to true */
        delete: operations["insights_destroy"];
        options?: never;
        head?: never;
        /**
         * @description DRF ViewSet mixin that gates coalesced responses behind permission checks.
         *
         *     The QueryCoalescingMiddleware attaches cached response data to
         *     request.META["_coalesced_response"] for followers. This mixin runs DRF's
         *     initial() (auth + permissions + throttling) before returning the
         *     cached response, ensuring the request is authorized.
         */
        patch: operations["insights_partial_update"];
        trace?: never;
    };
    "/api/projects/{project_id}/schema_property_groups/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["schema_property_groups_list"];
        put?: never;
        post: operations["schema_property_groups_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{project_id}/schema_property_groups/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["schema_property_groups_retrieve"];
        put?: never;
        post?: never;
        delete: operations["schema_property_groups_destroy"];
        options?: never;
        head?: never;
        patch: operations["schema_property_groups_partial_update"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * AIEventType
         * @enum {string}
         */
        AIEventType: "$ai_generation" | "$ai_embedding" | "$ai_span" | "$ai_trace" | "$ai_metric" | "$ai_feedback" | "$ai_evaluation" | "$ai_tag" | "$ai_trace_summary" | "$ai_generation_summary" | "$ai_trace_clusters" | "$ai_generation_clusters";
        /** AccessControlFilterWarning */
        AccessControlFilterWarning: {
            /**
             * Message
             * @description Human-readable warning shown to the user
             */
            message: string;
            /**
             * Resources
             * @description Resource types the user has access restrictions on, referenced by the query, e.g. ["insight", "dashboard"]
             */
            resources: string[];
            /**
             * Type
             * @description Tells warning kinds apart in the shared `warnings` list
             * @default access_control
             * @constant
             */
            type: "access_control";
        };
        /** AccountCustomPropertyFilter */
        AccountCustomPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @description Customer analytics account custom property — the key is the property definition id
             * @default account_custom_property
             * @constant
             */
            type: "account_custom_property";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** AccountsQuery */
        AccountsQuery: {
            /**
             * Allrolesunassigned
             * @description Match accounts with no active relationship of any definition.
             * @default null
             */
            allRolesUnassigned: boolean | null;
            /**
             * Assignedtouserids
             * @description Match accounts where any of these user ids actively holds any relationship (CSM, Account executive, or a custom definition). Drives the "My accounts" shortcut (the current user's id) and the shareable "Assigned to" filter — the ids are explicit so a shared URL resolves identically for every viewer.
             * @default null
             */
            assignedToUserIds: number[] | null;
            /**
             * Filterexpression
             * @description Optional HogQL boolean expression AND-ed into the WHERE clause. Used by the overview tile click-to-filter affordance.
             * @default null
             */
            filterExpression: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "AccountsQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * Metrics
             * @description Aggregation expressions evaluated against the filtered account set; one value per metric is returned in `metricsResults`. When `metrics` is set without a `select`, the runner skips the regular row fetch and returns only the aggregated values.
             * @default null
             */
            metrics: string[] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: string[] | null;
            /** @default null */
            response: components["schemas"]["AccountsQueryResponse"] | null;
            /**
             * Search
             * @default null
             */
            search: string | null;
            /**
             * Select
             * @default null
             */
            select: string[] | null;
            /**
             * Tagnames
             * @default null
             */
            tagNames: string[] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** AccountsQueryResponse */
        AccountsQueryResponse: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Kind
             * @default AccountsQuery
             * @constant
             */
            kind: "AccountsQuery";
            /** Limit */
            limit: number;
            /**
             * Metricsresults
             * @description When `metrics` is set on the query, the aggregated values in the same order.
             * @default null
             */
            metricsResults: (number | null)[] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** @description Serializer mixin that handles tags for objects. */
        Action: {
            readonly id: number;
            /** @description Name of the action (must be unique within the project). */
            name?: string | null;
            /** @description Human-readable description of what this action represents. */
            description?: string;
            tags?: unknown[];
            /** @description Whether to post a notification to Slack when this action is triggered. */
            post_to_slack?: boolean;
            /** @description Custom Slack message format. Supports templates with event properties. */
            slack_message_format?: string;
            /** @description Action steps defining trigger conditions. Each step matches events by name, properties, URL, or element attributes. Multiple steps are OR-ed together. */
            steps?: components["schemas"]["ActionStepJSON"][];
            /** Format: date-time */
            readonly created_at: string;
            readonly created_by: components["schemas"]["UserBasic"];
            deleted?: boolean;
            readonly is_calculating: boolean;
            /** Format: date-time */
            last_calculated_at?: string;
            readonly team_id: number;
            /** @default true */
            readonly is_action: boolean;
            readonly bytecode_error: string | null;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when the action was pinned, or null if not pinned. Set any value to pin, null to unpin.
             */
            pinned_at?: string | null;
            readonly creation_context: string | null;
            /** create in folder */
            _create_in_folder?: string;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /** ActionConversionGoal */
        ActionConversionGoal: {
            /** Actionid */
            actionId: number;
        };
        ActionStepJSON: {
            /** @description Event name to match (e.g. '$pageview', '$autocapture', or a custom event name). */
            event?: string | null;
            /** @description Event or person property filters. Each item should have 'key' (string), 'value' (string, number, boolean, or array), optional 'operator' (exact, is_not, is_set, is_not_set, icontains, not_icontains, regex, not_regex, gt, gte, lt, lte), and optional 'type' (event, person). */
            properties?: components["schemas"]["ActionStepPropertyFilter"][] | null;
            /** @description CSS selector to match the target element (e.g. 'div > button.cta'). */
            selector?: string | null;
            readonly selector_regex: string | null;
            /** @description HTML tag name to match (e.g. "button", "a", "input"). */
            tag_name?: string | null;
            /** @description Element text content to match. */
            text?: string | null;
            /**
             * @description How to match the text value. Defaults to exact.
             *
             *     * `contains` - contains
             *     * `regex` - regex
             *     * `exact` - exact
             */
            text_matching?: components["schemas"]["ActionStepMatchingEnum"] | components["schemas"]["NullEnum"];
            /** @description Link href attribute to match. */
            href?: string | null;
            /**
             * @description How to match the href value. Defaults to exact.
             *
             *     * `contains` - contains
             *     * `regex` - regex
             *     * `exact` - exact
             */
            href_matching?: components["schemas"]["ActionStepMatchingEnum"] | components["schemas"]["NullEnum"];
            /** @description Page URL to match. */
            url?: string | null;
            /**
             * @description How to match the URL value. Defaults to contains.
             *
             *     * `contains` - contains
             *     * `regex` - regex
             *     * `exact` - exact
             */
            url_matching?: components["schemas"]["ActionStepMatchingEnum"] | components["schemas"]["NullEnum"];
        };
        /**
         * @description * `contains` - contains
         *     * `regex` - regex
         *     * `exact` - exact
         * @enum {string}
         */
        ActionStepMatchingEnum: "contains" | "regex" | "exact";
        ActionStepPropertyFilter: components["schemas"]["StringPropertyFilter"] | components["schemas"]["NumericPropertyFilter"] | components["schemas"]["ArrayPropertyFilter"] | components["schemas"]["DatePropertyFilter"] | components["schemas"]["ExistencePropertyFilter"];
        /** ActionsNode */
        ActionsNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: number;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ActionsNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ActionsPie */
        ActionsPie: {
            /**
             * Disablehoveroffset
             * @default null
             */
            disableHoverOffset: boolean | null;
            /**
             * Hideaggregation
             * @default null
             */
            hideAggregation: boolean | null;
        };
        /** ActorsQuery */
        ActorsQuery: {
            /**
             * Fixedproperties
             * @description Currently only person filters supported. No filters for querying groups. See `filter_conditions()` in actor_strategies.py.
             * @default null
             */
            fixedProperties: (components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"])[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ActorsQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @description Currently only person filters supported. No filters for querying groups. See `filter_conditions()` in actor_strategies.py.
             * @default null
             */
            properties: (components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"])[] | components["schemas"]["PropertyGroupFilterValue"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            /**
             * Search
             * @default null
             */
            search: string | null;
            /**
             * Select
             * @default null
             */
            select: string[] | null;
            /**
             * Source
             * @default null
             */
            source: components["schemas"]["InsightActorsQuery"] | components["schemas"]["FunnelsActorsQuery"] | components["schemas"]["FunnelCorrelationActorsQuery"] | components["schemas"]["ExperimentActorsQuery"] | components["schemas"]["StickinessActorsQuery"] | components["schemas"]["HogQLQuery"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ActorsQueryResponse */
        ActorsQueryResponse: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /** Limit */
            limit: number;
            /**
             * Missing Actors Count
             * @default null
             */
            missing_actors_count: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: string[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * AggregationAxisFormat
         * @enum {string}
         */
        AggregationAxisFormat: "numeric" | "duration" | "duration_ms" | "duration_ns" | "percentage" | "percentage_scaled" | "currency" | "short";
        /**
         * AggregationPropertyType
         * @enum {string}
         */
        AggregationPropertyType: "event" | "person" | "data_warehouse";
        /**
         * AggregationType
         * @enum {string}
         */
        AggregationType: "count" | "sum" | "avg";
        Annotation: {
            readonly id: number;
            /** @description Annotation text shown on charts to describe the change, release, or incident. */
            content?: string | null;
            /**
             * Format: date-time
             * @description When this annotation happened (ISO 8601 timestamp). Used to position it on charts.
             */
            date_marker?: string | null;
            /**
             * @description Who created this annotation. Use `USR` for user-created notes and `GIT` for bot/deployment notes.
             *
             *     * `USR` - user
             *     * `GIT` - GitHub
             */
            creation_type?: components["schemas"]["CreationTypeEnum"];
            dashboard_item?: number | null;
            dashboard_id?: number | null;
            readonly dashboard_name: string | null;
            readonly insight_short_id: string | null;
            readonly insight_name: string | null;
            readonly insight_derived_name: string | null;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string | null;
            /** Format: date-time */
            readonly updated_at: string;
            /** @description Soft-delete flag. Set to true to hide the annotation, or false to restore it. */
            deleted?: boolean;
            /**
             * @description Annotation visibility scope: `project`, `organization`, `dashboard`, or `dashboard_item`. `recording` is deprecated and rejected.
             *
             *     * `dashboard_item` - insight
             *     * `dashboard` - dashboard
             *     * `project` - project
             *     * `organization` - organization
             *     * `recording` - recording
             */
            scope?: components["schemas"]["AnnotationScopeEnum"];
            /** @description Optional emoji shown in place of the default badge when this annotation is surfaced on a chart. */
            emoji?: string | null;
            /** @description When true, the annotation is hidden from the PostHog UI (charts and the annotations list) but still readable over the API and MCP. Use for high-frequency markers like deployments that would otherwise crowd the UI. Null (the default) means the annotation is shown. */
            hidden_in_user_interface?: boolean | null;
        };
        /**
         * @description * `dashboard_item` - insight
         *     * `dashboard` - dashboard
         *     * `project` - project
         *     * `organization` - organization
         *     * `recording` - recording
         * @enum {string}
         */
        AnnotationScopeEnum: "dashboard_item" | "dashboard" | "project" | "organization" | "recording";
        ArchiveExperiment: {
            /**
             * @description When the linked feature flag is still enabled, also disable and archive it along with the experiment. Has no effect if the flag is already disabled (it is archived either way).
             * @default false
             */
            disable_feature_flag: boolean;
        };
        /** @description Matches against a list of values (OR semantics for exact/is_not, set membership for in/not_in). */
        ArrayPropertyFilter: {
            /** @description Key of the property you're filtering on. For example `email` or `$current_url`. */
            key: string;
            /**
             * @description Property type (event, person, session, etc.).
             *
             *     * `event` - event
             *     * `event_metadata` - event_metadata
             *     * `feature` - feature
             *     * `person` - person
             *     * `person_metadata` - person_metadata
             *     * `cohort` - cohort
             *     * `element` - element
             *     * `static-cohort` - static-cohort
             *     * `dynamic-cohort` - dynamic-cohort
             *     * `precalculated-cohort` - precalculated-cohort
             *     * `group` - group
             *     * `recording` - recording
             *     * `log_entry` - log_entry
             *     * `behavioral` - behavioral
             *     * `session` - session
             *     * `hogql` - hogql
             *     * `data_warehouse` - data_warehouse
             *     * `data_warehouse_person_property` - data_warehouse_person_property
             *     * `error_tracking_issue` - error_tracking_issue
             *     * `log` - log
             *     * `log_attribute` - log_attribute
             *     * `log_resource_attribute` - log_resource_attribute
             *     * `metric_attribute` - metric_attribute
             *     * `span` - span
             *     * `span_attribute` - span_attribute
             *     * `span_resource_attribute` - span_resource_attribute
             *     * `revenue_analytics` - revenue_analytics
             *     * `account_custom_property` - account_custom_property
             *     * `flag` - flag
             *     * `workflow_variable` - workflow_variable
             * @default event
             */
            type: components["schemas"]["PropertyFilterTypeEnum"];
            /** @description List of values to match. For example `["test@example.com", "ok@example.com"]`. */
            value: string[];
            /**
             * @description Array comparison operator.
             *
             *     * `exact` - exact
             *     * `is_not` - is_not
             *     * `in` - in
             *     * `not_in` - not_in
             * @default exact
             */
            operator: components["schemas"]["ArrayPropertyFilterOperatorEnum"];
        };
        /**
         * @description * `exact` - exact
         *     * `is_not` - is_not
         *     * `in` - in
         *     * `not_in` - not_in
         * @enum {string}
         */
        ArrayPropertyFilterOperatorEnum: "exact" | "is_not" | "in" | "not_in";
        /**
         * @description * `first_touch` - First Touch
         *     * `last_touch` - Last Touch
         *     * `linear` - Linear
         *     * `time_decay` - Time Decay
         *     * `position_based` - Position Based
         * @enum {string}
         */
        AttributionModeEnum: "first_touch" | "last_touch" | "linear" | "time_decay" | "position_based";
        /**
         * @description * `ingest_first_event` - ingest_first_event
         *     * `set_up_reverse_proxy` - set_up_reverse_proxy
         *     * `create_first_insight` - create_first_insight
         *     * `create_first_dashboard` - create_first_dashboard
         *     * `track_custom_events` - track_custom_events
         *     * `define_actions` - define_actions
         *     * `set_up_cohorts` - set_up_cohorts
         *     * `explore_trends_insight` - explore_trends_insight
         *     * `create_funnel` - create_funnel
         *     * `explore_retention_insight` - explore_retention_insight
         *     * `explore_paths_insight` - explore_paths_insight
         *     * `explore_stickiness_insight` - explore_stickiness_insight
         *     * `explore_lifecycle_insight` - explore_lifecycle_insight
         *     * `add_authorized_domain` - add_authorized_domain
         *     * `set_up_web_vitals` - set_up_web_vitals
         *     * `review_web_analytics_dashboard` - review_web_analytics_dashboard
         *     * `filter_web_analytics` - filter_web_analytics
         *     * `set_up_web_analytics_conversion_goals` - set_up_web_analytics_conversion_goals
         *     * `visit_web_vitals_dashboard` - visit_web_vitals_dashboard
         *     * `setup_session_recordings` - setup_session_recordings
         *     * `watch_session_recording` - watch_session_recording
         *     * `configure_recording_settings` - configure_recording_settings
         *     * `create_recording_playlist` - create_recording_playlist
         *     * `enable_console_logs` - enable_console_logs
         *     * `create_feature_flag` - create_feature_flag
         *     * `implement_flag_in_code` - implement_flag_in_code
         *     * `update_feature_flag_release_conditions` - update_feature_flag_release_conditions
         *     * `create_multivariate_flag` - create_multivariate_flag
         *     * `set_up_flag_payloads` - set_up_flag_payloads
         *     * `set_up_flag_evaluation_runtimes` - set_up_flag_evaluation_runtimes
         *     * `create_experiment` - create_experiment
         *     * `implement_experiment_variants` - implement_experiment_variants
         *     * `launch_experiment` - launch_experiment
         *     * `review_experiment_results` - review_experiment_results
         *     * `create_survey` - create_survey
         *     * `launch_survey` - launch_survey
         *     * `collect_survey_responses` - collect_survey_responses
         *     * `connect_source` - connect_source
         *     * `run_first_query` - run_first_query
         *     * `join_external_data` - join_external_data
         *     * `create_saved_view` - create_saved_view
         *     * `enable_error_tracking` - enable_error_tracking
         *     * `upload_source_maps` - upload_source_maps
         *     * `view_first_error` - view_first_error
         *     * `resolve_first_error` - resolve_first_error
         *     * `ingest_first_llm_event` - ingest_first_llm_event
         *     * `view_first_trace` - view_first_trace
         *     * `track_costs` - track_costs
         *     * `set_up_llm_evaluation` - set_up_llm_evaluation
         *     * `run_ai_playground` - run_ai_playground
         *     * `enable_revenue_analytics_viewset` - enable_revenue_analytics_viewset
         *     * `connect_revenue_source` - connect_revenue_source
         *     * `set_up_revenue_goal` - set_up_revenue_goal
         *     * `enable_log_capture` - enable_log_capture
         *     * `view_first_logs` - view_first_logs
         *     * `create_first_workflow` - create_first_workflow
         *     * `set_up_first_workflow_channel` - set_up_first_workflow_channel
         *     * `configure_workflow_trigger` - configure_workflow_trigger
         *     * `add_workflow_action` - add_workflow_action
         *     * `launch_workflow` - launch_workflow
         *     * `create_first_endpoint` - create_first_endpoint
         *     * `configure_endpoint` - configure_endpoint
         *     * `test_endpoint` - test_endpoint
         *     * `create_early_access_feature` - create_early_access_feature
         *     * `update_feature_stage` - update_feature_stage
         *     * `use_posthog_ai` - use_posthog_ai
         *     * `use_posthog_code` - use_posthog_code
         *     * `use_posthog_mcp` - use_posthog_mcp
         *     * `use_posthog_in_slack` - use_posthog_in_slack
         * @enum {string}
         */
        AvailableSetupTaskIdsEnum: "ingest_first_event" | "set_up_reverse_proxy" | "create_first_insight" | "create_first_dashboard" | "track_custom_events" | "define_actions" | "set_up_cohorts" | "explore_trends_insight" | "create_funnel" | "explore_retention_insight" | "explore_paths_insight" | "explore_stickiness_insight" | "explore_lifecycle_insight" | "add_authorized_domain" | "set_up_web_vitals" | "review_web_analytics_dashboard" | "filter_web_analytics" | "set_up_web_analytics_conversion_goals" | "visit_web_vitals_dashboard" | "setup_session_recordings" | "watch_session_recording" | "configure_recording_settings" | "create_recording_playlist" | "enable_console_logs" | "create_feature_flag" | "implement_flag_in_code" | "update_feature_flag_release_conditions" | "create_multivariate_flag" | "set_up_flag_payloads" | "set_up_flag_evaluation_runtimes" | "create_experiment" | "implement_experiment_variants" | "launch_experiment" | "review_experiment_results" | "create_survey" | "launch_survey" | "collect_survey_responses" | "connect_source" | "run_first_query" | "join_external_data" | "create_saved_view" | "enable_error_tracking" | "upload_source_maps" | "view_first_error" | "resolve_first_error" | "ingest_first_llm_event" | "view_first_trace" | "track_costs" | "set_up_llm_evaluation" | "run_ai_playground" | "enable_revenue_analytics_viewset" | "connect_revenue_source" | "set_up_revenue_goal" | "enable_log_capture" | "view_first_logs" | "create_first_workflow" | "set_up_first_workflow_channel" | "configure_workflow_trigger" | "add_workflow_action" | "launch_workflow" | "create_first_endpoint" | "configure_endpoint" | "test_endpoint" | "create_early_access_feature" | "update_feature_stage" | "use_posthog_ai" | "use_posthog_code" | "use_posthog_mcp" | "use_posthog_in_slack";
        /**
         * @description * `AED` - AED
         *     * `AFN` - AFN
         *     * `ALL` - ALL
         *     * `AMD` - AMD
         *     * `ANG` - ANG
         *     * `AOA` - AOA
         *     * `ARS` - ARS
         *     * `AUD` - AUD
         *     * `AWG` - AWG
         *     * `AZN` - AZN
         *     * `BAM` - BAM
         *     * `BBD` - BBD
         *     * `BDT` - BDT
         *     * `BGN` - BGN
         *     * `BHD` - BHD
         *     * `BIF` - BIF
         *     * `BMD` - BMD
         *     * `BND` - BND
         *     * `BOB` - BOB
         *     * `BRL` - BRL
         *     * `BSD` - BSD
         *     * `BTC` - BTC
         *     * `BTN` - BTN
         *     * `BWP` - BWP
         *     * `BYN` - BYN
         *     * `BZD` - BZD
         *     * `CAD` - CAD
         *     * `CDF` - CDF
         *     * `CHF` - CHF
         *     * `CLP` - CLP
         *     * `CNY` - CNY
         *     * `COP` - COP
         *     * `CRC` - CRC
         *     * `CVE` - CVE
         *     * `CZK` - CZK
         *     * `DJF` - DJF
         *     * `DKK` - DKK
         *     * `DOP` - DOP
         *     * `DZD` - DZD
         *     * `EGP` - EGP
         *     * `ERN` - ERN
         *     * `ETB` - ETB
         *     * `EUR` - EUR
         *     * `FJD` - FJD
         *     * `GBP` - GBP
         *     * `GEL` - GEL
         *     * `GHS` - GHS
         *     * `GIP` - GIP
         *     * `GMD` - GMD
         *     * `GNF` - GNF
         *     * `GTQ` - GTQ
         *     * `GYD` - GYD
         *     * `HKD` - HKD
         *     * `HNL` - HNL
         *     * `HRK` - HRK
         *     * `HTG` - HTG
         *     * `HUF` - HUF
         *     * `IDR` - IDR
         *     * `ILS` - ILS
         *     * `INR` - INR
         *     * `IQD` - IQD
         *     * `IRR` - IRR
         *     * `ISK` - ISK
         *     * `JMD` - JMD
         *     * `JOD` - JOD
         *     * `JPY` - JPY
         *     * `KES` - KES
         *     * `KGS` - KGS
         *     * `KHR` - KHR
         *     * `KMF` - KMF
         *     * `KRW` - KRW
         *     * `KWD` - KWD
         *     * `KYD` - KYD
         *     * `KZT` - KZT
         *     * `LAK` - LAK
         *     * `LBP` - LBP
         *     * `LKR` - LKR
         *     * `LRD` - LRD
         *     * `LTL` - LTL
         *     * `LVL` - LVL
         *     * `LSL` - LSL
         *     * `LYD` - LYD
         *     * `MAD` - MAD
         *     * `MDL` - MDL
         *     * `MGA` - MGA
         *     * `MKD` - MKD
         *     * `MMK` - MMK
         *     * `MNT` - MNT
         *     * `MOP` - MOP
         *     * `MRU` - MRU
         *     * `MTL` - MTL
         *     * `MUR` - MUR
         *     * `MVR` - MVR
         *     * `MWK` - MWK
         *     * `MXN` - MXN
         *     * `MYR` - MYR
         *     * `MZN` - MZN
         *     * `NAD` - NAD
         *     * `NGN` - NGN
         *     * `NIO` - NIO
         *     * `NOK` - NOK
         *     * `NPR` - NPR
         *     * `NZD` - NZD
         *     * `OMR` - OMR
         *     * `PAB` - PAB
         *     * `PEN` - PEN
         *     * `PGK` - PGK
         *     * `PHP` - PHP
         *     * `PKR` - PKR
         *     * `PLN` - PLN
         *     * `PYG` - PYG
         *     * `QAR` - QAR
         *     * `RON` - RON
         *     * `RSD` - RSD
         *     * `RUB` - RUB
         *     * `RWF` - RWF
         *     * `SAR` - SAR
         *     * `SBD` - SBD
         *     * `SCR` - SCR
         *     * `SDG` - SDG
         *     * `SEK` - SEK
         *     * `SGD` - SGD
         *     * `SRD` - SRD
         *     * `SSP` - SSP
         *     * `STN` - STN
         *     * `SYP` - SYP
         *     * `SZL` - SZL
         *     * `THB` - THB
         *     * `TJS` - TJS
         *     * `TMT` - TMT
         *     * `TND` - TND
         *     * `TOP` - TOP
         *     * `TRY` - TRY
         *     * `TTD` - TTD
         *     * `TWD` - TWD
         *     * `TZS` - TZS
         *     * `UAH` - UAH
         *     * `UGX` - UGX
         *     * `USD` - USD
         *     * `UYU` - UYU
         *     * `UZS` - UZS
         *     * `VES` - VES
         *     * `VND` - VND
         *     * `VUV` - VUV
         *     * `WST` - WST
         *     * `XAF` - XAF
         *     * `XCD` - XCD
         *     * `XOF` - XOF
         *     * `XPF` - XPF
         *     * `YER` - YER
         *     * `ZAR` - ZAR
         *     * `ZMW` - ZMW
         * @enum {string}
         */
        BaseCurrencyEnum: "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLP" | "CNY" | "COP" | "CRC" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LTL" | "LVL" | "LSL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRU" | "MTL" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SRD" | "SSP" | "STN" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "UYU" | "UZS" | "VES" | "VND" | "VUV" | "WST" | "XAF" | "XCD" | "XOF" | "XPF" | "YER" | "ZAR" | "ZMW";
        /**
         * BaseMathType
         * @enum {string}
         */
        BaseMathType: "total" | "dau" | "weekly_active" | "monthly_active" | "unique_session" | "first_time_for_user" | "first_matching_event_for_user";
        /** BehavioralFilter */
        BehavioralFilter: {
            /**
             * Bytecode
             * @default null
             */
            bytecode: unknown[] | null;
            /**
             * Bytecode Error
             * @default null
             */
            bytecode_error: string | null;
            /**
             * Conditionhash
             * @default null
             */
            conditionHash: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "behavioral";
            /** Key */
            key: string | number;
            /** Value */
            value: string;
            /** Event Type */
            event_type: string;
            /**
             * Time Value
             * @default null
             */
            time_value: number | null;
            /**
             * Time Interval
             * @default null
             */
            time_interval: string | null;
            /**
             * Negation
             * @default false
             */
            negation: boolean;
            /**
             * Operator
             * @default null
             */
            operator: string | null;
            /**
             * Operator Value
             * @default null
             */
            operator_value: number | null;
            /**
             * Seq Time Interval
             * @default null
             */
            seq_time_interval: string | null;
            /**
             * Seq Time Value
             * @default null
             */
            seq_time_value: number | null;
            /**
             * Seq Event
             * @default null
             */
            seq_event: string | number | null;
            /**
             * Seq Event Type
             * @default null
             */
            seq_event_type: string | null;
            /**
             * Total Periods
             * @default null
             */
            total_periods: number | null;
            /**
             * Min Periods
             * @default null
             */
            min_periods: number | null;
            /**
             * Event Filters
             * @default null
             */
            event_filters: (components["schemas"]["EventPropFilter"] | components["schemas"]["HogQLFilter"])[] | null;
            /**
             * Explicit Datetime
             * @default null
             */
            explicit_datetime: string | null;
            /**
             * Explicit Datetime To
             * @default null
             */
            explicit_datetime_to: string | null;
        };
        /** @enum {unknown} */
        BlankEnum: "";
        /**
         * BounceRatePageViewMode
         * @enum {string}
         */
        BounceRatePageViewMode: "count_pageviews" | "uniq_urls" | "uniq_page_screen_autocaptures";
        /** BoxPlotDatum */
        BoxPlotDatum: {
            /** Day */
            day: string;
            /** Label */
            label: string;
            /** Max */
            max: number;
            /** Mean */
            mean: number;
            /** Median */
            median: number;
            /** Min */
            min: number;
            /** P25 */
            p25: number;
            /** P75 */
            p75: number;
            /**
             * Series Index
             * @default null
             */
            series_index: number | null;
            /**
             * Series Label
             * @default null
             */
            series_label: string | null;
        };
        /** Breakdown */
        Breakdown: {
            /**
             * Group Type Index
             * @default null
             */
            group_type_index: number | null;
            /**
             * Histogram Bin Count
             * @default null
             */
            histogram_bin_count: number | null;
            /**
             * Normalize Url
             * @default null
             */
            normalize_url: boolean | null;
            /** Property */
            property: string | number;
            /** @default null */
            type: components["schemas"]["MultipleBreakdownType"] | null;
        };
        /**
         * BreakdownAttributionType
         * @enum {string}
         */
        BreakdownAttributionType: "first_touch" | "last_touch" | "all_events" | "step";
        /** BreakdownFilter */
        BreakdownFilter: {
            /**
             * Breakdown
             * @default null
             */
            breakdown: string | (string | number)[] | number | null;
            /**
             * Breakdown Group Type Index
             * @default null
             */
            breakdown_group_type_index: number | null;
            /**
             * Breakdown Hide Other Aggregation
             * @default null
             */
            breakdown_hide_other_aggregation: boolean | null;
            /**
             * Breakdown Histogram Bin Count
             * @default null
             */
            breakdown_histogram_bin_count: number | null;
            /**
             * Breakdown Limit
             * @default null
             */
            breakdown_limit: number | null;
            /**
             * Breakdown Normalize Url
             * @default null
             */
            breakdown_normalize_url: boolean | null;
            /**
             * Breakdown Path Cleaning
             * @default null
             */
            breakdown_path_cleaning: boolean | null;
            /** @default event */
            breakdown_type: components["schemas"]["BreakdownType"] | null;
            /**
             * Breakdowns
             * @default null
             */
            breakdowns: components["schemas"]["Breakdown"][] | null;
        };
        /**
         * BreakdownType
         * @enum {string}
         */
        BreakdownType: "cohort" | "person" | "event" | "event_metadata" | "group" | "session" | "hogql" | "data_warehouse" | "data_warehouse_person_property" | "revenue_analytics";
        /**
         * @description * `distinct_id` - User ID (default)
         *     * `device_id` - Device ID
         * @enum {string}
         */
        BucketingIdentifierEnum: "distinct_id" | "device_id";
        /**
         * @description * `b2b` - B2B
         *     * `b2c` - B2C
         *     * `other` - Other
         * @enum {string}
         */
        BusinessModelEnum: "b2b" | "b2c" | "other";
        /** CalendarHeatmapFilter */
        CalendarHeatmapFilter: {
            /**
             * Bucketbysessionstart
             * @description When true and the series math is `dau`/`unique_users`, each user contributes to the (day-of-week, hour) bucket of their session's first event only — matching the web overview session-start attribution. When false (default), the user contributes to every bucket they have any event in. No effect on `total` math (event counts are unchanged either way).
             * @default false
             */
            bucketBySessionStart: boolean | null;
        };
        /**
         * CalendarHeatmapMathType
         * @enum {string}
         */
        CalendarHeatmapMathType: "total" | "dau";
        /** ChartAxis */
        ChartAxis: {
            /** Column */
            column: string;
            /** @default null */
            settings: components["schemas"]["Settings"] | null;
        };
        /**
         * ChartDisplayType
         * @enum {string}
         */
        ChartDisplayType: "Auto" | "ActionsLineGraph" | "ActionsBar" | "ActionsUnstackedBar" | "ActionsStackedBar" | "ActionsAreaGraph" | "ActionsLineGraphCumulative" | "BoldNumber" | "Metric" | "ActionsPie" | "ActionsBarValue" | "ActionsTable" | "WorldMap" | "CalendarHeatmap" | "TwoDimensionalHeatmap" | "BoxPlot" | "SlopeGraph";
        /** ChartSettings */
        ChartSettings: {
            /**
             * Goallines
             * @default null
             */
            goalLines: components["schemas"]["GoalLine"][] | null;
            /** @default null */
            heatmap: components["schemas"]["HeatmapSettings"] | null;
            /** @default null */
            leftYAxisSettings: components["schemas"]["YAxisSettings"] | null;
            /** @default null */
            pie: components["schemas"]["PieChartSettings"] | null;
            /**
             * Resultcustomizations
             * @description Per-breakdown-value color customizations. Keyed by the raw breakdown column value.
             * @default null
             */
            resultCustomizations: {
                [key: string]: components["schemas"]["ResultCustomizationByValue"];
            } | null;
            /** @default null */
            rightYAxisSettings: components["schemas"]["YAxisSettings"] | null;
            /**
             * Seriesbreakdowncolumn
             * @default null
             */
            seriesBreakdownColumn: string | null;
            /**
             * Showlegend
             * @default null
             */
            showLegend: boolean | null;
            /**
             * Shownullsaszero
             * @default null
             */
            showNullsAsZero: boolean | null;
            /**
             * Showpietotal
             * @default null
             */
            showPieTotal: boolean | null;
            /**
             * Showtotalrow
             * @default null
             */
            showTotalRow: boolean | null;
            /**
             * Showvaluesonseries
             * @default null
             */
            showValuesOnSeries: boolean | null;
            /**
             * Showxaxisborder
             * @default null
             */
            showXAxisBorder: boolean | null;
            /**
             * Showxaxisticks
             * @default null
             */
            showXAxisTicks: boolean | null;
            /**
             * Showyaxisborder
             * @default null
             */
            showYAxisBorder: boolean | null;
            /**
             * Stackbars100
             * @description Whether we fill the bars to 100% in stacked mode
             * @default null
             */
            stackBars100: boolean | null;
            /** @default null */
            xAxis: components["schemas"]["ChartAxis"] | null;
            /**
             * Xaxislabel
             * @default null
             */
            xAxisLabel: string | null;
            /**
             * Yaxis
             * @default null
             */
            yAxis: components["schemas"]["ChartAxis"][] | null;
            /**
             * Yaxisatzero
             * @description Deprecated: use `[left|right]YAxisSettings`. Whether the Y axis should start at zero
             * @default null
             */
            yAxisAtZero: boolean | null;
        };
        /** ChartSettingsDisplay */
        ChartSettingsDisplay: {
            /**
             * Color
             * @default null
             */
            color: string | null;
            /** @default null */
            displayType: components["schemas"]["DisplayType"] | null;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Trendline
             * @default null
             */
            trendLine: boolean | null;
            /** @default null */
            yAxisPosition: components["schemas"]["YAxisPosition"] | null;
        };
        /** ChartSettingsFormatting */
        ChartSettingsFormatting: {
            /**
             * Decimalplaces
             * @default null
             */
            decimalPlaces: number | null;
            /**
             * Prefix
             * @default null
             */
            prefix: string | null;
            /** @default null */
            style: components["schemas"]["Style"] | null;
            /**
             * Suffix
             * @default null
             */
            suffix: string | null;
        };
        /** ChartStyle */
        ChartStyle: {
            /**
             * @description Line interpolation: straight segments or a smoothed curve through the points.
             * @default null
             */
            curve: components["schemas"]["Curve"] | null;
        };
        /** ClickhouseQueryProgress */
        ClickhouseQueryProgress: {
            /** Active Cpu Time */
            active_cpu_time: number;
            /** Bytes Read */
            bytes_read: number;
            /** Estimated Rows Total */
            estimated_rows_total: number;
            /** Rows Read */
            rows_read: number;
            /** Time Elapsed */
            time_elapsed: number;
        };
        Cohort: {
            readonly id: number;
            name?: string | null;
            description?: string;
            deleted?: boolean;
            filters?: components["schemas"]["CohortFilters"] | null;
            readonly version: number | null;
            readonly pending_version: number | null;
            readonly is_calculating: boolean;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string | null;
            /** Format: date-time */
            readonly last_calculation: string | null;
            /** Format: date-time */
            readonly last_backfill_person_properties_at: string | null;
            readonly errors_calculating: number;
            readonly last_error_message: string | null;
            readonly count: number | null;
            is_static?: boolean;
            /**
             * @description Type of cohort based on filter complexity
             *
             *     * `static` - static
             *     * `person_property` - person_property
             *     * `behavioral` - behavioral
             *     * `realtime` - realtime
             *     * `analytical` - analytical
             */
            cohort_type?: components["schemas"]["CohortTypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            /** @description Flags describing which kinds of conditions the cohort's filters contain. Null when the cohort has no filters to classify. */
            readonly condition_type: components["schemas"]["CohortConditionTypeFlags"] | null;
            readonly experiment_set: number[];
            /** @description How this row matched the `search` query parameter: `exact` (the term is a case-insensitive substring of a searched field) or `similar` (a fuzzy trigram match, returned only when no exact match exists). Null when the list is not filtered by `search`. */
            readonly search_match_type: components["schemas"]["SearchMatchTypeEnum"] | components["schemas"]["NullEnum"];
            /** create in folder */
            _create_in_folder?: string;
            /**
             * create static person ids
             * @default []
             */
            _create_static_person_ids: string[];
        };
        /** CohortConditionTypeFlags */
        CohortConditionTypeFlags: {
            /**
             * Person Properties
             * @description The filters include a person property or person_metadata condition.
             */
            person_properties: boolean;
            /**
             * Behavioral
             * @description The filters include a behavioral condition that is not lifecycle-style (e.g. performed_event, performed_event_multiple, performed_event_sequence, or their negations).
             */
            behavioral: boolean;
            /**
             * Lifecycle
             * @description The filters include a lifecycle-style behavioral condition (first-seen/regularly/stopped/restarted performing an event).
             */
            lifecycle: boolean;
            /**
             * Cohorts
             * @description The filters include a nested reference to another cohort.
             */
            cohorts: boolean;
        };
        /** CohortFilter */
        CohortFilter: {
            /**
             * Bytecode
             * @default null
             */
            bytecode: unknown[] | null;
            /**
             * Bytecode Error
             * @default null
             */
            bytecode_error: string | null;
            /**
             * Conditionhash
             * @default null
             */
            conditionHash: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "cohort";
            /**
             * Key
             * @constant
             */
            key: "id";
            /** Value */
            value: number;
            /**
             * Negation
             * @default false
             */
            negation: boolean;
        };
        /**
         * CohortFilterGroup
         * @description AND/OR group containing cohort filters. Named to avoid collision with analytics Group model.
         */
        CohortFilterGroup: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "AND" | "OR";
            /** Values */
            values: (components["schemas"]["BehavioralFilter"] | components["schemas"]["CohortFilter"] | components["schemas"]["PersonFilter"] | components["schemas"]["PersonMetadataFilter"] | components["schemas"]["CohortFilterGroup"])[];
        };
        /** CohortFilters */
        CohortFilters: {
            properties: components["schemas"]["CohortFilterGroup"];
        };
        /** CohortPropertyFilter */
        CohortPropertyFilter: {
            /**
             * Cohort Name
             * @default null
             */
            cohort_name: string | null;
            /**
             * Key
             * @default id
             * @constant
             */
            key: "id";
            /**
             * Label
             * @default null
             */
            label: string | null;
            /** @default in */
            operator: components["schemas"]["PropertyOperator"] | null;
            /**
             * Type
             * @default cohort
             * @constant
             */
            type: "cohort";
            /** Value */
            value: number;
        };
        /**
         * @description * `static` - static
         *     * `person_property` - person_property
         *     * `behavioral` - behavioral
         *     * `realtime` - realtime
         *     * `analytical` - analytical
         * @enum {string}
         */
        CohortTypeEnum: "static" | "person_property" | "behavioral" | "realtime" | "analytical";
        /**
         * ColorMode
         * @enum {string}
         */
        ColorMode: "light" | "dark";
        /**
         * Compare
         * @enum {string}
         */
        Compare: "current" | "previous";
        /** CompareFilter */
        CompareFilter: {
            /**
             * Compare
             * @description Whether to compare the current date range to a previous date range.
             * @default false
             */
            compare: boolean | null;
            /**
             * Compare To
             * @description The date range to compare to. The value is a relative date. Examples of relative dates are: `-1y` for 1 year ago, `-14m` for 14 months ago, `-100w` for 100 weeks ago, `-14d` for 14 days ago, `-30h` for 30 hours ago.
             * @default null
             */
            compare_to: string | null;
        };
        /**
         * @description * `won` - won
         *     * `lost` - lost
         *     * `inconclusive` - inconclusive
         *     * `stopped_early` - stopped_early
         *     * `invalid` - invalid
         * @enum {string}
         */
        ConclusionEnum: "won" | "lost" | "inconclusive" | "stopped_early" | "invalid";
        /** ConditionalFormattingRule */
        ConditionalFormattingRule: {
            /** Bytecode */
            bytecode: unknown[];
            /** Color */
            color: string;
            /** @default null */
            colorMode: components["schemas"]["ColorMode"] | null;
            /** Columnname */
            columnName: string;
            /** Id */
            id: string;
            /** Input */
            input: string;
            /** Templateid */
            templateId: string;
        };
        /** ConversionGoalFilter1 */
        ConversionGoalFilter1: {
            /** Conversion Goal Id */
            conversion_goal_id: string;
            /** Conversion Goal Name */
            conversion_goal_name: string;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Event
             * @description The event or `null` for all events.
             * @default null
             */
            event: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default EventsNode
             * @constant
             */
            kind: "EventsNode";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Schema Map */
            schema_map: {
                [key: string]: string | never;
            };
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ConversionGoalFilter2 */
        ConversionGoalFilter2: {
            /** Conversion Goal Id */
            conversion_goal_id: string;
            /** Conversion Goal Name */
            conversion_goal_name: string;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: number;
            /**
             * Kind
             * @default ActionsNode
             * @constant
             */
            kind: "ActionsNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Schema Map */
            schema_map: {
                [key: string]: string | never;
            };
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ConversionGoalFilter3 */
        ConversionGoalFilter3: {
            /** Conversion Goal Id */
            conversion_goal_id: string;
            /** Conversion Goal Name */
            conversion_goal_name: string;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /** Distinct Id Field */
            distinct_id_field: string;
            /**
             * Dw Source Type
             * @default null
             */
            dw_source_type: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /** Id Field */
            id_field: string;
            /**
             * Kind
             * @default DataWarehouseNode
             * @constant
             */
            kind: "DataWarehouseNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Schema Map */
            schema_map: {
                [key: string]: string | never;
            };
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * ConversionRateInputType
         * @enum {string}
         */
        ConversionRateInputType: "manual" | "automatic";
        /**
         * @description * `0` - Disabled
         *     * `1` - Stateless
         *     * `2` - Stateful
         * @enum {integer}
         */
        CookielessServerHashModeEnum: 0 | 1 | 2;
        /**
         * CorrelationType
         * @enum {string}
         */
        CorrelationType: "success" | "failure";
        /**
         * CountPerActorMathType
         * @enum {string}
         */
        CountPerActorMathType: "avg_count_per_actor" | "min_count_per_actor" | "max_count_per_actor" | "median_count_per_actor" | "p75_count_per_actor" | "p90_count_per_actor" | "p95_count_per_actor" | "p99_count_per_actor";
        /**
         * @description * `default` - Default
         *     * `template` - Template
         *     * `duplicate` - Duplicate
         *     * `unlisted` - Unlisted (product-embedded)
         * @enum {string}
         */
        CreationModeEnum: "default" | "template" | "duplicate" | "unlisted";
        /**
         * @description * `USR` - user
         *     * `GIT` - GitHub
         * @enum {string}
         */
        CreationTypeEnum: "USR" | "GIT";
        /**
         * CurrencyCode
         * @enum {string}
         */
        CurrencyCode: "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLP" | "CNY" | "COP" | "CRC" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LTL" | "LVL" | "LSL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRU" | "MTL" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SRD" | "SSP" | "STN" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "UYU" | "UZS" | "VES" | "VND" | "VUV" | "WST" | "XAF" | "XCD" | "XOF" | "XPF" | "YER" | "ZAR" | "ZMW";
        /**
         * Curve
         * @enum {string}
         */
        Curve: "linear" | "smooth";
        /** CustomChannelCondition */
        CustomChannelCondition: {
            /** Id */
            id: string;
            key: components["schemas"]["CustomChannelField"];
            op: components["schemas"]["CustomChannelOperator"];
            /**
             * Value
             * @default null
             */
            value: string | string[] | null;
        };
        /**
         * CustomChannelField
         * @enum {string}
         */
        CustomChannelField: "utm_source" | "utm_medium" | "utm_campaign" | "referring_domain" | "url" | "pathname" | "hostname";
        /**
         * CustomChannelOperator
         * @enum {string}
         */
        CustomChannelOperator: "exact" | "is_not" | "is_set" | "is_not_set" | "icontains" | "not_icontains" | "regex" | "not_regex";
        /** CustomChannelRule */
        CustomChannelRule: {
            /** Channel Type */
            channel_type: string;
            combiner: components["schemas"]["FilterLogicalOperator"];
            /** Id */
            id: string;
            /** Items */
            items: components["schemas"]["CustomChannelCondition"][];
        };
        /** CustomEventConversionGoal */
        CustomEventConversionGoal: {
            /** Customeventname */
            customEventName: string;
        };
        /** @description Serializer mixin that handles tags for objects. */
        Dashboard: {
            readonly id: number;
            name?: string | null;
            description?: string;
            pinned?: boolean;
            /** Format: date-time */
            readonly created_at: string;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            last_accessed_at?: string | null;
            /** Format: date-time */
            readonly last_viewed_at: string | null;
            /** @description Path of the project-tree folder this dashboard is filed under in the file system, e.g. 'Unfiled/Dashboards'. An empty string means the project root; null means the dashboard has no file system entry. The dashboard's own name is not part of the path. */
            readonly folder: string | null;
            readonly is_shared: boolean;
            deleted?: boolean;
            readonly creation_mode: components["schemas"]["CreationModeEnum"];
            readonly filters: {
                [key: string]: unknown;
            };
            readonly variables: {
                [key: string]: unknown;
            } | null;
            /** @description Custom color mapping for breakdown values. */
            breakdown_colors?: unknown;
            /** @description ID of the color theme used for chart visualizations. */
            data_color_theme_id?: number | null;
            tags?: unknown[];
            restriction_level?: components["schemas"]["RestrictionLevelEnum"];
            readonly effective_restriction_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            readonly effective_privilege_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
            readonly access_control_version: string;
            /** Format: date-time */
            last_refresh?: string | null;
            readonly persisted_filters: {
                [key: string]: unknown;
            } | null;
            readonly persisted_variables: {
                [key: string]: unknown;
            } | null;
            readonly team_id: number;
            /** @description List of quick filter IDs associated with this dashboard */
            quick_filter_ids?: string[] | null;
            readonly tiles: {
                [key: string]: unknown;
            }[] | null;
            /** @description Template key to create the dashboard from a predefined template. */
            use_template?: string;
            /** @description ID of an existing dashboard to duplicate. */
            use_dashboard?: number | null;
            /**
             * @description When deleting, also delete insights that are only on this dashboard.
             * @default false
             */
            delete_insights: boolean;
            /** create in folder */
            _create_in_folder?: string;
        };
        /** @description Serializer mixin that handles tags for objects. */
        DashboardBasic: {
            readonly id: number;
            /** @description Name of the dashboard. */
            readonly name: string | null;
            /** @description Description of the dashboard. */
            readonly description: string;
            /** @description Whether the dashboard is pinned to the top of the list. */
            readonly pinned: boolean;
            /** Format: date-time */
            readonly created_at: string;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly last_accessed_at: string | null;
            /** Format: date-time */
            readonly last_viewed_at: string | null;
            /** @description Path of the project-tree folder this dashboard is filed under in the file system, e.g. 'Unfiled/Dashboards'. An empty string means the project root; null means the dashboard has no file system entry. The dashboard's own name is not part of the path. */
            readonly folder: string | null;
            readonly is_shared: boolean;
            readonly deleted: boolean;
            readonly creation_mode: components["schemas"]["CreationModeEnum"];
            tags?: unknown[];
            /**
             * @description Controls who can edit the dashboard.
             *
             *     * `21` - Everyone in the project can edit
             *     * `37` - Only those invited to this dashboard can edit
             */
            readonly restriction_level: components["schemas"]["RestrictionLevelEnum"];
            readonly effective_restriction_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            readonly effective_privilege_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
            readonly access_control_version: string;
            /** Format: date-time */
            readonly last_refresh: string | null;
            readonly team_id: number;
            /** @description How this row matched the `search` query parameter: `exact` (the term is a case-insensitive substring of a searched field) or `similar` (a fuzzy trigram match, returned only when no exact match exists). Null when the list is not filtered by `search`. */
            readonly search_match_type: components["schemas"]["SearchMatchTypeEnum"] | components["schemas"]["NullEnum"];
        };
        /** DashboardFilter */
        DashboardFilter: {
            /** @default null */
            breakdown_filter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Date From
             * @default null
             */
            date_from: string | null;
            /**
             * Date To
             * @default null
             */
            date_to: string | null;
            /**
             * Explicitdate
             * @default null
             */
            explicitDate: boolean | null;
            /**
             * Filtertestaccounts
             * @description Tri-state test-account override. Null/absent = inherit; true = force on; false = force off.
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Time granularity forced onto every insight that supports one. Absent/null = inherit.
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * Properties
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
        };
        /**
         * @description OpenAPI-only shape for a dashboard's filters object (agents/MCP).
         *
         *     Documents the dashboard-level filters that act as the single source of truth for the
         *     dashboard's tiles. Runtime persistence reads the raw ``filters`` dict from the request body, so
         *     extra keys are accepted, but these are the ones agents should set.
         */
        DashboardFiltersOpenApi: {
            /** @description Dashboard-level start of the date range, e.g. '-30d', '-7d', or an ISO date. Applies to all tiles. */
            date_from?: string | null;
            /** @description Dashboard-level end of the date range, e.g. '-1d' or an ISO date. Null/omitted means up to now. */
            date_to?: string | null;
            /** @description Dashboard-level property filters applied to every tile (PostHog property filter group). */
            properties?: unknown;
        };
        DashboardPatchTileOpenApi: {
            /** @description Dashboard tile ID to update. */
            id?: number;
            /** @description Nested widget row updates. */
            widget?: components["schemas"]["DashboardPatchWidgetOpenApi"];
        };
        DashboardPatchWidgetOpenApi: {
            /**
             * Format: uuid
             * @description Existing widget row ID when updating a widget tile via dashboard PATCH.
             */
            id?: string;
            /**
             * @description Widget type identifier (cannot be changed on update).
             *
             *     * `activity_events_list` - activity_events_list
             *     * `error_tracking_list` - error_tracking_list
             *     * `experiment_results` - experiment_results
             *     * `experiments_list` - experiments_list
             *     * `logs_list` - logs_list
             *     * `session_replay_list` - session_replay_list
             *     * `survey_results` - survey_results
             */
            widget_type?: components["schemas"]["DashboardPatchWidgetOpenApiWidgetTypeEnum"];
            /** @description Widget-specific configuration. Shape depends on the tile's widget_type. */
            config?: components["schemas"]["DashboardWidgetConfig"];
            /** @description Optional custom display name for the widget tile. */
            name?: string | null;
            /** @description Optional markdown description shown when show_description is enabled. */
            description?: string;
        };
        /**
         * @description * `activity_events_list` - activity_events_list
         *     * `error_tracking_list` - error_tracking_list
         *     * `experiment_results` - experiment_results
         *     * `experiments_list` - experiments_list
         *     * `logs_list` - logs_list
         *     * `session_replay_list` - session_replay_list
         *     * `survey_results` - survey_results
         * @enum {string}
         */
        DashboardPatchWidgetOpenApiWidgetTypeEnum: "activity_events_list" | "error_tracking_list" | "experiment_results" | "experiments_list" | "logs_list" | "session_replay_list" | "survey_results";
        DashboardTileBasic: {
            readonly id: number;
            readonly dashboard_id: number;
            deleted?: boolean | null;
        };
        DashboardWidgetConfig: components["schemas"]["ActivityEventsListWidgetConfig"] | components["schemas"]["ErrorTrackingListWidgetConfig"] | components["schemas"]["SessionReplayListWidgetConfig"] | components["schemas"]["ExperimentsListWidgetConfig"] | components["schemas"]["ExperimentResultsWidgetConfig"] | components["schemas"]["SurveyResultsWidgetConfig"] | components["schemas"]["LogsListWidgetConfig"];
        /**
         * DataColorToken
         * @enum {string}
         */
        DataColorToken: "preset-1" | "preset-2" | "preset-3" | "preset-4" | "preset-5" | "preset-6" | "preset-7" | "preset-8" | "preset-9" | "preset-10" | "preset-11" | "preset-12" | "preset-13" | "preset-14" | "preset-15";
        /** DataTableNode */
        DataTableNode: {
            /**
             * Allowsorting
             * @description Can the user click on column headers to sort the table? (default: true)
             * @default null
             */
            allowSorting: boolean | null;
            /**
             * Columns
             * @description Columns shown in the table, unless the `source` provides them.
             * @default null
             */
            columns: string[] | null;
            /**
             * @description Context for the table, used by components like ColumnConfigurator
             * @default null
             */
            context: components["schemas"]["DataTableNodeViewPropsContext"] | null;
            /**
             * Contextkey
             * @description Context key for universal column configuration (e.g., "survey:123")
             * @default null
             */
            contextKey: string | null;
            /**
             * Defaultcolumns
             * @description Default columns to use when resetting column configuration
             * @default null
             */
            defaultColumns: string[] | null;
            /**
             * Embedded
             * @description Uses the embedded version of LemonTable
             * @default null
             */
            embedded: boolean | null;
            /**
             * Expandable
             * @description Can expand row to show raw event data (default: true)
             * @default null
             */
            expandable: boolean | null;
            /**
             * Full
             * @description Show with most visual options enabled. Used in scenes.
             * @default null
             */
            full: boolean | null;
            /**
             * Hiddencolumns
             * @description Columns that aren't shown in the table, even if in columns or returned data
             * @default null
             */
            hiddenColumns: string[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "DataTableNode";
            /**
             * Pinnedcolumns
             * @description Columns that are sticky when scrolling horizontally
             * @default null
             */
            pinnedColumns: string[] | null;
            /**
             * Propertiesviaurl
             * @description Link properties via the URL (default: false)
             * @default null
             */
            propertiesViaUrl: boolean | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | components["schemas"]["Response"] | components["schemas"]["Response1"] | components["schemas"]["Response2"] | components["schemas"]["Response3"] | components["schemas"]["Response4"] | components["schemas"]["Response5"] | components["schemas"]["Response6"] | components["schemas"]["Response7"] | components["schemas"]["Response8"] | components["schemas"]["Response9"] | components["schemas"]["Response10"] | components["schemas"]["Response11"] | components["schemas"]["Response12"] | components["schemas"]["Response13"] | components["schemas"]["Response14"] | components["schemas"]["Response15"] | components["schemas"]["Response16"] | components["schemas"]["Response18"] | components["schemas"]["Response19"] | components["schemas"]["Response20"] | components["schemas"]["Response21"] | components["schemas"]["Response22"] | components["schemas"]["Response23"] | components["schemas"]["Response24"] | components["schemas"]["Response25"] | components["schemas"]["Response27"] | components["schemas"]["Response28"] | null;
            /**
             * Showabsolutetime
             * @description Render date-time columns (timestamp, created_at, last_seen, last_seen_at, session_start, session_end) as absolute date+time instead of relative ("X ago"). The toggle is exposed in the column header menu only on EventsQuery / ActorsQuery sources.
             * @default null
             */
            showAbsoluteTime: boolean | null;
            /**
             * Showactions
             * @description Show the kebab menu at the end of the row
             * @default null
             */
            showActions: boolean | null;
            /**
             * Showcolumnconfigurator
             * @description Show a button to configure the table's columns if possible
             * @default null
             */
            showColumnConfigurator: boolean | null;
            /**
             * Showcount
             * @description Show count of total and filtered results
             * @default null
             */
            showCount: boolean | null;
            /**
             * Showdaterange
             * @description Show date range selector
             * @default null
             */
            showDateRange: boolean | null;
            /**
             * Showelapsedtime
             * @description Show the time it takes to run a query
             * @default null
             */
            showElapsedTime: boolean | null;
            /**
             * Showeventfilter
             * @description Include an event filter above the table (EventsNode only)
             * @default null
             */
            showEventFilter: boolean | null;
            /**
             * Showeventsfilter
             * @description Include an events filter above the table to filter by multiple events (EventsQuery only)
             * @default null
             */
            showEventsFilter: boolean | null;
            /**
             * Showexport
             * @description Show the export button
             * @default null
             */
            showExport: boolean | null;
            /**
             * Showhogqleditor
             * @description Include a HogQL query editor above HogQL tables
             * @default null
             */
            showHogQLEditor: boolean | null;
            /**
             * Showopeneditorbutton
             * @description Show a button to open the current query as a new insight. (default: true)
             * @default null
             */
            showOpenEditorButton: boolean | null;
            /**
             * Showpersistentcolumnconfigurator
             * @description Show a button to configure and persist the table's default columns if possible
             * @default null
             */
            showPersistentColumnConfigurator: boolean | null;
            /**
             * Showpropertyfilter
             * @description Include a property filter above the table
             * @default null
             */
            showPropertyFilter: boolean | components["schemas"]["TaxonomicFilterGroupType"][] | null;
            /**
             * Showrecordingcolumn
             * @description Show a recording column for events with session recordings
             * @default null
             */
            showRecordingColumn: boolean | null;
            /**
             * Showreload
             * @description Show a reload button
             * @default null
             */
            showReload: boolean | null;
            /**
             * Showresultstable
             * @description Show a results table
             * @default null
             */
            showResultsTable: boolean | null;
            /**
             * Showsavedfilters
             * @description Show saved filters feature for this table (requires uniqueKey)
             * @default null
             */
            showSavedFilters: boolean | null;
            /**
             * Showsavedqueries
             * @description Shows a list of saved queries
             * @default null
             */
            showSavedQueries: boolean | null;
            /**
             * Showsearch
             * @description Include a free text search field (PersonsNode only)
             * @default null
             */
            showSearch: boolean | null;
            /**
             * Showsourcequeryoptions
             * @description Show actors query options and back to source
             * @default null
             */
            showSourceQueryOptions: boolean | null;
            /**
             * Showtableviews
             * @description Show table views feature for this table (requires uniqueKey)
             * @default null
             */
            showTableViews: boolean | null;
            /**
             * Showtestaccountfilters
             * @description Show filter to exclude test accounts
             * @default null
             */
            showTestAccountFilters: boolean | null;
            /**
             * Showtimings
             * @description Show a detailed query timing breakdown
             * @default null
             */
            showTimings: boolean | null;
            /**
             * Source
             * @description Source of the events
             */
            source: components["schemas"]["EventsNode"] | components["schemas"]["EventsQuery"] | components["schemas"]["PersonsNode"] | components["schemas"]["ActorsQuery"] | components["schemas"]["GroupsQuery"] | components["schemas"]["HogQLQuery"] | components["schemas"]["WebOverviewQuery"] | components["schemas"]["WebStatsTableQuery"] | components["schemas"]["WebExternalClicksTableQuery"] | components["schemas"]["WebGoalsQuery"] | components["schemas"]["WebVitalsQuery"] | components["schemas"]["WebVitalsPathBreakdownQuery"] | components["schemas"]["SessionAttributionExplorerQuery"] | components["schemas"]["SessionsQuery"] | components["schemas"]["RevenueAnalyticsGrossRevenueQuery"] | components["schemas"]["RevenueAnalyticsMetricsQuery"] | components["schemas"]["RevenueAnalyticsMRRQuery"] | components["schemas"]["RevenueAnalyticsOverviewQuery"] | components["schemas"]["RevenueAnalyticsTopCustomersQuery"] | components["schemas"]["RevenueExampleEventsQuery"] | components["schemas"]["RevenueExampleDataWarehouseTablesQuery"] | components["schemas"]["MarketingAnalyticsTableQuery"] | components["schemas"]["MarketingAnalyticsAggregatedQuery"] | components["schemas"]["NonIntegratedConversionsTableQuery"] | components["schemas"]["ErrorTrackingQuery"] | components["schemas"]["ErrorTrackingIssueCorrelationQuery"] | components["schemas"]["ExperimentFunnelsQuery"] | components["schemas"]["ExperimentTrendsQuery"] | components["schemas"]["TracesQuery"] | components["schemas"]["TraceQuery"] | components["schemas"]["SessionQuery"] | components["schemas"]["EndpointsUsageTableQuery"] | components["schemas"]["AccountsQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** DataTableNodeViewPropsContext */
        DataTableNodeViewPropsContext: {
            /**
             * Eventdefinitionid
             * @default null
             */
            eventDefinitionId: string | null;
            type: components["schemas"]["DataTableNodeViewPropsContextType"];
        };
        /**
         * DataTableNodeViewPropsContextType
         * @enum {string}
         */
        DataTableNodeViewPropsContextType: "event_definition" | "team_columns";
        /** DataVisualizationNode */
        DataVisualizationNode: {
            /** @default null */
            chartSettings: components["schemas"]["ChartSettings"] | null;
            /** @default null */
            display: components["schemas"]["ChartDisplayType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "DataVisualizationNode";
            source: components["schemas"]["HogQLQuery"];
            /** @default null */
            tableSettings: components["schemas"]["TableSettings"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** DataWarehouseEventsModifier */
        DataWarehouseEventsModifier: {
            /** Distinct Id Field */
            distinct_id_field: string;
            /** Id Field */
            id_field: string;
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
        };
        /** DataWarehouseNode */
        DataWarehouseNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /** Distinct Id Field */
            distinct_id_field: string;
            /**
             * Dw Source Type
             * @default null
             */
            dw_source_type: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /** Id Field */
            id_field: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "DataWarehouseNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** DataWarehousePersonPropertyFilter */
        DataWarehousePersonPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default data_warehouse_person_property
             * @constant
             */
            type: "data_warehouse_person_property";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** DataWarehousePropertyFilter */
        DataWarehousePropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default data_warehouse
             * @constant
             */
            type: "data_warehouse";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** DataWarehouseSourceUsage */
        DataWarehouseSourceUsage: {
            /**
             * Id
             * @description ExternalDataSource id
             */
            id: string;
            /**
             * Source Type
             * @description Connector type of the source (e.g. Stripe, Postgres), if known
             * @default null
             */
            source_type: string | null;
            /**
             * Table Name
             * @description Warehouse table name that was referenced
             */
            table_name: string;
        };
        /** DataWarehouseSyncWarning */
        DataWarehouseSyncWarning: {
            /**
             * Message
             * @description Human-readable warning shown to the user
             */
            message: string;
            /**
             * Schema Name
             * @description Name of the ExternalDataSchema responsible for syncing the table
             */
            schema_name: string;
            /**
             * Source Id
             * @description ID of the ExternalDataSource, used to link to its management page. Null for self-managed tables.
             * @default null
             */
            source_id: string | null;
            /**
             * Source Type
             * @description Source type, e.g. "Stripe", "Hubspot"
             */
            source_type: string;
            /**
             * Status
             * @description Sync status that triggered the warning, e.g. "Failed", "Paused", "BillingLimitReached"
             */
            status: string;
            /**
             * Table Name
             * @description Name of the warehouse table the warning refers to
             */
            table_name: string;
            /**
             * Type
             * @description Tells warning kinds apart in the shared `warnings` list
             * @default warehouse_sync
             * @constant
             */
            type: "warehouse_sync";
        };
        /**
         * @description * `is_date_exact` - is_date_exact
         *     * `is_date_before` - is_date_before
         *     * `is_date_after` - is_date_after
         * @enum {string}
         */
        DateOperatorEnum: "is_date_exact" | "is_date_before" | "is_date_after";
        /** @description Matches date/datetime values with date-specific operators. */
        DatePropertyFilter: {
            /** @description Key of the property you're filtering on. For example `email` or `$current_url`. */
            key: string;
            /**
             * @description Property type (event, person, session, etc.).
             *
             *     * `event` - event
             *     * `event_metadata` - event_metadata
             *     * `feature` - feature
             *     * `person` - person
             *     * `person_metadata` - person_metadata
             *     * `cohort` - cohort
             *     * `element` - element
             *     * `static-cohort` - static-cohort
             *     * `dynamic-cohort` - dynamic-cohort
             *     * `precalculated-cohort` - precalculated-cohort
             *     * `group` - group
             *     * `recording` - recording
             *     * `log_entry` - log_entry
             *     * `behavioral` - behavioral
             *     * `session` - session
             *     * `hogql` - hogql
             *     * `data_warehouse` - data_warehouse
             *     * `data_warehouse_person_property` - data_warehouse_person_property
             *     * `error_tracking_issue` - error_tracking_issue
             *     * `log` - log
             *     * `log_attribute` - log_attribute
             *     * `log_resource_attribute` - log_resource_attribute
             *     * `metric_attribute` - metric_attribute
             *     * `span` - span
             *     * `span_attribute` - span_attribute
             *     * `span_resource_attribute` - span_resource_attribute
             *     * `revenue_analytics` - revenue_analytics
             *     * `account_custom_property` - account_custom_property
             *     * `flag` - flag
             *     * `workflow_variable` - workflow_variable
             * @default event
             */
            type: components["schemas"]["PropertyFilterTypeEnum"];
            /** @description Date or datetime string in ISO 8601 format (e.g. '2024-01-15' or '2024-01-15T10:30:00Z'). */
            value: string;
            /**
             * @description Date comparison operator.
             *
             *     * `is_date_exact` - is_date_exact
             *     * `is_date_before` - is_date_before
             *     * `is_date_after` - is_date_after
             * @default is_date_exact
             */
            operator: components["schemas"]["DateOperatorEnum"];
        };
        /** DateRange */
        DateRange: {
            /**
             * Date From
             * @description Start of the date range. Accepts ISO 8601 timestamps (e.g., 2024-01-15T00:00:00Z) or relative formats: -7d (7 days ago), -2w (2 weeks ago), -1m (1 month ago),
             *     -1h (1 hour ago), -1mStart (start of last month), -1yStart (start of last year).
             * @default null
             */
            date_from: string | null;
            /**
             * Date To
             * @description End of the date range. Same format as date_from. Omit or null for "now".
             * @default null
             */
            date_to: string | null;
            /**
             * Daysofweek
             * @description Restrict the query to events occurring on these ISO days of week (1=Monday to 7=Sunday), evaluated in the project timezone. Omit or empty for all days. Only applied by insight queries.
             * @default null
             */
            daysOfWeek: components["schemas"]["DaysOfWeekEnum"][] | null;
            /**
             * Excludeincompleteperiods
             * @description Exclude the current, still-collecting period by clipping date_to to the end of the last complete interval (evaluated in the project timezone). No-op when the range contains no complete interval. Only applied by insight queries.
             * @default false
             */
            excludeIncompletePeriods: boolean | null;
            /**
             * Explicitdate
             * @description Whether the date_from and date_to should be used verbatim. Disables rounding to the start and end of period.
             * @default false
             */
            explicitDate: boolean | null;
        };
        /**
         * DaysOfWeekEnum
         * @enum {number}
         */
        DaysOfWeekEnum: 1 | 2 | 3 | 4 | 5 | 6 | 7;
        /**
         * DetailedResultsAggregationType
         * @enum {string}
         */
        DetailedResultsAggregationType: "total" | "average" | "median";
        /**
         * DisplayType
         * @enum {string}
         */
        DisplayType: "auto" | "line" | "bar" | "area";
        /**
         * DurationType
         * @enum {string}
         */
        DurationType: "duration" | "active_seconds" | "inactive_seconds";
        /** @enum {integer} */
        EffectiveMembershipLevelEnum: 1 | 8 | 15;
        /** @enum {integer} */
        EffectivePrivilegeLevelEnum: 21 | 37;
        /** ElementPropertyFilter */
        ElementPropertyFilter: {
            key: components["schemas"]["Key10"];
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default element
             * @constant
             */
            type: "element";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** EmptyPropertyFilter */
        EmptyPropertyFilter: {
            /**
             * Type
             * @default empty
             * @constant
             */
            type: "empty";
        };
        EndExperiment: {
            /**
             * @description The conclusion of the experiment.
             *
             *     * `won` - won
             *     * `lost` - lost
             *     * `inconclusive` - inconclusive
             *     * `stopped_early` - stopped_early
             *     * `invalid` - invalid
             */
            conclusion?: components["schemas"]["ConclusionEnum"] | components["schemas"]["NullEnum"];
            /** @description Optional comment about the experiment conclusion. */
            conclusion_comment?: string | null;
            /**
             * @description When true, open a draft pull request that removes the experiment's feature-flag code from the linked repository. Requires the requesting user to have access to PostHog Code (403 otherwise). Only acts for allowlisted teams; ignored otherwise.
             * @default false
             */
            open_cleanup_pr: boolean;
        };
        /** @description A column in the endpoint's query result. */
        EndpointColumn: {
            /** @description Column name from the query SELECT clause. */
            name: string;
            /** @description Serialized column type: integer, float, string, datetime, date, boolean, array, json, or unknown. */
            type: string;
        };
        /** @description Materialization status for an endpoint version. */
        EndpointMaterialization: {
            /** @description URL-safe endpoint name. */
            name: string;
            /** @description Current materialization status (e.g. 'Completed', 'Running'). */
            status?: string;
            /** @description Whether this endpoint query can be materialized. */
            can_materialize: boolean;
            /** @description Reason why materialization is not possible (only when can_materialize is false). */
            reason?: string | null;
            /** @description ISO 8601 timestamp of the last successful materialization. */
            last_materialized_at?: string | null;
            /** @description Last materialization error message, if any. */
            error?: string;
            /**
             * Format: uuid
             * @description UUID of the underlying saved query backing this materialization. Only populated when the version is materialized.
             */
            saved_query_id?: string | null;
        };
        /** @description Schema for creating/updating endpoints. OpenAPI docs only — validation uses Pydantic. */
        EndpointRequest: {
            /** @description Unique URL-safe name. Must start with a letter, only letters/numbers/hyphens/underscores, max 128 chars. */
            name?: string | null;
            /** @description HogQL or insight query this endpoint executes. Changing this auto-creates a new version. */
            query?: unknown;
            /** @description Human-readable description of what this endpoint returns. */
            description?: string | null;
            /** @description How fresh the data should be, in seconds. Must be one of: 900 (15 min), 1800 (30 min), 3600 (1 h), 21600 (6 h), 43200 (12 h), 86400 (24 h, default), 604800 (7 d). Controls cache TTL and materialization sync frequency. */
            data_freshness_seconds?: number | null;
            /** @description Whether this endpoint is available for execution via the API. */
            is_active?: boolean | null;
            /** @description Whether query results are materialized to S3. */
            is_materialized?: boolean | null;
            /** @description Short ID of the insight this endpoint was derived from. */
            derived_from_insight?: string | null;
            /** @description Target a specific version for updates (defaults to current version). */
            version?: number | null;
            /** @description Per-column bucket overrides for range variable materialization. Keys are column names, values are bucket keys. */
            bucket_overrides?: {
                [key: string]: unknown;
            } | null;
            /** @description Set to true to soft-delete this endpoint. */
            deleted?: boolean | null;
            /** @description List of tag names to associate with this endpoint. Replaces any existing tags. */
            tags?: string[] | null;
            /** @description Breakdown property names that may be omitted on /run. Omitted ones return data aggregated across all values of that breakdown. Defaults to [] — every breakdown variable is required. */
            optional_breakdown_properties?: string[] | null;
        };
        /** @description Full endpoint representation returned by list/retrieve/create/update. */
        EndpointResponse: {
            /**
             * Format: uuid
             * @description Unique endpoint identifier (UUID).
             */
            id: string;
            /** @description URL-safe endpoint name, unique per team. */
            name: string;
            /** @description Human-readable description of the endpoint. */
            description: string | null;
            /** @description The HogQL or insight query definition (JSON object with 'kind' key). */
            query: unknown;
            /** @description Whether the endpoint can be executed via the API. */
            is_active: boolean;
            /** @description How fresh the data is, in seconds. One of: 900, 1800, 3600, 21600, 43200, 86400, 604800. */
            data_freshness_seconds: number;
            /** @description Relative API path to execute this endpoint (e.g. /api/projects/{team_id}/endpoints/{name}/run). */
            endpoint_path: string;
            /** @description Absolute URL to execute this endpoint. */
            url: string | null;
            /** @description Absolute URL to view this endpoint in the PostHog UI. */
            ui_url: string | null;
            /**
             * Format: date-time
             * @description When the endpoint was created (ISO 8601).
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the endpoint was last updated (ISO 8601).
             */
            updated_at: string;
            /** @description User who created the endpoint. */
            readonly created_by: components["schemas"]["UserBasic"];
            /** @description Whether the current version's results are pre-computed to S3. */
            is_materialized: boolean;
            /** @description Latest version number. */
            current_version: number;
            /**
             * Format: uuid
             * @description UUID of the current EndpointVersion row.
             */
            current_version_id?: string | null;
            /** @description Total number of versions for this endpoint. */
            versions_count: number;
            /** @description Short ID of the source insight, if derived from one. */
            derived_from_insight: string | null;
            /**
             * Format: date-time
             * @description When this endpoint was last executed via the API (ISO 8601), or null if never executed.
             */
            last_executed_at: string | null;
            /** @description Materialization status and configuration for the current version. */
            materialization: components["schemas"]["EndpointMaterialization"];
            /** @description Per-column bucket overrides for range variable materialization. */
            bucket_overrides: {
                [key: string]: unknown;
            } | null;
            /** @description Column names and types from the query's SELECT clause. */
            columns: components["schemas"]["EndpointColumn"][];
            /** @description Tag names associated with this endpoint. */
            tags: string[];
            /** @description Breakdown property names that may be omitted on /run. Omitted ones return data aggregated across all values of that breakdown. */
            optional_breakdown_properties: string[];
        };
        /** @description Extended endpoint representation when viewing a specific version. */
        EndpointVersionResponse: {
            /**
             * Format: uuid
             * @description Unique endpoint identifier (UUID).
             */
            id: string;
            /** @description URL-safe endpoint name, unique per team. */
            name: string;
            /** @description Human-readable description of the endpoint. */
            description: string | null;
            /** @description The HogQL or insight query definition (JSON object with 'kind' key). */
            query: unknown;
            /** @description Whether the endpoint can be executed via the API. */
            is_active: boolean;
            /** @description How fresh the data is, in seconds. One of: 900, 1800, 3600, 21600, 43200, 86400, 604800. */
            data_freshness_seconds: number;
            /** @description Relative API path to execute this endpoint (e.g. /api/projects/{team_id}/endpoints/{name}/run). */
            endpoint_path: string;
            /** @description Absolute URL to execute this endpoint. */
            url: string | null;
            /** @description Absolute URL to view this endpoint in the PostHog UI. */
            ui_url: string | null;
            /**
             * Format: date-time
             * @description When the endpoint was created (ISO 8601).
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the endpoint was last updated (ISO 8601).
             */
            updated_at: string;
            /** @description User who created the endpoint. */
            readonly created_by: components["schemas"]["UserBasic"];
            /** @description Whether the current version's results are pre-computed to S3. */
            is_materialized: boolean;
            /** @description Latest version number. */
            current_version: number;
            /**
             * Format: uuid
             * @description UUID of the current EndpointVersion row.
             */
            current_version_id?: string | null;
            /** @description Total number of versions for this endpoint. */
            versions_count: number;
            /** @description Short ID of the source insight, if derived from one. */
            derived_from_insight: string | null;
            /**
             * Format: date-time
             * @description When this specific version was last executed via the API (ISO 8601), or null if it hasn't been executed. Per-version tracking is recent, so versions that predate it read null until their next run.
             */
            last_executed_at: string | null;
            /** @description Materialization status and configuration for the current version. */
            materialization: components["schemas"]["EndpointMaterialization"];
            /** @description Per-column bucket overrides for range variable materialization. */
            bucket_overrides: {
                [key: string]: unknown;
            } | null;
            /** @description Column names and types from the query's SELECT clause. */
            columns: components["schemas"]["EndpointColumn"][];
            /** @description Tag names associated with this endpoint. */
            tags: string[];
            /** @description Breakdown property names that may be omitted on /run. Omitted ones return data aggregated across all values of that breakdown. */
            optional_breakdown_properties: string[];
            /** @description Version number. */
            version: number;
            /**
             * Format: uuid
             * @description Version unique identifier (UUID).
             */
            version_id: string;
            /** @description Whether the parent endpoint is active (distinct from version.is_active). */
            endpoint_is_active: boolean;
            /** @description ISO 8601 timestamp when this version was created. */
            version_created_at: string;
            /** @description ISO 8601 timestamp when this version was last updated. */
            version_updated_at: string | null;
            /** @description User who created this version. */
            readonly version_created_by: components["schemas"]["UserBasic"] | null;
        };
        /**
         * EndpointsUsageBreakdown
         * @enum {string}
         */
        EndpointsUsageBreakdown: "Endpoint" | "MaterializationType" | "ApiKey" | "Status";
        /**
         * EndpointsUsageOrderByDirection
         * @enum {string}
         */
        EndpointsUsageOrderByDirection: "ASC" | "DESC";
        /**
         * EndpointsUsageOrderByField
         * @enum {string}
         */
        EndpointsUsageOrderByField: "requests" | "bytes_read" | "cpu_seconds" | "avg_query_duration_ms" | "error_rate";
        /** EndpointsUsageTableQuery */
        EndpointsUsageTableQuery: {
            breakdownBy: components["schemas"]["EndpointsUsageBreakdown"];
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Endpointnames
             * @description Filter to specific endpoints by name
             * @default null
             */
            endpointNames: string[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "EndpointsUsageTableQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Filter by materialization type
             * @default null
             */
            materializationType: components["schemas"]["MaterializationType"] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["EndpointsUsageOrderByField"] | components["schemas"]["EndpointsUsageOrderByDirection"])[] | null;
            /** @default null */
            response: components["schemas"]["EndpointsUsageTableQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** EndpointsUsageTableQueryResponse */
        EndpointsUsageTableQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `allow` - Allow
         *     * `reject` - Reject
         * @enum {string}
         */
        EnforcementModeEnum: "allow" | "reject";
        /** @description Serializer mixin that handles tags for objects. */
        EnterpriseEventDefinition: {
            /** Format: uuid */
            readonly id: string;
            name: string;
            owner?: number | null;
            description?: string | null;
            tags?: unknown[];
            /** Format: date-time */
            readonly created_at: string | null;
            /** Format: date-time */
            readonly updated_at: string;
            readonly updated_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly last_seen_at: string | null;
            /** Format: date-time */
            readonly last_updated_at: string;
            verified?: boolean;
            /** Format: date-time */
            readonly verified_at: string | null;
            readonly verified_by: components["schemas"]["UserBasic"];
            hidden?: boolean | null;
            enforcement_mode?: components["schemas"]["EnforcementModeEnum"];
            /** @description Name of a single property on this event that PostHog UIs should display alongside the event (for example `$pathname` on `$pageview`). When set, surfaces like the session replay inspector show the property's value next to the event name without the user having to open the event. */
            primary_property?: string | null;
            readonly is_action: boolean;
            readonly action_id: number;
            readonly is_calculating: boolean;
            /** Format: date-time */
            readonly last_calculated_at: string;
            readonly created_by: components["schemas"]["UserBasic"];
            /** @default false */
            post_to_slack: boolean;
            default_columns?: string[];
            readonly media_preview_urls: string[];
        };
        /**
         * EntityType
         * @enum {string}
         */
        EntityType: "actions" | "events" | "data_warehouse" | "new_entity" | "groups";
        /** ErrorTrackingCorrelatedIssue */
        ErrorTrackingCorrelatedIssue: {
            /** @default null */
            assignee: components["schemas"]["ErrorTrackingIssueAssignee"] | null;
            /** @default null */
            cohort: components["schemas"]["ErrorTrackingIssueCohort"] | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Event */
            event: string;
            /**
             * External Issues
             * @default null
             */
            external_issues: components["schemas"]["ErrorTrackingExternalReference"][] | null;
            /**
             * First Seen
             * Format: date-time
             */
            first_seen: string;
            /** Id */
            id: string;
            /**
             * Last Seen
             * Format: date-time
             */
            last_seen: string;
            /**
             * Library
             * @default null
             */
            library: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** Odds Ratio */
            odds_ratio: number;
            population: components["schemas"]["Population"];
            status: components["schemas"]["ErrorTrackingIssueStatus"];
        };
        /** ErrorTrackingExternalReference */
        ErrorTrackingExternalReference: {
            /** External Url */
            external_url: string;
            /** Id */
            id: string;
            integration: components["schemas"]["ErrorTrackingExternalReferenceIntegration"];
        };
        /** ErrorTrackingExternalReferenceIntegration */
        ErrorTrackingExternalReferenceIntegration: {
            /** Display Name */
            display_name: string;
            /** Id */
            id: number;
            kind: components["schemas"]["IntegrationKind"];
        };
        /** ErrorTrackingIssue */
        ErrorTrackingIssue: {
            /** @default null */
            aggregations: components["schemas"]["ErrorTrackingIssueAggregations"] | null;
            /** @default null */
            assignee: components["schemas"]["ErrorTrackingIssueAssignee"] | null;
            /** @default null */
            cohort: components["schemas"]["ErrorTrackingIssueCohort"] | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * External Issues
             * @default null
             */
            external_issues: components["schemas"]["ErrorTrackingExternalReference"][] | null;
            /** @default null */
            first_event: components["schemas"]["FirstEvent"] | null;
            /**
             * First Seen
             * Format: date-time
             */
            first_seen: string;
            /**
             * Function
             * @default null
             */
            function: string | null;
            /** Id */
            id: string;
            /** @default null */
            last_event: components["schemas"]["LastEvent"] | null;
            /**
             * Last Seen
             * Format: date-time
             */
            last_seen: string;
            /**
             * Library
             * @default null
             */
            library: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Source
             * @default null
             */
            source: string | null;
            status: components["schemas"]["ErrorTrackingIssueStatus"];
        };
        /** ErrorTrackingIssueAggregations */
        ErrorTrackingIssueAggregations: {
            /** Occurrences */
            occurrences: number;
            /** Sessions */
            sessions: number;
            /** Users */
            users: number;
            /**
             * Volumerange
             * @default null
             */
            volumeRange: number[] | null;
            /** Volume Buckets */
            volume_buckets: components["schemas"]["VolumeBucket"][];
        };
        /** ErrorTrackingIssueAssignee */
        ErrorTrackingIssueAssignee: {
            /** Id */
            id: string | number;
            type: components["schemas"]["ErrorTrackingIssueAssigneeType"];
        };
        /**
         * ErrorTrackingIssueAssigneeType
         * @enum {string}
         */
        ErrorTrackingIssueAssigneeType: "user" | "role";
        /** ErrorTrackingIssueCohort */
        ErrorTrackingIssueCohort: {
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** ErrorTrackingIssueCorrelationQuery */
        ErrorTrackingIssueCorrelationQuery: {
            /** Events */
            events: string[];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ErrorTrackingIssueCorrelationQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            response: components["schemas"]["ErrorTrackingIssueCorrelationQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ErrorTrackingIssueCorrelationQueryResponse */
        ErrorTrackingIssueCorrelationQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["ErrorTrackingCorrelatedIssue"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** ErrorTrackingIssueFilter */
        ErrorTrackingIssueFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default error_tracking_issue
             * @constant
             */
            type: "error_tracking_issue";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * ErrorTrackingIssueStatus
         * @enum {string}
         */
        ErrorTrackingIssueStatus: "archived" | "active" | "resolved" | "pending_release" | "suppressed";
        /**
         * ErrorTrackingOrderBy
         * @enum {string}
         */
        ErrorTrackingOrderBy: "last_seen" | "first_seen" | "occurrences" | "users" | "sessions";
        /** ErrorTrackingPendingFingerprintIssueStateUpdate */
        ErrorTrackingPendingFingerprintIssueStateUpdate: {
            /**
             * Assigned Role Id
             * @default null
             */
            assigned_role_id: string | null;
            /**
             * Assigned User Id
             * @default null
             */
            assigned_user_id: number | null;
            /** Fingerprint */
            fingerprint: string;
            /**
             * First Seen
             * @description ISO 8601 datetime string.
             */
            first_seen: string;
            /** Is Deleted */
            is_deleted: number;
            /**
             * Issue Description
             * @default null
             */
            issue_description: string | null;
            /** Issue Id */
            issue_id: string;
            /**
             * Issue Name
             * @default null
             */
            issue_name: string | null;
            /** Issue Status */
            issue_status: string;
            /**
             * Version
             * @description Client-stamped monotonic version (`Date.now()` ms at mutation success).
             */
            version: number;
        };
        /** ErrorTrackingQuery */
        ErrorTrackingQuery: {
            /** @default null */
            assignee: components["schemas"]["ErrorTrackingIssueAssignee"] | null;
            /** @description Date range to filter results. */
            dateRange: components["schemas"]["DateRange"];
            /** @default null */
            filterGroup: components["schemas"]["PropertyGroupFilter"] | null;
            /**
             * Filtertestaccounts
             * @description Whether to filter out test accounts.
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Groupkey
             * @default null
             */
            groupKey: string | null;
            /**
             * Grouptypeindex
             * @default null
             */
            groupTypeIndex: number | null;
            /**
             * Issueid
             * @description Filter to a specific error tracking issue by ID.
             * @default null
             */
            issueId: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ErrorTrackingQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @description Field to sort results by. */
            orderBy: components["schemas"]["ErrorTrackingOrderBy"];
            /**
             * @description Sort direction.
             * @default null
             */
            orderDirection: components["schemas"]["OrderDirection2"] | null;
            /**
             * Pendingfingerprintissuestateupdates
             * @description Pending fingerprint issue state updates UNIONed into the fingerprint issue state subquery. The backend caps the list at 50 entries; extras are dropped silently.
             * @default null
             */
            pendingFingerprintIssueStateUpdates: components["schemas"]["ErrorTrackingPendingFingerprintIssueStateUpdate"][] | null;
            /**
             * Personid
             * @default null
             */
            personId: string | null;
            /** @default null */
            response: components["schemas"]["ErrorTrackingQueryResponse"] | null;
            /**
             * Searchquery
             * @description Free-text search across exception type, message, and stack frames.
             * @default null
             */
            searchQuery: string | null;
            /**
             * ErrorTrackingQueryStatus
             * @description Filter by issue status.
             * @default null
             */
            status: components["schemas"]["ErrorTrackingIssueStatus"] | string | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usequeryv2
             * @default null
             */
            useQueryV2: boolean | null;
            /**
             * Usequeryv3
             * @default null
             */
            useQueryV3: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
            /** Volumeresolution */
            volumeResolution: number;
            /**
             * Withaggregations
             * @default null
             */
            withAggregations: boolean | null;
            /**
             * Withfirstevent
             * @default null
             */
            withFirstEvent: boolean | null;
            /**
             * Withlastevent
             * @default null
             */
            withLastEvent: boolean | null;
        };
        /** ErrorTrackingQueryResponse */
        ErrorTrackingQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["ErrorTrackingIssue"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `server` - Server
         *     * `client` - Client
         *     * `all` - All
         * @enum {string}
         */
        EvaluationRuntimeEnum: "server" | "client" | "all";
        /** EventDefinition */
        EventDefinition: {
            /** Elements */
            elements: unknown[];
            /** Event */
            event: string;
            /** Properties */
            properties: {
                [key: string]: unknown;
            };
        };
        EventDefinitionBasic: {
            /** Format: uuid */
            id: string;
            name: string;
        };
        /** EventMetadataPropertyFilter */
        EventMetadataPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default event_metadata
             * @constant
             */
            type: "event_metadata";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** EventOddsRatioSerialized */
        EventOddsRatioSerialized: {
            correlation_type: components["schemas"]["CorrelationType"];
            event: components["schemas"]["EventDefinition"];
            /** Failure Count */
            failure_count: number;
            /** Odds Ratio */
            odds_ratio: number;
            /** Success Count */
            success_count: number;
        };
        /** EventPropFilter */
        EventPropFilter: {
            /** Type */
            type: components["schemas"]["EventPropFilterTypeEnum"];
            /** Key */
            key: string;
            /** Value */
            value: unknown;
            /**
             * Operator
             * @default null
             */
            operator: string | null;
        };
        /** @enum {string} */
        EventPropFilterTypeEnum: "event" | "element";
        /** EventPropertyFilter */
        EventPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /** @default exact */
            operator: components["schemas"]["PropertyOperator"] | null;
            /**
             * Type
             * @description Event properties
             * @default event
             * @constant
             */
            type: "event";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        EventSchema: {
            /** Format: uuid */
            readonly id: string;
            /** Format: uuid */
            event_definition: string;
            readonly property_group: components["schemas"]["SchemaPropertyGroup"];
            /** Format: uuid */
            property_group_id: string;
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
        };
        /** EventsNode */
        EventsNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Event
             * @description The event or `null` for all events.
             * @default null
             */
            event: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "EventsNode";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** EventsQuery */
        EventsQuery: {
            /**
             * Actionid
             * @description Show events matching a given action
             * @default null
             */
            actionId: number | null;
            /**
             * Actionsteps
             * @description Show events matching action steps directly, used when no actionId is provided (e.g. previewing unsaved actions). Ignored if actionId is set.
             * @default null
             */
            actionSteps: components["schemas"]["EventsQueryActionStep"][] | null;
            /**
             * After
             * @description Only fetch events that happened after this timestamp
             * @default null
             */
            after: string | null;
            /**
             * Before
             * @description Only fetch events that happened before this timestamp
             * @default null
             */
            before: string | null;
            /**
             * Event
             * @description Limit to events matching this string
             * @default null
             */
            event: string | null;
            /**
             * Events
             * @description Filter to events matching any of these event names
             * @default null
             */
            events: string[] | null;
            /**
             * Filtertestaccounts
             * @description Filter test accounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["PropertyGroupFilter"] | components["schemas"]["PropertyGroupFilterValue"] | (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"]))[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "EventsQuery";
            /**
             * Limit
             * @description Number of rows to return
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @description Number of rows to skip before returning rows
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Personid
             * @description Show events for a given person
             * @default null
             */
            personId: string | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** @default null */
            response: components["schemas"]["EventsQueryResponse"] | null;
            /**
             * Select
             * @description Return a limited set of data. Required.
             */
            select: string[];
            /**
             * @description source for querying events for insights
             * @default null
             */
            source: components["schemas"]["InsightActorsQuery"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
            /**
             * Where
             * @description HogQL filters to apply on returned data
             * @default null
             */
            where: string[] | null;
        };
        /** EventsQueryActionStep */
        EventsQueryActionStep: {
            /**
             * Event
             * @default null
             */
            event: string | null;
            /**
             * Href
             * @default null
             */
            href: string | null;
            /** @default null */
            href_matching: components["schemas"]["HrefMatching"] | null;
            /**
             * Properties
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Selector
             * @default null
             */
            selector: string | null;
            /**
             * Tag Name
             * @default null
             */
            tag_name: string | null;
            /**
             * Text
             * @default null
             */
            text: string | null;
            /** @default null */
            text_matching: components["schemas"]["TextMatching"] | null;
            /**
             * Url
             * @default null
             */
            url: string | null;
            /** @default null */
            url_matching: components["schemas"]["UrlMatching"] | null;
        };
        /** EventsQueryResponse */
        EventsQueryResponse: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Nextcursor
             * @description Cursor for fetching the next page of results
             * @default null
             */
            nextCursor: string | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `is_set` - is_set
         *     * `is_not_set` - is_not_set
         * @enum {string}
         */
        ExistenceOperatorEnum: "is_set" | "is_not_set";
        /** @description Checks whether a property is set or not, without comparing values. */
        ExistencePropertyFilter: {
            /** @description Key of the property you're filtering on. For example `email` or `$current_url`. */
            key: string;
            /**
             * @description Property type (event, person, session, etc.).
             *
             *     * `event` - event
             *     * `event_metadata` - event_metadata
             *     * `feature` - feature
             *     * `person` - person
             *     * `person_metadata` - person_metadata
             *     * `cohort` - cohort
             *     * `element` - element
             *     * `static-cohort` - static-cohort
             *     * `dynamic-cohort` - dynamic-cohort
             *     * `precalculated-cohort` - precalculated-cohort
             *     * `group` - group
             *     * `recording` - recording
             *     * `log_entry` - log_entry
             *     * `behavioral` - behavioral
             *     * `session` - session
             *     * `hogql` - hogql
             *     * `data_warehouse` - data_warehouse
             *     * `data_warehouse_person_property` - data_warehouse_person_property
             *     * `error_tracking_issue` - error_tracking_issue
             *     * `log` - log
             *     * `log_attribute` - log_attribute
             *     * `log_resource_attribute` - log_resource_attribute
             *     * `metric_attribute` - metric_attribute
             *     * `span` - span
             *     * `span_attribute` - span_attribute
             *     * `span_resource_attribute` - span_resource_attribute
             *     * `revenue_analytics` - revenue_analytics
             *     * `account_custom_property` - account_custom_property
             *     * `flag` - flag
             *     * `workflow_variable` - workflow_variable
             * @default event
             */
            type: components["schemas"]["PropertyFilterTypeEnum"];
            /**
             * @description Existence check operator.
             *
             *     * `is_set` - is_set
             *     * `is_not_set` - is_not_set
             */
            operator: components["schemas"]["ExistenceOperatorEnum"];
        };
        /**
         * @description Full experiment representation for the detail, create, and update endpoints.
         *
         *     Extends the shared read-side fields in ``ExperimentBaseSerializer`` with the metric
         *     definitions (``metrics``/``metrics_secondary``/``saved_metrics``) and the write-side
         *     fields, and refreshes stale action names while serializing. The list endpoint uses the
         *     leaner ``ExperimentBasicSerializer`` instead.
         */
        Experiment: {
            readonly id: number;
            /** @description Name of the experiment. */
            name: string;
            /** @description Description of the experiment hypothesis and expected outcomes. */
            description?: string | null;
            /** Format: date-time */
            start_date?: string | null;
            /** Format: date-time */
            end_date?: string | null;
            /** @description Unique key for the experiment's feature flag. Letters, numbers, hyphens, and underscores only. Search existing flags with the feature-flag-get-all tool first — reuse an existing flag when possible. */
            feature_flag_key: string;
            readonly feature_flag: components["schemas"]["MinimalFeatureFlag"];
            readonly holdout: components["schemas"]["ExperimentHoldout"];
            /** @description ID of a holdout group to exclude from the experiment. */
            holdout_id?: number | null;
            readonly exposure_cohort: number | null;
            /** @description Experiment parameters JSON. Supported keys include `custom_exposure_filter` and `variant_notes` (free-text notes per variant, keyed by variant key). Flag config (variants, rollout, aggregation, payloads, experience continuity) belongs on the `feature_flag` object; send it there. For backward compatibility, config still sent through these deprecated keys is copied onto the linked flag rather than rejected, and reads project the flag's current config back into this field. Excluded variants live on the top-level `excluded_variants` field, not here. */
            parameters?: components["schemas"]["ExperimentParameters"] | null;
            /** @description Running-time calculator state: `minimum_detectable_effect`, `recommended_running_time`, `recommended_sample_size`, and `exposure_estimate_config`. Canonical home for these keys, which historically lived in `parameters`. */
            running_time_calculation?: components["schemas"]["ExperimentRunningTimeCalculation"] | null;
            /** @description Variant keys to exclude from metric result calculations. Excluded variants are still served to users but omitted from statistical analysis. The baseline variant and holdout pseudo-variants cannot be excluded. Canonical home for what historically lived in `parameters.excluded_variants`. */
            excluded_variants?: string[] | null;
            readonly saved_metrics: components["schemas"]["ExperimentToSavedMetric"][];
            /** @description IDs of shared saved metrics to attach to this experiment. Each item has 'id' (saved metric ID) and 'metadata' with 'type' (primary or secondary). */
            saved_metrics_ids?: unknown[] | null;
            /**
             * @description Whether the experiment is archived.
             * @default false
             */
            archived: boolean;
            deleted?: boolean | null;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            /**
             * @description Experiment type: web for frontend UI changes, product for backend/API changes.
             *
             *     * `web` - web
             *     * `product` - product
             */
            type?: components["schemas"]["ExperimentTypeEnum"] | components["schemas"]["NullEnum"];
            /** @description Exposure configuration including filter test accounts and custom exposure events. */
            exposure_criteria?: components["schemas"]["ExperimentApiExposureCriteria"] | null;
            /** @description Primary experiment metrics. Each metric must have kind='ExperimentMetric' and a metric_type: 'mean' (set source to an EventsNode with an event name), 'funnel' (set series to an array of EventsNode steps), 'ratio' (set numerator and denominator EventsNode entries), or 'retention' (set start_event and completion_event). Use the read-data-schema tool with query kind 'events' to find available events in the project. */
            metrics?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /** @description Secondary metrics for additional measurements. Same format as primary metrics. */
            metrics_secondary?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /**
             * @description Suppresses the validation that rejects metrics referencing events not yet ingested by this project. REQUIRES explicit user confirmation before being set to true — never flip this silently to retry a failed call. The default validation catches typo'd event names and missing instrumentation. Set this to true only when the user has confirmed the event is intentional (e.g. they are about to instrument it).
             * @default false
             */
            allow_unknown_events: boolean;
            /** create in folder */
            _create_in_folder?: string;
            /**
             * @description Experiment conclusion: won, lost, inconclusive, stopped_early, or invalid.
             *
             *     * `won` - won
             *     * `lost` - lost
             *     * `inconclusive` - inconclusive
             *     * `stopped_early` - stopped_early
             *     * `invalid` - invalid
             */
            conclusion?: components["schemas"]["ConclusionEnum"] | components["schemas"]["NullEnum"];
            /** @description Comment about the experiment conclusion. */
            conclusion_comment?: string | null;
            /**
             * Format: uuid
             * @description ID of the Code task opened to remove the experiment's feature-flag code, when one was requested via open_cleanup_pr on end/ship_variant. Read its status via the flag_cleanup_task action.
             */
            readonly flag_cleanup_task_id: string | null;
            only_count_matured_users?: boolean;
            /**
             * @description When true, sync the flag config sent in this request (via the `feature_flag` object) to the linked feature flag. Draft experiments always sync regardless. On a running experiment, `feature_flag` config without this flag is rejected.
             * @default false
             */
            update_feature_flag_params: boolean;
            /** @description Experiment lifecycle state: 'draft' (not yet launched), 'running' (launched with active feature flag), 'paused' (running with feature flag deactivated — virtual state derived from feature_flag.active, not stored), 'exposure_frozen' (running with enrollment frozen to the already-exposed cohort while metrics keep flowing — virtual state derived from the flag's release groups, not stored), 'stopped' (ended). */
            readonly status: components["schemas"]["ExperimentStatusEnum"];
            /** @description Whether the experiment uses any legacy-engine metrics (ExperimentTrendsQuery or ExperimentFunnelsQuery). Used to flag legacy experiments and gate actions that don't support them, such as duplicate and copy-to-project. */
            readonly is_legacy: boolean;
            /** @description Whether enrollment can be frozen right now: the experiment must be running (not draft, paused, stopped, or already frozen) and its feature flag must have release conditions that a person cohort can narrow (no group aggregation, no holdout, no early access conditions). */
            readonly can_freeze_exposure: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /** ExperimentActorsQuery */
        ExperimentActorsQuery: {
            /**
             * Exposureconfig
             * @description Exposure configuration for filtering events. Defines when users were first exposed to the experiment.
             * @default null
             */
            exposureConfig: components["schemas"]["ExperimentEventExposureConfig"] | components["schemas"]["ActionsNode"] | null;
            /**
             * Featureflagkey
             * @description Feature flag key for breakdown filtering.
             * @default null
             */
            featureFlagKey: string | null;
            /**
             * Funnelstep
             * @description Index of the step for which we want to get actors for, per experiment variant. Positive for converted persons, negative for dropped off persons.
             * @default null
             */
            funnelStep: number | null;
            /**
             * Funnelstepbreakdown
             * @description The variant key for filtering actors. For experiments, this filters by feature flag variant (e.g., 'control', 'test').
             * @default null
             */
            funnelStepBreakdown: number | string | (number | string)[] | null;
            /**
             * Includerecordings
             * @default null
             */
            includeRecordings: boolean | null;
            /**
             * Kind
             * @default ExperimentActorsQuery
             * @constant
             */
            kind: "ExperimentActorsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description How to handle users with multiple variant exposures.
             * @default null
             */
            multipleVariantHandling: components["schemas"]["MultipleVariantHandling"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            source: components["schemas"]["ExperimentQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentApiEventSource */
        ExperimentApiEventSource: {
            /**
             * Event
             * @description Event name, e.g. '$pageview'. Required for EventsNode.
             * @default null
             */
            event: string | null;
            /**
             * Id
             * @description Action ID. Required for ActionsNode.
             * @default null
             */
            id: number | null;
            kind: components["schemas"]["Kind"];
            /**
             * @description How to aggregate this source. Defaults to 'total' (event count). Use 'sum' together with math_property to aggregate a numeric property — e.g. a ratio numerator of revenue per order. Other options: 'avg', 'min', 'max', 'unique_session', 'dau', 'unique_group', 'hogql'.
             * @default null
             */
            math: components["schemas"]["ExperimentMetricMathType"] | null;
            /**
             * @description Group type index to aggregate over. Required when math is 'unique_group'.
             * @default null
             */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @description HogQL aggregation expression. Required when math is 'hogql' — without it the metric silently falls back to a plain count/sum.
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Property
             * @description Numeric event property to aggregate when math is 'sum', 'avg', 'min', or 'max' (e.g. 'revenue').
             * @default null
             */
            math_property: string | null;
            /**
             * Properties
             * @description Event property filters to narrow which events are counted.
             * @default null
             */
            properties: components["schemas"]["EventPropertyFilter"][] | null;
        };
        /** ExperimentApiExposureConfig */
        ExperimentApiExposureConfig: {
            /**
             * Event
             * @description Custom exposure event name. Required when kind is 'ExperimentEventExposureConfig'.
             * @default null
             */
            event: string | null;
            /**
             * Id
             * @description Action ID. Required when kind is 'ActionsNode'.
             * @default null
             */
            id: number | null;
            /**
             * @description Defaults to 'ExperimentEventExposureConfig' when omitted. Pass 'ActionsNode' for an action-based exposure.
             * @default null
             */
            kind: components["schemas"]["Kind1"] | null;
            /**
             * Properties
             * @description Property filters (event, person, and other supported types). Pass an empty array if no filters needed.
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[];
        };
        /** ExperimentApiExposureCriteria */
        ExperimentApiExposureCriteria: {
            /** @default null */
            exposure_config: components["schemas"]["ExperimentApiExposureConfig"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * @description How to handle entities exposed to multiple variants. 'exclude' (default) drops them from the analysis; 'first_seen' assigns them to the variant from their earliest exposure.
             * @default null
             */
            multiple_variant_handling: components["schemas"]["MultipleVariantHandling"] | null;
        };
        /** ExperimentApiMetric */
        ExperimentApiMetric: {
            /**
             * @description For retention metrics: completion event.
             * @default null
             */
            completion_event: components["schemas"]["ExperimentApiEventSource"] | null;
            /**
             * Conversion Window
             * @description Conversion window duration.
             * @default null
             */
            conversion_window: number | null;
            /**
             * @description For ratio metrics: denominator source.
             * @default null
             */
            denominator: components["schemas"]["ExperimentApiEventSource"] | null;
            /**
             * @description For ratio metrics: winsorization applied to the denominator aggregate. Leave unset for a binomial-style denominator, which is never clamped.
             * @default null
             */
            denominator_outlier_handling: components["schemas"]["ExperimentMetricOutlierHandling"] | null;
            /**
             * @description Whether higher or lower values indicate success.
             * @default null
             */
            goal: components["schemas"]["ExperimentMetricGoal"] | null;
            /**
             * Ignore Zeros
             * @description For mean metrics: exclude zero values when computing the winsorization percentile thresholds.
             * @default null
             */
            ignore_zeros: boolean | null;
            /**
             * Kind
             * @default ExperimentMetric
             * @constant
             */
            kind: "ExperimentMetric";
            /**
             * Lower Bound Percentile
             * @description For mean metrics: winsorization lower percentile bound, as a fraction in [0, 1] (e.g. 0.01 for the 1st percentile). Per-user values below this percentile are clamped to it before aggregation.
             * @default null
             */
            lower_bound_percentile: number | null;
            metric_type: components["schemas"]["ExperimentMetricType"];
            /**
             * Name
             * @description Human-readable metric name.
             * @default null
             */
            name: string | null;
            /**
             * @description For ratio metrics: numerator source.
             * @default null
             */
            numerator: components["schemas"]["ExperimentApiEventSource"] | null;
            /**
             * @description For ratio metrics: winsorization applied to the numerator aggregate, independently of the denominator and each with its own percentile thresholds.
             * @default null
             */
            numerator_outlier_handling: components["schemas"]["ExperimentMetricOutlierHandling"] | null;
            /**
             * Retention Window End
             * @default null
             */
            retention_window_end: number | null;
            /**
             * Retention Window Start
             * @default null
             */
            retention_window_start: number | null;
            /** @default null */
            retention_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /**
             * Series
             * @description For funnel metrics: array of EventsNode/ActionsNode steps.
             * @default null
             */
            series: components["schemas"]["ExperimentApiEventSource"][] | null;
            /**
             * @description For mean metrics: event source.
             * @default null
             */
            source: components["schemas"]["ExperimentApiEventSource"] | null;
            /**
             * @description For retention metrics: start event.
             * @default null
             */
            start_event: components["schemas"]["ExperimentApiEventSource"] | null;
            /** @default null */
            start_handling: components["schemas"]["StartHandling"] | null;
            /**
             * Threshold
             * @description For mean metrics: when set, reports the percentage of users whose per-user summed/counted value reaches or exceeds this threshold. Only meaningful for sum/count math types.
             * @default null
             */
            threshold: number | null;
            /**
             * Upper Bound Percentile
             * @description For mean metrics: winsorization upper percentile bound, as a fraction in [0, 1] (e.g. 0.99 for the 99th percentile). Per-user values above this percentile are clamped to it before aggregation.
             * @default null
             */
            upper_bound_percentile: number | null;
            /**
             * Uuid
             * @description Unique identifier. Auto-generated if omitted.
             * @default null
             */
            uuid: string | null;
        };
        /**
         * @description Lightweight, read-only serializer for the experiment list endpoint.
         *
         *     The list view (and the MCP list tool) render only the scalar and feature-flag fields
         *     shared via ``ExperimentBaseSerializer`` — never the metric definitions. Omitting
         *     ``metrics``/``metrics_secondary``/``saved_metrics`` lets the list query defer the large
         *     JSON columns and skip the saved-metric prefetch plus per-row fingerprinting; that work
         *     belongs to the detail response served by ``ExperimentSerializer``.
         *
         *     Because the metric fields, the write-side machinery, and the action-name-refreshing
         *     ``to_representation`` all live on ``ExperimentSerializer`` rather than the shared base,
         *     this serializer needs no overrides: it gets DRF's default ``get_fields`` (no write-only
         *     ``holdout_id`` to configure), default ``to_representation`` (no metrics to normalize), and
         *     a plain ``ListSerializer`` that never touches the deferred columns. See
         *     ``EnterpriseExperimentsViewSet.safely_get_queryset``.
         */
        ExperimentBasic: {
            readonly id: number;
            /** @description Name of the experiment. */
            name: string;
            /** @description Description of the experiment hypothesis and expected outcomes. */
            description?: string | null;
            /** Format: date-time */
            start_date?: string | null;
            /** Format: date-time */
            end_date?: string | null;
            /** @description Unique key for the experiment's feature flag. Letters, numbers, hyphens, and underscores only. Search existing flags with the feature-flag-get-all tool first — reuse an existing flag when possible. */
            feature_flag_key: string;
            readonly feature_flag: components["schemas"]["MinimalFeatureFlag"];
            readonly holdout: components["schemas"]["ExperimentHoldout"];
            readonly exposure_cohort: number | null;
            /** @description Experiment parameters JSON. Supported keys include `custom_exposure_filter` and `variant_notes` (free-text notes per variant, keyed by variant key). Flag config (variants, rollout, aggregation, payloads, experience continuity) belongs on the `feature_flag` object; send it there. For backward compatibility, config still sent through these deprecated keys is copied onto the linked flag rather than rejected, and reads project the flag's current config back into this field. Excluded variants live on the top-level `excluded_variants` field, not here. */
            parameters?: components["schemas"]["ExperimentParameters"] | null;
            /** @description Running-time calculator state: `minimum_detectable_effect`, `recommended_running_time`, `recommended_sample_size`, and `exposure_estimate_config`. Canonical home for these keys, which historically lived in `parameters`. */
            running_time_calculation?: components["schemas"]["ExperimentRunningTimeCalculation"] | null;
            /** @description Variant keys to exclude from metric result calculations. Excluded variants are still served to users but omitted from statistical analysis. The baseline variant and holdout pseudo-variants cannot be excluded. Canonical home for what historically lived in `parameters.excluded_variants`. */
            excluded_variants?: string[] | null;
            /**
             * @description Whether the experiment is archived.
             * @default false
             */
            archived: boolean;
            deleted?: boolean | null;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            /**
             * @description Experiment type: web for frontend UI changes, product for backend/API changes.
             *
             *     * `web` - web
             *     * `product` - product
             */
            type?: components["schemas"]["ExperimentTypeEnum"] | components["schemas"]["NullEnum"];
            /**
             * @description Experiment conclusion: won, lost, inconclusive, stopped_early, or invalid.
             *
             *     * `won` - won
             *     * `lost` - lost
             *     * `inconclusive` - inconclusive
             *     * `stopped_early` - stopped_early
             *     * `invalid` - invalid
             */
            conclusion?: components["schemas"]["ConclusionEnum"] | components["schemas"]["NullEnum"];
            /** @description Comment about the experiment conclusion. */
            conclusion_comment?: string | null;
            /** @description Experiment lifecycle state: 'draft' (not yet launched), 'running' (launched with active feature flag), 'paused' (running with feature flag deactivated — virtual state derived from feature_flag.active, not stored), 'exposure_frozen' (running with enrollment frozen to the already-exposed cohort while metrics keep flowing — virtual state derived from the flag's release groups, not stored), 'stopped' (ended). */
            readonly status: components["schemas"]["ExperimentStatusEnum"];
            /** @description Whether the experiment uses any legacy-engine metrics (ExperimentTrendsQuery or ExperimentFunnelsQuery). Used to flag legacy experiments and gate actions that don't support them, such as duplicate and copy-to-project. */
            readonly is_legacy: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /** ExperimentBreakdownResult */
        ExperimentBreakdownResult: {
            /** @description Control variant stats for this breakdown */
            baseline: components["schemas"]["ExperimentStatsBaseValidated"];
            /**
             * Breakdown Value
             * @description The breakdown values as an array (e.g., ["MacOS", "Chrome"] for multi-breakdown, ["Chrome"] for single) Although `BreakdownKeyType` could be an array, we only use the array form for the breakdown_value. The way `BreakdownKeyType` is defined is problematic. It should be treated as a primitive and allow for the types using it to define if it's and array or an optional value.
             */
            breakdown_value: (string | number)[];
            /**
             * Variants
             * @description Test variant results with statistical comparisons for this breakdown
             */
            variants: components["schemas"]["ExperimentVariantResultFrequentist"][] | components["schemas"]["ExperimentVariantResultBayesian"][];
        };
        /** ExperimentDataWarehouseNode */
        ExperimentDataWarehouseNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /** Data Warehouse Join Key */
            data_warehouse_join_key: string;
            /** Events Join Key */
            events_join_key: string;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ExperimentDataWarehouseNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentEventExposureConfig */
        ExperimentEventExposureConfig: {
            /** Event */
            event: string;
            /**
             * Kind
             * @default ExperimentEventExposureConfig
             * @constant
             */
            kind: "ExperimentEventExposureConfig";
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[];
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentExposureEstimateConfig */
        ExperimentExposureEstimateConfig: {
            /** @description 'manual' when the baseline value and exposure rate were entered by hand, 'automatic' when derived from live experiment data. */
            conversionRateInputType: components["schemas"]["ConversionRateInputType"];
            /**
             * Manualbaselinevalue
             * @description Manually entered baseline metric value (a conversion percentage for funnel metrics). Only used in manual mode.
             * @default null
             */
            manualBaselineValue: number | null;
            /**
             * Manualexposurerate
             * @description Manually entered estimate of users exposed to the experiment per day. Only used in manual mode.
             * @default null
             */
            manualExposureRate: number | null;
            /**
             * @description Metric type the manual baseline value refers to. Only used in manual mode.
             * @default null
             */
            manualMetricType: components["schemas"]["ManualMetricType"] | null;
        };
        /**
         * @description Feature-flag filters accepted by the experiment endpoints: the flag's own filters shape,
         *     minus the keys experiments don't apply.
         */
        ExperimentFeatureFlagFilters: {
            /** @description Overall rollout as a single group: [{"properties": [], "rollout_percentage": N}]. */
            groups?: components["schemas"]["ExperimentFlagRolloutGroup"][];
            /** @description Multivariate variant configuration. */
            multivariate?: components["schemas"]["ExperimentFlagMultivariate"] | null;
            /** @description Group type index for group-based feature flags. */
            aggregation_group_type_index?: number | null;
            /** @description Optional payload values keyed by variant key. */
            payloads?: {
                [key: string]: string;
            };
        };
        /**
         * @description Flag config for experiment create/update, sent through the linked feature flag's own shape.
         *
         *     Validated both as the OpenAPI request field (via ``ExperimentWriteSerializer``) and at runtime
         *     (``ExperimentSerializer._normalize_feature_flag_input`` runs it against the raw feature_flag
         *     object). Echoed read-only flag objects (carrying a non-null id) are handled upstream and never
         *     reach this validation.
         */
        ExperimentFeatureFlagInput: {
            /** @description Flag config to apply: `multivariate.variants` (2 to 20 variants; the baseline defaults to the variant keyed 'control' when present, else the first variant), `groups` (a single group with `rollout_percentage` only; release conditions are not supported here, edit the feature flag directly), `aggregation_group_type_index`, and `payloads` (JSON-encoded strings keyed by variant key). On update, config this object omits is preserved from the linked flag's current state. */
            filters?: components["schemas"]["ExperimentFeatureFlagFilters"];
            /** @description Whether the flag persists variant assignment across authentication steps. */
            ensure_experience_continuity?: boolean | null;
        };
        /** @description Multivariate config for the experiment's feature flag. */
        ExperimentFlagMultivariate: {
            /** @description Variant definitions (2 to 20). The baseline defaults to the variant keyed 'control' when present, else the first variant. */
            variants: components["schemas"]["ExperimentFlagVariant"][];
        };
        /**
         * @description A single release-condition group carrying only the overall rollout percentage, the one
         *     groups entry the experiment input applies.
         */
        ExperimentFlagRolloutGroup: {
            /** @description Percentage of users who enter the experiment (0-100). */
            rollout_percentage?: number | null;
            /** @description Must be empty or omitted: release-condition properties are not supported via the experiment input. Edit the feature flag directly for targeting. */
            properties?: unknown[];
        };
        /** @description A single multivariate variant. Extra per-variant keys are dropped. */
        ExperimentFlagVariant: {
            /** @description Unique variant key. The baseline defaults to the variant keyed 'control' when present, else the first variant. */
            key: string;
            /** @description Human-readable variant name. */
            name?: string;
            /** @description Variant rollout percentage (0-100). Across variants these must sum to 100. */
            rollout_percentage: number;
        };
        /** ExperimentFunnelMetric */
        ExperimentFunnelMetric: {
            /** @default null */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Conversion Window
             * @default null
             */
            conversion_window: number | null;
            /** @default null */
            conversion_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            /** @default null */
            funnel_order_type: components["schemas"]["StepOrderValue"] | null;
            /** @default null */
            goal: components["schemas"]["ExperimentMetricGoal"] | null;
            /**
             * Issharedmetric
             * @default null
             */
            isSharedMetric: boolean | null;
            /**
             * Kind
             * @default ExperimentMetric
             * @constant
             */
            kind: "ExperimentMetric";
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            metric_type: "funnel";
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Series */
            series: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"])[];
            /**
             * Sharedmetricid
             * @default null
             */
            sharedMetricId: number | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentFunnelsQuery */
        ExperimentFunnelsQuery: {
            /**
             * Experiment Id
             * @default null
             */
            experiment_id: number | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            funnels_query: components["schemas"]["FunnelsQuery"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ExperimentFunnelsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** @default null */
            response: components["schemas"]["ExperimentFunnelsQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentFunnelsQueryResponse */
        ExperimentFunnelsQueryResponse: {
            /** Credible Intervals */
            credible_intervals: {
                [key: string]: number[];
            };
            /** Expected Loss */
            expected_loss: number;
            /** @default null */
            funnels_query: components["schemas"]["FunnelsQuery"] | null;
            /** Insight */
            insight: {
                [key: string]: unknown;
            }[][];
            /**
             * Kind
             * @default ExperimentFunnelsQuery
             * @constant
             */
            kind: "ExperimentFunnelsQuery";
            /** Probability */
            probability: {
                [key: string]: number;
            };
            significance_code: components["schemas"]["ExperimentSignificanceCode"];
            /** Significant */
            significant: boolean;
            /**
             * Stats Version
             * @default null
             */
            stats_version: number | null;
            /** Variants */
            variants: components["schemas"]["ExperimentVariantFunnelsBaseStats"][];
            /**
             * Warnings
             * @description Data warehouse sync warnings — see AnalyticsQueryResponseBase.warnings for semantics.
             * @default null
             */
            warnings: components["schemas"]["DataWarehouseSyncWarning"][] | null;
        };
        /** @description A holdout group — a stable slice of users excluded from experiment exposure. */
        ExperimentHoldout: {
            readonly id: number;
            /** @description Human-readable name for the holdout group. */
            name: string;
            /** @description Optional description of what this holdout reserves and why. */
            description?: string | null;
            /** @description Non-empty list of release-condition groups defining the held-out population, using the same shape as feature-flag release conditions. Each element's `rollout_percentage` (0–100, may be fractional) is the **exclusion** percentage — the share of users held back from all experiments that reference this holdout. `properties` optionally narrows the group by person/group properties. Do not set `variant`: the server normalizes it to `holdout-{id}`. Note that only the first element's `rollout_percentage` is embedded into each linked experiment's feature flag, and this population is shared across every experiment using the holdout. */
            filters?: components["schemas"]["FeatureFlagConditionGroupSchema"][];
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /** ExperimentMeanMetric */
        ExperimentMeanMetric: {
            /** @default null */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Conversion Window
             * @default null
             */
            conversion_window: number | null;
            /** @default null */
            conversion_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            /** @default null */
            goal: components["schemas"]["ExperimentMetricGoal"] | null;
            /**
             * Ignore Zeros
             * @default null
             */
            ignore_zeros: boolean | null;
            /**
             * Issharedmetric
             * @default null
             */
            isSharedMetric: boolean | null;
            /**
             * Kind
             * @default ExperimentMetric
             * @constant
             */
            kind: "ExperimentMetric";
            /**
             * Lower Bound Percentile
             * @description Winsorization lower percentile bound, as a fraction in [0, 1] (e.g. 0.01 for the 1st percentile).
             * @default null
             */
            lower_bound_percentile: number | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            metric_type: "mean";
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Sharedmetricid
             * @default null
             */
            sharedMetricId: number | null;
            /** Source */
            source: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
            /**
             * Threshold
             * @description When set, reports the percentage of users whose per-user summed/counted value reaches or exceeds this threshold. Only meaningful for sum/count math types.
             * @default null
             */
            threshold: number | null;
            /**
             * Upper Bound Percentile
             * @description Winsorization upper percentile bound, as a fraction in [0, 1] (e.g. 0.99 for the 99th percentile).
             * @default null
             */
            upper_bound_percentile: number | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * ExperimentMetricGoal
         * @enum {string}
         */
        ExperimentMetricGoal: "increase" | "decrease";
        /**
         * ExperimentMetricMathType
         * @enum {string}
         */
        ExperimentMetricMathType: "total" | "sum" | "unique_session" | "min" | "max" | "avg" | "dau" | "unique_group" | "hogql";
        /** ExperimentMetricOutlierHandling */
        ExperimentMetricOutlierHandling: {
            /**
             * Ignore Zeros
             * @default null
             */
            ignore_zeros: boolean | null;
            /**
             * Lower Bound Percentile
             * @description Winsorization lower percentile bound, as a fraction in [0, 1] (e.g. 0.01 for the 1st percentile).
             * @default null
             */
            lower_bound_percentile: number | null;
            /**
             * Upper Bound Percentile
             * @description Winsorization upper percentile bound, as a fraction in [0, 1] (e.g. 0.99 for the 99th percentile).
             * @default null
             */
            upper_bound_percentile: number | null;
        };
        /**
         * ExperimentMetricType
         * @enum {string}
         */
        ExperimentMetricType: "funnel" | "mean" | "ratio" | "retention";
        /** ExperimentParameters */
        ExperimentParameters: {
            /**
             * Minimum Detectable Effect
             * @description Minimum detectable effect as a percentage. Lower values need more users but catch smaller changes. Suggest 20–30% for most experiments.
             * @default null
             */
            minimum_detectable_effect: number | null;
            /**
             * Variant Notes
             * @description Free-text notes per variant, keyed by variant key. Use to document what each variant does or its reroute URL.
             * @default null
             */
            variant_notes: {
                [key: string]: string;
            } | null;
        };
        /** ExperimentQuery */
        ExperimentQuery: {
            /**
             * Experiment Id
             * @default null
             */
            experiment_id: number | null;
            /**
             * Kind
             * @default ExperimentQuery
             * @constant
             */
            kind: "ExperimentQuery";
            /** Metric */
            metric: components["schemas"]["ExperimentMeanMetric"] | components["schemas"]["ExperimentFunnelMetric"] | components["schemas"]["ExperimentRatioMetric"] | components["schemas"]["ExperimentRetentionMetric"];
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** @default null */
            precomputation_mode: components["schemas"]["PrecomputationMode"] | null;
            /** @default null */
            response: components["schemas"]["ExperimentQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentQueryResponse */
        ExperimentQueryResponse: {
            /** @default null */
            baseline: components["schemas"]["ExperimentStatsBaseValidated"] | null;
            /**
             * Breakdown Results
             * @description Results grouped by breakdown value. When present, baseline and variant_results contain aggregated data.
             * @default null
             */
            breakdown_results: components["schemas"]["ExperimentBreakdownResult"][] | null;
            /**
             * Clickhouse Sql
             * @default null
             */
            clickhouse_sql: string | null;
            /**
             * Credible Intervals
             * @default null
             */
            credible_intervals: {
                [key: string]: number[];
            } | null;
            /**
             * Hogql
             * @default null
             */
            hogql: string | null;
            /**
             * Insight
             * @default null
             */
            insight: {
                [key: string]: unknown;
            }[] | null;
            /**
             * Is Precomputed
             * @description Whether exposures were served from the precomputation system
             * @default null
             */
            is_precomputed: boolean | null;
            /**
             * Kind
             * @default ExperimentQuery
             * @constant
             */
            kind: "ExperimentQuery";
            /**
             * Metric
             * @default null
             */
            metric: (components["schemas"]["ExperimentMeanMetric"] | components["schemas"]["ExperimentFunnelMetric"] | components["schemas"]["ExperimentRatioMetric"] | components["schemas"]["ExperimentRetentionMetric"]) | null;
            /**
             * P Value
             * @default null
             */
            p_value: number | null;
            /**
             * Probability
             * @default null
             */
            probability: {
                [key: string]: number;
            } | null;
            /** @default null */
            significance_code: components["schemas"]["ExperimentSignificanceCode"] | null;
            /**
             * Significant
             * @default null
             */
            significant: boolean | null;
            /**
             * Stats Version
             * @default null
             */
            stats_version: number | null;
            /**
             * Variant Results
             * @default null
             */
            variant_results: components["schemas"]["ExperimentVariantResultFrequentist"][] | components["schemas"]["ExperimentVariantResultBayesian"][] | null;
            /**
             * Variants
             * @default null
             */
            variants: components["schemas"]["ExperimentVariantTrendsBaseStats"][] | components["schemas"]["ExperimentVariantFunnelsBaseStats"][] | null;
            /**
             * Warnings
             * @description Data warehouse sync warnings — see AnalyticsQueryResponseBase.warnings for semantics.
             * @default null
             */
            warnings: components["schemas"]["DataWarehouseSyncWarning"][] | null;
        };
        /** ExperimentRatioMetric */
        ExperimentRatioMetric: {
            /** @default null */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Conversion Window
             * @default null
             */
            conversion_window: number | null;
            /** @default null */
            conversion_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /** Denominator */
            denominator: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
            /** @default null */
            denominator_outlier_handling: components["schemas"]["ExperimentMetricOutlierHandling"] | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            /** @default null */
            goal: components["schemas"]["ExperimentMetricGoal"] | null;
            /**
             * Issharedmetric
             * @default null
             */
            isSharedMetric: boolean | null;
            /**
             * Kind
             * @default ExperimentMetric
             * @constant
             */
            kind: "ExperimentMetric";
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            metric_type: "ratio";
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** Numerator */
            numerator: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
            /** @default null */
            numerator_outlier_handling: components["schemas"]["ExperimentMetricOutlierHandling"] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Sharedmetricid
             * @default null
             */
            sharedMetricId: number | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentRetentionMetric */
        ExperimentRetentionMetric: {
            /** @default null */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /** Completion Event */
            completion_event: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
            /**
             * Conversion Window
             * @default null
             */
            conversion_window: number | null;
            /** @default null */
            conversion_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            /** @default null */
            goal: components["schemas"]["ExperimentMetricGoal"] | null;
            /**
             * Issharedmetric
             * @default null
             */
            isSharedMetric: boolean | null;
            /**
             * Kind
             * @default ExperimentMetric
             * @constant
             */
            kind: "ExperimentMetric";
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            metric_type: "retention";
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Retention Window End */
            retention_window_end: number;
            /** Retention Window Start */
            retention_window_start: number;
            retention_window_unit: components["schemas"]["FunnelConversionWindowTimeUnit"];
            /**
             * Sharedmetricid
             * @default null
             */
            sharedMetricId: number | null;
            /** Start Event */
            start_event: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
            start_handling: components["schemas"]["StartHandling"];
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentRunningTimeCalculation */
        ExperimentRunningTimeCalculation: {
            /**
             * @description How the exposure estimate is configured: manual user-entered values or automatic from live experiment data.
             * @default null
             */
            exposure_estimate_config: components["schemas"]["ExperimentExposureEstimateConfig"] | null;
            /**
             * Minimum Detectable Effect
             * @description Minimum detectable effect as a percentage. Lower values need more users but catch smaller changes.
             * @default null
             */
            minimum_detectable_effect: number | null;
            /**
             * Recommended Running Time
             * @description Estimated number of days needed to reach the recommended sample size.
             * @default null
             */
            recommended_running_time: number | null;
            /**
             * Recommended Sample Size
             * @description Recommended number of exposed users needed for statistical significance.
             * @default null
             */
            recommended_sample_size: number | null;
        };
        /** @description Mixin for serializers to add user access control fields */
        ExperimentSavedMetric: {
            readonly id: number;
            /** @description Name of the shared metric. Must be unique within the project (case-insensitive). */
            name: string;
            /** @description Short description of what the metric measures. */
            description?: string | null;
            /** @description ExperimentMetric JSON. Must have kind='ExperimentMetric' and a metric_type: 'mean' (set source to an EventsNode with an event name), 'funnel' (set series to an array of EventsNode steps), 'ratio' (set numerator and denominator EventsNode entries), or 'retention' (set start_event and completion_event). Legacy kinds (ExperimentTrendsQuery, ExperimentFunnelsQuery) are rejected for new shared metrics. */
            query: unknown;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            tags?: unknown[];
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /**
         * ExperimentSignificanceCode
         * @enum {string}
         */
        ExperimentSignificanceCode: "significant" | "not_enough_exposure" | "low_win_probability" | "high_loss" | "high_p_value";
        /** ExperimentStatsBaseValidated */
        ExperimentStatsBaseValidated: {
            /**
             * Covariate Sum
             * @default null
             */
            covariate_sum: number | null;
            /**
             * Covariate Sum Product
             * @default null
             */
            covariate_sum_product: number | null;
            /**
             * Covariate Sum Squares
             * @default null
             */
            covariate_sum_squares: number | null;
            /**
             * Denominator Sum
             * @default null
             */
            denominator_sum: number | null;
            /**
             * Denominator Sum Squares
             * @default null
             */
            denominator_sum_squares: number | null;
            /** Key */
            key: string;
            /** Number Of Samples */
            number_of_samples: number;
            /**
             * Numerator Denominator Sum Product
             * @default null
             */
            numerator_denominator_sum_product: number | null;
            /**
             * Step Counts
             * @default null
             */
            step_counts: number[] | null;
            /**
             * Step Sessions
             * @default null
             */
            step_sessions: components["schemas"]["SessionData"][][] | null;
            /** Sum */
            sum: number;
            /** Sum Squares */
            sum_squares: number;
            /**
             * Validation Failures
             * @default null
             */
            validation_failures: components["schemas"]["ExperimentStatsValidationFailure"][] | null;
        };
        /**
         * ExperimentStatsValidationFailure
         * @enum {string}
         */
        ExperimentStatsValidationFailure: "not-enough-exposures" | "baseline-mean-is-zero" | "not-enough-metric-data";
        /** @enum {string} */
        ExperimentStatusEnum: "draft" | "running" | "paused" | "exposure_frozen" | "stopped";
        ExperimentToSavedMetric: {
            readonly id: number;
            experiment: number;
            saved_metric: number;
            /** Format: date-time */
            readonly created_at: string;
            readonly query: unknown;
            readonly name: string;
        };
        /** ExperimentTrendsQuery */
        ExperimentTrendsQuery: {
            count_query: components["schemas"]["TrendsQuery"];
            /**
             * Experiment Id
             * @default null
             */
            experiment_id: number | null;
            /** @default null */
            exposure_query: components["schemas"]["TrendsQuery"] | null;
            /**
             * Fingerprint
             * @default null
             */
            fingerprint: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ExperimentTrendsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** @default null */
            response: components["schemas"]["ExperimentTrendsQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** ExperimentTrendsQueryResponse */
        ExperimentTrendsQueryResponse: {
            /** @default null */
            count_query: components["schemas"]["TrendsQuery"] | null;
            /** Credible Intervals */
            credible_intervals: {
                [key: string]: number[];
            };
            /** @default null */
            exposure_query: components["schemas"]["TrendsQuery"] | null;
            /** Insight */
            insight: {
                [key: string]: unknown;
            }[];
            /**
             * Kind
             * @default ExperimentTrendsQuery
             * @constant
             */
            kind: "ExperimentTrendsQuery";
            /** P Value */
            p_value: number;
            /** Probability */
            probability: {
                [key: string]: number;
            };
            significance_code: components["schemas"]["ExperimentSignificanceCode"];
            /** Significant */
            significant: boolean;
            /**
             * Stats Version
             * @default null
             */
            stats_version: number | null;
            /** Variants */
            variants: components["schemas"]["ExperimentVariantTrendsBaseStats"][];
            /**
             * Warnings
             * @description Data warehouse sync warnings — see AnalyticsQueryResponseBase.warnings for semantics.
             * @default null
             */
            warnings: components["schemas"]["DataWarehouseSyncWarning"][] | null;
        };
        /**
         * @description * `web` - web
         *     * `product` - product
         * @enum {string}
         */
        ExperimentTypeEnum: "web" | "product";
        /** ExperimentVariantFunnelsBaseStats */
        ExperimentVariantFunnelsBaseStats: {
            /** Failure Count */
            failure_count: number;
            /** Key */
            key: string;
            /** Success Count */
            success_count: number;
        };
        /** ExperimentVariantResultBayesian */
        ExperimentVariantResultBayesian: {
            /**
             * Chance To Win
             * @default null
             */
            chance_to_win: number | null;
            /**
             * Covariate Sum
             * @default null
             */
            covariate_sum: number | null;
            /**
             * Covariate Sum Product
             * @default null
             */
            covariate_sum_product: number | null;
            /**
             * Covariate Sum Squares
             * @default null
             */
            covariate_sum_squares: number | null;
            /**
             * Credible Interval
             * @default null
             */
            credible_interval: number[] | null;
            /**
             * Denominator Sum
             * @default null
             */
            denominator_sum: number | null;
            /**
             * Denominator Sum Squares
             * @default null
             */
            denominator_sum_squares: number | null;
            /** Key */
            key: string;
            /**
             * Method
             * @default bayesian
             * @constant
             */
            method: "bayesian";
            /** Number Of Samples */
            number_of_samples: number;
            /**
             * Numerator Denominator Sum Product
             * @default null
             */
            numerator_denominator_sum_product: number | null;
            /**
             * Significant
             * @default null
             */
            significant: boolean | null;
            /**
             * Step Counts
             * @default null
             */
            step_counts: number[] | null;
            /**
             * Step Sessions
             * @default null
             */
            step_sessions: components["schemas"]["SessionData"][][] | null;
            /** Sum */
            sum: number;
            /** Sum Squares */
            sum_squares: number;
            /**
             * Validation Failures
             * @default null
             */
            validation_failures: components["schemas"]["ExperimentStatsValidationFailure"][] | null;
        };
        /** ExperimentVariantResultFrequentist */
        ExperimentVariantResultFrequentist: {
            /**
             * Confidence Interval
             * @default null
             */
            confidence_interval: number[] | null;
            /**
             * Covariate Sum
             * @default null
             */
            covariate_sum: number | null;
            /**
             * Covariate Sum Product
             * @default null
             */
            covariate_sum_product: number | null;
            /**
             * Covariate Sum Squares
             * @default null
             */
            covariate_sum_squares: number | null;
            /**
             * Denominator Sum
             * @default null
             */
            denominator_sum: number | null;
            /**
             * Denominator Sum Squares
             * @default null
             */
            denominator_sum_squares: number | null;
            /** Key */
            key: string;
            /**
             * Method
             * @default frequentist
             * @constant
             */
            method: "frequentist";
            /** Number Of Samples */
            number_of_samples: number;
            /**
             * Numerator Denominator Sum Product
             * @default null
             */
            numerator_denominator_sum_product: number | null;
            /**
             * P Value
             * @default null
             */
            p_value: number | null;
            /**
             * Significant
             * @default null
             */
            significant: boolean | null;
            /**
             * Step Counts
             * @default null
             */
            step_counts: number[] | null;
            /**
             * Step Sessions
             * @default null
             */
            step_sessions: components["schemas"]["SessionData"][][] | null;
            /** Sum */
            sum: number;
            /** Sum Squares */
            sum_squares: number;
            /**
             * Validation Failures
             * @default null
             */
            validation_failures: components["schemas"]["ExperimentStatsValidationFailure"][] | null;
        };
        /** ExperimentVariantTrendsBaseStats */
        ExperimentVariantTrendsBaseStats: {
            /** Absolute Exposure */
            absolute_exposure: number;
            /** Count */
            count: number;
            /** Exposure */
            exposure: number;
            /** Key */
            key: string;
        };
        /** @description Experiment write payload. Identical to Experiment, plus the writable `feature_flag` config input. */
        ExperimentWrite: {
            readonly id: number;
            /** @description Name of the experiment. */
            name: string;
            /** @description Description of the experiment hypothesis and expected outcomes. */
            description?: string | null;
            /** Format: date-time */
            start_date?: string | null;
            /** Format: date-time */
            end_date?: string | null;
            /** @description Unique key for the experiment's feature flag. Letters, numbers, hyphens, and underscores only. Search existing flags with the feature-flag-get-all tool first — reuse an existing flag when possible. */
            feature_flag_key: string;
            /** @description Feature-flag config for the experiment, in the flag's own filters shape. The linked flag is the source of truth for variants, rollout, aggregation, payloads, and experience continuity: send config here instead of the deprecated `parameters` keys. On a running experiment, also send `update_feature_flag_params=true`. Cannot be combined with the key of a pre-existing feature flag on create (the experiment links to it as-is). */
            feature_flag?: components["schemas"]["ExperimentFeatureFlagInput"];
            readonly holdout: components["schemas"]["ExperimentHoldout"];
            /** @description ID of a holdout group to exclude from the experiment. */
            holdout_id?: number | null;
            readonly exposure_cohort: number | null;
            /** @description Experiment parameters JSON. Supported keys include `custom_exposure_filter` and `variant_notes` (free-text notes per variant, keyed by variant key). Flag config (variants, rollout, aggregation, payloads, experience continuity) belongs on the `feature_flag` object; send it there. For backward compatibility, config still sent through these deprecated keys is copied onto the linked flag rather than rejected, and reads project the flag's current config back into this field. Excluded variants live on the top-level `excluded_variants` field, not here. */
            parameters?: components["schemas"]["ExperimentParameters"] | null;
            /** @description Running-time calculator state: `minimum_detectable_effect`, `recommended_running_time`, `recommended_sample_size`, and `exposure_estimate_config`. Canonical home for these keys, which historically lived in `parameters`. */
            running_time_calculation?: components["schemas"]["ExperimentRunningTimeCalculation"] | null;
            /** @description Variant keys to exclude from metric result calculations. Excluded variants are still served to users but omitted from statistical analysis. The baseline variant and holdout pseudo-variants cannot be excluded. Canonical home for what historically lived in `parameters.excluded_variants`. */
            excluded_variants?: string[] | null;
            readonly saved_metrics: components["schemas"]["ExperimentToSavedMetric"][];
            /** @description IDs of shared saved metrics to attach to this experiment. Each item has 'id' (saved metric ID) and 'metadata' with 'type' (primary or secondary). */
            saved_metrics_ids?: unknown[] | null;
            /**
             * @description Whether the experiment is archived.
             * @default false
             */
            archived: boolean;
            deleted?: boolean | null;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            /**
             * @description Experiment type: web for frontend UI changes, product for backend/API changes.
             *
             *     * `web` - web
             *     * `product` - product
             */
            type?: components["schemas"]["ExperimentTypeEnum"] | components["schemas"]["NullEnum"];
            /** @description Exposure configuration including filter test accounts and custom exposure events. */
            exposure_criteria?: components["schemas"]["ExperimentApiExposureCriteria"] | null;
            /** @description Primary experiment metrics. Each metric must have kind='ExperimentMetric' and a metric_type: 'mean' (set source to an EventsNode with an event name), 'funnel' (set series to an array of EventsNode steps), 'ratio' (set numerator and denominator EventsNode entries), or 'retention' (set start_event and completion_event). Use the read-data-schema tool with query kind 'events' to find available events in the project. */
            metrics?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /** @description Secondary metrics for additional measurements. Same format as primary metrics. */
            metrics_secondary?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /**
             * @description Suppresses the validation that rejects metrics referencing events not yet ingested by this project. REQUIRES explicit user confirmation before being set to true — never flip this silently to retry a failed call. The default validation catches typo'd event names and missing instrumentation. Set this to true only when the user has confirmed the event is intentional (e.g. they are about to instrument it).
             * @default false
             */
            allow_unknown_events: boolean;
            /** create in folder */
            _create_in_folder?: string;
            /**
             * @description Experiment conclusion: won, lost, inconclusive, stopped_early, or invalid.
             *
             *     * `won` - won
             *     * `lost` - lost
             *     * `inconclusive` - inconclusive
             *     * `stopped_early` - stopped_early
             *     * `invalid` - invalid
             */
            conclusion?: components["schemas"]["ConclusionEnum"] | components["schemas"]["NullEnum"];
            /** @description Comment about the experiment conclusion. */
            conclusion_comment?: string | null;
            /**
             * Format: uuid
             * @description ID of the Code task opened to remove the experiment's feature-flag code, when one was requested via open_cleanup_pr on end/ship_variant. Read its status via the flag_cleanup_task action.
             */
            readonly flag_cleanup_task_id: string | null;
            only_count_matured_users?: boolean;
            /**
             * @description When true, sync the flag config sent in this request (via the `feature_flag` object) to the linked feature flag. Draft experiments always sync regardless. On a running experiment, `feature_flag` config without this flag is rejected.
             * @default false
             */
            update_feature_flag_params: boolean;
            /** @description Experiment lifecycle state: 'draft' (not yet launched), 'running' (launched with active feature flag), 'paused' (running with feature flag deactivated — virtual state derived from feature_flag.active, not stored), 'exposure_frozen' (running with enrollment frozen to the already-exposed cohort while metrics keep flowing — virtual state derived from the flag's release groups, not stored), 'stopped' (ended). */
            readonly status: components["schemas"]["ExperimentStatusEnum"];
            /** @description Whether the experiment uses any legacy-engine metrics (ExperimentTrendsQuery or ExperimentFunnelsQuery). Used to flag legacy experiments and gate actions that don't support them, such as duplicate and copy-to-project. */
            readonly is_legacy: boolean;
            /** @description Whether enrollment can be frozen right now: the experiment must be running (not draft, paused, stopped, or already frozen) and its feature flag must have release conditions that a person cohort can narrow (no group aggregation, no holdout, no early access conditions). */
            readonly can_freeze_exposure: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
        };
        /** @description Serializer mixin that handles tags for objects. */
        FeatureFlag: {
            readonly id: number;
            /** @description contains the description for the flag (field name `name` is kept for backwards-compatibility) */
            name?: string;
            key: string;
            filters?: {
                [key: string]: unknown;
            };
            deleted?: boolean;
            active?: boolean;
            /** @description Whether the flag is archived. Archived flags are hidden from the flag list by default and must be disabled (`active: false`). */
            archived?: boolean;
            readonly created_by: components["schemas"]["UserBasic"];
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            readonly updated_at: string | null;
            /** @default 0 */
            version: number;
            readonly last_modified_by: components["schemas"]["UserBasic"];
            ensure_experience_continuity?: boolean | null;
            readonly experiment_set: number[];
            readonly experiment_set_metadata: components["schemas"]["FeatureFlagExperimentSetMetadata"][];
            readonly surveys: {
                [key: string]: unknown;
            };
            readonly features: {
                [key: string]: unknown;
            };
            readonly can_edit: boolean;
            tags?: unknown[];
            evaluation_contexts?: unknown[];
            readonly usage_dashboard: number;
            analytics_dashboards?: number[];
            has_enriched_analytics?: boolean | null;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
            /**
             * @description Indicates the origin product of the feature flag. Choices: 'feature_flags', 'experiments', 'surveys', 'early_access_features', 'web_experiments', 'product_tours'.
             *
             *     * `feature_flags` - feature_flags
             *     * `experiments` - experiments
             *     * `surveys` - surveys
             *     * `early_access_features` - early_access_features
             *     * `web_experiments` - web_experiments
             *     * `product_tours` - product_tours
             */
            creation_context?: components["schemas"]["FeatureFlagCreationContextEnum"];
            is_remote_configuration?: boolean | null;
            has_encrypted_payloads?: boolean | null;
            readonly status: string;
            /**
             * @description Specifies where this feature flag should be evaluated
             *
             *     * `server` - Server
             *     * `client` - Client
             *     * `all` - All
             */
            evaluation_runtime?: components["schemas"]["EvaluationRuntimeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            /**
             * @description Identifier used for bucketing users into rollout and variants
             *
             *     * `distinct_id` - User ID (default)
             *     * `device_id` - Device ID
             */
            bucketing_identifier?: components["schemas"]["BucketingIdentifierEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            /**
             * Format: date-time
             * @description Last time this feature flag was called (from $feature_flag_called events)
             */
            last_called_at?: string | null;
            /** create in folder */
            _create_in_folder?: string;
            /**
             * should create usage dashboard
             * @default true
             */
            _should_create_usage_dashboard: boolean;
            /** @description Check if this feature flag is used in any team's session recording linked flag setting. */
            readonly is_used_in_replay_settings: boolean;
            /** @description Whether this flag can back an experiment: multivariate with 2 to 20 variants. */
            readonly is_eligible_for_experiment: boolean;
        };
        FeatureFlagConditionGroupSchema: {
            /** @description Property conditions for this release condition group. */
            properties?: components["schemas"]["FeatureFlagFilterPropertySchema"][];
            /**
             * Format: double
             * @description Rollout percentage for this release condition group.
             */
            rollout_percentage?: number;
            /** @description Variant key override for multivariate flags. */
            variant?: string | null;
            /** @description Group type index for this condition set. None means person-level aggregation. */
            aggregation_group_type_index?: number | null;
        };
        FeatureFlagCreateRequestSchema: {
            /** @description Feature flag key. */
            key?: string;
            /** @description Feature flag description (stored in the `name` field for backwards compatibility). */
            name?: string;
            /** @description Feature flag targeting configuration. */
            filters?: components["schemas"]["FeatureFlagFiltersSchema"];
            /** @description Whether the feature flag is active. */
            active?: boolean;
            /** @description Whether the flag is archived. Archived flags are hidden from the flag list by default and must be disabled (`active: false`). */
            archived?: boolean;
            /** @description Organizational tags for this feature flag. */
            tags?: string[];
            /** @description Evaluation contexts that control where this flag evaluates at runtime. */
            evaluation_contexts?: string[];
            /** @description Whether this flag is a remote configuration flag that delivers a payload rather than gating a feature. */
            is_remote_configuration?: boolean | null;
            /** @description Whether to persist a user's flag value across the anonymous-to-identified transition (the 'persist across authentication steps' option). Incompatible with device_id bucketing. */
            ensure_experience_continuity?: boolean | null;
            /**
             * @description Where this flag is allowed to evaluate: 'server' (server-side SDKs only), 'client' (client-side SDKs only), or 'all' (both). Defaults to 'all'.
             *
             *     * `server` - Server
             *     * `client` - Client
             *     * `all` - All
             */
            evaluation_runtime?: components["schemas"]["EvaluationRuntimeEnum"] | components["schemas"]["NullEnum"];
            /**
             * @description Identifier used to bucket users into rollout percentages and variants: 'distinct_id' (user ID, the default) or 'device_id'. Using 'device_id' is incompatible with ensure_experience_continuity=True.
             *
             *     * `distinct_id` - User ID (default)
             *     * `device_id` - Device ID
             */
            bucketing_identifier?: components["schemas"]["BucketingIdentifierEnum"] | components["schemas"]["NullEnum"];
        };
        /**
         * @description * `feature_flags` - feature_flags
         *     * `experiments` - experiments
         *     * `surveys` - surveys
         *     * `early_access_features` - early_access_features
         *     * `web_experiments` - web_experiments
         *     * `product_tours` - product_tours
         * @enum {string}
         */
        FeatureFlagCreationContextEnum: "feature_flags" | "experiments" | "surveys" | "early_access_features" | "web_experiments" | "product_tours";
        FeatureFlagExperimentSetMetadata: {
            /** @description ID of the experiment linked to this flag. */
            id: number;
            /** @description Name of the experiment linked to this flag. */
            name: string;
            /** @description Whether the experiment is currently running (started and not yet stopped). A running experiment blocks deletion of the linked flag. */
            is_running: boolean;
        };
        FeatureFlagFilterPropertyCohortInSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Cohort property type required for in/not_in operators.
             *
             *     * `cohort` - cohort
             */
            type: components["schemas"]["FeatureFlagFilterPropertyCohortInSchemaTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Membership operator for cohort properties.
             *
             *     * `in` - in
             *     * `not_in` - not_in
             */
            operator: components["schemas"]["FeatureFlagFilterPropertyCohortInSchemaOperatorEnum"];
            /** @description Cohort comparison value (single or list, depending on usage). */
            value: unknown;
        };
        /**
         * @description * `in` - in
         *     * `not_in` - not_in
         * @enum {string}
         */
        FeatureFlagFilterPropertyCohortInSchemaOperatorEnum: "in" | "not_in";
        /**
         * @description * `cohort` - cohort
         * @enum {string}
         */
        FeatureFlagFilterPropertyCohortInSchemaTypeEnum: "cohort";
        FeatureFlagFilterPropertyDateSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Property filter type. Common values are 'person' and 'cohort'.
             *
             *     * `cohort` - cohort
             *     * `person` - person
             *     * `group` - group
             */
            type?: components["schemas"]["PropertyGroupTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Date comparison operator.
             *
             *     * `is_date_exact` - is_date_exact
             *     * `is_date_after` - is_date_after
             *     * `is_date_before` - is_date_before
             */
            operator: components["schemas"]["DateOperatorEnum"];
            /** @description Date value in ISO format or relative date expression. */
            value: string;
        };
        FeatureFlagFilterPropertyExistsSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Property filter type. Common values are 'person' and 'cohort'.
             *
             *     * `cohort` - cohort
             *     * `person` - person
             *     * `group` - group
             */
            type?: components["schemas"]["PropertyGroupTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Existence operator.
             *
             *     * `is_set` - is_set
             *     * `is_not_set` - is_not_set
             */
            operator: components["schemas"]["ExistenceOperatorEnum"];
            /** @description Optional value. Runtime behavior determines whether this is ignored. */
            value?: unknown;
        };
        FeatureFlagFilterPropertyFlagEvaluatesSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Flag property type required for flag dependency checks.
             *
             *     * `flag` - flag
             */
            type: components["schemas"]["FeatureFlagFilterPropertyFlagEvaluatesSchemaTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Operator for feature flag dependency evaluation.
             *
             *     * `flag_evaluates_to` - flag_evaluates_to
             */
            operator: components["schemas"]["FeatureFlagFilterPropertyFlagEvaluatesSchemaOperatorEnum"];
            /** @description Value to compare flag evaluation against. */
            value: unknown;
        };
        /**
         * @description * `flag_evaluates_to` - flag_evaluates_to
         * @enum {string}
         */
        FeatureFlagFilterPropertyFlagEvaluatesSchemaOperatorEnum: "flag_evaluates_to";
        /**
         * @description * `flag` - flag
         * @enum {string}
         */
        FeatureFlagFilterPropertyFlagEvaluatesSchemaTypeEnum: "flag";
        FeatureFlagFilterPropertyGenericSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Property filter type. Common values are 'person' and 'cohort'.
             *
             *     * `cohort` - cohort
             *     * `person` - person
             *     * `group` - group
             */
            type?: components["schemas"]["PropertyGroupTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /** @description Comparison value for the property filter. Supports strings, numbers, booleans, and arrays. */
            value: unknown;
            /**
             * @description Operator used to compare the property value.
             *
             *     * `exact` - exact
             *     * `is_not` - is_not
             *     * `icontains` - icontains
             *     * `not_icontains` - not_icontains
             *     * `regex` - regex
             *     * `not_regex` - not_regex
             *     * `gt` - gt
             *     * `gte` - gte
             *     * `lt` - lt
             *     * `lte` - lte
             */
            operator: components["schemas"]["FeatureFlagFilterPropertyGenericSchemaOperatorEnum"];
        };
        /**
         * @description * `exact` - exact
         *     * `is_not` - is_not
         *     * `icontains` - icontains
         *     * `not_icontains` - not_icontains
         *     * `regex` - regex
         *     * `not_regex` - not_regex
         *     * `gt` - gt
         *     * `gte` - gte
         *     * `lt` - lt
         *     * `lte` - lte
         * @enum {string}
         */
        FeatureFlagFilterPropertyGenericSchemaOperatorEnum: "exact" | "is_not" | "icontains" | "not_icontains" | "regex" | "not_regex" | "gt" | "gte" | "lt" | "lte";
        FeatureFlagFilterPropertyMultiContainsSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Property filter type. Common values are 'person' and 'cohort'.
             *
             *     * `cohort` - cohort
             *     * `person` - person
             *     * `group` - group
             */
            type?: components["schemas"]["PropertyGroupTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Multi-contains operator.
             *
             *     * `icontains_multi` - icontains_multi
             *     * `not_icontains_multi` - not_icontains_multi
             */
            operator: components["schemas"]["FeatureFlagFilterPropertyMultiContainsSchemaOperatorEnum"];
            /** @description List of strings to evaluate against. */
            value: string[];
        };
        /**
         * @description * `icontains_multi` - icontains_multi
         *     * `not_icontains_multi` - not_icontains_multi
         * @enum {string}
         */
        FeatureFlagFilterPropertyMultiContainsSchemaOperatorEnum: "icontains_multi" | "not_icontains_multi";
        FeatureFlagFilterPropertySchema: components["schemas"]["FeatureFlagFilterPropertyGenericSchema"] | components["schemas"]["FeatureFlagFilterPropertyExistsSchema"] | components["schemas"]["FeatureFlagFilterPropertyDateSchema"] | components["schemas"]["FeatureFlagFilterPropertySemverSchema"] | components["schemas"]["FeatureFlagFilterPropertyMultiContainsSchema"] | components["schemas"]["FeatureFlagFilterPropertyCohortInSchema"] | components["schemas"]["FeatureFlagFilterPropertyFlagEvaluatesSchema"];
        FeatureFlagFilterPropertySemverSchema: {
            /** @description Property key used in this feature flag condition. */
            key: string;
            /**
             * @description Property filter type. Common values are 'person' and 'cohort'.
             *
             *     * `cohort` - cohort
             *     * `person` - person
             *     * `group` - group
             */
            type?: components["schemas"]["PropertyGroupTypeEnum"];
            /** @description Resolved cohort name for cohort-type filters. */
            cohort_name?: string | null;
            /** @description Group type index when using group-based filters. */
            group_type_index?: number | null;
            /**
             * @description Semantic version comparison operator.
             *
             *     * `semver_gt` - semver_gt
             *     * `semver_gte` - semver_gte
             *     * `semver_lt` - semver_lt
             *     * `semver_lte` - semver_lte
             *     * `semver_eq` - semver_eq
             *     * `semver_neq` - semver_neq
             *     * `semver_tilde` - semver_tilde
             *     * `semver_caret` - semver_caret
             *     * `semver_wildcard` - semver_wildcard
             */
            operator: components["schemas"]["FeatureFlagFilterPropertySemverSchemaOperatorEnum"];
            /** @description Semantic version string. */
            value: string;
        };
        /**
         * @description * `semver_gt` - semver_gt
         *     * `semver_gte` - semver_gte
         *     * `semver_lt` - semver_lt
         *     * `semver_lte` - semver_lte
         *     * `semver_eq` - semver_eq
         *     * `semver_neq` - semver_neq
         *     * `semver_tilde` - semver_tilde
         *     * `semver_caret` - semver_caret
         *     * `semver_wildcard` - semver_wildcard
         * @enum {string}
         */
        FeatureFlagFilterPropertySemverSchemaOperatorEnum: "semver_gt" | "semver_gte" | "semver_lt" | "semver_lte" | "semver_eq" | "semver_neq" | "semver_tilde" | "semver_caret" | "semver_wildcard";
        FeatureFlagFiltersSchema: {
            /** @description Release condition groups for the feature flag. */
            groups?: components["schemas"]["FeatureFlagConditionGroupSchema"][];
            /** @description Multivariate configuration for variant-based rollouts. */
            multivariate?: components["schemas"]["FeatureFlagMultivariateSchema"] | null;
            /** @description Group type index for group-based feature flags. */
            aggregation_group_type_index?: number | null;
            /** @description Optional payload values keyed by variant key. */
            payloads?: {
                [key: string]: string;
            };
            /** @description Whether this flag has early access feature enrollment enabled. When true, the flag is evaluated against the person property $feature_enrollment/{flag_key}. */
            feature_enrollment?: boolean | null;
            /**
             * @description When true, condition evaluation stops at the first matching condition set rather than continuing to evaluate subsequent groups.
             * @default false
             */
            early_exit: boolean;
        };
        FeatureFlagMultivariateSchema: {
            /** @description Variant definitions for multivariate feature flags. */
            variants: components["schemas"]["FeatureFlagMultivariateVariantSchema"][];
        };
        FeatureFlagMultivariateVariantSchema: {
            /** @description Unique key for this variant. */
            key: string;
            /** @description Human-readable name for this variant. */
            name?: string;
            /**
             * Format: double
             * @description Variant rollout percentage.
             */
            rollout_percentage: number;
        };
        /** FeaturePropertyFilter */
        FeaturePropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @description Event property with "$feature/" prepended
             * @default feature
             * @constant
             */
            type: "feature";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * FilterLogicalOperator
         * @enum {string}
         */
        FilterLogicalOperator: "AND" | "OR";
        /** Filters */
        Filters: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Properties
             * @default null
             */
            properties: components["schemas"]["SessionPropertyFilter"][] | null;
        };
        /** FirstEvent */
        FirstEvent: {
            /** Distinct Id */
            distinct_id: string;
            /** Properties */
            properties: string;
            /** Timestamp */
            timestamp: string;
            /** Uuid */
            uuid: string;
        };
        /** FlagPropertyFilter */
        FlagPropertyFilter: {
            /**
             * Key
             * @description The key should be the flag ID
             */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Operator
             * @description Only flag_evaluates_to operator is allowed for flag dependencies
             * @default flag_evaluates_to
             * @constant
             */
            operator: "flag_evaluates_to";
            /**
             * Type
             * @description Feature flag dependency
             * @default flag
             * @constant
             */
            type: "flag";
            /**
             * Value
             * @description The value can be true, false, or a variant name
             */
            value: boolean | string;
        };
        /**
         * FunnelConversionWindowTimeUnit
         * @enum {string}
         */
        FunnelConversionWindowTimeUnit: "second" | "minute" | "hour" | "day" | "week" | "month";
        /** FunnelCorrelationActorsQuery */
        FunnelCorrelationActorsQuery: {
            /**
             * Funnelcorrelationpersonconverted
             * @default null
             */
            funnelCorrelationPersonConverted: boolean | null;
            /**
             * Funnelcorrelationpersonentity
             * @default null
             */
            funnelCorrelationPersonEntity: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["DataWarehouseNode"] | null;
            /**
             * Funnelcorrelationpropertyvalues
             * @default null
             */
            funnelCorrelationPropertyValues: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Includerecordings
             * @default null
             */
            includeRecordings: boolean | null;
            /**
             * Kind
             * @default FunnelCorrelationActorsQuery
             * @constant
             */
            kind: "FunnelCorrelationActorsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            source: components["schemas"]["FunnelCorrelationQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelCorrelationQuery */
        FunnelCorrelationQuery: {
            /**
             * Funnelcorrelationeventexcludepropertynames
             * @default null
             */
            funnelCorrelationEventExcludePropertyNames: string[] | null;
            /**
             * Funnelcorrelationeventnames
             * @default null
             */
            funnelCorrelationEventNames: string[] | null;
            /**
             * Funnelcorrelationexcludeeventnames
             * @default null
             */
            funnelCorrelationExcludeEventNames: string[] | null;
            /**
             * Funnelcorrelationexcludenames
             * @default null
             */
            funnelCorrelationExcludeNames: string[] | null;
            /**
             * Funnelcorrelationnames
             * @default null
             */
            funnelCorrelationNames: string[] | null;
            funnelCorrelationType: components["schemas"]["FunnelCorrelationResultsType"];
            /**
             * Kind
             * @default FunnelCorrelationQuery
             * @constant
             */
            kind: "FunnelCorrelationQuery";
            /** @default null */
            response: components["schemas"]["FunnelCorrelationResponse"] | null;
            source: components["schemas"]["FunnelsActorsQuery"];
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelCorrelationResponse */
        FunnelCorrelationResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            results: components["schemas"]["FunnelCorrelationResult"];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** FunnelCorrelationResult */
        FunnelCorrelationResult: {
            /** Events */
            events: components["schemas"]["EventOddsRatioSerialized"][];
            /** Skewed */
            skewed: boolean;
        };
        /**
         * FunnelCorrelationResultsType
         * @enum {string}
         */
        FunnelCorrelationResultsType: "events" | "properties" | "event_with_properties";
        /** FunnelExclusionActionsNode */
        FunnelExclusionActionsNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Funnelfromstep */
            funnelFromStep: number;
            /** Funneltostep */
            funnelToStep: number;
            /** Id */
            id: number;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "ActionsNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelExclusionEventsNode */
        FunnelExclusionEventsNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Event
             * @description The event or `null` for all events.
             * @default null
             */
            event: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Funnelfromstep */
            funnelFromStep: number;
            /** Funneltostep */
            funnelToStep: number;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "EventsNode";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * FunnelLayout
         * @enum {string}
         */
        FunnelLayout: "horizontal" | "vertical";
        /**
         * FunnelMathType
         * @enum {string}
         */
        FunnelMathType: "total" | "first_time_for_user" | "first_time_for_user_with_filters";
        /**
         * FunnelPathType
         * @enum {string}
         */
        FunnelPathType: "funnel_path_before_step" | "funnel_path_between_steps" | "funnel_path_after_step";
        /** FunnelPathsFilter */
        FunnelPathsFilter: {
            /** @default null */
            funnelPathType: components["schemas"]["FunnelPathType"] | null;
            funnelSource: components["schemas"]["FunnelsQuery"];
            /**
             * Funnelstep
             * @default null
             */
            funnelStep: number | null;
        };
        /**
         * FunnelStepReference
         * @enum {string}
         */
        FunnelStepReference: "total" | "previous";
        /**
         * FunnelVizType
         * @enum {string}
         */
        FunnelVizType: "steps" | "time_to_convert" | "trends" | "flow";
        /** FunnelsActorsQuery */
        FunnelsActorsQuery: {
            /**
             * @description When the source funnel has compare-to-previous enabled, scopes the actors to a single period. The runner resolves `'previous'` to the shifted date range; `'current'` (or unset) uses the source's own date range.
             * @default null
             */
            compare: components["schemas"]["Compare"] | null;
            /**
             * Funnelstep
             * @description Index of the step for which we want to get the timestamp for, per person. Positive for converted persons, negative for dropped of persons.
             * @default null
             */
            funnelStep: number | null;
            /**
             * Funnelstepbreakdown
             * @description The breakdown value for which to get persons for. This is an array for person and event properties, a string for groups and an integer for cohorts.
             * @default null
             */
            funnelStepBreakdown: number | string | (number | string)[] | null;
            /**
             * Funneltrendsdropoff
             * @default null
             */
            funnelTrendsDropOff: boolean | null;
            /**
             * Funneltrendsentranceperiodstart
             * @description Used together with `funnelTrendsDropOff` for funnels time conversion date for the persons modal.
             * @default null
             */
            funnelTrendsEntrancePeriodStart: string | null;
            /**
             * Includerecordings
             * @default null
             */
            includeRecordings: boolean | null;
            /**
             * Kind
             * @default FunnelsActorsQuery
             * @constant
             */
            kind: "FunnelsActorsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            source: components["schemas"]["FunnelsQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelsDataWarehouseNode */
        FunnelsDataWarehouseNode: {
            /** Aggregation Target Field */
            aggregation_target_field: string;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Dw Source Type
             * @default null
             */
            dw_source_type: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /** Id Field */
            id_field: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "FunnelsDataWarehouseNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelsFilter */
        FunnelsFilter: {
            /**
             * Bincount
             * @default null
             */
            binCount: number | null;
            /** @default first_touch */
            breakdownAttributionType: components["schemas"]["BreakdownAttributionType"] | null;
            /**
             * Breakdownattributionvalue
             * @default null
             */
            breakdownAttributionValue: number | null;
            /**
             * Breakdownsorting
             * @description Breakdown table sorting. Format: 'column_key' or '-column_key' (descending)
             * @default null
             */
            breakdownSorting: string | null;
            /**
             * @description Chart rendering style overrides (line shape). Only applies to historical-trends funnels.
             * @default null
             */
            chartStyle: components["schemas"]["ChartStyle"] | null;
            /**
             * Customaggregationtarget
             * @description For data warehouse based funnel insights when the aggregation target can't be mapped to persons or groups.
             * @default null
             */
            customAggregationTarget: boolean | null;
            /**
             * Exclusions
             * @default []
             */
            exclusions: (components["schemas"]["FunnelExclusionEventsNode"] | components["schemas"]["FunnelExclusionActionsNode"])[] | null;
            /**
             * Funnelaggregatebyhogql
             * @default null
             */
            funnelAggregateByHogQL: string | null;
            /**
             * Funnelfromstep
             * @default null
             */
            funnelFromStep: number | null;
            /** @default ordered */
            funnelOrderType: components["schemas"]["StepOrderValue"] | null;
            /** @default total */
            funnelStepReference: components["schemas"]["FunnelStepReference"] | null;
            /**
             * Funneltostep
             * @description To select the range of steps for trends & time to convert funnels, 0-indexed
             * @default null
             */
            funnelToStep: number | null;
            /** @default steps */
            funnelVizType: components["schemas"]["FunnelVizType"] | null;
            /**
             * Funnelwindowinterval
             * @default 14
             */
            funnelWindowInterval: number | null;
            /** @default day */
            funnelWindowIntervalUnit: components["schemas"]["FunnelConversionWindowTimeUnit"] | null;
            /**
             * Goallines
             * @description Goal Lines
             * @default null
             */
            goalLines: components["schemas"]["GoalLine"][] | null;
            /**
             * Hiddenlegendbreakdowns
             * @default null
             */
            hiddenLegendBreakdowns: string[] | null;
            /**
             * Hideincompleteconversionwindowperiods
             * @description Trends only: hide periods whose conversion window has not fully elapsed yet, so the recent tail of the trend isn't dragged down by entrants who still have time to convert.
             * @default false
             */
            hideIncompleteConversionWindowPeriods: boolean | null;
            /** @default vertical */
            layout: components["schemas"]["FunnelLayout"] | null;
            /**
             * @description Where the in-chart legend sits relative to the plot. Only applies to the in-chart legend.
             * @default bottom
             */
            legendPosition: components["schemas"]["LegendPosition"] | null;
            /**
             * Resultcustomizations
             * @description Customizations for the appearance of result datasets.
             * @default null
             */
            resultCustomizations: {
                [key: string]: components["schemas"]["ResultCustomizationByValue"];
            } | null;
            /**
             * Showannotations
             * @description Whether to render annotations on the chart. Only applies to historical-trends funnels.
             * @default true
             */
            showAnnotations: boolean | null;
            /**
             * Showlegend
             * @description Whether to show a legend describing the series. The legend only renders when the funnel has multiple series. Only applies to historical-trends funnels.
             * @default false
             */
            showLegend: boolean | null;
            /**
             * Showtrendlines
             * @description Display linear regression trend lines on the chart (only for historical trends viz)
             * @default null
             */
            showTrendLines: boolean | null;
            /**
             * Showvaluesonseries
             * @default false
             */
            showValuesOnSeries: boolean | null;
            /**
             * Useudf
             * @default null
             */
            useUdf: boolean | null;
        };
        /** FunnelsQuery */
        FunnelsQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * @description Breakdown of the events and actions
             * @default null
             */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * @description Compare to date range
             * @default null
             */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Properties specific to the funnels insight
             * @default null
             */
            funnelsFilter: components["schemas"]["FunnelsFilter"] | null;
            /**
             * @description Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "FunnelsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["FunnelsQueryResponse"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Series
             * @description Events and actions to include
             */
            series: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["FunnelsDataWarehouseNode"] | components["schemas"]["GroupNode"])[];
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** FunnelsQueryResponse */
        FunnelsQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Total Median Conversion Time
             * @description Median total conversion time across all completers, computed breakdown-agnostically for the Steps viz header.
             * @default null
             */
            total_median_conversion_time: number | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** GoalLine */
        GoalLine: {
            /**
             * Bordercolor
             * @default null
             */
            borderColor: string | null;
            /**
             * Displayifcrossed
             * @default null
             */
            displayIfCrossed: boolean | null;
            /**
             * Displaylabel
             * @default null
             */
            displayLabel: boolean | null;
            /** Label */
            label: string;
            /** @default null */
            position: components["schemas"]["Position"] | null;
            /** Value */
            value: number;
        };
        /**
         * GradientScaleMode
         * @enum {string}
         */
        GradientScaleMode: "absolute" | "relative";
        /** GroupNode */
        GroupNode: {
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "GroupNode";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Nodes
             * @description Entities to combine in this group
             */
            nodes: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["DataWarehouseNode"])[];
            /** @description Group of entities combined with AND/OR operator */
            operator: components["schemas"]["FilterLogicalOperator"];
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** GroupPropertyFilter */
        GroupPropertyFilter: {
            /**
             * Group Key Names
             * @default null
             */
            group_key_names: {
                [key: string]: string;
            } | null;
            /**
             * Group Type Index
             * @default null
             */
            group_type_index: number | null;
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default group
             * @constant
             */
            type: "group";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** GroupsQuery */
        GroupsQuery: {
            /** Group Type Index */
            group_type_index: number;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "GroupsQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Properties
             * @default null
             */
            properties: (components["schemas"]["GroupPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"])[] | null;
            /** @default null */
            response: components["schemas"]["GroupsQueryResponse"] | null;
            /**
             * Search
             * @default null
             */
            search: string | null;
            /**
             * Select
             * @default null
             */
            select: string[] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** GroupsQueryResponse */
        GroupsQueryResponse: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Kind
             * @default GroupsQuery
             * @constant
             */
            kind: "GroupsQuery";
            /** Limit */
            limit: number;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** HeatmapGradientStop */
        HeatmapGradientStop: {
            /** Color */
            color: string;
            /** Value */
            value: number;
        };
        /** HeatmapSettings */
        HeatmapSettings: {
            /**
             * Gradient
             * @default null
             */
            gradient: components["schemas"]["HeatmapGradientStop"][] | null;
            /**
             * Gradientpreset
             * @default null
             */
            gradientPreset: string | null;
            /** @default null */
            gradientScaleMode: components["schemas"]["GradientScaleMode"] | null;
            /**
             * Nulllabel
             * @default null
             */
            nullLabel: string | null;
            /**
             * Nullvalue
             * @default null
             */
            nullValue: string | null;
            /**
             * Sortcolumn
             * @default null
             */
            sortColumn: string | null;
            /** @default null */
            sortOrder: components["schemas"]["HeatmapSortOrder"] | null;
            /**
             * Valuecolumn
             * @default null
             */
            valueColumn: string | null;
            /**
             * Xaxiscolumn
             * @default null
             */
            xAxisColumn: string | null;
            /**
             * Xaxislabel
             * @default null
             */
            xAxisLabel: string | null;
            /**
             * Yaxiscolumn
             * @default null
             */
            yAxisColumn: string | null;
            /**
             * Yaxislabel
             * @default null
             */
            yAxisLabel: string | null;
        };
        /**
         * HeatmapSortOrder
         * @enum {string}
         */
        HeatmapSortOrder: "asc" | "desc";
        /** HogQLFilter */
        HogQLFilter: {
            /**
             * Type
             * @constant
             */
            type: "hogql";
            /** Key */
            key: string;
            /**
             * Value
             * @default null
             */
            value: unknown;
        };
        /** HogQLFilters */
        HogQLFilters: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Properties
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
        };
        /** HogQLMetadataResponse */
        HogQLMetadataResponse: {
            /**
             * Ch Table Names
             * @default null
             */
            ch_table_names: string[] | null;
            /** Errors */
            errors: components["schemas"]["HogQLNotice"][];
            /** @default null */
            isUsingIndices: components["schemas"]["QueryIndexUsage"] | null;
            /**
             * Isvalid
             * @default null
             */
            isValid: boolean | null;
            /** Notices */
            notices: components["schemas"]["HogQLNotice"][];
            /**
             * Query
             * @default null
             */
            query: string | null;
            /**
             * Table Names
             * @default null
             */
            table_names: string[] | null;
            /** Warnings */
            warnings: components["schemas"]["HogQLNotice"][];
        };
        /** HogQLNotice */
        HogQLNotice: {
            /**
             * End
             * @default null
             */
            end: number | null;
            /**
             * Fix
             * @default null
             */
            fix: string | null;
            /** Message */
            message: string;
            /**
             * Start
             * @default null
             */
            start: number | null;
        };
        /** HogQLPropertyFilter */
        HogQLPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Type
             * @default hogql
             * @constant
             */
            type: "hogql";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** HogQLQuery */
        HogQLQuery: {
            /**
             * Connectionid
             * @description Optional id of a direct-query-capable external data source to run against instead of ClickHouse — a pure-direct source, or a synced source with direct query enabled.
             * @default null
             */
            connectionId: string | null;
            /**
             * Explain
             * @default null
             */
            explain: boolean | null;
            /** @default null */
            filters: components["schemas"]["HogQLFilters"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "HogQLQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Name
             * @description Client provided name of the query
             * @default null
             */
            name: string | null;
            /** Query */
            query: string;
            /** @default null */
            response: components["schemas"]["HogQLQueryResponse"] | null;
            /**
             * Sendrawquery
             * @description Run the selected connection query directly without translating it through HogQL first
             * @default null
             */
            sendRawQuery: boolean | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Values
             * @description Constant values that can be referenced with the {placeholder} syntax in the query
             * @default null
             */
            values: {
                [key: string]: unknown;
            } | null;
            /**
             * Variables
             * @description Variables to be substituted into the query
             * @default null
             */
            variables: {
                [key: string]: components["schemas"]["HogQLVariable"];
            } | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** HogQLQueryModifiers */
        HogQLQueryModifiers: {
            /**
             * Bounceratedurationseconds
             * @default null
             */
            bounceRateDurationSeconds: number | null;
            /** @default null */
            bounceRatePageViewMode: components["schemas"]["BounceRatePageViewMode"] | null;
            /**
             * Converttoprojecttimezone
             * @default null
             */
            convertToProjectTimezone: boolean | null;
            /**
             * Customchanneltyperules
             * @default null
             */
            customChannelTypeRules: components["schemas"]["CustomChannelRule"][] | null;
            /**
             * Datawarehouseeventsmodifiers
             * @default null
             */
            dataWarehouseEventsModifiers: components["schemas"]["DataWarehouseEventsModifier"][] | null;
            /**
             * Debug
             * @default null
             */
            debug: boolean | null;
            /**
             * Forceclickhousedataskippingindexes
             * @description If these are provided, the query will fail if these skip indexes are not used
             * @default null
             */
            forceClickhouseDataSkippingIndexes: string[] | null;
            /**
             * Formatcsvallowdoublequotes
             * @default null
             */
            formatCsvAllowDoubleQuotes: boolean | null;
            /** @default null */
            inCohortVia: components["schemas"]["InCohortVia"] | null;
            /** @default null */
            inlineCohortCalculation: components["schemas"]["InlineCohortCalculation"] | null;
            /** @default null */
            materializationMode: components["schemas"]["MaterializationMode"] | null;
            /** @default null */
            materializedColumnsOptimizationMode: components["schemas"]["MaterializedColumnsOptimizationMode"] | null;
            /**
             * Optimizejoinedfilters
             * @default null
             */
            optimizeJoinedFilters: boolean | null;
            /**
             * Optimizeprojections
             * @default null
             */
            optimizeProjections: boolean | null;
            /**
             * @description HogQL parser backend; absent → `rust_py_with_cpp_shadow` (rust-py is primary, cpp runs as a sampled shadow). `*_shadow` modes return the primary result and sample-compare against the other parser, reporting divergences without failing the request. The `rust_py_*` modes drive the same hand-rolled Rust parser as `rust_*` but build `posthog.hogql.ast` dataclass instances directly via PyO3, skipping the JSON round-trip.
             * @default null
             */
            parserMode: components["schemas"]["ParserMode"] | null;
            /** @default null */
            personsArgMaxVersion: components["schemas"]["PersonsArgMaxVersion"] | null;
            /** @default null */
            personsJoinMode: components["schemas"]["PersonsJoinMode"] | null;
            /** @default null */
            personsOnEventsMode: components["schemas"]["PersonsOnEventsMode"] | null;
            /** @default null */
            propertyGroupsMode: components["schemas"]["PropertyGroupsMode"] | null;
            /**
             * Pushdownpredicates
             * @default null
             */
            pushDownPredicates: boolean | null;
            /**
             * S3Tableuseinvalidcolumns
             * @default null
             */
            s3TableUseInvalidColumns: boolean | null;
            /**
             * Sessionidpushdown
             * @description Push a `session_id_v7 IN (SELECT … FROM events WHERE …)` predicate into the raw_sessions subquery to limit aggregation to sessions that participate in the outer events filter.
             * @default null
             */
            sessionIdPushdown: boolean | null;
            /**
             * Sessionpropertypreaggregation
             * @description Pre-filter raw_sessions aggregation by `session_id_v7 IN (cheap pre-aggregation that only materializes the columns referenced by the outer-WHERE session predicate)`. Useful when the breakdown/SELECT pulls in many session columns (e.g. `$channel_type`) but the filter only references one (e.g. `$entry_current_url`).
             * @default null
             */
            sessionPropertyPreAggregation: boolean | null;
            /** @default null */
            sessionTableVersion: components["schemas"]["SessionTableVersion"] | null;
            /** @default null */
            sessionsV2JoinMode: components["schemas"]["SessionsV2JoinMode"] | null;
            /**
             * Timings
             * @default null
             */
            timings: boolean | null;
            /**
             * Usematerializedviews
             * @default null
             */
            useMaterializedViews: boolean | null;
            /**
             * Usepreaggregatedintermediateresults
             * @default null
             */
            usePreaggregatedIntermediateResults: boolean | null;
            /**
             * Usepreaggregatedtabletransforms
             * @description Try to automatically convert HogQL queries to use preaggregated tables at the AST level *
             * @default null
             */
            usePreaggregatedTableTransforms: boolean | null;
            /**
             * Usewebanalyticspreaggregatedtables
             * @default null
             */
            useWebAnalyticsPreAggregatedTables: boolean | null;
        };
        /** HogQLQueryResponse */
        HogQLQueryResponse: {
            /**
             * Clickhouse
             * @description Executed ClickHouse query
             * @default null
             */
            clickhouse: string | null;
            /**
             * Columns
             * @description Returned columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Explain
             * @description Query explanation output
             * @default null
             */
            explain: string[] | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Query metadata output
             * @default null
             */
            metadata: components["schemas"]["HogQLMetadataResponse"] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Query
             * @description Input query string
             * @default null
             */
            query: string | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @description Types of returned columns
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** HogQLVariable */
        HogQLVariable: {
            /** Code Name */
            code_name: string;
            /**
             * Isnull
             * @default null
             */
            isNull: boolean | null;
            /**
             * Value
             * @default null
             */
            value: unknown;
            /** Variableid */
            variableId: string;
        };
        /** HogQuery */
        HogQuery: {
            /**
             * Code
             * @default null
             */
            code: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "HogQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            response: components["schemas"]["HogQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** HogQueryResponse */
        HogQueryResponse: {
            /**
             * Bytecode
             * @default null
             */
            bytecode: unknown[] | null;
            /**
             * Coloredbytecode
             * @default null
             */
            coloredBytecode: unknown[] | null;
            /** Results */
            results: unknown;
            /**
             * Stdout
             * @default null
             */
            stdout: string | null;
        };
        /**
         * HrefMatching
         * @enum {unknown}
         */
        HrefMatching: "contains" | "exact" | "regex" | null;
        /**
         * InCohortVia
         * @enum {string}
         */
        InCohortVia: "auto" | "leftjoin" | "subquery" | "leftjoin_conjoined";
        /**
         * InlineCohortCalculation
         * @enum {string}
         */
        InlineCohortCalculation: "off" | "auto" | "always";
        /** @description Simplified serializer to speed response times when loading large amounts of objects. */
        Insight: {
            readonly id: number;
            readonly short_id: string;
            name?: string | null;
            derived_name?: string | null;
            query?: components["schemas"]["_InsightQuerySchema"] | null;
            order?: number | null;
            deleted?: boolean;
            /**
             * @deprecated
             * @description DEPRECATED. Will be removed in a future release. Use dashboard_tiles instead.
             *             A dashboard ID for each of the dashboards that this insight is displayed on.
             *             This field may be omitted from responses: once opt-in enforcement is enabled, API-token
             *             callers (personal API keys, OAuth) only receive it when passing the
             *             `include_dashboards=true` query parameter. Do not rely on it being present.
             */
            dashboards?: number[];
            /** @description A dashboard tile ID and dashboard_id for each of the dashboards that this insight is displayed on. */
            readonly dashboard_tiles: components["schemas"]["DashboardTileBasic"][];
            /**
             * Format: date-time
             * @description The datetime this insight's results were generated.
             *         If added to one or more dashboards the insight can be refreshed separately on each.
             *         Returns the appropriate last_refresh datetime for the context the insight is viewed in
             *         (see from_dashboard query parameter).
             */
            readonly last_refresh: string | null;
            /**
             * Format: date-time
             * @description The target age of the cached results for this insight.
             */
            readonly cache_target_age: string | null;
            /**
             * Format: date-time
             * @description The earliest possible datetime at which we'll allow the cached results for this insight to be refreshed
             *         by querying the database.
             */
            readonly next_allowed_client_refresh: string | null;
            readonly result: unknown;
            readonly hasMore: boolean | null;
            readonly columns: string[] | null;
            /** Format: date-time */
            readonly created_at: string | null;
            readonly created_by: components["schemas"]["UserBasic"];
            description?: string | null;
            /** Format: date-time */
            readonly updated_at: string;
            tags?: unknown[];
            favorited?: boolean;
            /** Format: date-time */
            readonly last_modified_at: string;
            readonly last_modified_by: components["schemas"]["UserBasic"];
            readonly is_sample: boolean;
            readonly effective_restriction_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            readonly effective_privilege_level: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
            /** @description The timezone this chart is displayed in. */
            readonly timezone: string | null;
            readonly is_cached: boolean;
            readonly query_status: unknown;
            readonly hogql: string | null;
            readonly types: unknown[] | null;
            readonly resolved_date_range: {
                /** Format: date-time */
                date_from?: string;
                /** Format: date-time */
                date_to?: string;
            } | null;
            /** create in folder */
            _create_in_folder?: string;
            readonly alerts: unknown[];
            /** @description Resolved dashboard and tile filter layers used to explain filter precedence in the UI. */
            readonly filter_override_context: components["schemas"]["InsightFilterOverrideContext"] | null;
            /** Format: date-time */
            readonly last_viewed_at: string | null;
            /** @description How this row matched the `search` query parameter: `exact` (the term is a case-insensitive substring of a searched field) or `similar` (a fuzzy trigram match, returned only when no exact match exists). Null when the list is not filtered by `search`. */
            readonly search_match_type: components["schemas"]["SearchMatchTypeEnum"] | components["schemas"]["NullEnum"];
        };
        /** InsightActorsQuery */
        InsightActorsQuery: {
            /**
             * Breakdown
             * @default null
             */
            breakdown: string | string[] | number | null;
            /** @default null */
            compare: components["schemas"]["Compare"] | null;
            /**
             * Day
             * @default null
             */
            day: string | number | null;
            /**
             * Includerecordings
             * @default null
             */
            includeRecordings: boolean | null;
            /**
             * Interval
             * @description An interval selected out of available intervals in source query.
             * @default null
             */
            interval: number | null;
            /**
             * Kind
             * @default InsightActorsQuery
             * @constant
             */
            kind: "InsightActorsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            /**
             * Series
             * @default null
             */
            series: number | null;
            /** Source */
            source: components["schemas"]["TrendsQuery"] | components["schemas"]["FunnelsQuery"] | components["schemas"]["RetentionQuery"] | components["schemas"]["PathsQuery"] | components["schemas"]["StickinessQuery"] | components["schemas"]["LifecycleQuery"] | components["schemas"]["WebStatsTableQuery"] | components["schemas"]["WebOverviewQuery"];
            /**
             * Status
             * @default null
             */
            status: string | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** InsightFilterOverrideContext */
        InsightFilterOverrideContext: {
            /**
             * @description Dashboard filters that remain active after applying tile precedence.
             * @default null
             */
            dashboard: components["schemas"]["DashboardFilter"] | null;
            /**
             * @description Tile filters applied above the dashboard filters.
             * @default null
             */
            tile: components["schemas"]["TileFilters"] | null;
            /**
             * @description Dashboard filters replaced by the tile filters.
             * @default null
             */
            overridden_dashboard: components["schemas"]["DashboardFilter"] | null;
        };
        /** InsightVizNode */
        InsightVizNode: {
            /**
             * Embedded
             * @description Query is embedded inside another bordered component
             * @default null
             */
            embedded: boolean | null;
            /**
             * Full
             * @description Show with most visual options enabled. Used in insight scene.
             * @default null
             */
            full: boolean | null;
            /**
             * Hidepersonsmodal
             * @default null
             */
            hidePersonsModal: boolean | null;
            /**
             * Hidetooltiponscroll
             * @default null
             */
            hideTooltipOnScroll: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "InsightVizNode";
            /**
             * Showcorrelationtable
             * @default null
             */
            showCorrelationTable: boolean | null;
            /**
             * Showfilters
             * @default null
             */
            showFilters: boolean | null;
            /**
             * Showheader
             * @default null
             */
            showHeader: boolean | null;
            /**
             * Showlastcomputation
             * @default null
             */
            showLastComputation: boolean | null;
            /**
             * Showlastcomputationrefresh
             * @default null
             */
            showLastComputationRefresh: boolean | null;
            /**
             * Showresults
             * @default null
             */
            showResults: boolean | null;
            /**
             * Showtable
             * @default null
             */
            showTable: boolean | null;
            /** Source */
            source: components["schemas"]["TrendsQuery"] | components["schemas"]["FunnelsQuery"] | components["schemas"]["RetentionQuery"] | components["schemas"]["PathsQuery"] | components["schemas"]["StickinessQuery"] | components["schemas"]["LifecycleQuery"] | components["schemas"]["WebStatsTableQuery"] | components["schemas"]["WebOverviewQuery"];
            /**
             * Suppresssessionanalysiswarning
             * @default null
             */
            suppressSessionAnalysisWarning: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
            /** @default null */
            vizSpecificOptions: components["schemas"]["VizSpecificOptions"] | null;
        };
        /** IntegrationFilter */
        IntegrationFilter: {
            /**
             * Integrationsourceids
             * @description Selected integration source IDs to filter by (e.g., table IDs or source map IDs)
             * @default null
             */
            integrationSourceIds: string[] | null;
        };
        /**
         * IntegrationKind
         * @enum {string}
         */
        IntegrationKind: "slack" | "salesforce" | "hubspot" | "google-pubsub" | "google-cloud-service-account" | "google-cloud-storage" | "google-ads" | "google-analytics" | "google-search-console" | "google-sheets" | "linkedin-ads" | "snapchat" | "stripe" | "intercom" | "email" | "twilio" | "linear" | "github" | "gitlab" | "meta-ads" | "clickup" | "reddit-ads" | "databricks" | "tiktok-ads" | "bing-ads" | "vercel" | "azure-blob" | "firebase" | "jira" | "pinterest-ads" | "customerio-app" | "customerio-webhook" | "customerio-track" | "apns" | "postgresql" | "aws-s3" | "s3-compatible" | "snowflake";
        /**
         * IntervalType
         * @enum {string}
         */
        IntervalType: "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";
        /**
         * Key10
         * @enum {string}
         */
        Key10: "tag_name" | "text" | "href" | "selector";
        /**
         * Kind
         * @enum {string}
         */
        Kind: "EventsNode" | "ActionsNode";
        /**
         * Kind1
         * @enum {string}
         */
        Kind1: "ExperimentEventExposureConfig" | "ActionsNode";
        /** LLMSentimentMessage */
        LLMSentimentMessage: {
            /** Label */
            label: string;
            /** Score */
            score: number;
            /**
             * Scores
             * @default null
             */
            scores: {
                [key: string]: number;
            } | null;
        };
        /** LLMSentimentResult */
        LLMSentimentResult: {
            /** Label */
            label: string;
            /**
             * Message Count
             * @default null
             */
            message_count: number | null;
            /**
             * Messages
             * @default null
             */
            messages: {
                [key: string]: components["schemas"]["LLMSentimentMessage"];
            } | null;
            /** Score */
            score: number;
            /**
             * Scores
             * @default null
             */
            scores: {
                [key: string]: number;
            } | null;
        };
        /** LLMTrace */
        LLMTrace: {
            /**
             * Aisessionid
             * @default null
             */
            aiSessionId: string | null;
            /** Createdat */
            createdAt: string;
            /** Distinctid */
            distinctId: string;
            /**
             * Errorcount
             * @default null
             */
            errorCount: number | null;
            /** Events */
            events: components["schemas"]["LLMTraceEvent"][];
            /** Id */
            id: string;
            /**
             * Inputcost
             * @default null
             */
            inputCost: number | null;
            /**
             * Inputstate
             * @default null
             */
            inputState: unknown;
            /**
             * Inputtokens
             * @default null
             */
            inputTokens: number | null;
            /**
             * Issupporttrace
             * @default null
             */
            isSupportTrace: boolean | null;
            /**
             * Outputcost
             * @default null
             */
            outputCost: number | null;
            /**
             * Outputstate
             * @default null
             */
            outputState: unknown;
            /**
             * Outputtokens
             * @default null
             */
            outputTokens: number | null;
            /** @default null */
            person: components["schemas"]["LLMTracePerson"] | null;
            /**
             * Requestcost
             * @default null
             */
            requestCost: number | null;
            /** @default null */
            sentiment: components["schemas"]["LLMSentimentResult"] | null;
            /**
             * Tools
             * @default null
             */
            tools: string[] | null;
            /**
             * Totalcost
             * @default null
             */
            totalCost: number | null;
            /**
             * Totallatency
             * @default null
             */
            totalLatency: number | null;
            /**
             * Tracename
             * @default null
             */
            traceName: string | null;
            /**
             * Websearchcost
             * @default null
             */
            webSearchCost: number | null;
        };
        /** LLMTraceEvent */
        LLMTraceEvent: {
            /** Createdat */
            createdAt: string;
            /** Event */
            event: components["schemas"]["AIEventType"] | string;
            /** Id */
            id: string;
            /** Properties */
            properties: {
                [key: string]: unknown;
            };
            /** @default null */
            sentiment: components["schemas"]["LLMSentimentResult"] | null;
        };
        /** LLMTracePerson */
        LLMTracePerson: {
            /** Created At */
            created_at: string;
            /** Distinct Id */
            distinct_id: string;
            /** Properties */
            properties: {
                [key: string]: unknown;
            };
            /** Uuid */
            uuid: string;
        };
        /** LastEvent */
        LastEvent: {
            /** Distinct Id */
            distinct_id: string;
            /** Properties */
            properties: string;
            /** Timestamp */
            timestamp: string;
            /** Uuid */
            uuid: string;
        };
        /**
         * LegendPosition
         * @enum {string}
         */
        LegendPosition: "top" | "bottom" | "left" | "right";
        /** LifecycleDataWarehouseNode */
        LifecycleDataWarehouseNode: {
            /** Aggregation Target Field */
            aggregation_target_field: string;
            /** Created At Field */
            created_at_field: string;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "LifecycleDataWarehouseNode";
            /**
             * Math
             * @default null
             */
            math: components["schemas"]["BaseMathType"] | components["schemas"]["FunnelMathType"] | components["schemas"]["PropertyMathType"] | components["schemas"]["CountPerActorMathType"] | components["schemas"]["ExperimentMetricMathType"] | components["schemas"]["CalendarHeatmapMathType"] | "unique_group" | "hogql" | null;
            /** @default null */
            math_group_type_index: components["schemas"]["MathGroupTypeIndex"] | null;
            /**
             * Math Hogql
             * @default null
             */
            math_hogql: string | null;
            /**
             * Math Multiplier
             * @default null
             */
            math_multiplier: number | null;
            /**
             * Math Property
             * @default null
             */
            math_property: string | null;
            /** @default null */
            math_property_revenue_currency: components["schemas"]["RevenueCurrencyPropertyConfig"] | null;
            /**
             * Math Property Type
             * @default null
             */
            math_property_type: string | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Optionalinfunnel
             * @default null
             */
            optionalInFunnel: boolean | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /** Table Name */
            table_name: string;
            /** Timestamp Field */
            timestamp_field: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** LifecycleFilter */
        LifecycleFilter: {
            /**
             * @description Where the in-chart legend sits relative to the plot. Only applies to the in-chart legend.
             * @default bottom
             */
            legendPosition: components["schemas"]["LegendPosition"] | null;
            /**
             * Showlegend
             * @default false
             */
            showLegend: boolean | null;
            /**
             * Showpercentagesonseries
             * @description Append per-band percentage to each value label (e.g. `580 (42%)`). Requires `showValuesOnSeries` — on its own it has no visible effect.
             * @default null
             */
            showPercentagesOnSeries: boolean | null;
            /**
             * Showvaluesonseries
             * @default null
             */
            showValuesOnSeries: boolean | null;
            /**
             * Stacked
             * @default true
             */
            stacked: boolean | null;
            /**
             * Toggledlifecycles
             * @default null
             */
            toggledLifecycles: components["schemas"]["LifecycleToggle"][] | null;
        };
        /** LifecycleQuery */
        LifecycleQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * Customaggregationtarget
             * @description For data warehouse based lifecycle insights when the aggregation target can't be mapped to persons or groups.
             * @default null
             */
            customAggregationTarget: boolean | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
             * @default day
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "LifecycleQuery";
            /**
             * @description Properties specific to the lifecycle insight
             * @default null
             */
            lifecycleFilter: components["schemas"]["LifecycleFilter"] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["LifecycleQueryResponse"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Series
             * @description Events and actions to include
             */
            series: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["LifecycleDataWarehouseNode"])[];
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** LifecycleQueryResponse */
        LifecycleQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: {
                [key: string]: unknown;
            }[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * LifecycleToggle
         * @enum {string}
         */
        LifecycleToggle: "new" | "resurrecting" | "returning" | "dormant";
        /** LogEntryPropertyFilter */
        LogEntryPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default log_entry
             * @constant
             */
            type: "log_entry";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** LogPropertyFilter */
        LogPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            type: components["schemas"]["LogPropertyFilterType"];
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * LogPropertyFilterType
         * @enum {string}
         */
        LogPropertyFilterType: "log" | "log_attribute" | "log_resource_attribute";
        /**
         * ManualMetricType
         * @enum {string}
         */
        ManualMetricType: "funnel" | "mean_count" | "mean_sum_or_avg";
        /** MarketingAnalyticsAggregatedQuery */
        MarketingAnalyticsAggregatedQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Draftconversiongoal
             * @description Draft conversion goal that can be set in the UI without saving
             * @default null
             */
            draftConversionGoal: components["schemas"]["ConversionGoalFilter1"] | components["schemas"]["ConversionGoalFilter2"] | components["schemas"]["ConversionGoalFilter3"] | null;
            /**
             * @description Drill-down hierarchy level: channel, source, or campaign (default)
             * @default null
             */
            drillDownLevel: components["schemas"]["MarketingAnalyticsDrillDownLevel"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Filter by integration IDs
             * @default null
             */
            integrationFilter: components["schemas"]["IntegrationFilter"] | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "MarketingAnalyticsAggregatedQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["MarketingAnalyticsAggregatedQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Select
             * @description Return a limited set of data. Will use default columns if empty.
             * @default null
             */
            select: string[] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** MarketingAnalyticsAggregatedQueryResponse */
        MarketingAnalyticsAggregatedQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: {
                [key: string]: components["schemas"]["MarketingAnalyticsItem"];
            };
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * MarketingAnalyticsDrillDownLevel
         * @enum {string}
         */
        MarketingAnalyticsDrillDownLevel: "channel" | "source" | "campaign" | "ad_group" | "ad" | "medium" | "content" | "term";
        /** MarketingAnalyticsItem */
        MarketingAnalyticsItem: {
            /**
             * Changefrompreviouspct
             * @default null
             */
            changeFromPreviousPct: number | null;
            /**
             * Hascomparison
             * @default null
             */
            hasComparison: boolean | null;
            /**
             * Isincreasebad
             * @default null
             */
            isIncreaseBad: boolean | null;
            /** Key */
            key: string;
            kind: components["schemas"]["WebAnalyticsItemKind"];
            /**
             * Previous
             * @default null
             */
            previous: number | string | null;
            /**
             * Value
             * @default null
             */
            value: number | string | null;
        };
        /**
         * MarketingAnalyticsOrderByEnum
         * @enum {string}
         */
        MarketingAnalyticsOrderByEnum: "ASC" | "DESC";
        /** MarketingAnalyticsTableQuery */
        MarketingAnalyticsTableQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * @description Compare to date range
             * @default null
             */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Draftconversiongoal
             * @description Draft conversion goal that can be set in the UI without saving
             * @default null
             */
            draftConversionGoal: components["schemas"]["ConversionGoalFilter1"] | components["schemas"]["ConversionGoalFilter2"] | components["schemas"]["ConversionGoalFilter3"] | null;
            /**
             * @description Drill-down hierarchy level: channel, source, or campaign (default)
             * @default null
             */
            drillDownLevel: components["schemas"]["MarketingAnalyticsDrillDownLevel"] | null;
            /**
             * Filtertestaccounts
             * @description Filter test accounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Filter by integration type
             * @default null
             */
            integrationFilter: components["schemas"]["IntegrationFilter"] | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "MarketingAnalyticsTableQuery";
            /**
             * Limit
             * @description Number of rows to return
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @description Number of rows to skip before returning rows
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @description Columns to order by - similar to EventsQuery format
             * @default null
             */
            orderBy: (string | components["schemas"]["MarketingAnalyticsOrderByEnum"])[][] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["MarketingAnalyticsTableQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Select
             * @description Return a limited set of data. Will use default columns if empty.
             * @default null
             */
            select: string[] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** MarketingAnalyticsTableQueryResponse */
        MarketingAnalyticsTableQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["MarketingAnalyticsItem"][][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * MaterializationMode
         * @enum {string}
         */
        MaterializationMode: "auto" | "legacy_null_as_string" | "legacy_null_as_null" | "disabled";
        /**
         * MaterializationType
         * @enum {unknown}
         */
        MaterializationType: "materialized" | "inline" | null;
        /**
         * MaterializedColumnsOptimizationMode
         * @enum {string}
         */
        MaterializedColumnsOptimizationMode: "disabled" | "optimized";
        /**
         * MathGroupTypeIndex
         * @enum {number}
         */
        MathGroupTypeIndex: 0 | 1 | 2 | 3 | 4;
        /**
         * MeanRetentionCalculation
         * @enum {string}
         */
        MeanRetentionCalculation: "simple" | "weighted" | "none";
        /** MetricPropertyFilter */
        MetricPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default metric_attribute
             * @constant
             */
            type: "metric_attribute";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * MetricSummary
         * @enum {string}
         */
        MetricSummary: "total" | "average" | "latest";
        MinimalFeatureFlag: {
            readonly id: number;
            readonly team_id: number;
            name?: string;
            key: string;
            filters?: {
                [key: string]: unknown;
            };
            deleted?: boolean;
            active?: boolean;
            ensure_experience_continuity?: boolean | null;
            version?: number | null;
            /**
             * @description Specifies where this feature flag should be evaluated
             *
             *     * `server` - Server
             *     * `client` - Client
             *     * `all` - All
             */
            evaluation_runtime?: components["schemas"]["EvaluationRuntimeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            /**
             * @description Identifier used for bucketing users into rollout and variants
             *
             *     * `distinct_id` - User ID (default)
             *     * `device_id` - Device ID
             */
            bucketing_identifier?: components["schemas"]["BucketingIdentifierEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            readonly evaluation_contexts: string[];
        };
        /**
         * MultipleBreakdownType
         * @enum {string}
         */
        MultipleBreakdownType: "person" | "event" | "event_metadata" | "group" | "session" | "hogql" | "cohort" | "revenue_analytics" | "data_warehouse" | "data_warehouse_person_property";
        /**
         * MultipleVariantHandling
         * @enum {string}
         */
        MultipleVariantHandling: "exclude" | "first_seen";
        /** NonIntegratedConversionsTableQuery */
        NonIntegratedConversionsTableQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * @description Compare to date range
             * @default null
             */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Draftconversiongoal
             * @description Draft conversion goal that can be set in the UI without saving
             * @default null
             */
            draftConversionGoal: components["schemas"]["ConversionGoalFilter1"] | components["schemas"]["ConversionGoalFilter2"] | components["schemas"]["ConversionGoalFilter3"] | null;
            /**
             * Filtertestaccounts
             * @description Filter test accounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "NonIntegratedConversionsTableQuery";
            /**
             * Limit
             * @description Number of rows to return
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @description Number of rows to skip before returning rows
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: (string | components["schemas"]["MarketingAnalyticsOrderByEnum"])[][] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["NonIntegratedConversionsTableQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Select
             * @description Return a limited set of data. Will use default columns if empty.
             * @default null
             */
            select: string[] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** NonIntegratedConversionsTableQueryResponse */
        NonIntegratedConversionsTableQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["MarketingAnalyticsItem"][][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        NullEnum: null;
        /** @description Matches numeric values with comparison operators. */
        NumericPropertyFilter: {
            /** @description Key of the property you're filtering on. For example `email` or `$current_url`. */
            key: string;
            /**
             * @description Property type (event, person, session, etc.).
             *
             *     * `event` - event
             *     * `event_metadata` - event_metadata
             *     * `feature` - feature
             *     * `person` - person
             *     * `person_metadata` - person_metadata
             *     * `cohort` - cohort
             *     * `element` - element
             *     * `static-cohort` - static-cohort
             *     * `dynamic-cohort` - dynamic-cohort
             *     * `precalculated-cohort` - precalculated-cohort
             *     * `group` - group
             *     * `recording` - recording
             *     * `log_entry` - log_entry
             *     * `behavioral` - behavioral
             *     * `session` - session
             *     * `hogql` - hogql
             *     * `data_warehouse` - data_warehouse
             *     * `data_warehouse_person_property` - data_warehouse_person_property
             *     * `error_tracking_issue` - error_tracking_issue
             *     * `log` - log
             *     * `log_attribute` - log_attribute
             *     * `log_resource_attribute` - log_resource_attribute
             *     * `metric_attribute` - metric_attribute
             *     * `span` - span
             *     * `span_attribute` - span_attribute
             *     * `span_resource_attribute` - span_resource_attribute
             *     * `revenue_analytics` - revenue_analytics
             *     * `account_custom_property` - account_custom_property
             *     * `flag` - flag
             *     * `workflow_variable` - workflow_variable
             * @default event
             */
            type: components["schemas"]["PropertyFilterTypeEnum"];
            /**
             * Format: double
             * @description Numeric value to compare against.
             */
            value: number;
            /**
             * @description Numeric comparison operator.
             *
             *     * `exact` - exact
             *     * `is_not` - is_not
             *     * `gt` - gt
             *     * `lt` - lt
             *     * `gte` - gte
             *     * `lte` - lte
             * @default exact
             */
            operator: components["schemas"]["NumericPropertyFilterOperatorEnum"];
        };
        /**
         * @description * `exact` - exact
         *     * `is_not` - is_not
         *     * `gt` - gt
         *     * `lt` - lt
         *     * `gte` - gte
         *     * `lte` - lte
         * @enum {string}
         */
        NumericPropertyFilterOperatorEnum: "exact" | "is_not" | "gt" | "lt" | "gte" | "lte";
        /**
         * OrderDirection2
         * @enum {string}
         */
        OrderDirection2: "ASC" | "DESC";
        PaginatedActionList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["Action"][];
        };
        PaginatedAnnotationList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["Annotation"][];
        };
        PaginatedCohortList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["Cohort"][];
        };
        PaginatedDashboardBasicList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["DashboardBasic"][];
        };
        PaginatedEndpointResponseList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["EndpointResponse"][];
        };
        PaginatedEnterpriseEventDefinitionList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["EnterpriseEventDefinition"][];
        };
        PaginatedEventSchemaList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["EventSchema"][];
        };
        PaginatedExperimentBasicList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["ExperimentBasic"][];
        };
        PaginatedExperimentHoldoutList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["ExperimentHoldout"][];
        };
        PaginatedExperimentSavedMetricList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["ExperimentSavedMetric"][];
        };
        PaginatedFeatureFlagList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["FeatureFlag"][];
        };
        PaginatedInsightList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["Insight"][];
        };
        PaginatedSchemaPropertyGroupList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=400&limit=100
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?offset=200&limit=100
             */
            previous?: string | null;
            results: components["schemas"]["SchemaPropertyGroup"][];
        };
        /**
         * ParserMode
         * @enum {string}
         */
        ParserMode: "cpp_only" | "cpp_with_rust_shadow" | "cpp_with_rust_py_shadow" | "rust_with_cpp_shadow" | "rust_only" | "rust_py_only" | "rust_py_with_cpp_shadow";
        /** @description Serializer mixin that handles tags for objects. */
        PatchedAction: {
            readonly id?: number;
            /** @description Name of the action (must be unique within the project). */
            name?: string | null;
            /** @description Human-readable description of what this action represents. */
            description?: string;
            tags?: unknown[];
            /** @description Whether to post a notification to Slack when this action is triggered. */
            post_to_slack?: boolean;
            /** @description Custom Slack message format. Supports templates with event properties. */
            slack_message_format?: string;
            /** @description Action steps defining trigger conditions. Each step matches events by name, properties, URL, or element attributes. Multiple steps are OR-ed together. */
            steps?: components["schemas"]["ActionStepJSON"][];
            /** Format: date-time */
            readonly created_at?: string;
            readonly created_by?: components["schemas"]["UserBasic"];
            deleted?: boolean;
            readonly is_calculating?: boolean;
            /** Format: date-time */
            last_calculated_at?: string;
            readonly team_id?: number;
            /** @default true */
            readonly is_action: boolean;
            readonly bytecode_error?: string | null;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when the action was pinned, or null if not pinned. Set any value to pin, null to unpin.
             */
            pinned_at?: string | null;
            readonly creation_context?: string | null;
            /** create in folder */
            _create_in_folder?: string;
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
        };
        PatchedAnnotation: {
            readonly id?: number;
            /** @description Annotation text shown on charts to describe the change, release, or incident. */
            content?: string | null;
            /**
             * Format: date-time
             * @description When this annotation happened (ISO 8601 timestamp). Used to position it on charts.
             */
            date_marker?: string | null;
            /**
             * @description Who created this annotation. Use `USR` for user-created notes and `GIT` for bot/deployment notes.
             *
             *     * `USR` - user
             *     * `GIT` - GitHub
             */
            creation_type?: components["schemas"]["CreationTypeEnum"];
            dashboard_item?: number | null;
            dashboard_id?: number | null;
            readonly dashboard_name?: string | null;
            readonly insight_short_id?: string | null;
            readonly insight_name?: string | null;
            readonly insight_derived_name?: string | null;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at?: string | null;
            /** Format: date-time */
            readonly updated_at?: string;
            /** @description Soft-delete flag. Set to true to hide the annotation, or false to restore it. */
            deleted?: boolean;
            /**
             * @description Annotation visibility scope: `project`, `organization`, `dashboard`, or `dashboard_item`. `recording` is deprecated and rejected.
             *
             *     * `dashboard_item` - insight
             *     * `dashboard` - dashboard
             *     * `project` - project
             *     * `organization` - organization
             *     * `recording` - recording
             */
            scope?: components["schemas"]["AnnotationScopeEnum"];
            /** @description Optional emoji shown in place of the default badge when this annotation is surfaced on a chart. */
            emoji?: string | null;
            /** @description When true, the annotation is hidden from the PostHog UI (charts and the annotations list) but still readable over the API and MCP. Use for high-frequency markers like deployments that would otherwise crowd the UI. Null (the default) means the annotation is shown. */
            hidden_in_user_interface?: boolean | null;
        };
        PatchedCohort: {
            readonly id?: number;
            name?: string | null;
            description?: string;
            deleted?: boolean;
            filters?: components["schemas"]["CohortFilters"] | null;
            readonly version?: number | null;
            readonly pending_version?: number | null;
            readonly is_calculating?: boolean;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at?: string | null;
            /** Format: date-time */
            readonly last_calculation?: string | null;
            /** Format: date-time */
            readonly last_backfill_person_properties_at?: string | null;
            readonly errors_calculating?: number;
            readonly last_error_message?: string | null;
            readonly count?: number | null;
            is_static?: boolean;
            /**
             * @description Type of cohort based on filter complexity
             *
             *     * `static` - static
             *     * `person_property` - person_property
             *     * `behavioral` - behavioral
             *     * `realtime` - realtime
             *     * `analytical` - analytical
             */
            cohort_type?: components["schemas"]["CohortTypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            /** @description Flags describing which kinds of conditions the cohort's filters contain. Null when the cohort has no filters to classify. */
            readonly condition_type?: components["schemas"]["CohortConditionTypeFlags"] | null;
            readonly experiment_set?: number[];
            /** @description How this row matched the `search` query parameter: `exact` (the term is a case-insensitive substring of a searched field) or `similar` (a fuzzy trigram match, returned only when no exact match exists). Null when the list is not filtered by `search`. */
            readonly search_match_type?: components["schemas"]["SearchMatchTypeEnum"] | components["schemas"]["NullEnum"];
            /** create in folder */
            _create_in_folder?: string;
            /**
             * create static person ids
             * @default []
             */
            _create_static_person_ids: string[];
        };
        /** @description Schema for creating/updating endpoints. OpenAPI docs only — validation uses Pydantic. */
        PatchedEndpointRequest: {
            /** @description Unique URL-safe name. Must start with a letter, only letters/numbers/hyphens/underscores, max 128 chars. */
            name?: string | null;
            /** @description HogQL or insight query this endpoint executes. Changing this auto-creates a new version. */
            query?: unknown;
            /** @description Human-readable description of what this endpoint returns. */
            description?: string | null;
            /** @description How fresh the data should be, in seconds. Must be one of: 900 (15 min), 1800 (30 min), 3600 (1 h), 21600 (6 h), 43200 (12 h), 86400 (24 h, default), 604800 (7 d). Controls cache TTL and materialization sync frequency. */
            data_freshness_seconds?: number | null;
            /** @description Whether this endpoint is available for execution via the API. */
            is_active?: boolean | null;
            /** @description Whether query results are materialized to S3. */
            is_materialized?: boolean | null;
            /** @description Short ID of the insight this endpoint was derived from. */
            derived_from_insight?: string | null;
            /** @description Target a specific version for updates (defaults to current version). */
            version?: number | null;
            /** @description Per-column bucket overrides for range variable materialization. Keys are column names, values are bucket keys. */
            bucket_overrides?: {
                [key: string]: unknown;
            } | null;
            /** @description Set to true to soft-delete this endpoint. */
            deleted?: boolean | null;
            /** @description List of tag names to associate with this endpoint. Replaces any existing tags. */
            tags?: string[] | null;
            /** @description Breakdown property names that may be omitted on /run. Omitted ones return data aggregated across all values of that breakdown. Defaults to [] — every breakdown variable is required. */
            optional_breakdown_properties?: string[] | null;
        };
        /** @description Serializer mixin that handles tags for objects. */
        PatchedEnterpriseEventDefinition: {
            /** Format: uuid */
            readonly id?: string;
            name?: string;
            owner?: number | null;
            description?: string | null;
            tags?: unknown[];
            /** Format: date-time */
            readonly created_at?: string | null;
            /** Format: date-time */
            readonly updated_at?: string;
            readonly updated_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly last_seen_at?: string | null;
            /** Format: date-time */
            readonly last_updated_at?: string;
            verified?: boolean;
            /** Format: date-time */
            readonly verified_at?: string | null;
            readonly verified_by?: components["schemas"]["UserBasic"];
            hidden?: boolean | null;
            enforcement_mode?: components["schemas"]["EnforcementModeEnum"];
            /** @description Name of a single property on this event that PostHog UIs should display alongside the event (for example `$pathname` on `$pageview`). When set, surfaces like the session replay inspector show the property's value next to the event name without the user having to open the event. */
            primary_property?: string | null;
            readonly is_action?: boolean;
            readonly action_id?: number;
            readonly is_calculating?: boolean;
            /** Format: date-time */
            readonly last_calculated_at?: string;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** @default false */
            post_to_slack: boolean;
            default_columns?: string[];
            readonly media_preview_urls?: string[];
        };
        /** @description A holdout group — a stable slice of users excluded from experiment exposure. */
        PatchedExperimentHoldout: {
            readonly id?: number;
            /** @description Human-readable name for the holdout group. */
            name?: string;
            /** @description Optional description of what this holdout reserves and why. */
            description?: string | null;
            /** @description Non-empty list of release-condition groups defining the held-out population, using the same shape as feature-flag release conditions. Each element's `rollout_percentage` (0–100, may be fractional) is the **exclusion** percentage — the share of users held back from all experiments that reference this holdout. `properties` optionally narrows the group by person/group properties. Do not set `variant`: the server normalizes it to `holdout-{id}`. Note that only the first element's `rollout_percentage` is embedded into each linked experiment's feature flag, and this population is shared across every experiment using the holdout. */
            filters?: components["schemas"]["FeatureFlagConditionGroupSchema"][];
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at?: string;
            /** Format: date-time */
            readonly updated_at?: string;
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
        };
        /** @description Mixin for serializers to add user access control fields */
        PatchedExperimentSavedMetric: {
            readonly id?: number;
            /** @description Name of the shared metric. Must be unique within the project (case-insensitive). */
            name?: string;
            /** @description Short description of what the metric measures. */
            description?: string | null;
            /** @description ExperimentMetric JSON. Must have kind='ExperimentMetric' and a metric_type: 'mean' (set source to an EventsNode with an event name), 'funnel' (set series to an array of EventsNode steps), 'ratio' (set numerator and denominator EventsNode entries), or 'retention' (set start_event and completion_event). Legacy kinds (ExperimentTrendsQuery, ExperimentFunnelsQuery) are rejected for new shared metrics. */
            query?: unknown;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at?: string;
            /** Format: date-time */
            readonly updated_at?: string;
            tags?: unknown[];
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
        };
        /** @description Experiment write payload. Identical to Experiment, plus the writable `feature_flag` config input. */
        PatchedExperimentWrite: {
            readonly id?: number;
            /** @description Name of the experiment. */
            name?: string;
            /** @description Description of the experiment hypothesis and expected outcomes. */
            description?: string | null;
            /** Format: date-time */
            start_date?: string | null;
            /** Format: date-time */
            end_date?: string | null;
            /** @description Unique key for the experiment's feature flag. Letters, numbers, hyphens, and underscores only. Search existing flags with the feature-flag-get-all tool first — reuse an existing flag when possible. */
            feature_flag_key?: string;
            /** @description Feature-flag config for the experiment, in the flag's own filters shape. The linked flag is the source of truth for variants, rollout, aggregation, payloads, and experience continuity: send config here instead of the deprecated `parameters` keys. On a running experiment, also send `update_feature_flag_params=true`. Cannot be combined with the key of a pre-existing feature flag on create (the experiment links to it as-is). */
            feature_flag?: components["schemas"]["ExperimentFeatureFlagInput"];
            readonly holdout?: components["schemas"]["ExperimentHoldout"];
            /** @description ID of a holdout group to exclude from the experiment. */
            holdout_id?: number | null;
            readonly exposure_cohort?: number | null;
            /** @description Experiment parameters JSON. Supported keys include `custom_exposure_filter` and `variant_notes` (free-text notes per variant, keyed by variant key). Flag config (variants, rollout, aggregation, payloads, experience continuity) belongs on the `feature_flag` object; send it there. For backward compatibility, config still sent through these deprecated keys is copied onto the linked flag rather than rejected, and reads project the flag's current config back into this field. Excluded variants live on the top-level `excluded_variants` field, not here. */
            parameters?: components["schemas"]["ExperimentParameters"] | null;
            /** @description Running-time calculator state: `minimum_detectable_effect`, `recommended_running_time`, `recommended_sample_size`, and `exposure_estimate_config`. Canonical home for these keys, which historically lived in `parameters`. */
            running_time_calculation?: components["schemas"]["ExperimentRunningTimeCalculation"] | null;
            /** @description Variant keys to exclude from metric result calculations. Excluded variants are still served to users but omitted from statistical analysis. The baseline variant and holdout pseudo-variants cannot be excluded. Canonical home for what historically lived in `parameters.excluded_variants`. */
            excluded_variants?: string[] | null;
            readonly saved_metrics?: components["schemas"]["ExperimentToSavedMetric"][];
            /** @description IDs of shared saved metrics to attach to this experiment. Each item has 'id' (saved metric ID) and 'metadata' with 'type' (primary or secondary). */
            saved_metrics_ids?: unknown[] | null;
            /**
             * @description Whether the experiment is archived.
             * @default false
             */
            archived: boolean;
            deleted?: boolean | null;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            readonly created_at?: string;
            /** Format: date-time */
            readonly updated_at?: string;
            /**
             * @description Experiment type: web for frontend UI changes, product for backend/API changes.
             *
             *     * `web` - web
             *     * `product` - product
             */
            type?: components["schemas"]["ExperimentTypeEnum"] | components["schemas"]["NullEnum"];
            /** @description Exposure configuration including filter test accounts and custom exposure events. */
            exposure_criteria?: components["schemas"]["ExperimentApiExposureCriteria"] | null;
            /** @description Primary experiment metrics. Each metric must have kind='ExperimentMetric' and a metric_type: 'mean' (set source to an EventsNode with an event name), 'funnel' (set series to an array of EventsNode steps), 'ratio' (set numerator and denominator EventsNode entries), or 'retention' (set start_event and completion_event). Use the read-data-schema tool with query kind 'events' to find available events in the project. */
            metrics?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /** @description Secondary metrics for additional measurements. Same format as primary metrics. */
            metrics_secondary?: components["schemas"]["_ExperimentApiMetricsList"] | null;
            /**
             * @description Suppresses the validation that rejects metrics referencing events not yet ingested by this project. REQUIRES explicit user confirmation before being set to true — never flip this silently to retry a failed call. The default validation catches typo'd event names and missing instrumentation. Set this to true only when the user has confirmed the event is intentional (e.g. they are about to instrument it).
             * @default false
             */
            allow_unknown_events: boolean;
            /** create in folder */
            _create_in_folder?: string;
            /**
             * @description Experiment conclusion: won, lost, inconclusive, stopped_early, or invalid.
             *
             *     * `won` - won
             *     * `lost` - lost
             *     * `inconclusive` - inconclusive
             *     * `stopped_early` - stopped_early
             *     * `invalid` - invalid
             */
            conclusion?: components["schemas"]["ConclusionEnum"] | components["schemas"]["NullEnum"];
            /** @description Comment about the experiment conclusion. */
            conclusion_comment?: string | null;
            /**
             * Format: uuid
             * @description ID of the Code task opened to remove the experiment's feature-flag code, when one was requested via open_cleanup_pr on end/ship_variant. Read its status via the flag_cleanup_task action.
             */
            readonly flag_cleanup_task_id?: string | null;
            only_count_matured_users?: boolean;
            /**
             * @description When true, sync the flag config sent in this request (via the `feature_flag` object) to the linked feature flag. Draft experiments always sync regardless. On a running experiment, `feature_flag` config without this flag is rejected.
             * @default false
             */
            update_feature_flag_params: boolean;
            /** @description Experiment lifecycle state: 'draft' (not yet launched), 'running' (launched with active feature flag), 'paused' (running with feature flag deactivated — virtual state derived from feature_flag.active, not stored), 'exposure_frozen' (running with enrollment frozen to the already-exposed cohort while metrics keep flowing — virtual state derived from the flag's release groups, not stored), 'stopped' (ended). */
            readonly status?: components["schemas"]["ExperimentStatusEnum"];
            /** @description Whether the experiment uses any legacy-engine metrics (ExperimentTrendsQuery or ExperimentFunnelsQuery). Used to flag legacy experiments and gate actions that don't support them, such as duplicate and copy-to-project. */
            readonly is_legacy?: boolean;
            /** @description Whether enrollment can be frozen right now: the experiment must be running (not draft, paused, stopped, or already frozen) and its feature flag must have release conditions that a person cohort can narrow (no group aggregation, no holdout, no early access conditions). */
            readonly can_freeze_exposure?: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
        };
        PatchedFeatureFlagPartialUpdateRequestSchema: {
            /** @description Feature flag key. */
            key?: string;
            /** @description Feature flag description (stored in the `name` field for backwards compatibility). */
            name?: string;
            /** @description Feature flag targeting configuration. */
            filters?: components["schemas"]["FeatureFlagFiltersSchema"];
            /** @description Whether the feature flag is active. */
            active?: boolean;
            /** @description Whether the flag is archived. Archived flags are hidden from the flag list by default and must be disabled (`active: false`). */
            archived?: boolean;
            /** @description Organizational tags for this feature flag. */
            tags?: string[];
            /** @description Evaluation contexts that control where this flag evaluates at runtime. */
            evaluation_contexts?: string[];
            /** @description Whether this flag is a remote configuration flag that delivers a payload rather than gating a feature. */
            is_remote_configuration?: boolean | null;
            /** @description Whether to persist a user's flag value across the anonymous-to-identified transition (the 'persist across authentication steps' option). Incompatible with device_id bucketing. */
            ensure_experience_continuity?: boolean | null;
            /**
             * @description Where this flag is allowed to evaluate: 'server' (server-side SDKs only), 'client' (client-side SDKs only), or 'all' (both). Defaults to 'all'.
             *
             *     * `server` - Server
             *     * `client` - Client
             *     * `all` - All
             */
            evaluation_runtime?: components["schemas"]["EvaluationRuntimeEnum"] | components["schemas"]["NullEnum"];
            /**
             * @description Identifier used to bucket users into rollout percentages and variants: 'distinct_id' (user ID, the default) or 'device_id'. Using 'device_id' is incompatible with ensure_experience_continuity=True.
             *
             *     * `distinct_id` - User ID (default)
             *     * `device_id` - Device ID
             */
            bucketing_identifier?: components["schemas"]["BucketingIdentifierEnum"] | components["schemas"]["NullEnum"];
        };
        /** @description Simplified serializer to speed response times when loading large amounts of objects. */
        PatchedInsight: {
            readonly id?: number;
            readonly short_id?: string;
            name?: string | null;
            derived_name?: string | null;
            query?: components["schemas"]["_InsightQuerySchema"] | null;
            order?: number | null;
            deleted?: boolean;
            /**
             * @deprecated
             * @description DEPRECATED. Will be removed in a future release. Use dashboard_tiles instead.
             *             A dashboard ID for each of the dashboards that this insight is displayed on.
             *             This field may be omitted from responses: once opt-in enforcement is enabled, API-token
             *             callers (personal API keys, OAuth) only receive it when passing the
             *             `include_dashboards=true` query parameter. Do not rely on it being present.
             */
            dashboards?: number[];
            /** @description A dashboard tile ID and dashboard_id for each of the dashboards that this insight is displayed on. */
            readonly dashboard_tiles?: components["schemas"]["DashboardTileBasic"][];
            /**
             * Format: date-time
             * @description The datetime this insight's results were generated.
             *         If added to one or more dashboards the insight can be refreshed separately on each.
             *         Returns the appropriate last_refresh datetime for the context the insight is viewed in
             *         (see from_dashboard query parameter).
             */
            readonly last_refresh?: string | null;
            /**
             * Format: date-time
             * @description The target age of the cached results for this insight.
             */
            readonly cache_target_age?: string | null;
            /**
             * Format: date-time
             * @description The earliest possible datetime at which we'll allow the cached results for this insight to be refreshed
             *         by querying the database.
             */
            readonly next_allowed_client_refresh?: string | null;
            readonly result?: unknown;
            readonly hasMore?: boolean | null;
            readonly columns?: string[] | null;
            /** Format: date-time */
            readonly created_at?: string | null;
            readonly created_by?: components["schemas"]["UserBasic"];
            description?: string | null;
            /** Format: date-time */
            readonly updated_at?: string;
            tags?: unknown[];
            favorited?: boolean;
            /** Format: date-time */
            readonly last_modified_at?: string;
            readonly last_modified_by?: components["schemas"]["UserBasic"];
            readonly is_sample?: boolean;
            readonly effective_restriction_level?: components["schemas"]["EffectivePrivilegeLevelEnum"];
            readonly effective_privilege_level?: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
            /** @description The timezone this chart is displayed in. */
            readonly timezone?: string | null;
            readonly is_cached?: boolean;
            readonly query_status?: unknown;
            readonly hogql?: string | null;
            readonly types?: unknown[] | null;
            readonly resolved_date_range?: {
                /** Format: date-time */
                date_from?: string;
                /** Format: date-time */
                date_to?: string;
            } | null;
            /** create in folder */
            _create_in_folder?: string;
            readonly alerts?: unknown[];
            /** @description Resolved dashboard and tile filter layers used to explain filter precedence in the UI. */
            readonly filter_override_context?: components["schemas"]["InsightFilterOverrideContext"] | null;
            /** Format: date-time */
            readonly last_viewed_at?: string | null;
            /** @description How this row matched the `search` query parameter: `exact` (the term is a case-insensitive substring of a searched field) or `similar` (a fuzzy trigram match, returned only when no exact match exists). Null when the list is not filtered by `search`. */
            readonly search_match_type?: components["schemas"]["SearchMatchTypeEnum"] | components["schemas"]["NullEnum"];
        };
        /**
         * @description OpenAPI-only PATCH body for dashboards (agents/MCP).
         *
         *     Must be a superset of ``dashboard_patch_runtime_openapi_field_names()`` — ``extend_schema(request=...)``
         *     replaces the inferred schema entirely. Contract: ``test_dashboard_openapi.py``.
         */
        PatchedPatchedDashboardOpenApi: {
            name?: string | null;
            description?: string;
            pinned?: boolean;
            /** @description Dashboard-level filters (date range and properties) applied across all tiles as the source of truth. */
            filters?: components["schemas"]["DashboardFiltersOpenApi"];
            /** @description Custom color mapping for breakdown values. */
            breakdown_colors?: unknown;
            /** @description ID of the color theme used for chart visualizations. */
            data_color_theme_id?: number | null;
            tags?: string[];
            restriction_level?: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description List of quick filter IDs associated with this dashboard. */
            quick_filter_ids?: string[] | null;
            /** @description Dashboard tiles to update. Widget tiles accept nested widget.config patches. */
            tiles?: components["schemas"]["DashboardPatchTileOpenApi"][];
            /** @description Template key to create the dashboard from a predefined template. */
            use_template?: string;
            /** @description ID of an existing dashboard to duplicate. */
            use_dashboard?: number | null;
            /**
             * @description When deleting, also delete insights that are only on this dashboard.
             * @default false
             */
            delete_insights: boolean;
        };
        PatchedSchemaPropertyGroup: {
            /** Format: uuid */
            readonly id?: string;
            name?: string;
            description?: string;
            properties?: components["schemas"]["SchemaPropertyGroupProperty"][];
            readonly events?: components["schemas"]["EventDefinitionBasic"][];
            /** Format: date-time */
            readonly created_at?: string;
            /** Format: date-time */
            readonly updated_at?: string;
            readonly created_by?: components["schemas"]["UserBasic"];
        };
        PatchedTeam: {
            readonly id?: number;
            /** Format: uuid */
            readonly uuid?: string;
            name?: string;
            access_control?: boolean;
            /** Format: uuid */
            readonly organization?: string;
            /** Format: int64 */
            readonly project_id?: number;
            readonly api_token?: string;
            readonly secret_api_token?: string | null;
            readonly secret_api_token_backup?: string | null;
            /** Format: date-time */
            readonly created_at?: string;
            /** Format: date-time */
            readonly updated_at?: string;
            readonly ingested_event?: boolean;
            readonly default_modifiers?: {
                [key: string]: unknown;
            };
            readonly person_on_events_querying_enabled?: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
            app_urls?: (string | null)[];
            anonymize_ips?: boolean;
            completed_snippet_onboarding?: boolean;
            /**
             * @description Filters used to identify internal/test users. Each entry is a property filter.
             *
             *                 Supported entry types and the exact shape each accepts:
             *
             *                 # Person property — match (or exclude) by a person property
             *                 {"key": "email", "type": "person", "value": "@example.com", "operator": "icontains"}
             *
             *                 # Event property — match by an event property
             *                 {"key": "$host", "type": "event", "value": "localhost", "operator": "icontains"}
             *
             *                 # Cohort membership — match (or exclude) members of a cohort.
             *                 # Use operator "in" for inclusion and "not_in" for exclusion. Do NOT use a
             *                 # `negation` field here — `negation` is specific to cohort *definitions*
             *                 # (the inner sub-filters that build a cohort) and is rejected by the
             *                 # property-filter schema.
             *                 {"key": "id", "type": "cohort", "value": 8814, "operator": "not_in"}
             *
             *                 Common operators: "exact", "is_not", "icontains", "not_icontains", "regex",
             *                 "not_regex", "gt", "lt", "gte", "lte", "is_set", "is_not_set", "in", "not_in".
             */
            test_account_filters?: unknown;
            test_account_filters_default_checked?: boolean | null;
            is_demo?: boolean;
            timezone?: components["schemas"]["TimezoneEnum"];
            person_display_name_properties?: string[] | null;
            autocapture_opt_out?: boolean | null;
            autocapture_exceptions_opt_in?: boolean | null;
            autocapture_web_vitals_opt_in?: boolean | null;
            capture_console_log_opt_in?: boolean | null;
            capture_performance_opt_in?: boolean | null;
            session_recording_opt_in?: boolean;
            /** Format: decimal */
            session_recording_sample_rate?: string | null;
            session_recording_minimum_duration_milliseconds?: number | null;
            session_recording_url_trigger_config?: unknown[] | null;
            session_recording_url_blocklist_config?: unknown[] | null;
            session_recording_event_trigger_config?: (string | null)[] | null;
            session_recording_trigger_match_type_config?: string | null;
            /** @description V2 trigger groups configuration for session recording. If present, takes precedence over legacy trigger fields. */
            session_recording_trigger_groups?: unknown;
            session_recording_retention_period?: components["schemas"]["SessionRecordingRetentionPeriodEnum"];
            week_start_day?: components["schemas"]["WeekStartDayEnum"] | components["schemas"]["NullEnum"];
            primary_dashboard?: number | null;
            live_events_columns?: string[] | null;
            recording_domains?: (string | null)[] | null;
            cookieless_server_hash_mode?: components["schemas"]["CookielessServerHashModeEnum"] | components["schemas"]["NullEnum"];
            human_friendly_comparison_periods?: boolean | null;
            inject_web_apps?: boolean | null;
            surveys_opt_in?: boolean | null;
            heatmaps_opt_in?: boolean | null;
            flags_persistence_default?: boolean | null;
            feature_flag_confirmation_enabled?: boolean | null;
            feature_flag_confirmation_message?: string | null;
            /** @description Whether to automatically apply default evaluation contexts to new feature flags */
            default_evaluation_contexts_enabled?: boolean | null;
            /** @description Whether to require at least one evaluation context tag when creating new feature flags */
            require_evaluation_contexts?: boolean | null;
            capture_dead_clicks?: boolean | null;
            default_data_theme?: number | null;
            revenue_analytics_config?: components["schemas"]["TeamRevenueAnalyticsConfig"];
            marketing_analytics_config?: components["schemas"]["TeamMarketingAnalyticsConfig"];
            customer_analytics_config?: components["schemas"]["TeamCustomerAnalyticsConfig"];
            /** @default USD */
            base_currency: components["schemas"]["BaseCurrencyEnum"];
            web_analytics_pre_aggregated_tables_enabled?: boolean | null;
            receive_org_level_activity_logs?: boolean | null;
            /**
             * @description Whether this project serves B2B or B2C customers, used to optimize the UI layout.
             *
             *     * `b2b` - B2B
             *     * `b2c` - B2C
             *     * `other` - Other
             */
            business_model?: components["schemas"]["BusinessModelEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            conversations_enabled?: boolean | null;
            proactive_tasks_enabled?: boolean | null;
            workflows_config?: components["schemas"]["TeamWorkflowsConfig"];
            readonly effective_membership_level?: components["schemas"]["EffectiveMembershipLevelEnum"];
            readonly has_group_types?: boolean;
            readonly group_types?: {
                [key: string]: unknown;
            }[];
            readonly live_events_token?: string | null;
            readonly product_intents?: {
                [key: string]: unknown;
            }[];
            readonly managed_viewsets?: {
                [key: string]: boolean;
            };
            readonly available_setup_task_ids?: components["schemas"]["AvailableSetupTaskIdsEnum"][];
            /** @description The team's events data retention window in months (plan-derived, synced from billing). When retention enforcement is active for the team, queries do not return events older than this many months. */
            readonly event_retention_months?: number;
            /** @description Whether events data retention is currently enforced for this team (cohort/flag gated). */
            readonly events_retention_enforced?: boolean;
        };
        /** PathCleaningFilter */
        PathCleaningFilter: {
            /**
             * Alias
             * @default null
             */
            alias: string | null;
            /**
             * Order
             * @default null
             */
            order: number | null;
            /**
             * Regex
             * @default null
             */
            regex: string | null;
        };
        /**
         * PathType
         * @enum {string}
         */
        PathType: "$pageview" | "$screen" | "custom_event" | "hogql";
        /** PathsFilter */
        PathsFilter: {
            /**
             * Edgelimit
             * @default 50
             */
            edgeLimit: number | null;
            /**
             * Endpoint
             * @default null
             */
            endPoint: string | null;
            /**
             * Excludeevents
             * @default null
             */
            excludeEvents: string[] | null;
            /**
             * Includeeventtypes
             * @default null
             */
            includeEventTypes: components["schemas"]["PathType"][] | null;
            /**
             * Localpathcleaningfilters
             * @default null
             */
            localPathCleaningFilters: components["schemas"]["PathCleaningFilter"][] | null;
            /**
             * Maxedgeweight
             * @default null
             */
            maxEdgeWeight: number | null;
            /**
             * Minedgeweight
             * @default null
             */
            minEdgeWeight: number | null;
            /**
             * Pathdropoffkey
             * @description Relevant only within actors query
             * @default null
             */
            pathDropoffKey: string | null;
            /**
             * Pathendkey
             * @description Relevant only within actors query
             * @default null
             */
            pathEndKey: string | null;
            /**
             * Pathgroupings
             * @default null
             */
            pathGroupings: string[] | null;
            /**
             * Pathreplacements
             * @default null
             */
            pathReplacements: boolean | null;
            /**
             * Pathstartkey
             * @description Relevant only within actors query
             * @default null
             */
            pathStartKey: string | null;
            /**
             * Pathshogqlexpression
             * @default null
             */
            pathsHogQLExpression: string | null;
            /**
             * Showfullurls
             * @default null
             */
            showFullUrls: boolean | null;
            /**
             * Startpoint
             * @default null
             */
            startPoint: string | null;
            /**
             * Steplimit
             * @default 5
             */
            stepLimit: number | null;
        };
        /** PathsLink */
        PathsLink: {
            /** Average Conversion Time */
            average_conversion_time: number;
            /** Source */
            source: string;
            /** Target */
            target: string;
            /** Value */
            value: number;
        };
        /** PathsQuery */
        PathsQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Used for displaying paths in relation to funnel steps.
             * @default null
             */
            funnelPathsFilter: components["schemas"]["FunnelPathsFilter"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "PathsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @description Properties specific to the paths insight */
            pathsFilter: components["schemas"]["PathsFilter"];
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["PathsQueryResponse"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** PathsQueryResponse */
        PathsQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["PathsLink"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** PersonFilter */
        PersonFilter: {
            /**
             * Operator
             * @default null
             */
            operator: string | null;
            /**
             * Value
             * @default null
             */
            value: unknown;
            /**
             * Bytecode
             * @default null
             */
            bytecode: unknown[] | null;
            /**
             * Bytecode Error
             * @default null
             */
            bytecode_error: string | null;
            /**
             * Conditionhash
             * @default null
             */
            conditionHash: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "person";
            /** Key */
            key: string;
            /**
             * Negation
             * @default false
             */
            negation: boolean;
        };
        /**
         * PersonMetadataFilter
         * @description Filter on a top-level persons-table column (e.g. created_at) rather than the
         *     properties JSON. The matching key must be one of PERSON_METADATA_FIELDS.
         */
        PersonMetadataFilter: {
            /**
             * Operator
             * @default null
             */
            operator: string | null;
            /**
             * Value
             * @default null
             */
            value: unknown;
            /**
             * Bytecode
             * @default null
             */
            bytecode: unknown[] | null;
            /**
             * Bytecode Error
             * @default null
             */
            bytecode_error: string | null;
            /**
             * Conditionhash
             * @default null
             */
            conditionHash: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "person_metadata";
            /** Key */
            key: string;
            /**
             * Negation
             * @default false
             */
            negation: boolean;
        };
        /** PersonMetadataPropertyFilter */
        PersonMetadataPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @description Top-level columns on the persons table (e.g. created_at), not properties JSON
             * @default person_metadata
             * @constant
             */
            type: "person_metadata";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** PersonPropertyFilter */
        PersonPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @description Person properties
             * @default person
             * @constant
             */
            type: "person";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * PersonsArgMaxVersion
         * @enum {string}
         */
        PersonsArgMaxVersion: "auto" | "v1" | "v2";
        /**
         * PersonsJoinMode
         * @enum {string}
         */
        PersonsJoinMode: "inner" | "left";
        /** PersonsNode */
        PersonsNode: {
            /**
             * Cohort
             * @default null
             */
            cohort: number | null;
            /**
             * Distinctid
             * @default null
             */
            distinctId: string | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "PersonsNode";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Response
             * @default null
             */
            response: {
                [key: string]: unknown;
            } | null;
            /**
             * Search
             * @default null
             */
            search: string | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * PersonsOnEventsMode
         * @enum {string}
         */
        PersonsOnEventsMode: "disabled" | "person_id_no_override_properties_on_events" | "person_id_override_properties_on_events" | "person_id_override_properties_joined";
        /** PieChartSettings */
        PieChartSettings: {
            /**
             * Showtotal
             * @description Whether to show the aggregation total below the chart. Defaults to on.
             * @default null
             */
            showTotal: boolean | null;
            /**
             * @description What to render on each slice. Defaults to labels.
             * @default null
             */
            sliceContent: components["schemas"]["SliceContent"] | null;
            /**
             * @description Whether slice values show as absolute amounts or shares of the total. Only applies when `sliceContent` is `values`.
             * @default null
             */
            valueDisplay: components["schemas"]["ValueDisplay"] | null;
        };
        /** Population */
        Population: {
            /** Both */
            both: number;
            /** Exception Only */
            exception_only: number;
            /** Neither */
            neither: number;
            /** Success Only */
            success_only: number;
        };
        /**
         * Position
         * @enum {string}
         */
        Position: "start" | "end";
        /**
         * PrecomputationMode
         * @enum {string}
         */
        PrecomputationMode: "precomputed" | "direct";
        /**
         * @description * `event` - event
         *     * `event_metadata` - event_metadata
         *     * `feature` - feature
         *     * `person` - person
         *     * `person_metadata` - person_metadata
         *     * `cohort` - cohort
         *     * `element` - element
         *     * `static-cohort` - static-cohort
         *     * `dynamic-cohort` - dynamic-cohort
         *     * `precalculated-cohort` - precalculated-cohort
         *     * `group` - group
         *     * `recording` - recording
         *     * `log_entry` - log_entry
         *     * `behavioral` - behavioral
         *     * `session` - session
         *     * `hogql` - hogql
         *     * `data_warehouse` - data_warehouse
         *     * `data_warehouse_person_property` - data_warehouse_person_property
         *     * `error_tracking_issue` - error_tracking_issue
         *     * `log` - log
         *     * `log_attribute` - log_attribute
         *     * `log_resource_attribute` - log_resource_attribute
         *     * `metric_attribute` - metric_attribute
         *     * `span` - span
         *     * `span_attribute` - span_attribute
         *     * `span_resource_attribute` - span_resource_attribute
         *     * `revenue_analytics` - revenue_analytics
         *     * `account_custom_property` - account_custom_property
         *     * `flag` - flag
         *     * `workflow_variable` - workflow_variable
         * @enum {string}
         */
        PropertyFilterTypeEnum: "event" | "event_metadata" | "feature" | "person" | "person_metadata" | "cohort" | "element" | "static-cohort" | "dynamic-cohort" | "precalculated-cohort" | "group" | "recording" | "log_entry" | "behavioral" | "session" | "hogql" | "data_warehouse" | "data_warehouse_person_property" | "error_tracking_issue" | "log" | "log_attribute" | "log_resource_attribute" | "metric_attribute" | "span" | "span_attribute" | "span_resource_attribute" | "revenue_analytics" | "account_custom_property" | "flag" | "workflow_variable";
        /** PropertyGroupFilter */
        PropertyGroupFilter: {
            type: components["schemas"]["FilterLogicalOperator"];
            /** Values */
            values: components["schemas"]["PropertyGroupFilterValue"][];
        };
        /** PropertyGroupFilterValue */
        PropertyGroupFilterValue: {
            type: components["schemas"]["FilterLogicalOperator"];
            /** Values */
            values: (components["schemas"]["PropertyGroupFilterValue"] | components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[];
        };
        /** @enum {string} */
        PropertyGroupOperator: "AND" | "OR";
        /**
         * @description * `cohort` - cohort
         *     * `person` - person
         *     * `group` - group
         * @enum {string}
         */
        PropertyGroupTypeEnum: "cohort" | "person" | "group";
        /**
         * PropertyGroupsMode
         * @enum {string}
         */
        PropertyGroupsMode: "enabled" | "disabled" | "optimized";
        /**
         * PropertyMathType
         * @enum {string}
         */
        PropertyMathType: "avg" | "sum" | "min" | "max" | "median" | "p75" | "p90" | "p95" | "p99";
        /**
         * PropertyOperator
         * @enum {string}
         */
        PropertyOperator: "exact" | "is_not" | "icontains" | "not_icontains" | "regex" | "not_regex" | "gt" | "gte" | "lt" | "lte" | "is_set" | "is_not_set" | "is_date_exact" | "is_date_before" | "is_date_after" | "between" | "not_between" | "min" | "max" | "in" | "not_in" | "is_cleaned_path_exact" | "flag_evaluates_to" | "semver_eq" | "semver_neq" | "semver_gt" | "semver_gte" | "semver_lt" | "semver_lte" | "semver_tilde" | "semver_caret" | "semver_wildcard" | "icontains_multi" | "not_icontains_multi";
        /**
         * QueryIndexUsage
         * @enum {string}
         */
        QueryIndexUsage: "undecisive" | "no" | "partial" | "yes";
        /** QueryLogTags */
        QueryLogTags: {
            /**
             * Name
             * @description Name of the query, preferably unique. For example web_analytics_vitals
             * @default null
             */
            name: string | null;
            /**
             * Productkey
             * @description Product responsible for this query. Use string, there's no need to churn the Schema when we add a new product *
             * @default null
             */
            productKey: string | null;
            /**
             * Scene
             * @description Scene where this query is shown in the UI. Use string, there's no need to churn the Schema when we add a new Scene *
             * @default null
             */
            scene: string | null;
        };
        /** QueryStatus */
        QueryStatus: {
            /**
             * Complete
             * @description Whether the query is still running. Will be true if the query is complete, even if it errored. Either result or error will be set.
             * @default false
             */
            complete: boolean | null;
            /**
             * Dashboard Id
             * @default null
             */
            dashboard_id: number | null;
            /**
             * End Time
             * @description When did the query execution task finish (whether successfully or not).
             * @default null
             */
            end_time: string | null;
            /**
             * Error
             * @description If the query failed, this will be set to true. More information can be found in the error_message field.
             * @default false
             */
            error: boolean | null;
            /**
             * Error Code
             * @description Stable machine-readable code for the error (the DRF exception code), when known.
             * @default null
             */
            error_code: string | null;
            /**
             * Error Message
             * @default null
             */
            error_message: string | null;
            /**
             * Expiration Time
             * @default null
             */
            expiration_time: string | null;
            /** Id */
            id: string;
            /**
             * Insight Id
             * @default null
             */
            insight_id: number | null;
            /**
             * Labels
             * @default null
             */
            labels: string[] | null;
            /**
             * Pickup Time
             * @description When was the query execution task picked up by a worker.
             * @default null
             */
            pickup_time: string | null;
            /**
             * Query Async
             * @description ONLY async queries use QueryStatus.
             * @default true
             * @constant
             */
            query_async: true;
            /** @default null */
            query_progress: components["schemas"]["ClickhouseQueryProgress"] | null;
            /**
             * Results
             * @default null
             */
            results: unknown;
            /**
             * Start Time
             * @description When was query execution task enqueued.
             * @default null
             */
            start_time: string | null;
            /**
             * Task Id
             * @default null
             */
            task_id: string | null;
            /** Team Id */
            team_id: number;
        };
        /** QueryTiming */
        QueryTiming: {
            /**
             * K
             * @description Key. Shortened to 'k' to save on data.
             */
            k: string;
            /**
             * T
             * @description Time in seconds. Shortened to 't' to save on data.
             */
            t: number;
        };
        /** RETENTION */
        RETENTION: {
            /**
             * Hidelinegraph
             * @default null
             */
            hideLineGraph: boolean | null;
            /**
             * Hidesizecolumn
             * @default null
             */
            hideSizeColumn: boolean | null;
            /**
             * Usesmalllayout
             * @default null
             */
            useSmallLayout: boolean | null;
        };
        /** RecordingPropertyFilter */
        RecordingPropertyFilter: {
            /** Key */
            key: components["schemas"]["DurationType"] | string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default recording
             * @constant
             */
            type: "recording";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** ResolvedDateRangeResponse */
        ResolvedDateRangeResponse: {
            /**
             * Date From
             * Format: date-time
             */
            date_from: string;
            /**
             * Date To
             * Format: date-time
             */
            date_to: string;
        };
        /** Response */
        Response: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Nextcursor
             * @description Cursor for fetching the next page of results
             * @default null
             */
            nextCursor: string | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response1 */
        Response1: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /** Limit */
            limit: number;
            /**
             * Missing Actors Count
             * @default null
             */
            missing_actors_count: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: string[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response10 */
        Response10: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response11 */
        Response11: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response12 */
        Response12: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response13 */
        Response13: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["RevenueAnalyticsMRRQueryResultItem"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response14 */
        Response14: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["RevenueAnalyticsOverviewItem"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response15 */
        Response15: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response16 */
        Response16: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response18 */
        Response18: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["MarketingAnalyticsItem"][][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response19 */
        Response19: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: {
                [key: string]: components["schemas"]["MarketingAnalyticsItem"];
            };
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response2 */
        Response2: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Kind
             * @default GroupsQuery
             * @constant
             */
            kind: "GroupsQuery";
            /** Limit */
            limit: number;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response20 */
        Response20: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["MarketingAnalyticsItem"][][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response21 */
        Response21: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["ErrorTrackingIssue"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response22 */
        Response22: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["ErrorTrackingCorrelatedIssue"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response23 */
        Response23: {
            /** Credible Intervals */
            credible_intervals: {
                [key: string]: number[];
            };
            /** Expected Loss */
            expected_loss: number;
            /** @default null */
            funnels_query: components["schemas"]["FunnelsQuery"] | null;
            /** Insight */
            insight: {
                [key: string]: unknown;
            }[][];
            /**
             * Kind
             * @default ExperimentFunnelsQuery
             * @constant
             */
            kind: "ExperimentFunnelsQuery";
            /** Probability */
            probability: {
                [key: string]: number;
            };
            significance_code: components["schemas"]["ExperimentSignificanceCode"];
            /** Significant */
            significant: boolean;
            /**
             * Stats Version
             * @default null
             */
            stats_version: number | null;
            /** Variants */
            variants: components["schemas"]["ExperimentVariantFunnelsBaseStats"][];
            /**
             * Warnings
             * @description Data warehouse sync warnings — see AnalyticsQueryResponseBase.warnings for semantics.
             * @default null
             */
            warnings: components["schemas"]["DataWarehouseSyncWarning"][] | null;
        };
        /** Response24 */
        Response24: {
            /** @default null */
            count_query: components["schemas"]["TrendsQuery"] | null;
            /** Credible Intervals */
            credible_intervals: {
                [key: string]: number[];
            };
            /** @default null */
            exposure_query: components["schemas"]["TrendsQuery"] | null;
            /** Insight */
            insight: {
                [key: string]: unknown;
            }[];
            /**
             * Kind
             * @default ExperimentTrendsQuery
             * @constant
             */
            kind: "ExperimentTrendsQuery";
            /** P Value */
            p_value: number;
            /** Probability */
            probability: {
                [key: string]: number;
            };
            significance_code: components["schemas"]["ExperimentSignificanceCode"];
            /** Significant */
            significant: boolean;
            /**
             * Stats Version
             * @default null
             */
            stats_version: number | null;
            /** Variants */
            variants: components["schemas"]["ExperimentVariantTrendsBaseStats"][];
            /**
             * Warnings
             * @description Data warehouse sync warnings — see AnalyticsQueryResponseBase.warnings for semantics.
             * @default null
             */
            warnings: components["schemas"]["DataWarehouseSyncWarning"][] | null;
        };
        /** Response25 */
        Response25: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["LLMTrace"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response27 */
        Response27: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response28 */
        Response28: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Kind
             * @default AccountsQuery
             * @constant
             */
            kind: "AccountsQuery";
            /** Limit */
            limit: number;
            /**
             * Metricsresults
             * @description When `metrics` is set on the query, the aggregated values in the same order.
             * @default null
             */
            metricsResults: (number | null)[] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Offset */
            offset: number;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response3 */
        Response3: {
            /**
             * Clickhouse
             * @description Executed ClickHouse query
             * @default null
             */
            clickhouse: string | null;
            /**
             * Columns
             * @description Returned columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Explain
             * @description Query explanation output
             * @default null
             */
            explain: string[] | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Query metadata output
             * @default null
             */
            metadata: components["schemas"]["HogQLMetadataResponse"] | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Query
             * @description Input query string
             * @default null
             */
            query: string | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @description Types of returned columns
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response4 */
        Response4: {
            /**
             * Datefrom
             * @default null
             */
            dateFrom: string | null;
            /**
             * Dateto
             * @default null
             */
            dateTo: string | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["WebOverviewItem"][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response5 */
        Response5: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Precomputestale
             * @description Whether a lazy-precompute read was served from expired-within-grace (stale) jobs instead of recomputing inline.
             * @default null
             */
            preComputeStale: boolean | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response6 */
        Response6: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response7 */
        Response7: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response8 */
        Response8: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["WebVitalsPathBreakdownResult"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** Response9 */
        Response9: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `21` - Everyone in the project can edit
         *     * `37` - Only those invited to this dashboard can edit
         * @enum {integer}
         */
        RestrictionLevelEnum: 21 | 37;
        /**
         * ResultCustomizationBy
         * @enum {string}
         */
        ResultCustomizationBy: "value" | "position";
        /** ResultCustomizationByPosition */
        ResultCustomizationByPosition: {
            /**
             * Assignmentby
             * @default position
             * @constant
             */
            assignmentBy: "position";
            /** @default null */
            color: components["schemas"]["DataColorToken"] | null;
            /**
             * Hidden
             * @default null
             */
            hidden: boolean | null;
        };
        /** ResultCustomizationByValue */
        ResultCustomizationByValue: {
            /**
             * Assignmentby
             * @default value
             * @constant
             */
            assignmentBy: "value";
            /** @default null */
            color: components["schemas"]["DataColorToken"] | null;
            /**
             * Hidden
             * @default null
             */
            hidden: boolean | null;
        };
        /**
         * RetentionDashboardDisplayType
         * @enum {string}
         */
        RetentionDashboardDisplayType: "table_only" | "graph_only" | "all";
        /** RetentionEntity */
        RetentionEntity: {
            /**
             * Aggregation Target Field
             * @description Data warehouse field used as the actor identifier
             * @default null
             */
            aggregation_target_field: string | null;
            /**
             * Custom Name
             * @default null
             */
            custom_name: string | null;
            /**
             * Id
             * @default null
             */
            id: string | number | null;
            /** @default null */
            kind: components["schemas"]["RetentionEntityKind"] | null;
            /**
             * Name
             * @default null
             */
            name: string | null;
            /**
             * Order
             * @default null
             */
            order: number | null;
            /**
             * Properties
             * @description filters on the event
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Table Name
             * @description Data warehouse table name
             * @default null
             */
            table_name: string | null;
            /**
             * Timestamp Field
             * @description Data warehouse timestamp field
             * @default null
             */
            timestamp_field: string | null;
            /** @default null */
            type: components["schemas"]["EntityType"] | null;
            /**
             * Uuid
             * @default null
             */
            uuid: string | null;
        };
        /**
         * RetentionEntityKind
         * @enum {string}
         */
        RetentionEntityKind: "ActionsNode" | "EventsNode";
        /** RetentionFilter */
        RetentionFilter: {
            /**
             * Aggregationproperty
             * @description The property to aggregate when aggregationType is sum or avg
             * @default null
             */
            aggregationProperty: string | null;
            /**
             * @description The type of property to aggregate on (event, person or data_warehouse). Defaults to event.
             * @default event
             */
            aggregationPropertyType: components["schemas"]["AggregationPropertyType"] | null;
            /**
             * @description The aggregation type to use for retention
             * @default count
             */
            aggregationType: components["schemas"]["AggregationType"] | null;
            /**
             * @description Chart rendering style overrides (line shape).
             * @default null
             */
            chartStyle: components["schemas"]["ChartStyle"] | null;
            /**
             * Cohortlabelstartindex
             * @description Starting index used when labeling cohort columns (e.g. 0 for D0/D1/D2, 1 for D1/D2/D3). Display-only — does not affect retention calculations.
             * @default 0
             */
            cohortLabelStartIndex: number | null;
            /**
             * Cumulative
             * @default null
             */
            cumulative: boolean | null;
            /**
             * Customaggregationtarget
             * @description For data warehouse based retention insights when the aggregation target can't be mapped to persons or groups.
             * @default null
             */
            customAggregationTarget: boolean | null;
            /** @default null */
            dashboardDisplay: components["schemas"]["RetentionDashboardDisplayType"] | null;
            /**
             * @description controls the display of the retention graph
             * @default null
             */
            display: components["schemas"]["ChartDisplayType"] | null;
            /**
             * Goallines
             * @default null
             */
            goalLines: components["schemas"]["GoalLine"][] | null;
            /** @default null */
            meanRetentionCalculation: components["schemas"]["MeanRetentionCalculation"] | null;
            /**
             * Minimumoccurrences
             * @default null
             */
            minimumOccurrences: number | null;
            /** @default Day */
            period: components["schemas"]["RetentionPeriod"] | null;
            /**
             * Retentioncustombrackets
             * @description Custom brackets for retention calculations
             * @default null
             */
            retentionCustomBrackets: number[] | null;
            /**
             * @description Whether retention is with regard to initial cohort size, or that of the previous period.
             * @default null
             */
            retentionReference: components["schemas"]["RetentionReference"] | null;
            /** @default null */
            retentionType: components["schemas"]["RetentionType"] | null;
            /** @default null */
            returningEntity: components["schemas"]["RetentionEntity"] | null;
            /**
             * Selectedinterval
             * @description The selected interval to display across all cohorts (null = show all intervals for each cohort)
             * @default null
             */
            selectedInterval: number | null;
            /**
             * Showtrendlines
             * @default null
             */
            showTrendLines: boolean | null;
            /** @default null */
            targetEntity: components["schemas"]["RetentionEntity"] | null;
            /**
             * @description The time window mode to use for retention calculations
             * @default null
             */
            timeWindowMode: components["schemas"]["TimeWindowMode"] | null;
            /**
             * Totalintervals
             * @default 8
             */
            totalIntervals: number | null;
        };
        /**
         * RetentionPeriod
         * @enum {string}
         */
        RetentionPeriod: "Hour" | "Day" | "Week" | "Month";
        /** RetentionQuery */
        RetentionQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * @description Breakdown of the events and actions
             * @default null
             */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RetentionQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["RetentionQueryResponse"] | null;
            /** @description Properties specific to the retention insight */
            retentionFilter: components["schemas"]["RetentionFilter"];
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RetentionQueryResponse */
        RetentionQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["RetentionResult"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * RetentionReference
         * @enum {string}
         */
        RetentionReference: "total" | "previous";
        /** RetentionResult */
        RetentionResult: {
            /**
             * Breakdown Value
             * @description Optional breakdown value for retention cohorts
             * @default null
             */
            breakdown_value: string | number | null;
            /**
             * Date
             * Format: date-time
             */
            date: string;
            /** Label */
            label: string;
            /** Values */
            values: components["schemas"]["RetentionValue"][];
        };
        /**
         * RetentionType
         * @enum {string}
         */
        RetentionType: "retention_recurring" | "retention_first_time" | "retention_first_ever_occurrence";
        /** RetentionValue */
        RetentionValue: {
            /**
             * Aggregation Value
             * @default null
             */
            aggregation_value: number | null;
            /** Count */
            count: number;
            /**
             * Label
             * @default null
             */
            label: string | null;
        };
        /** RevenueAnalyticsBreakdown */
        RevenueAnalyticsBreakdown: {
            /** Property */
            property: string;
            /**
             * Type
             * @default revenue_analytics
             * @constant
             */
            type: "revenue_analytics";
        };
        /** RevenueAnalyticsGrossRevenueQuery */
        RevenueAnalyticsGrossRevenueQuery: {
            /** Breakdown */
            breakdown: components["schemas"]["RevenueAnalyticsBreakdown"][];
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            interval: components["schemas"]["SimpleIntervalType"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueAnalyticsGrossRevenueQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: components["schemas"]["RevenueAnalyticsPropertyFilter"][];
            /** @default null */
            response: components["schemas"]["RevenueAnalyticsGrossRevenueQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueAnalyticsGrossRevenueQueryResponse */
        RevenueAnalyticsGrossRevenueQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueAnalyticsMRRQuery */
        RevenueAnalyticsMRRQuery: {
            /** Breakdown */
            breakdown: components["schemas"]["RevenueAnalyticsBreakdown"][];
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            interval: components["schemas"]["SimpleIntervalType"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueAnalyticsMRRQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: components["schemas"]["RevenueAnalyticsPropertyFilter"][];
            /** @default null */
            response: components["schemas"]["RevenueAnalyticsMRRQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueAnalyticsMRRQueryResponse */
        RevenueAnalyticsMRRQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["RevenueAnalyticsMRRQueryResultItem"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueAnalyticsMRRQueryResultItem */
        RevenueAnalyticsMRRQueryResultItem: {
            /** Churn */
            churn: unknown;
            /** Contraction */
            contraction: unknown;
            /** Expansion */
            expansion: unknown;
            /** New */
            new: unknown;
            /** Total */
            total: unknown;
        };
        /** RevenueAnalyticsMetricsQuery */
        RevenueAnalyticsMetricsQuery: {
            /** Breakdown */
            breakdown: components["schemas"]["RevenueAnalyticsBreakdown"][];
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            interval: components["schemas"]["SimpleIntervalType"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueAnalyticsMetricsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: components["schemas"]["RevenueAnalyticsPropertyFilter"][];
            /** @default null */
            response: components["schemas"]["RevenueAnalyticsMetricsQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueAnalyticsMetricsQueryResponse */
        RevenueAnalyticsMetricsQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueAnalyticsOverviewItem */
        RevenueAnalyticsOverviewItem: {
            key: components["schemas"]["RevenueAnalyticsOverviewItemKey"];
            /** Value */
            value: number;
        };
        /**
         * RevenueAnalyticsOverviewItemKey
         * @enum {string}
         */
        RevenueAnalyticsOverviewItemKey: "revenue" | "paying_customer_count" | "avg_revenue_per_customer";
        /** RevenueAnalyticsOverviewQuery */
        RevenueAnalyticsOverviewQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueAnalyticsOverviewQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: components["schemas"]["RevenueAnalyticsPropertyFilter"][];
            /** @default null */
            response: components["schemas"]["RevenueAnalyticsOverviewQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueAnalyticsOverviewQueryResponse */
        RevenueAnalyticsOverviewQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["RevenueAnalyticsOverviewItem"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueAnalyticsPropertyFilter */
        RevenueAnalyticsPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default revenue_analytics
             * @constant
             */
            type: "revenue_analytics";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * RevenueAnalyticsTopCustomersGroupBy
         * @enum {string}
         */
        RevenueAnalyticsTopCustomersGroupBy: "month" | "all";
        /** RevenueAnalyticsTopCustomersQuery */
        RevenueAnalyticsTopCustomersQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            groupBy: components["schemas"]["RevenueAnalyticsTopCustomersGroupBy"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueAnalyticsTopCustomersQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** Properties */
            properties: components["schemas"]["RevenueAnalyticsPropertyFilter"][];
            /** @default null */
            response: components["schemas"]["RevenueAnalyticsTopCustomersQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueAnalyticsTopCustomersQueryResponse */
        RevenueAnalyticsTopCustomersQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueCurrencyPropertyConfig */
        RevenueCurrencyPropertyConfig: {
            /**
             * Property
             * @default null
             */
            property: string | null;
            /** @default null */
            static: components["schemas"]["CurrencyCode"] | null;
        };
        /** RevenueExampleDataWarehouseTablesQuery */
        RevenueExampleDataWarehouseTablesQuery: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueExampleDataWarehouseTablesQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            response: components["schemas"]["RevenueExampleDataWarehouseTablesQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueExampleDataWarehouseTablesQueryResponse */
        RevenueExampleDataWarehouseTablesQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** RevenueExampleEventsQuery */
        RevenueExampleEventsQuery: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "RevenueExampleEventsQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            response: components["schemas"]["RevenueExampleEventsQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** RevenueExampleEventsQueryResponse */
        RevenueExampleEventsQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `engineering` - Engineering
         *     * `data` - Data
         *     * `product` - Product Management
         *     * `founder` - Founder
         *     * `leadership` - Leadership
         *     * `marketing` - Marketing
         *     * `sales` - Sales / Success
         *     * `other` - Other
         * @enum {string}
         */
        RoleAtOrganizationEnum: "engineering" | "data" | "product" | "founder" | "leadership" | "marketing" | "sales" | "other";
        /** SamplingRate */
        SamplingRate: {
            /**
             * Denominator
             * @default null
             */
            denominator: number | null;
            /** Numerator */
            numerator: number;
        };
        /**
         * Scale
         * @enum {string}
         */
        Scale: "linear" | "logarithmic";
        SchemaPropertyGroup: {
            /** Format: uuid */
            readonly id: string;
            name: string;
            description?: string;
            properties?: components["schemas"]["SchemaPropertyGroupProperty"][];
            readonly events: components["schemas"]["EventDefinitionBasic"][];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            readonly created_by: components["schemas"]["UserBasic"];
        };
        SchemaPropertyGroupProperty: {
            /** Format: uuid */
            readonly id: string;
            name: string;
            property_type: components["schemas"]["SchemaPropertyGroupPropertyPropertyTypeEnum"];
            is_required?: boolean;
            is_optional_in_types?: boolean;
            description?: string;
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
        };
        /**
         * @description * `DateTime` - DateTime
         *     * `String` - String
         *     * `Numeric` - Numeric
         *     * `Boolean` - Boolean
         *     * `Object` - Object
         * @enum {string}
         */
        SchemaPropertyGroupPropertyPropertyTypeEnum: "DateTime" | "String" | "Numeric" | "Boolean" | "Object";
        /** @enum {string} */
        SearchMatchTypeEnum: "exact" | "similar";
        /** SessionAttributionExplorerQuery */
        SessionAttributionExplorerQuery: {
            /** @default null */
            filters: components["schemas"]["Filters"] | null;
            /** Groupby */
            groupBy: components["schemas"]["SessionAttributionGroupBy"][];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "SessionAttributionExplorerQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            response: components["schemas"]["SessionAttributionExplorerQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** SessionAttributionExplorerQueryResponse */
        SessionAttributionExplorerQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * SessionAttributionGroupBy
         * @enum {string}
         */
        SessionAttributionGroupBy: "ChannelType" | "Medium" | "Source" | "Campaign" | "AdIds" | "ReferringDomain" | "InitialURL";
        /** SessionData */
        SessionData: {
            /** Event Uuid */
            event_uuid: string;
            /** Person Id */
            person_id: string;
            /** Session Id */
            session_id: string;
            /** Timestamp */
            timestamp: string;
        };
        /** SessionPropertyFilter */
        SessionPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default session
             * @constant
             */
            type: "session";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** SessionQuery */
        SessionQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Includesentiment
             * @description Include stored sentiment evaluation results for returned traces and generation events.
             * @default null
             */
            includeSentiment: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "SessionQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            response: components["schemas"]["SessionQueryResponse"] | null;
            /** Sessionid */
            sessionId: string;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** SessionQueryResponse */
        SessionQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["LLMTrace"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `30d` - 30 Days
         *     * `90d` - 90 Days
         *     * `1y` - 1 Year
         *     * `5y` - 5 Years
         * @enum {string}
         */
        SessionRecordingRetentionPeriodEnum: "30d" | "90d" | "1y" | "5y";
        /**
         * SessionTableVersion
         * @enum {string}
         */
        SessionTableVersion: "auto" | "v1" | "v2" | "v3";
        /** SessionsQuery */
        SessionsQuery: {
            /**
             * Actionid
             * @description Filter sessions by action - sessions that contain events matching this action
             * @default null
             */
            actionId: number | null;
            /**
             * After
             * @description Only fetch sessions that started after this timestamp
             * @default null
             */
            after: string | null;
            /**
             * Before
             * @description Only fetch sessions that started before this timestamp
             * @default null
             */
            before: string | null;
            /**
             * Event
             * @description Filter sessions by event name - sessions that contain this event
             * @default null
             */
            event: string | null;
            /**
             * Eventproperties
             * @description Event property filters - filters sessions that contain events matching these properties
             * @default null
             */
            eventProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Filtertestaccounts
             * @description Filter test accounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Fixedproperties
             * @description Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person)
             * @default null
             */
            fixedProperties: (components["schemas"]["PropertyGroupFilter"] | components["schemas"]["PropertyGroupFilterValue"] | (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"]))[] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "SessionsQuery";
            /**
             * Limit
             * @description Number of rows to return
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @description Number of rows to skip before returning rows
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @description Columns to order by
             * @default null
             */
            orderBy: string[] | null;
            /**
             * Personid
             * @description Show sessions for a given person
             * @default null
             */
            personId: string | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** @default null */
            response: components["schemas"]["SessionsQueryResponse"] | null;
            /**
             * Select
             * @description Return a limited set of data. Required.
             */
            select: string[];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
            /**
             * Where
             * @description HogQL filters to apply on returned data
             * @default null
             */
            where: string[] | null;
        };
        /** SessionsQueryResponse */
        SessionsQueryResponse: {
            /** Columns */
            columns: unknown[];
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             */
            hogql: string;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /** Types */
            types: string[];
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * SessionsV2JoinMode
         * @enum {string}
         */
        SessionsV2JoinMode: "string" | "uuid";
        /** Settings */
        Settings: {
            /** @default null */
            display: components["schemas"]["ChartSettingsDisplay"] | null;
            /** @default null */
            formatting: components["schemas"]["ChartSettingsFormatting"] | null;
        };
        /**
         * SimpleIntervalType
         * @enum {string}
         */
        SimpleIntervalType: "day" | "month";
        /**
         * SliceContent
         * @enum {string}
         */
        SliceContent: "labels" | "values" | "none";
        /** SpanPropertyFilter */
        SpanPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            type: components["schemas"]["SpanPropertyFilterType"];
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * SpanPropertyFilterType
         * @enum {string}
         */
        SpanPropertyFilterType: "span" | "span_attribute" | "span_resource_attribute";
        /**
         * StartHandling
         * @enum {string}
         */
        StartHandling: "first_seen" | "last_seen";
        /**
         * StepOrderValue
         * @enum {string}
         */
        StepOrderValue: "strict" | "unordered" | "ordered";
        /** StickinessActorsQuery */
        StickinessActorsQuery: {
            /** @default null */
            compare: components["schemas"]["Compare"] | null;
            /**
             * Day
             * @default null
             */
            day: string | number | null;
            /**
             * Includerecordings
             * @default null
             */
            includeRecordings: boolean | null;
            /**
             * Kind
             * @default StickinessActorsQuery
             * @constant
             */
            kind: "StickinessActorsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            operator: components["schemas"]["StickinessOperator"] | null;
            /** @default null */
            response: components["schemas"]["ActorsQueryResponse"] | null;
            /**
             * Series
             * @default null
             */
            series: number | null;
            source: components["schemas"]["StickinessQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * StickinessComputationMode
         * @enum {string}
         */
        StickinessComputationMode: "non_cumulative" | "cumulative";
        /** StickinessCriteria */
        StickinessCriteria: {
            operator: components["schemas"]["StickinessOperator"];
            /** Value */
            value: number;
        };
        /** StickinessFilter */
        StickinessFilter: {
            /**
             * @description Chart rendering style overrides (line shape).
             * @default null
             */
            chartStyle: components["schemas"]["ChartStyle"] | null;
            /** @default null */
            computedAs: components["schemas"]["StickinessComputationMode"] | null;
            /** @default null */
            display: components["schemas"]["ChartDisplayType"] | null;
            /**
             * Hiddenlegendindexes
             * @default null
             */
            hiddenLegendIndexes: number[] | null;
            /**
             * @description Where the in-chart legend sits relative to the plot. Only applies to the in-chart legend.
             * @default bottom
             */
            legendPosition: components["schemas"]["LegendPosition"] | null;
            /**
             * @description Whether result datasets are associated by their values or by their order.
             * @default value
             */
            resultCustomizationBy: components["schemas"]["ResultCustomizationBy"] | null;
            /**
             * Resultcustomizations
             * @description Customizations for the appearance of result datasets.
             * @default null
             */
            resultCustomizations: {
                [key: string]: components["schemas"]["ResultCustomizationByValue"];
            } | {
                [key: string]: components["schemas"]["ResultCustomizationByPosition"];
            } | null;
            /**
             * Showlegend
             * @default null
             */
            showLegend: boolean | null;
            /**
             * Showmultipleyaxes
             * @default null
             */
            showMultipleYAxes: boolean | null;
            /**
             * Showvaluesonseries
             * @default null
             */
            showValuesOnSeries: boolean | null;
            /** @default null */
            stickinessCriteria: components["schemas"]["StickinessCriteria"] | null;
        };
        /**
         * StickinessOperator
         * @enum {string}
         */
        StickinessOperator: "gte" | "lte" | "exact";
        /** StickinessQuery */
        StickinessQuery: {
            /**
             * @description Compare to date range
             * @default null
             */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
             * @default day
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * Intervalcount
             * @description How many intervals comprise a period. Only used for cohorts, otherwise default 1.
             * @default null
             */
            intervalCount: number | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "StickinessQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["StickinessQueryResponse"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Series
             * @description Events and actions to include
             */
            series: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["DataWarehouseNode"])[];
            /**
             * @description Properties specific to the stickiness insight
             * @default null
             */
            stickinessFilter: components["schemas"]["StickinessFilter"] | null;
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** StickinessQueryResponse */
        StickinessQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: {
                [key: string]: unknown;
            }[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * @description * `exact` - exact
         *     * `is_not` - is_not
         *     * `icontains` - icontains
         *     * `not_icontains` - not_icontains
         *     * `regex` - regex
         *     * `not_regex` - not_regex
         * @enum {string}
         */
        StringMatchOperatorEnum: "exact" | "is_not" | "icontains" | "not_icontains" | "regex" | "not_regex";
        /** @description Matches string values with text-oriented operators. */
        StringPropertyFilter: {
            /** @description Key of the property you're filtering on. For example `email` or `$current_url`. */
            key: string;
            /**
             * @description Property type (event, person, session, etc.).
             *
             *     * `event` - event
             *     * `event_metadata` - event_metadata
             *     * `feature` - feature
             *     * `person` - person
             *     * `person_metadata` - person_metadata
             *     * `cohort` - cohort
             *     * `element` - element
             *     * `static-cohort` - static-cohort
             *     * `dynamic-cohort` - dynamic-cohort
             *     * `precalculated-cohort` - precalculated-cohort
             *     * `group` - group
             *     * `recording` - recording
             *     * `log_entry` - log_entry
             *     * `behavioral` - behavioral
             *     * `session` - session
             *     * `hogql` - hogql
             *     * `data_warehouse` - data_warehouse
             *     * `data_warehouse_person_property` - data_warehouse_person_property
             *     * `error_tracking_issue` - error_tracking_issue
             *     * `log` - log
             *     * `log_attribute` - log_attribute
             *     * `log_resource_attribute` - log_resource_attribute
             *     * `metric_attribute` - metric_attribute
             *     * `span` - span
             *     * `span_attribute` - span_attribute
             *     * `span_resource_attribute` - span_resource_attribute
             *     * `revenue_analytics` - revenue_analytics
             *     * `account_custom_property` - account_custom_property
             *     * `flag` - flag
             *     * `workflow_variable` - workflow_variable
             * @default event
             */
            type: components["schemas"]["PropertyFilterTypeEnum"];
            /** @description String value to match against. */
            value: string;
            /**
             * @description String comparison operator.
             *
             *     * `exact` - exact
             *     * `is_not` - is_not
             *     * `icontains` - icontains
             *     * `not_icontains` - not_icontains
             *     * `regex` - regex
             *     * `not_regex` - not_regex
             * @default exact
             */
            operator: components["schemas"]["StringMatchOperatorEnum"];
        };
        /**
         * Style
         * @enum {string}
         */
        Style: "none" | "number" | "short" | "percent";
        /** TableSettings */
        TableSettings: {
            /**
             * Columns
             * @default null
             */
            columns: components["schemas"]["ChartAxis"][] | null;
            /**
             * Conditionalformatting
             * @default null
             */
            conditionalFormatting: components["schemas"]["ConditionalFormattingRule"][] | null;
            /**
             * Pinnedcolumns
             * @default null
             */
            pinnedColumns: string[] | null;
            /**
             * Transpose
             * @default null
             */
            transpose: boolean | null;
        };
        /**
         * TaxonomicFilterGroupType
         * @enum {string}
         */
        TaxonomicFilterGroupType: "metadata" | "actions" | "cohorts" | "cohorts_with_all" | "data_warehouse" | "data_warehouse_source_tables" | "data_warehouse_properties" | "data_warehouse_person_properties" | "elements" | "events" | "internal_events" | "internal_event_properties" | "event_properties" | "event_feature_flags" | "event_metadata" | "numerical_event_properties" | "person_properties" | "person_metadata" | "pageview_urls" | "pageview_events" | "screens" | "screen_events" | "email_addresses" | "autocapture_events" | "custom_events" | "wildcard" | "groups" | "persons" | "feature_flags" | "insights" | "experiments" | "plugins" | "dashboards" | "name_groups" | "session_properties" | "hogql_expression" | "notebooks" | "log_entries" | "error_tracking_issues" | "logs" | "log_attributes" | "log_resource_attributes" | "metric_attributes" | "spans" | "span_attributes" | "span_resource_attributes" | "replay" | "replay_saved_filters" | "revenue_analytics_properties" | "account_custom_properties" | "resources" | "error_tracking_properties" | "activity_log_properties" | "mcp_properties" | "max_ai_context" | "workflow_variables" | "suggested_filters" | "recent_filters" | "pinned_filters" | "empty";
        Team: {
            readonly id: number;
            /** Format: uuid */
            readonly uuid: string;
            name?: string;
            access_control?: boolean;
            /** Format: uuid */
            readonly organization: string;
            /** Format: int64 */
            readonly project_id: number;
            readonly api_token: string;
            readonly secret_api_token: string | null;
            readonly secret_api_token_backup: string | null;
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            readonly ingested_event: boolean;
            readonly default_modifiers: {
                [key: string]: unknown;
            };
            readonly person_on_events_querying_enabled: boolean;
            /** @description The effective access level the user has for this object */
            readonly user_access_level: string | null;
            app_urls?: (string | null)[];
            anonymize_ips?: boolean;
            completed_snippet_onboarding?: boolean;
            /**
             * @description Filters used to identify internal/test users. Each entry is a property filter.
             *
             *                 Supported entry types and the exact shape each accepts:
             *
             *                 # Person property — match (or exclude) by a person property
             *                 {"key": "email", "type": "person", "value": "@example.com", "operator": "icontains"}
             *
             *                 # Event property — match by an event property
             *                 {"key": "$host", "type": "event", "value": "localhost", "operator": "icontains"}
             *
             *                 # Cohort membership — match (or exclude) members of a cohort.
             *                 # Use operator "in" for inclusion and "not_in" for exclusion. Do NOT use a
             *                 # `negation` field here — `negation` is specific to cohort *definitions*
             *                 # (the inner sub-filters that build a cohort) and is rejected by the
             *                 # property-filter schema.
             *                 {"key": "id", "type": "cohort", "value": 8814, "operator": "not_in"}
             *
             *                 Common operators: "exact", "is_not", "icontains", "not_icontains", "regex",
             *                 "not_regex", "gt", "lt", "gte", "lte", "is_set", "is_not_set", "in", "not_in".
             */
            test_account_filters?: unknown;
            test_account_filters_default_checked?: boolean | null;
            is_demo?: boolean;
            timezone?: components["schemas"]["TimezoneEnum"];
            person_display_name_properties?: string[] | null;
            autocapture_opt_out?: boolean | null;
            autocapture_exceptions_opt_in?: boolean | null;
            autocapture_web_vitals_opt_in?: boolean | null;
            capture_console_log_opt_in?: boolean | null;
            capture_performance_opt_in?: boolean | null;
            session_recording_opt_in?: boolean;
            /** Format: decimal */
            session_recording_sample_rate?: string | null;
            session_recording_minimum_duration_milliseconds?: number | null;
            session_recording_url_trigger_config?: unknown[] | null;
            session_recording_url_blocklist_config?: unknown[] | null;
            session_recording_event_trigger_config?: (string | null)[] | null;
            session_recording_trigger_match_type_config?: string | null;
            /** @description V2 trigger groups configuration for session recording. If present, takes precedence over legacy trigger fields. */
            session_recording_trigger_groups?: unknown;
            session_recording_retention_period?: components["schemas"]["SessionRecordingRetentionPeriodEnum"];
            week_start_day?: components["schemas"]["WeekStartDayEnum"] | components["schemas"]["NullEnum"];
            primary_dashboard?: number | null;
            live_events_columns?: string[] | null;
            recording_domains?: (string | null)[] | null;
            cookieless_server_hash_mode?: components["schemas"]["CookielessServerHashModeEnum"] | components["schemas"]["NullEnum"];
            human_friendly_comparison_periods?: boolean | null;
            inject_web_apps?: boolean | null;
            surveys_opt_in?: boolean | null;
            heatmaps_opt_in?: boolean | null;
            flags_persistence_default?: boolean | null;
            feature_flag_confirmation_enabled?: boolean | null;
            feature_flag_confirmation_message?: string | null;
            /** @description Whether to automatically apply default evaluation contexts to new feature flags */
            default_evaluation_contexts_enabled?: boolean | null;
            /** @description Whether to require at least one evaluation context tag when creating new feature flags */
            require_evaluation_contexts?: boolean | null;
            capture_dead_clicks?: boolean | null;
            default_data_theme?: number | null;
            revenue_analytics_config?: components["schemas"]["TeamRevenueAnalyticsConfig"];
            marketing_analytics_config?: components["schemas"]["TeamMarketingAnalyticsConfig"];
            customer_analytics_config?: components["schemas"]["TeamCustomerAnalyticsConfig"];
            /** @default USD */
            base_currency: components["schemas"]["BaseCurrencyEnum"];
            web_analytics_pre_aggregated_tables_enabled?: boolean | null;
            receive_org_level_activity_logs?: boolean | null;
            /**
             * @description Whether this project serves B2B or B2C customers, used to optimize the UI layout.
             *
             *     * `b2b` - B2B
             *     * `b2c` - B2C
             *     * `other` - Other
             */
            business_model?: components["schemas"]["BusinessModelEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
            conversations_enabled?: boolean | null;
            proactive_tasks_enabled?: boolean | null;
            workflows_config?: components["schemas"]["TeamWorkflowsConfig"];
            readonly effective_membership_level: components["schemas"]["EffectiveMembershipLevelEnum"];
            readonly has_group_types: boolean;
            readonly group_types: {
                [key: string]: unknown;
            }[];
            readonly live_events_token: string | null;
            readonly product_intents: {
                [key: string]: unknown;
            }[];
            readonly managed_viewsets: {
                [key: string]: boolean;
            };
            readonly available_setup_task_ids: components["schemas"]["AvailableSetupTaskIdsEnum"][];
            /** @description The team's events data retention window in months (plan-derived, synced from billing). When retention enforcement is active for the team, queries do not return events older than this many months. */
            readonly event_retention_months: number;
            /** @description Whether events data retention is currently enforced for this team (cohort/flag gated). */
            readonly events_retention_enforced: boolean;
        };
        TeamCustomerAnalyticsConfig: {
            /** @description Event used as the activity signal (DAU/WAU/MAU). */
            activity_event?: unknown;
            /** @description Event used to count signup pageviews on dashboards. */
            signup_pageview_event?: unknown;
            /** @description Event used to count signups on dashboards. */
            signup_event?: unknown;
            /** @description Event used to count subscriptions on dashboards. */
            subscription_event?: unknown;
            /** @description Event used to count payments on dashboards. */
            payment_event?: unknown;
            /** @description Index of the group type to treat as an Account in customer analytics. Must reference an existing group type configured for the project. */
            account_group_type_index?: number | null;
        };
        TeamMarketingAnalyticsConfig: {
            attribution_window_days?: number;
            attribution_mode?: components["schemas"]["AttributionModeEnum"];
        };
        TeamRevenueAnalyticsConfig: {
            base_currency?: components["schemas"]["BaseCurrencyEnum"];
            filter_test_accounts?: boolean;
        };
        TeamWorkflowsConfig: {
            /** @description When enabled, workflows engagement activity (email sends, opens, clicks, bounces, spam reports, unsubscribes) is captured as standard PostHog events ($workflows_email_*) alongside the existing workflow metrics. */
            capture_workflows_engagement_events?: boolean;
        };
        /**
         * TextMatching
         * @enum {unknown}
         */
        TextMatching: "contains" | "exact" | "regex" | null;
        /** TileFilters */
        TileFilters: {
            /** @default null */
            breakdown_filter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * Date From
             * @default null
             */
            date_from: string | null;
            /**
             * Date To
             * @default null
             */
            date_to: string | null;
            /**
             * Explicitdate
             * @default null
             */
            explicitDate: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Ignoredashboardfilters
             * @description When true, this tile ignores every dashboard-level filter; the tile's own overrides still apply.
             * @default null
             */
            ignoreDashboardFilters: boolean | null;
            /** @default null */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * Properties
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
        };
        /**
         * TimeWindowMode
         * @enum {string}
         */
        TimeWindowMode: "strict_calendar_dates" | "24_hour_windows";
        /**
         * @description * `Africa/Abidjan` - Africa/Abidjan
         *     * `Africa/Accra` - Africa/Accra
         *     * `Africa/Addis_Ababa` - Africa/Addis_Ababa
         *     * `Africa/Algiers` - Africa/Algiers
         *     * `Africa/Asmara` - Africa/Asmara
         *     * `Africa/Asmera` - Africa/Asmera
         *     * `Africa/Bamako` - Africa/Bamako
         *     * `Africa/Bangui` - Africa/Bangui
         *     * `Africa/Banjul` - Africa/Banjul
         *     * `Africa/Bissau` - Africa/Bissau
         *     * `Africa/Blantyre` - Africa/Blantyre
         *     * `Africa/Brazzaville` - Africa/Brazzaville
         *     * `Africa/Bujumbura` - Africa/Bujumbura
         *     * `Africa/Cairo` - Africa/Cairo
         *     * `Africa/Casablanca` - Africa/Casablanca
         *     * `Africa/Ceuta` - Africa/Ceuta
         *     * `Africa/Conakry` - Africa/Conakry
         *     * `Africa/Dakar` - Africa/Dakar
         *     * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
         *     * `Africa/Djibouti` - Africa/Djibouti
         *     * `Africa/Douala` - Africa/Douala
         *     * `Africa/El_Aaiun` - Africa/El_Aaiun
         *     * `Africa/Freetown` - Africa/Freetown
         *     * `Africa/Gaborone` - Africa/Gaborone
         *     * `Africa/Harare` - Africa/Harare
         *     * `Africa/Johannesburg` - Africa/Johannesburg
         *     * `Africa/Juba` - Africa/Juba
         *     * `Africa/Kampala` - Africa/Kampala
         *     * `Africa/Khartoum` - Africa/Khartoum
         *     * `Africa/Kigali` - Africa/Kigali
         *     * `Africa/Kinshasa` - Africa/Kinshasa
         *     * `Africa/Lagos` - Africa/Lagos
         *     * `Africa/Libreville` - Africa/Libreville
         *     * `Africa/Lome` - Africa/Lome
         *     * `Africa/Luanda` - Africa/Luanda
         *     * `Africa/Lubumbashi` - Africa/Lubumbashi
         *     * `Africa/Lusaka` - Africa/Lusaka
         *     * `Africa/Malabo` - Africa/Malabo
         *     * `Africa/Maputo` - Africa/Maputo
         *     * `Africa/Maseru` - Africa/Maseru
         *     * `Africa/Mbabane` - Africa/Mbabane
         *     * `Africa/Mogadishu` - Africa/Mogadishu
         *     * `Africa/Monrovia` - Africa/Monrovia
         *     * `Africa/Nairobi` - Africa/Nairobi
         *     * `Africa/Ndjamena` - Africa/Ndjamena
         *     * `Africa/Niamey` - Africa/Niamey
         *     * `Africa/Nouakchott` - Africa/Nouakchott
         *     * `Africa/Ouagadougou` - Africa/Ouagadougou
         *     * `Africa/Porto-Novo` - Africa/Porto-Novo
         *     * `Africa/Sao_Tome` - Africa/Sao_Tome
         *     * `Africa/Timbuktu` - Africa/Timbuktu
         *     * `Africa/Tripoli` - Africa/Tripoli
         *     * `Africa/Tunis` - Africa/Tunis
         *     * `Africa/Windhoek` - Africa/Windhoek
         *     * `America/Adak` - America/Adak
         *     * `America/Anchorage` - America/Anchorage
         *     * `America/Anguilla` - America/Anguilla
         *     * `America/Antigua` - America/Antigua
         *     * `America/Araguaina` - America/Araguaina
         *     * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
         *     * `America/Argentina/Catamarca` - America/Argentina/Catamarca
         *     * `America/Argentina/ComodRivadavia` - America/Argentina/ComodRivadavia
         *     * `America/Argentina/Cordoba` - America/Argentina/Cordoba
         *     * `America/Argentina/Jujuy` - America/Argentina/Jujuy
         *     * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
         *     * `America/Argentina/Mendoza` - America/Argentina/Mendoza
         *     * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
         *     * `America/Argentina/Salta` - America/Argentina/Salta
         *     * `America/Argentina/San_Juan` - America/Argentina/San_Juan
         *     * `America/Argentina/San_Luis` - America/Argentina/San_Luis
         *     * `America/Argentina/Tucuman` - America/Argentina/Tucuman
         *     * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
         *     * `America/Aruba` - America/Aruba
         *     * `America/Asuncion` - America/Asuncion
         *     * `America/Atikokan` - America/Atikokan
         *     * `America/Atka` - America/Atka
         *     * `America/Bahia` - America/Bahia
         *     * `America/Bahia_Banderas` - America/Bahia_Banderas
         *     * `America/Barbados` - America/Barbados
         *     * `America/Belem` - America/Belem
         *     * `America/Belize` - America/Belize
         *     * `America/Blanc-Sablon` - America/Blanc-Sablon
         *     * `America/Boa_Vista` - America/Boa_Vista
         *     * `America/Bogota` - America/Bogota
         *     * `America/Boise` - America/Boise
         *     * `America/Buenos_Aires` - America/Buenos_Aires
         *     * `America/Cambridge_Bay` - America/Cambridge_Bay
         *     * `America/Campo_Grande` - America/Campo_Grande
         *     * `America/Cancun` - America/Cancun
         *     * `America/Caracas` - America/Caracas
         *     * `America/Catamarca` - America/Catamarca
         *     * `America/Cayenne` - America/Cayenne
         *     * `America/Cayman` - America/Cayman
         *     * `America/Chicago` - America/Chicago
         *     * `America/Chihuahua` - America/Chihuahua
         *     * `America/Ciudad_Juarez` - America/Ciudad_Juarez
         *     * `America/Coral_Harbour` - America/Coral_Harbour
         *     * `America/Cordoba` - America/Cordoba
         *     * `America/Costa_Rica` - America/Costa_Rica
         *     * `America/Creston` - America/Creston
         *     * `America/Cuiaba` - America/Cuiaba
         *     * `America/Curacao` - America/Curacao
         *     * `America/Danmarkshavn` - America/Danmarkshavn
         *     * `America/Dawson` - America/Dawson
         *     * `America/Dawson_Creek` - America/Dawson_Creek
         *     * `America/Denver` - America/Denver
         *     * `America/Detroit` - America/Detroit
         *     * `America/Dominica` - America/Dominica
         *     * `America/Edmonton` - America/Edmonton
         *     * `America/Eirunepe` - America/Eirunepe
         *     * `America/El_Salvador` - America/El_Salvador
         *     * `America/Ensenada` - America/Ensenada
         *     * `America/Fort_Nelson` - America/Fort_Nelson
         *     * `America/Fort_Wayne` - America/Fort_Wayne
         *     * `America/Fortaleza` - America/Fortaleza
         *     * `America/Glace_Bay` - America/Glace_Bay
         *     * `America/Godthab` - America/Godthab
         *     * `America/Goose_Bay` - America/Goose_Bay
         *     * `America/Grand_Turk` - America/Grand_Turk
         *     * `America/Grenada` - America/Grenada
         *     * `America/Guadeloupe` - America/Guadeloupe
         *     * `America/Guatemala` - America/Guatemala
         *     * `America/Guayaquil` - America/Guayaquil
         *     * `America/Guyana` - America/Guyana
         *     * `America/Halifax` - America/Halifax
         *     * `America/Havana` - America/Havana
         *     * `America/Hermosillo` - America/Hermosillo
         *     * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
         *     * `America/Indiana/Knox` - America/Indiana/Knox
         *     * `America/Indiana/Marengo` - America/Indiana/Marengo
         *     * `America/Indiana/Petersburg` - America/Indiana/Petersburg
         *     * `America/Indiana/Tell_City` - America/Indiana/Tell_City
         *     * `America/Indiana/Vevay` - America/Indiana/Vevay
         *     * `America/Indiana/Vincennes` - America/Indiana/Vincennes
         *     * `America/Indiana/Winamac` - America/Indiana/Winamac
         *     * `America/Indianapolis` - America/Indianapolis
         *     * `America/Inuvik` - America/Inuvik
         *     * `America/Iqaluit` - America/Iqaluit
         *     * `America/Jamaica` - America/Jamaica
         *     * `America/Jujuy` - America/Jujuy
         *     * `America/Juneau` - America/Juneau
         *     * `America/Kentucky/Louisville` - America/Kentucky/Louisville
         *     * `America/Kentucky/Monticello` - America/Kentucky/Monticello
         *     * `America/Knox_IN` - America/Knox_IN
         *     * `America/Kralendijk` - America/Kralendijk
         *     * `America/La_Paz` - America/La_Paz
         *     * `America/Lima` - America/Lima
         *     * `America/Los_Angeles` - America/Los_Angeles
         *     * `America/Louisville` - America/Louisville
         *     * `America/Lower_Princes` - America/Lower_Princes
         *     * `America/Maceio` - America/Maceio
         *     * `America/Managua` - America/Managua
         *     * `America/Manaus` - America/Manaus
         *     * `America/Marigot` - America/Marigot
         *     * `America/Martinique` - America/Martinique
         *     * `America/Matamoros` - America/Matamoros
         *     * `America/Mazatlan` - America/Mazatlan
         *     * `America/Mendoza` - America/Mendoza
         *     * `America/Menominee` - America/Menominee
         *     * `America/Merida` - America/Merida
         *     * `America/Metlakatla` - America/Metlakatla
         *     * `America/Mexico_City` - America/Mexico_City
         *     * `America/Miquelon` - America/Miquelon
         *     * `America/Moncton` - America/Moncton
         *     * `America/Monterrey` - America/Monterrey
         *     * `America/Montevideo` - America/Montevideo
         *     * `America/Montreal` - America/Montreal
         *     * `America/Montserrat` - America/Montserrat
         *     * `America/Nassau` - America/Nassau
         *     * `America/New_York` - America/New_York
         *     * `America/Nipigon` - America/Nipigon
         *     * `America/Nome` - America/Nome
         *     * `America/Noronha` - America/Noronha
         *     * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
         *     * `America/North_Dakota/Center` - America/North_Dakota/Center
         *     * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
         *     * `America/Nuuk` - America/Nuuk
         *     * `America/Ojinaga` - America/Ojinaga
         *     * `America/Panama` - America/Panama
         *     * `America/Pangnirtung` - America/Pangnirtung
         *     * `America/Paramaribo` - America/Paramaribo
         *     * `America/Phoenix` - America/Phoenix
         *     * `America/Port-au-Prince` - America/Port-au-Prince
         *     * `America/Port_of_Spain` - America/Port_of_Spain
         *     * `America/Porto_Acre` - America/Porto_Acre
         *     * `America/Porto_Velho` - America/Porto_Velho
         *     * `America/Puerto_Rico` - America/Puerto_Rico
         *     * `America/Punta_Arenas` - America/Punta_Arenas
         *     * `America/Rainy_River` - America/Rainy_River
         *     * `America/Rankin_Inlet` - America/Rankin_Inlet
         *     * `America/Recife` - America/Recife
         *     * `America/Regina` - America/Regina
         *     * `America/Resolute` - America/Resolute
         *     * `America/Rio_Branco` - America/Rio_Branco
         *     * `America/Rosario` - America/Rosario
         *     * `America/Santa_Isabel` - America/Santa_Isabel
         *     * `America/Santarem` - America/Santarem
         *     * `America/Santiago` - America/Santiago
         *     * `America/Santo_Domingo` - America/Santo_Domingo
         *     * `America/Sao_Paulo` - America/Sao_Paulo
         *     * `America/Scoresbysund` - America/Scoresbysund
         *     * `America/Shiprock` - America/Shiprock
         *     * `America/Sitka` - America/Sitka
         *     * `America/St_Barthelemy` - America/St_Barthelemy
         *     * `America/St_Johns` - America/St_Johns
         *     * `America/St_Kitts` - America/St_Kitts
         *     * `America/St_Lucia` - America/St_Lucia
         *     * `America/St_Thomas` - America/St_Thomas
         *     * `America/St_Vincent` - America/St_Vincent
         *     * `America/Swift_Current` - America/Swift_Current
         *     * `America/Tegucigalpa` - America/Tegucigalpa
         *     * `America/Thule` - America/Thule
         *     * `America/Thunder_Bay` - America/Thunder_Bay
         *     * `America/Tijuana` - America/Tijuana
         *     * `America/Toronto` - America/Toronto
         *     * `America/Tortola` - America/Tortola
         *     * `America/Vancouver` - America/Vancouver
         *     * `America/Virgin` - America/Virgin
         *     * `America/Whitehorse` - America/Whitehorse
         *     * `America/Winnipeg` - America/Winnipeg
         *     * `America/Yakutat` - America/Yakutat
         *     * `America/Yellowknife` - America/Yellowknife
         *     * `Antarctica/Casey` - Antarctica/Casey
         *     * `Antarctica/Davis` - Antarctica/Davis
         *     * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
         *     * `Antarctica/Macquarie` - Antarctica/Macquarie
         *     * `Antarctica/Mawson` - Antarctica/Mawson
         *     * `Antarctica/McMurdo` - Antarctica/McMurdo
         *     * `Antarctica/Palmer` - Antarctica/Palmer
         *     * `Antarctica/Rothera` - Antarctica/Rothera
         *     * `Antarctica/South_Pole` - Antarctica/South_Pole
         *     * `Antarctica/Syowa` - Antarctica/Syowa
         *     * `Antarctica/Troll` - Antarctica/Troll
         *     * `Antarctica/Vostok` - Antarctica/Vostok
         *     * `Arctic/Longyearbyen` - Arctic/Longyearbyen
         *     * `Asia/Aden` - Asia/Aden
         *     * `Asia/Almaty` - Asia/Almaty
         *     * `Asia/Amman` - Asia/Amman
         *     * `Asia/Anadyr` - Asia/Anadyr
         *     * `Asia/Aqtau` - Asia/Aqtau
         *     * `Asia/Aqtobe` - Asia/Aqtobe
         *     * `Asia/Ashgabat` - Asia/Ashgabat
         *     * `Asia/Ashkhabad` - Asia/Ashkhabad
         *     * `Asia/Atyrau` - Asia/Atyrau
         *     * `Asia/Baghdad` - Asia/Baghdad
         *     * `Asia/Bahrain` - Asia/Bahrain
         *     * `Asia/Baku` - Asia/Baku
         *     * `Asia/Bangkok` - Asia/Bangkok
         *     * `Asia/Barnaul` - Asia/Barnaul
         *     * `Asia/Beirut` - Asia/Beirut
         *     * `Asia/Bishkek` - Asia/Bishkek
         *     * `Asia/Brunei` - Asia/Brunei
         *     * `Asia/Calcutta` - Asia/Calcutta
         *     * `Asia/Chita` - Asia/Chita
         *     * `Asia/Choibalsan` - Asia/Choibalsan
         *     * `Asia/Chongqing` - Asia/Chongqing
         *     * `Asia/Chungking` - Asia/Chungking
         *     * `Asia/Colombo` - Asia/Colombo
         *     * `Asia/Dacca` - Asia/Dacca
         *     * `Asia/Damascus` - Asia/Damascus
         *     * `Asia/Dhaka` - Asia/Dhaka
         *     * `Asia/Dili` - Asia/Dili
         *     * `Asia/Dubai` - Asia/Dubai
         *     * `Asia/Dushanbe` - Asia/Dushanbe
         *     * `Asia/Famagusta` - Asia/Famagusta
         *     * `Asia/Gaza` - Asia/Gaza
         *     * `Asia/Harbin` - Asia/Harbin
         *     * `Asia/Hebron` - Asia/Hebron
         *     * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
         *     * `Asia/Hong_Kong` - Asia/Hong_Kong
         *     * `Asia/Hovd` - Asia/Hovd
         *     * `Asia/Irkutsk` - Asia/Irkutsk
         *     * `Asia/Istanbul` - Asia/Istanbul
         *     * `Asia/Jakarta` - Asia/Jakarta
         *     * `Asia/Jayapura` - Asia/Jayapura
         *     * `Asia/Jerusalem` - Asia/Jerusalem
         *     * `Asia/Kabul` - Asia/Kabul
         *     * `Asia/Kamchatka` - Asia/Kamchatka
         *     * `Asia/Karachi` - Asia/Karachi
         *     * `Asia/Kashgar` - Asia/Kashgar
         *     * `Asia/Kathmandu` - Asia/Kathmandu
         *     * `Asia/Katmandu` - Asia/Katmandu
         *     * `Asia/Khandyga` - Asia/Khandyga
         *     * `Asia/Kolkata` - Asia/Kolkata
         *     * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
         *     * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
         *     * `Asia/Kuching` - Asia/Kuching
         *     * `Asia/Kuwait` - Asia/Kuwait
         *     * `Asia/Macao` - Asia/Macao
         *     * `Asia/Macau` - Asia/Macau
         *     * `Asia/Magadan` - Asia/Magadan
         *     * `Asia/Makassar` - Asia/Makassar
         *     * `Asia/Manila` - Asia/Manila
         *     * `Asia/Muscat` - Asia/Muscat
         *     * `Asia/Nicosia` - Asia/Nicosia
         *     * `Asia/Novokuznetsk` - Asia/Novokuznetsk
         *     * `Asia/Novosibirsk` - Asia/Novosibirsk
         *     * `Asia/Omsk` - Asia/Omsk
         *     * `Asia/Oral` - Asia/Oral
         *     * `Asia/Phnom_Penh` - Asia/Phnom_Penh
         *     * `Asia/Pontianak` - Asia/Pontianak
         *     * `Asia/Pyongyang` - Asia/Pyongyang
         *     * `Asia/Qatar` - Asia/Qatar
         *     * `Asia/Qostanay` - Asia/Qostanay
         *     * `Asia/Qyzylorda` - Asia/Qyzylorda
         *     * `Asia/Rangoon` - Asia/Rangoon
         *     * `Asia/Riyadh` - Asia/Riyadh
         *     * `Asia/Saigon` - Asia/Saigon
         *     * `Asia/Sakhalin` - Asia/Sakhalin
         *     * `Asia/Samarkand` - Asia/Samarkand
         *     * `Asia/Seoul` - Asia/Seoul
         *     * `Asia/Shanghai` - Asia/Shanghai
         *     * `Asia/Singapore` - Asia/Singapore
         *     * `Asia/Srednekolymsk` - Asia/Srednekolymsk
         *     * `Asia/Taipei` - Asia/Taipei
         *     * `Asia/Tashkent` - Asia/Tashkent
         *     * `Asia/Tbilisi` - Asia/Tbilisi
         *     * `Asia/Tehran` - Asia/Tehran
         *     * `Asia/Tel_Aviv` - Asia/Tel_Aviv
         *     * `Asia/Thimbu` - Asia/Thimbu
         *     * `Asia/Thimphu` - Asia/Thimphu
         *     * `Asia/Tokyo` - Asia/Tokyo
         *     * `Asia/Tomsk` - Asia/Tomsk
         *     * `Asia/Ujung_Pandang` - Asia/Ujung_Pandang
         *     * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
         *     * `Asia/Ulan_Bator` - Asia/Ulan_Bator
         *     * `Asia/Urumqi` - Asia/Urumqi
         *     * `Asia/Ust-Nera` - Asia/Ust-Nera
         *     * `Asia/Vientiane` - Asia/Vientiane
         *     * `Asia/Vladivostok` - Asia/Vladivostok
         *     * `Asia/Yakutsk` - Asia/Yakutsk
         *     * `Asia/Yangon` - Asia/Yangon
         *     * `Asia/Yekaterinburg` - Asia/Yekaterinburg
         *     * `Asia/Yerevan` - Asia/Yerevan
         *     * `Atlantic/Azores` - Atlantic/Azores
         *     * `Atlantic/Bermuda` - Atlantic/Bermuda
         *     * `Atlantic/Canary` - Atlantic/Canary
         *     * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
         *     * `Atlantic/Faeroe` - Atlantic/Faeroe
         *     * `Atlantic/Faroe` - Atlantic/Faroe
         *     * `Atlantic/Jan_Mayen` - Atlantic/Jan_Mayen
         *     * `Atlantic/Madeira` - Atlantic/Madeira
         *     * `Atlantic/Reykjavik` - Atlantic/Reykjavik
         *     * `Atlantic/South_Georgia` - Atlantic/South_Georgia
         *     * `Atlantic/St_Helena` - Atlantic/St_Helena
         *     * `Atlantic/Stanley` - Atlantic/Stanley
         *     * `Australia/ACT` - Australia/ACT
         *     * `Australia/Adelaide` - Australia/Adelaide
         *     * `Australia/Brisbane` - Australia/Brisbane
         *     * `Australia/Broken_Hill` - Australia/Broken_Hill
         *     * `Australia/Canberra` - Australia/Canberra
         *     * `Australia/Currie` - Australia/Currie
         *     * `Australia/Darwin` - Australia/Darwin
         *     * `Australia/Eucla` - Australia/Eucla
         *     * `Australia/Hobart` - Australia/Hobart
         *     * `Australia/LHI` - Australia/LHI
         *     * `Australia/Lindeman` - Australia/Lindeman
         *     * `Australia/Lord_Howe` - Australia/Lord_Howe
         *     * `Australia/Melbourne` - Australia/Melbourne
         *     * `Australia/NSW` - Australia/NSW
         *     * `Australia/North` - Australia/North
         *     * `Australia/Perth` - Australia/Perth
         *     * `Australia/Queensland` - Australia/Queensland
         *     * `Australia/South` - Australia/South
         *     * `Australia/Sydney` - Australia/Sydney
         *     * `Australia/Tasmania` - Australia/Tasmania
         *     * `Australia/Victoria` - Australia/Victoria
         *     * `Australia/West` - Australia/West
         *     * `Australia/Yancowinna` - Australia/Yancowinna
         *     * `Brazil/Acre` - Brazil/Acre
         *     * `Brazil/DeNoronha` - Brazil/DeNoronha
         *     * `Brazil/East` - Brazil/East
         *     * `Brazil/West` - Brazil/West
         *     * `CET` - CET
         *     * `CST6CDT` - CST6CDT
         *     * `Canada/Atlantic` - Canada/Atlantic
         *     * `Canada/Central` - Canada/Central
         *     * `Canada/Eastern` - Canada/Eastern
         *     * `Canada/Mountain` - Canada/Mountain
         *     * `Canada/Newfoundland` - Canada/Newfoundland
         *     * `Canada/Pacific` - Canada/Pacific
         *     * `Canada/Saskatchewan` - Canada/Saskatchewan
         *     * `Canada/Yukon` - Canada/Yukon
         *     * `Chile/Continental` - Chile/Continental
         *     * `Chile/EasterIsland` - Chile/EasterIsland
         *     * `Cuba` - Cuba
         *     * `EET` - EET
         *     * `EST` - EST
         *     * `EST5EDT` - EST5EDT
         *     * `Egypt` - Egypt
         *     * `Eire` - Eire
         *     * `Etc/GMT` - Etc/GMT
         *     * `Etc/GMT+0` - Etc/GMT+0
         *     * `Etc/GMT+1` - Etc/GMT+1
         *     * `Etc/GMT+10` - Etc/GMT+10
         *     * `Etc/GMT+11` - Etc/GMT+11
         *     * `Etc/GMT+12` - Etc/GMT+12
         *     * `Etc/GMT+2` - Etc/GMT+2
         *     * `Etc/GMT+3` - Etc/GMT+3
         *     * `Etc/GMT+4` - Etc/GMT+4
         *     * `Etc/GMT+5` - Etc/GMT+5
         *     * `Etc/GMT+6` - Etc/GMT+6
         *     * `Etc/GMT+7` - Etc/GMT+7
         *     * `Etc/GMT+8` - Etc/GMT+8
         *     * `Etc/GMT+9` - Etc/GMT+9
         *     * `Etc/GMT-0` - Etc/GMT-0
         *     * `Etc/GMT-1` - Etc/GMT-1
         *     * `Etc/GMT-10` - Etc/GMT-10
         *     * `Etc/GMT-11` - Etc/GMT-11
         *     * `Etc/GMT-12` - Etc/GMT-12
         *     * `Etc/GMT-13` - Etc/GMT-13
         *     * `Etc/GMT-14` - Etc/GMT-14
         *     * `Etc/GMT-2` - Etc/GMT-2
         *     * `Etc/GMT-3` - Etc/GMT-3
         *     * `Etc/GMT-4` - Etc/GMT-4
         *     * `Etc/GMT-5` - Etc/GMT-5
         *     * `Etc/GMT-6` - Etc/GMT-6
         *     * `Etc/GMT-7` - Etc/GMT-7
         *     * `Etc/GMT-8` - Etc/GMT-8
         *     * `Etc/GMT-9` - Etc/GMT-9
         *     * `Etc/GMT0` - Etc/GMT0
         *     * `Etc/Greenwich` - Etc/Greenwich
         *     * `Etc/UCT` - Etc/UCT
         *     * `Etc/UTC` - Etc/UTC
         *     * `Etc/Universal` - Etc/Universal
         *     * `Etc/Zulu` - Etc/Zulu
         *     * `Europe/Amsterdam` - Europe/Amsterdam
         *     * `Europe/Andorra` - Europe/Andorra
         *     * `Europe/Astrakhan` - Europe/Astrakhan
         *     * `Europe/Athens` - Europe/Athens
         *     * `Europe/Belfast` - Europe/Belfast
         *     * `Europe/Belgrade` - Europe/Belgrade
         *     * `Europe/Berlin` - Europe/Berlin
         *     * `Europe/Bratislava` - Europe/Bratislava
         *     * `Europe/Brussels` - Europe/Brussels
         *     * `Europe/Bucharest` - Europe/Bucharest
         *     * `Europe/Budapest` - Europe/Budapest
         *     * `Europe/Busingen` - Europe/Busingen
         *     * `Europe/Chisinau` - Europe/Chisinau
         *     * `Europe/Copenhagen` - Europe/Copenhagen
         *     * `Europe/Dublin` - Europe/Dublin
         *     * `Europe/Gibraltar` - Europe/Gibraltar
         *     * `Europe/Guernsey` - Europe/Guernsey
         *     * `Europe/Helsinki` - Europe/Helsinki
         *     * `Europe/Isle_of_Man` - Europe/Isle_of_Man
         *     * `Europe/Istanbul` - Europe/Istanbul
         *     * `Europe/Jersey` - Europe/Jersey
         *     * `Europe/Kaliningrad` - Europe/Kaliningrad
         *     * `Europe/Kiev` - Europe/Kiev
         *     * `Europe/Kirov` - Europe/Kirov
         *     * `Europe/Kyiv` - Europe/Kyiv
         *     * `Europe/Lisbon` - Europe/Lisbon
         *     * `Europe/Ljubljana` - Europe/Ljubljana
         *     * `Europe/London` - Europe/London
         *     * `Europe/Luxembourg` - Europe/Luxembourg
         *     * `Europe/Madrid` - Europe/Madrid
         *     * `Europe/Malta` - Europe/Malta
         *     * `Europe/Mariehamn` - Europe/Mariehamn
         *     * `Europe/Minsk` - Europe/Minsk
         *     * `Europe/Monaco` - Europe/Monaco
         *     * `Europe/Moscow` - Europe/Moscow
         *     * `Europe/Nicosia` - Europe/Nicosia
         *     * `Europe/Oslo` - Europe/Oslo
         *     * `Europe/Paris` - Europe/Paris
         *     * `Europe/Podgorica` - Europe/Podgorica
         *     * `Europe/Prague` - Europe/Prague
         *     * `Europe/Riga` - Europe/Riga
         *     * `Europe/Rome` - Europe/Rome
         *     * `Europe/Samara` - Europe/Samara
         *     * `Europe/San_Marino` - Europe/San_Marino
         *     * `Europe/Sarajevo` - Europe/Sarajevo
         *     * `Europe/Saratov` - Europe/Saratov
         *     * `Europe/Simferopol` - Europe/Simferopol
         *     * `Europe/Skopje` - Europe/Skopje
         *     * `Europe/Sofia` - Europe/Sofia
         *     * `Europe/Stockholm` - Europe/Stockholm
         *     * `Europe/Tallinn` - Europe/Tallinn
         *     * `Europe/Tirane` - Europe/Tirane
         *     * `Europe/Tiraspol` - Europe/Tiraspol
         *     * `Europe/Ulyanovsk` - Europe/Ulyanovsk
         *     * `Europe/Uzhgorod` - Europe/Uzhgorod
         *     * `Europe/Vaduz` - Europe/Vaduz
         *     * `Europe/Vatican` - Europe/Vatican
         *     * `Europe/Vienna` - Europe/Vienna
         *     * `Europe/Vilnius` - Europe/Vilnius
         *     * `Europe/Volgograd` - Europe/Volgograd
         *     * `Europe/Warsaw` - Europe/Warsaw
         *     * `Europe/Zagreb` - Europe/Zagreb
         *     * `Europe/Zaporozhye` - Europe/Zaporozhye
         *     * `Europe/Zurich` - Europe/Zurich
         *     * `GB` - GB
         *     * `GB-Eire` - GB-Eire
         *     * `GMT` - GMT
         *     * `GMT+0` - GMT+0
         *     * `GMT-0` - GMT-0
         *     * `GMT0` - GMT0
         *     * `Greenwich` - Greenwich
         *     * `HST` - HST
         *     * `Hongkong` - Hongkong
         *     * `Iceland` - Iceland
         *     * `Indian/Antananarivo` - Indian/Antananarivo
         *     * `Indian/Chagos` - Indian/Chagos
         *     * `Indian/Christmas` - Indian/Christmas
         *     * `Indian/Cocos` - Indian/Cocos
         *     * `Indian/Comoro` - Indian/Comoro
         *     * `Indian/Kerguelen` - Indian/Kerguelen
         *     * `Indian/Mahe` - Indian/Mahe
         *     * `Indian/Maldives` - Indian/Maldives
         *     * `Indian/Mauritius` - Indian/Mauritius
         *     * `Indian/Mayotte` - Indian/Mayotte
         *     * `Indian/Reunion` - Indian/Reunion
         *     * `Iran` - Iran
         *     * `Israel` - Israel
         *     * `Jamaica` - Jamaica
         *     * `Japan` - Japan
         *     * `Kwajalein` - Kwajalein
         *     * `Libya` - Libya
         *     * `MET` - MET
         *     * `MST` - MST
         *     * `MST7MDT` - MST7MDT
         *     * `Mexico/BajaNorte` - Mexico/BajaNorte
         *     * `Mexico/BajaSur` - Mexico/BajaSur
         *     * `Mexico/General` - Mexico/General
         *     * `NZ` - NZ
         *     * `NZ-CHAT` - NZ-CHAT
         *     * `Navajo` - Navajo
         *     * `PRC` - PRC
         *     * `PST8PDT` - PST8PDT
         *     * `Pacific/Apia` - Pacific/Apia
         *     * `Pacific/Auckland` - Pacific/Auckland
         *     * `Pacific/Bougainville` - Pacific/Bougainville
         *     * `Pacific/Chatham` - Pacific/Chatham
         *     * `Pacific/Chuuk` - Pacific/Chuuk
         *     * `Pacific/Easter` - Pacific/Easter
         *     * `Pacific/Efate` - Pacific/Efate
         *     * `Pacific/Enderbury` - Pacific/Enderbury
         *     * `Pacific/Fakaofo` - Pacific/Fakaofo
         *     * `Pacific/Fiji` - Pacific/Fiji
         *     * `Pacific/Funafuti` - Pacific/Funafuti
         *     * `Pacific/Galapagos` - Pacific/Galapagos
         *     * `Pacific/Gambier` - Pacific/Gambier
         *     * `Pacific/Guadalcanal` - Pacific/Guadalcanal
         *     * `Pacific/Guam` - Pacific/Guam
         *     * `Pacific/Honolulu` - Pacific/Honolulu
         *     * `Pacific/Johnston` - Pacific/Johnston
         *     * `Pacific/Kanton` - Pacific/Kanton
         *     * `Pacific/Kiritimati` - Pacific/Kiritimati
         *     * `Pacific/Kosrae` - Pacific/Kosrae
         *     * `Pacific/Kwajalein` - Pacific/Kwajalein
         *     * `Pacific/Majuro` - Pacific/Majuro
         *     * `Pacific/Marquesas` - Pacific/Marquesas
         *     * `Pacific/Midway` - Pacific/Midway
         *     * `Pacific/Nauru` - Pacific/Nauru
         *     * `Pacific/Niue` - Pacific/Niue
         *     * `Pacific/Norfolk` - Pacific/Norfolk
         *     * `Pacific/Noumea` - Pacific/Noumea
         *     * `Pacific/Pago_Pago` - Pacific/Pago_Pago
         *     * `Pacific/Palau` - Pacific/Palau
         *     * `Pacific/Pitcairn` - Pacific/Pitcairn
         *     * `Pacific/Pohnpei` - Pacific/Pohnpei
         *     * `Pacific/Ponape` - Pacific/Ponape
         *     * `Pacific/Port_Moresby` - Pacific/Port_Moresby
         *     * `Pacific/Rarotonga` - Pacific/Rarotonga
         *     * `Pacific/Saipan` - Pacific/Saipan
         *     * `Pacific/Samoa` - Pacific/Samoa
         *     * `Pacific/Tahiti` - Pacific/Tahiti
         *     * `Pacific/Tarawa` - Pacific/Tarawa
         *     * `Pacific/Tongatapu` - Pacific/Tongatapu
         *     * `Pacific/Truk` - Pacific/Truk
         *     * `Pacific/Wake` - Pacific/Wake
         *     * `Pacific/Wallis` - Pacific/Wallis
         *     * `Pacific/Yap` - Pacific/Yap
         *     * `Poland` - Poland
         *     * `Portugal` - Portugal
         *     * `ROC` - ROC
         *     * `ROK` - ROK
         *     * `Singapore` - Singapore
         *     * `Turkey` - Turkey
         *     * `UCT` - UCT
         *     * `US/Alaska` - US/Alaska
         *     * `US/Aleutian` - US/Aleutian
         *     * `US/Arizona` - US/Arizona
         *     * `US/Central` - US/Central
         *     * `US/East-Indiana` - US/East-Indiana
         *     * `US/Eastern` - US/Eastern
         *     * `US/Hawaii` - US/Hawaii
         *     * `US/Indiana-Starke` - US/Indiana-Starke
         *     * `US/Michigan` - US/Michigan
         *     * `US/Mountain` - US/Mountain
         *     * `US/Pacific` - US/Pacific
         *     * `US/Samoa` - US/Samoa
         *     * `UTC` - UTC
         *     * `Universal` - Universal
         *     * `W-SU` - W-SU
         *     * `WET` - WET
         *     * `Zulu` - Zulu
         * @enum {string}
         */
        TimezoneEnum: "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Asmera" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Timbuktu" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/ComodRivadavia" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Atka" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Buenos_Aires" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Catamarca" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Ciudad_Juarez" | "America/Coral_Harbour" | "America/Cordoba" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Ensenada" | "America/Fort_Nelson" | "America/Fort_Wayne" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Indianapolis" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Jujuy" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Knox_IN" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Louisville" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Mendoza" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montreal" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Nuuk" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Acre" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Rosario" | "America/Santa_Isabel" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Shiprock" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Virgin" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/South_Pole" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Ashkhabad" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Calcutta" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Chongqing" | "Asia/Chungking" | "Asia/Colombo" | "Asia/Dacca" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Harbin" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Istanbul" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kashgar" | "Asia/Kathmandu" | "Asia/Katmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macao" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qostanay" | "Asia/Qyzylorda" | "Asia/Rangoon" | "Asia/Riyadh" | "Asia/Saigon" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Tel_Aviv" | "Asia/Thimbu" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ujung_Pandang" | "Asia/Ulaanbaatar" | "Asia/Ulan_Bator" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faeroe" | "Atlantic/Faroe" | "Atlantic/Jan_Mayen" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/ACT" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Canberra" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/LHI" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/NSW" | "Australia/North" | "Australia/Perth" | "Australia/Queensland" | "Australia/South" | "Australia/Sydney" | "Australia/Tasmania" | "Australia/Victoria" | "Australia/West" | "Australia/Yancowinna" | "Brazil/Acre" | "Brazil/DeNoronha" | "Brazil/East" | "Brazil/West" | "CET" | "CST6CDT" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Canada/Saskatchewan" | "Canada/Yukon" | "Chile/Continental" | "Chile/EasterIsland" | "Cuba" | "EET" | "EST" | "EST5EDT" | "Egypt" | "Eire" | "Etc/GMT" | "Etc/GMT+0" | "Etc/GMT+1" | "Etc/GMT+10" | "Etc/GMT+11" | "Etc/GMT+12" | "Etc/GMT+2" | "Etc/GMT+3" | "Etc/GMT+4" | "Etc/GMT+5" | "Etc/GMT+6" | "Etc/GMT+7" | "Etc/GMT+8" | "Etc/GMT+9" | "Etc/GMT-0" | "Etc/GMT-1" | "Etc/GMT-10" | "Etc/GMT-11" | "Etc/GMT-12" | "Etc/GMT-13" | "Etc/GMT-14" | "Etc/GMT-2" | "Etc/GMT-3" | "Etc/GMT-4" | "Etc/GMT-5" | "Etc/GMT-6" | "Etc/GMT-7" | "Etc/GMT-8" | "Etc/GMT-9" | "Etc/GMT0" | "Etc/Greenwich" | "Etc/UCT" | "Etc/UTC" | "Etc/Universal" | "Etc/Zulu" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belfast" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kirov" | "Europe/Kyiv" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Nicosia" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Tiraspol" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zurich" | "GB" | "GB-Eire" | "GMT" | "GMT+0" | "GMT-0" | "GMT0" | "Greenwich" | "HST" | "Hongkong" | "Iceland" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Iran" | "Israel" | "Jamaica" | "Japan" | "Kwajalein" | "Libya" | "MET" | "MST" | "MST7MDT" | "Mexico/BajaNorte" | "Mexico/BajaSur" | "Mexico/General" | "NZ" | "NZ-CHAT" | "Navajo" | "PRC" | "PST8PDT" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Johnston" | "Pacific/Kanton" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Ponape" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Samoa" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Truk" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Yap" | "Poland" | "Portugal" | "ROC" | "ROK" | "Singapore" | "Turkey" | "UCT" | "US/Alaska" | "US/Aleutian" | "US/Arizona" | "US/Central" | "US/East-Indiana" | "US/Eastern" | "US/Hawaii" | "US/Indiana-Starke" | "US/Michigan" | "US/Mountain" | "US/Pacific" | "US/Samoa" | "UTC" | "Universal" | "W-SU" | "WET" | "Zulu";
        /** TraceQuery */
        TraceQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Includesentiment
             * @description Include stored sentiment evaluation results for the trace and its generations.
             * @default null
             */
            includeSentiment: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "TraceQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** @default null */
            response: components["schemas"]["TraceQueryResponse"] | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /** Traceid */
            traceId: string;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** TraceQueryResponse */
        TraceQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["LLMTrace"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** TracesQuery */
        TracesQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtersupporttraces
             * @default null
             */
            filterSupportTraces: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Groupkey
             * @default null
             */
            groupKey: string | null;
            /**
             * Grouptypeindex
             * @default null
             */
            groupTypeIndex: number | null;
            /**
             * Includesentiment
             * @description Include stored sentiment evaluation results for returned traces and direct generation events.
             * @default null
             */
            includeSentiment: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "TracesQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Personid
             * @description Person who performed the event
             * @default null
             */
            personId: string | null;
            /**
             * Properties
             * @description Properties configurable in the interface
             * @default null
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Randomorder
             * @description Use random ordering instead of timestamp DESC. Useful for representative sampling to avoid recency bias.
             * @default null
             */
            randomOrder: boolean | null;
            /** @default null */
            response: components["schemas"]["TracesQueryResponse"] | null;
            /**
             * Searchterm
             * @default null
             */
            searchTerm: string | null;
            /**
             * Showcolumnconfigurator
             * @default null
             */
            showColumnConfigurator: boolean | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** TracesQueryResponse */
        TracesQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: string[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["LLMTrace"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** TrendsFilter */
        TrendsFilter: {
            /**
             * @description Y-axis value formatter. Picks a human-friendly unit per value at render time without changing the underlying series values.
             *
             *     - `numeric` (default): raw numbers, e.g. `1,234`.
             *     - `duration`: values are in seconds; rendered as friendly units per value (`45s`, `2m 12s`, `1h 4m`). Use this whenever the series is in seconds (latency, session length, time-to-event) instead of dividing in `formula` to force minutes or hours.
             *     - `duration_ms`: values are in milliseconds; rendered as friendly units (`850ms`, `1.5s`, `1m 4s`).
             *     - `percentage`: values are already in the 0-100 range; appends `%`.
             *     - `percentage_scaled`: values are a 0-1 ratio; multiplied and rendered as `%`.
             *     - `currency`: values are in the project's base currency (set in project settings, defaults to USD); rendered with that currency symbol. For values pinned to a specific currency regardless of project base (e.g. `$ai_total_cost_usd` is always USD), use `aggregationAxisPrefix` instead.
             *     - `short`: compact notation for large counts (`1.2K`, `3.4M`).
             * @default numeric
             */
            aggregationAxisFormat: components["schemas"]["AggregationAxisFormat"] | null;
            /**
             * Aggregationaxispostfix
             * @description Literal suffix applied to every value (e.g. ` req`). Reserve for units that `aggregationAxisFormat` cannot express. Do not use ` mins`, ` s`, ` ms`, `%` etc. — pick the matching `aggregationAxisFormat` instead so the underlying values stay numerically correct for breakdowns, formulas, and alerts. Include any leading space yourself.
             * @default null
             */
            aggregationAxisPostfix: string | null;
            /**
             * Aggregationaxisprefix
             * @description Literal prefix applied to every value (e.g. `$`). Use to pin a unit or currency symbol that does not depend on `aggregationAxisFormat` — for example, when values are denominated in a fixed currency regardless of the project's base currency. Include any trailing space yourself.
             * @default null
             */
            aggregationAxisPrefix: string | null;
            /**
             * Breakdown Histogram Bin Count
             * @default null
             */
            breakdown_histogram_bin_count: number | null;
            /**
             * @description Chart rendering style overrides (line shape).
             * @default null
             */
            chartStyle: components["schemas"]["ChartStyle"] | null;
            /**
             * Confidencelevel
             * @default null
             */
            confidenceLevel: number | null;
            /**
             * Decimalplaces
             * @description Maximum number of decimal places shown. 1 or 2 is usually right for percentages and currency.
             * @default null
             */
            decimalPlaces: number | null;
            /**
             * @description detailed results table
             * @default null
             */
            detailedResultsAggregationType: components["schemas"]["DetailedResultsAggregationType"] | null;
            /** @default ActionsLineGraph */
            display: components["schemas"]["ChartDisplayType"] | null;
            /**
             * Excludeboxplotoutliers
             * @default true
             */
            excludeBoxPlotOutliers: boolean | null;
            /**
             * Formula
             * @default null
             */
            formula: string | null;
            /**
             * Formulanodes
             * @description List of formulas with optional custom names. Takes precedence over formula/formulas if set.
             * @default null
             */
            formulaNodes: components["schemas"]["TrendsFormulaNode"][] | null;
            /**
             * Formulas
             * @default null
             */
            formulas: string[] | null;
            /**
             * Goallines
             * @description Goal Lines
             * @default null
             */
            goalLines: components["schemas"]["GoalLine"][] | null;
            /**
             * Hiddenlegendindexes
             * @default null
             */
            hiddenLegendIndexes: number[] | null;
            /**
             * Hideweekends
             * @default false
             */
            hideWeekends: boolean | null;
            /**
             * @description Where the in-chart legend sits relative to the plot. Only applies to the in-chart legend.
             * @default bottom
             */
            legendPosition: components["schemas"]["LegendPosition"] | null;
            /**
             * Metricchangedecreasecolor
             * @description Metric display: change pill color when the metric decreased. Defaults to red.
             * @default null
             */
            metricChangeDecreaseColor: string | null;
            /**
             * Metricchangeincreasecolor
             * @description Metric display: change pill color when the metric increased. Defaults to green.
             * @default null
             */
            metricChangeIncreaseColor: string | null;
            /**
             * Metriccolorbydirection
             * @description Metric display: color the sparkline by whether the metric increased or decreased.
             * @default false
             */
            metricColorByDirection: boolean | null;
            /**
             * Metriclinedecreasecolor
             * @description Metric display: line color when the metric decreased. Defaults to red.
             * @default null
             */
            metricLineDecreaseColor: string | null;
            /**
             * Metriclineincreasecolor
             * @description Metric display: line color when the metric increased. Defaults to green.
             * @default null
             */
            metricLineIncreaseColor: string | null;
            /**
             * Metricshowchange
             * @description Show the period-over-period change pill on the Metric display.
             * @default true
             */
            metricShowChange: boolean | null;
            /**
             * @description Metric display: which summary the resting headline shows — the period total, the average, or the latest point. Hovering the sparkline always shows the hovered point's value. Also drives the change pill: total/average compare against the previous period when "compare to previous" is on; latest compares first→last of the series.
             * @default total
             */
            metricSummary: components["schemas"]["MetricSummary"] | null;
            /**
             * Mindecimalplaces
             * @default null
             */
            minDecimalPlaces: number | null;
            /**
             * Movingaverageintervals
             * @default null
             */
            movingAverageIntervals: number | null;
            /**
             * @description Wether result datasets are associated by their values or by their order.
             * @default value
             */
            resultCustomizationBy: components["schemas"]["ResultCustomizationBy"] | null;
            /**
             * Resultcustomizations
             * @description Customizations for the appearance of result datasets.
             * @default null
             */
            resultCustomizations: {
                [key: string]: components["schemas"]["ResultCustomizationByValue"];
            } | {
                [key: string]: components["schemas"]["ResultCustomizationByPosition"];
            } | null;
            /**
             * Showalertthresholdlines
             * @default false
             */
            showAlertThresholdLines: boolean | null;
            /**
             * Showannotations
             * @default true
             */
            showAnnotations: boolean | null;
            /**
             * Showconfidenceintervals
             * @default null
             */
            showConfidenceIntervals: boolean | null;
            /**
             * Showlabelsonseries
             * @default null
             */
            showLabelsOnSeries: boolean | null;
            /**
             * Showlegend
             * @default false
             */
            showLegend: boolean | null;
            /**
             * Showmovingaverage
             * @default null
             */
            showMovingAverage: boolean | null;
            /**
             * Showmultipleyaxes
             * @default false
             */
            showMultipleYAxes: boolean | null;
            /**
             * Showpercentstackview
             * @default false
             */
            showPercentStackView: boolean | null;
            /**
             * Showtrendlines
             * @default null
             */
            showTrendLines: boolean | null;
            /**
             * Showvaluesonseries
             * @default false
             */
            showValuesOnSeries: boolean | null;
            /**
             * Smoothingintervals
             * @default 1
             */
            smoothingIntervals: number | null;
            /**
             * Stackbreakdownvalues
             * @description On the horizontal bar-value chart, stack a series' breakdown values into a single bar instead of rendering one bar per breakdown value.
             * @default false
             */
            stackBreakdownValues: boolean | null;
            /**
             * Xaxislabel
             * @description Custom label rendered under the X axis.
             * @default null
             */
            xAxisLabel: string | null;
            /**
             * Yaxislabel
             * @description Custom label rendered alongside the Y axis.
             * @default null
             */
            yAxisLabel: string | null;
            /** @default linear */
            yAxisScaleType: components["schemas"]["YAxisScaleType"] | null;
        };
        /** TrendsFormulaNode */
        TrendsFormulaNode: {
            /**
             * Custom Name
             * @description Optional user-defined name for the formula
             * @default null
             */
            custom_name: string | null;
            /** Formula */
            formula: string;
        };
        /** TrendsQuery */
        TrendsQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation
             * @default null
             */
            aggregation_group_type_index: number | null;
            /**
             * @description Breakdown of the events and actions
             * @default null
             */
            breakdownFilter: components["schemas"]["BreakdownFilter"] | null;
            /**
             * @description Properties specific to the calendar heatmap display variant. Only consulted when `trendsFilter.display === ChartDisplayType.CalendarHeatmap`; ignored otherwise.
             * @default null
             */
            calendarHeatmapFilter: components["schemas"]["CalendarHeatmapFilter"] | null;
            /**
             * @description Compare to date range
             * @default null
             */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @description Whether we should be comparing against a specific conversion goal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization
             * @default null
             */
            dataColorTheme: number | null;
            /**
             * @description Date range for the query
             * @default null
             */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Filtertestaccounts
             * @description Exclude internal and test users by applying the respective filters
             * @default false
             */
            filterTestAccounts: boolean | null;
            /**
             * @description Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
             * @default day
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "TrendsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Properties
             * @description Property filters for all series
             * @default []
             */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["PersonMetadataPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["MetricPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["AccountCustomPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
            /** @default null */
            response: components["schemas"]["TrendsQueryResponse"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Series
             * @description Events and actions to include
             */
            series: (components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["DataWarehouseNode"] | components["schemas"]["GroupNode"])[];
            /**
             * @description Tags that will be added to the Query log comment
             * @default null
             */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * @description Properties specific to the trends insight
             * @default null
             */
            trendsFilter: components["schemas"]["TrendsFilter"] | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** TrendsQueryResponse */
        TrendsQueryResponse: {
            /**
             * Boxplot Data
             * @default null
             */
            boxplot_data: components["schemas"]["BoxPlotDatum"][] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @description Wether more breakdown values are available.
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: {
                [key: string]: unknown;
            }[];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * UrlMatching
         * @enum {unknown}
         */
        UrlMatching: "contains" | "exact" | "regex" | null;
        UserBasic: {
            readonly id: number;
            /** Format: uuid */
            readonly uuid: string;
            distinct_id?: string | null;
            first_name?: string;
            last_name?: string;
            /**
             * Email address
             * Format: email
             */
            email: string;
            is_email_verified?: boolean | null;
            readonly hedgehog_config: {
                [key: string]: unknown;
            } | null;
            role_at_organization?: components["schemas"]["RoleAtOrganizationEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"];
        };
        /**
         * ValueDisplay
         * @enum {string}
         */
        ValueDisplay: "absolute" | "percentage";
        /** VizSpecificOptions */
        VizSpecificOptions: {
            /** @default null */
            ActionsPie: components["schemas"]["ActionsPie"] | null;
            /** @default null */
            RETENTION: components["schemas"]["RETENTION"] | null;
        };
        /** VolumeBucket */
        VolumeBucket: {
            /** Label */
            label: string;
            /** Value */
            value: number;
        };
        /**
         * WebAnalyticsItemKind
         * @enum {string}
         */
        WebAnalyticsItemKind: "unit" | "duration_s" | "percentage" | "currency";
        /**
         * WebAnalyticsOrderByDirection
         * @enum {string}
         */
        WebAnalyticsOrderByDirection: "ASC" | "DESC";
        /**
         * WebAnalyticsOrderByFields
         * @enum {string}
         */
        WebAnalyticsOrderByFields: "Visitors" | "Views" | "AvgTimeOnPage" | "Clicks" | "BounceRate" | "AverageScrollPercentage" | "ScrollGt80Percentage" | "TotalConversions" | "UniqueConversions" | "ConversionRate" | "ConvertingUsers" | "RageClicks" | "DeadClicks" | "Errors";
        /**
         * WebAnalyticsPreComputeStrategy
         * @enum {string}
         */
        WebAnalyticsPreComputeStrategy: "pre_aggregated" | "lazy_precompute" | "live";
        /** WebAnalyticsSampling */
        WebAnalyticsSampling: {
            /**
             * Enabled
             * @default null
             */
            enabled: boolean | null;
            /** @default null */
            forceSamplingRate: components["schemas"]["SamplingRate"] | null;
        };
        /** WebExternalClicksTableQuery */
        WebExternalClicksTableQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebExternalClicksTableQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebExternalClicksTableQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /**
             * Stripqueryparams
             * @default null
             */
            stripQueryParams: boolean | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** WebExternalClicksTableQueryResponse */
        WebExternalClicksTableQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** WebGoalsQuery */
        WebGoalsQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebGoalsQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebGoalsQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Usewebanalyticsprecompute
             * @description Opt this specific query into the web_goals_query precompute path. Requires the `web-analytics-precompute-toggle` PostHog feature flag to be on for the team's organization for the gate to pass. *
             * @default null
             */
            useWebAnalyticsPrecompute: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** WebGoalsQueryResponse */
        WebGoalsQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** WebOverviewItem */
        WebOverviewItem: {
            /**
             * Changefrompreviouspct
             * @default null
             */
            changeFromPreviousPct: number | null;
            /**
             * Isincreasebad
             * @default null
             */
            isIncreaseBad: boolean | null;
            /** Key */
            key: string;
            kind: components["schemas"]["WebAnalyticsItemKind"];
            /**
             * Previous
             * @default null
             */
            previous: number | null;
            /**
             * Value
             * @default null
             */
            value: number | null;
        };
        /** WebOverviewQuery */
        WebOverviewQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebOverviewQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebOverviewQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Usewebanalyticsprecompute
             * @description Opt this specific query into the web_overview_query precompute path. Requires the `web-analytics-precompute-toggle` PostHog feature flag to be on for the team's organization for the gate to pass. *
             * @default null
             */
            useWebAnalyticsPrecompute: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** WebOverviewQueryResponse */
        WebOverviewQueryResponse: {
            /**
             * Datefrom
             * @default null
             */
            dateFrom: string | null;
            /**
             * Dateto
             * @default null
             */
            dateTo: string | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["WebOverviewItem"][];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * WebStatsBreakdown
         * @enum {string}
         */
        WebStatsBreakdown: "Page" | "InitialPage" | "ExitPage" | "ExitClick" | "PreviousPage" | "ScreenName" | "InitialChannelType" | "InitialReferringDomain" | "InitialReferringURL" | "InitialUTMSource" | "InitialUTMCampaign" | "InitialUTMMedium" | "InitialUTMTerm" | "InitialUTMContent" | "InitialUTMSourceMediumCampaign" | "Browser" | "OS" | "Viewport" | "DeviceType" | "Country" | "Region" | "City" | "Timezone" | "Language" | "FrustrationMetrics";
        /** WebStatsTableQuery */
        WebStatsTableQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            breakdownBy: components["schemas"]["WebStatsBreakdown"];
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includeavgtimeonpage
             * @default null
             */
            includeAvgTimeOnPage: boolean | null;
            /**
             * Includebouncerate
             * @default null
             */
            includeBounceRate: boolean | null;
            /**
             * Includehost
             * @default null
             */
            includeHost: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * Includescrolldepth
             * @default null
             */
            includeScrollDepth: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebStatsTableQuery";
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebStatsTableQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Usewebanalyticsprecompute
             * @description Opt this specific query into the web stats table precompute path. Requires the `web-analytics-precompute-toggle` PostHog feature flag to be on for the team's organization for the gate to pass. *
             * @default null
             */
            useWebAnalyticsPrecompute: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** WebStatsTableQueryResponse */
        WebStatsTableQueryResponse: {
            /**
             * Columns
             * @default null
             */
            columns: unknown[] | null;
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hasmore
             * @default null
             */
            hasMore: boolean | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * Limit
             * @default null
             */
            limit: number | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Offset
             * @default null
             */
            offset: number | null;
            /**
             * Precomputestale
             * @description Whether a lazy-precompute read was served from expired-within-grace (stale) jobs instead of recomputing inline.
             * @default null
             */
            preComputeStale: boolean | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: unknown[];
            /** @default null */
            samplingRate: components["schemas"]["SamplingRate"] | null;
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Types
             * @default null
             */
            types: unknown[] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /**
         * WebVitalsMetric
         * @enum {string}
         */
        WebVitalsMetric: "INP" | "LCP" | "CLS" | "FCP";
        /** WebVitalsPathBreakdownQuery */
        WebVitalsPathBreakdownQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebVitalsPathBreakdownQuery";
            metric: components["schemas"]["WebVitalsMetric"];
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            percentile: components["schemas"]["WebVitalsPercentile"];
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebVitalsPathBreakdownQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /** Thresholds */
            thresholds: number[];
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Usewebanalyticsprecompute
             * @description Opt this specific query into the web vitals path breakdown precompute path. Requires the `web-analytics-precompute-toggle` PostHog feature flag to be on for the team's organization for the gate to pass. *
             * @default null
             */
            useWebAnalyticsPrecompute: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /** WebVitalsPathBreakdownQueryResponse */
        WebVitalsPathBreakdownQueryResponse: {
            /**
             * Error
             * @description Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise.
             * @default null
             */
            error: string | null;
            /**
             * Hogql
             * @description Generated HogQL query.
             * @default null
             */
            hogql: string | null;
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /** @default null */
            preComputeStrategy: components["schemas"]["WebAnalyticsPreComputeStrategy"] | null;
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
            /**
             * @description The resolved previous/comparison period date range, when comparing against another period
             * @default null
             */
            resolved_compare_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /**
             * @description The date range used for the query
             * @default null
             */
            resolved_date_range: components["schemas"]["ResolvedDateRangeResponse"] | null;
            /** Results */
            results: components["schemas"]["WebVitalsPathBreakdownResult"][];
            /**
             * Timings
             * @description Measured timings for different parts of the query generation process
             * @default null
             */
            timings: components["schemas"]["QueryTiming"][] | null;
            /**
             * Used Data Warehouse Sources
             * @description Connector-synced data warehouse sources referenced by this query, if any.
             * @default null
             */
            used_data_warehouse_sources: components["schemas"]["DataWarehouseSourceUsage"][] | null;
            /**
             * Warnings
             * @description Warnings about data warehouse sources referenced by the query whose latest sync failed, is paused, hit a billing limit, or is otherwise stale. Results may not reflect current source data. Accumulated across every HogQL execution that contributes to this response — so insights backed by warehouse tables (Trends, Funnels, etc.) receive the same warnings as raw HogQL queries. Also carries access control warnings when a system-table query filters out objects the user can't access.
             * @default null
             */
            warnings: (components["schemas"]["DataWarehouseSyncWarning"] | components["schemas"]["AccessControlFilterWarning"])[] | null;
        };
        /** WebVitalsPathBreakdownResult */
        WebVitalsPathBreakdownResult: {
            /** Good */
            good: components["schemas"]["WebVitalsPathBreakdownResultItem"][];
            /** Needs Improvements */
            needs_improvements: components["schemas"]["WebVitalsPathBreakdownResultItem"][];
            /** Poor */
            poor: components["schemas"]["WebVitalsPathBreakdownResultItem"][];
        };
        /** WebVitalsPathBreakdownResultItem */
        WebVitalsPathBreakdownResultItem: {
            /** Path */
            path: string;
            /** Value */
            value: number;
        };
        /**
         * WebVitalsPercentile
         * @enum {string}
         */
        WebVitalsPercentile: "p75" | "p90" | "p99";
        /** WebVitalsQuery */
        WebVitalsQuery: {
            /**
             * Aggregation Group Type Index
             * @description Groups aggregation - not used in Web Analytics but required for type compatibility
             * @default null
             */
            aggregation_group_type_index: number | null;
            /** @default null */
            compareFilter: components["schemas"]["CompareFilter"] | null;
            /**
             * Conversiongoal
             * @default null
             */
            conversionGoal: components["schemas"]["ActionConversionGoal"] | components["schemas"]["CustomEventConversionGoal"] | null;
            /**
             * Datacolortheme
             * @description Colors used in the insight's visualization - not used in Web Analytics but required for type compatibility
             * @default null
             */
            dataColorTheme: number | null;
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Dopathcleaning
             * @default null
             */
            doPathCleaning: boolean | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Includerevenue
             * @default null
             */
            includeRevenue: boolean | null;
            /**
             * @description Interval for date range calculation (affects date_to rounding for hour vs day ranges)
             * @default null
             */
            interval: components["schemas"]["IntervalType"] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "WebVitalsQuery";
            /**
             * @description Modifiers used when performing the query
             * @default null
             */
            modifiers: components["schemas"]["HogQLQueryModifiers"] | null;
            /**
             * Orderby
             * @default null
             */
            orderBy: (components["schemas"]["WebAnalyticsOrderByFields"] | components["schemas"]["WebAnalyticsOrderByDirection"])[] | null;
            /** Properties */
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"])[];
            /** @default null */
            response: components["schemas"]["WebGoalsQueryResponse"] | null;
            /** @default null */
            sampling: components["schemas"]["WebAnalyticsSampling"] | null;
            /**
             * Samplingfactor
             * @description Sampling rate
             * @default null
             */
            samplingFactor: number | null;
            /** Source */
            source: components["schemas"]["TrendsQuery"] | components["schemas"]["FunnelsQuery"] | components["schemas"]["RetentionQuery"] | components["schemas"]["PathsQuery"] | components["schemas"]["StickinessQuery"] | components["schemas"]["LifecycleQuery"] | components["schemas"]["WebStatsTableQuery"] | components["schemas"]["WebOverviewQuery"];
            /** @default null */
            tags: components["schemas"]["QueryLogTags"] | null;
            /**
             * Usesessionstable
             * @default null
             */
            useSessionsTable: boolean | null;
            /**
             * Version
             * @description version of the node, used for schema migrations
             * @default null
             */
            version: number | null;
        };
        /**
         * @description * `0` - Sunday
         *     * `1` - Monday
         * @enum {integer}
         */
        WeekStartDayEnum: 0 | 1;
        /** WorkflowVariablePropertyFilter */
        WorkflowVariablePropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @default workflow_variable
             * @constant
             */
            type: "workflow_variable";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /**
         * YAxisPosition
         * @enum {string}
         */
        YAxisPosition: "left" | "right";
        /**
         * YAxisScaleType
         * @enum {string}
         */
        YAxisScaleType: "log10" | "linear";
        /** YAxisSettings */
        YAxisSettings: {
            /**
             * Label
             * @default null
             */
            label: string | null;
            /** @default null */
            scale: components["schemas"]["Scale"] | null;
            /**
             * Showgridlines
             * @default null
             */
            showGridLines: boolean | null;
            /**
             * Showticks
             * @default null
             */
            showTicks: boolean | null;
            /**
             * Startatzero
             * @description Whether the Y axis should start at zero
             * @default null
             */
            startAtZero: boolean | null;
        };
        /**
         * _ExperimentApiMetricsList
         * @description List wrapper for OpenAPI schema generation — the field stores an array of metrics.
         */
        _ExperimentApiMetricsList: components["schemas"]["ExperimentApiMetric"][];
        /**
         * _InsightQuerySchema
         * @description The query definition for this insight. The `kind` field determines the query type:
         *     - `InsightVizNode` — product analytics (trends, funnels, retention, paths, stickiness, lifecycle)
         *     - `DataVisualizationNode` — SQL insights using HogQL
         *     - `DataTableNode` — raw data tables
         *     - `HogQuery` — Hog language queries
         */
        _InsightQuerySchema: components["schemas"]["InsightVizNode"] | components["schemas"]["DataTableNode"] | components["schemas"]["DataVisualizationNode"] | components["schemas"]["HogQuery"];
        /** WidgetFilterEntry */
        WidgetFilterEntry: {
            /** Filterid */
            filterId: string;
            /** Propertyname */
            propertyName: string;
            /** Optionid */
            optionId: string;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Value
             * @default null
             */
            value: string | string[] | null;
        };
        /** ActivityEventsPropertyFilter */
        ActivityEventsPropertyFilter: {
            /** Key */
            key: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            operator: components["schemas"]["PropertyOperator"];
            /**
             * Type
             * @enum {string}
             */
            type: "event" | "person";
            /**
             * Value
             * @default null
             */
            value: (string | number | boolean)[] | string | number | boolean | null;
        };
        /** WidgetDateRange */
        WidgetDateRange: {
            /**
             * Date From
             * @default null
             */
            date_from: ("-1M" | "-30M" | "-1h" | "-3h" | "-24h" | "-7d" | "-14d" | "-30d" | "-90d") | null;
        };
        /** ActivityEventsListWidgetConfig */
        ActivityEventsListWidgetConfig: {
            /** @default null */
            dateRange: components["schemas"]["WidgetDateRange"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Widgetfilters
             * @default null
             */
            widgetFilters: {
                [key: string]: components["schemas"]["WidgetFilterEntry"];
            } | null;
            /**
             * Limit
             * @description Maximum number of events to return.
             * @default 25
             */
            limit: number;
            /**
             * Eventname
             * @description Limit the feed to a single event name. Omit or null for all events.
             * @default null
             */
            eventName: string | null;
            /**
             * Properties
             * @description Event and person property filters, matching Activity > Explore events.
             * @default null
             */
            properties: components["schemas"]["ActivityEventsPropertyFilter"][] | null;
        };
        /** WidgetAssigneeFilter */
        WidgetAssigneeFilter: {
            /** Id */
            id: string | number;
            /**
             * Type
             * @enum {string}
             */
            type: "user" | "role";
        };
        /** ErrorTrackingListWidgetConfig */
        ErrorTrackingListWidgetConfig: {
            /** @default null */
            dateRange: components["schemas"]["WidgetDateRange"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Widgetfilters
             * @default null
             */
            widgetFilters: {
                [key: string]: components["schemas"]["WidgetFilterEntry"];
            } | null;
            /**
             * Limit
             * @description Maximum number of issues to return.
             * @default 10
             */
            limit: number;
            /**
             * Orderby
             * @description Issue ranking column.
             * @default occurrences
             * @enum {string}
             */
            orderBy: "last_seen" | "first_seen" | "occurrences" | "users" | "sessions";
            /**
             * Orderdirection
             * @description Sort direction for orderBy.
             * @default DESC
             * @enum {string}
             */
            orderDirection: "ASC" | "DESC";
            /**
             * Status
             * @description Issue status filter.
             * @default active
             * @enum {string}
             */
            status: "archived" | "active" | "resolved" | "pending_release" | "suppressed" | "all";
            /**
             * @description Filter by assignee ({type: user|role, id}). Omit for any assignee.
             * @default null
             */
            assignee: components["schemas"]["WidgetAssigneeFilter"] | null;
        };
        /** SessionReplayListWidgetConfig */
        SessionReplayListWidgetConfig: {
            /** @default null */
            dateRange: components["schemas"]["WidgetDateRange"] | null;
            /**
             * Filtertestaccounts
             * @default null
             */
            filterTestAccounts: boolean | null;
            /**
             * Widgetfilters
             * @default null
             */
            widgetFilters: {
                [key: string]: components["schemas"]["WidgetFilterEntry"];
            } | null;
            /**
             * Limit
             * @description Maximum number of recordings to return.
             * @default 10
             */
            limit: number;
            /**
             * Orderby
             * @description Recording ranking column.
             * @default start_time
             * @enum {string}
             */
            orderBy: "start_time" | "activity_score" | "recording_duration" | "duration" | "click_count" | "console_error_count";
            /**
             * Orderdirection
             * @description Sort direction for orderBy.
             * @default DESC
             * @enum {string}
             */
            orderDirection: "ASC" | "DESC";
            /**
             * Savedfilterid
             * @description short_id of a saved session replay filter to refine the recordings shown. When set, the saved filter owns the date range and property filters; only orderBy, orderDirection, and limit still apply. Combine with collectionId to filter within a collection.
             * @default null
             */
            savedFilterId: string | null;
            /**
             * Collectionid
             * @description short_id of a session replay collection to scope the widget to its pinned recordings. Combine with savedFilterId or property filters to narrow within the collection; orderBy, orderDirection, and limit still apply.
             * @default null
             */
            collectionId: string | null;
        };
        /** ExperimentsListWidgetConfig */
        ExperimentsListWidgetConfig: {
            /**
             * Limit
             * @description Maximum number of experiments to return.
             * @default 10
             */
            limit: number;
            /**
             * Orderby
             * @description Experiment list sort column.
             * @default created_at
             * @enum {string}
             */
            orderBy: "created_at" | "name" | "start_date";
            /**
             * Orderdirection
             * @description Sort direction for orderBy.
             * @default DESC
             * @enum {string}
             */
            orderDirection: "ASC" | "DESC";
            /**
             * Status
             * @description Experiment status filter.
             * @default all
             * @enum {string}
             */
            status: "draft" | "running" | "paused" | "exposure_frozen" | "stopped" | "all";
            /**
             * Createdby
             * @description Filter by creator (user id). Omit for any creator.
             * @default null
             */
            createdBy: number | null;
        };
        /** ExperimentResultsWidgetConfig */
        ExperimentResultsWidgetConfig: {
            /**
             * Experimentid
             * @description Experiment to show results for. Null until the user picks one in the widget settings.
             * @default null
             */
            experimentId: number | null;
        };
        /** SurveyResultsWidgetConfig */
        SurveyResultsWidgetConfig: {
            /**
             * @description Null or omitted means all time (the survey's full lifetime).
             * @default null
             */
            dateRange: components["schemas"]["WidgetDateRange"] | null;
            /**
             * Surveyid
             * @description Survey to show performance stats and recent responses for. Null until the user picks one.
             * @default null
             */
            surveyId: string | null;
            /**
             * Limit
             * @description Maximum number of recent responses to return.
             * @default 10
             */
            limit: number;
        };
        /** LogsListWidgetConfig */
        LogsListWidgetConfig: {
            /** @default null */
            dateRange: components["schemas"]["WidgetDateRange"] | null;
            /**
             * Limit
             * @description Maximum number of log lines to return.
             * @default 50
             */
            limit: number;
            /**
             * Orderby
             * @description Sort by newest (latest) or oldest (earliest) first.
             * @default latest
             * @enum {string}
             */
            orderBy: "latest" | "earliest";
            /**
             * Severitylevels
             * @description Only show logs at these severity levels. Empty shows all levels.
             */
            severityLevels?: ("trace" | "debug" | "info" | "warn" | "error" | "fatal")[];
            /**
             * Servicenames
             * @description Only show logs from these services. Empty shows all services.
             */
            serviceNames?: string[];
            /**
             * Wraplines
             * @description Wrap long log lines instead of truncating them to a single row.
             * @default false
             */
            wrapLines: boolean;
            /**
             * Timezone
             * @description Render log timestamps in UTC or in each viewer's local timezone.
             * @default UTC
             * @enum {string}
             */
            timezone: "UTC" | "local";
            /**
             * Savedviewid
             * @description short_id of a saved logs view to use as the source. When set, the saved view owns the date range, severity, service, and property filters; only orderBy and limit still apply.
             * @default null
             */
            savedViewId: string | null;
        };
    };
    responses: never;
    parameters: {
        /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
        ProjectIdPath: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    actions_list: {
        parameters: {
            query?: {
                /** @description Comma-separated list of creator user ids. Returns only actions created by these users. */
                created_by?: string;
                format?: "csv" | "json";
                /** @description Maximum number of actions to return. Omit to return all. */
                limit?: number;
                /** @description Number of actions to skip before returning results. */
                offset?: number;
                /** @description Field to order by (name, created_at, pinned_at, created_by). Prefix with '-' for descending. */
                ordering?: string;
                /** @description Case-insensitive substring match on the action name. */
                search?: string;
                /** @description JSON-encoded array of tag names, e.g. ["billing","beta"]. Returns actions having any of these tags. */
                tags?: string;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedActionList"];
                    "text/csv": components["schemas"]["PaginatedActionList"];
                };
            };
        };
    };
    actions_create: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Action"];
                "application/x-www-form-urlencoded": components["schemas"]["Action"];
                "multipart/form-data": components["schemas"]["Action"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Action"];
                    "text/csv": components["schemas"]["Action"];
                };
            };
        };
    };
    actions_retrieve: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this action. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Action"];
                    "text/csv": components["schemas"]["Action"];
                };
            };
        };
    };
    actions_update: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this action. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Action"];
                "application/x-www-form-urlencoded": components["schemas"]["Action"];
                "multipart/form-data": components["schemas"]["Action"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Action"];
                    "text/csv": components["schemas"]["Action"];
                };
            };
        };
    };
    actions_destroy: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this action. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    actions_partial_update: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this action. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedAction"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedAction"];
                "multipart/form-data": components["schemas"]["PatchedAction"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Action"];
                    "text/csv": components["schemas"]["Action"];
                };
            };
        };
    };
    annotations_list: {
        parameters: {
            query?: {
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedAnnotationList"];
                };
            };
        };
    };
    annotations_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Annotation"];
                "application/x-www-form-urlencoded": components["schemas"]["Annotation"];
                "multipart/form-data": components["schemas"]["Annotation"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Annotation"];
                };
            };
        };
    };
    annotations_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this annotation. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Annotation"];
                };
            };
        };
    };
    annotations_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this annotation. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedAnnotation"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedAnnotation"];
                "multipart/form-data": components["schemas"]["PatchedAnnotation"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Annotation"];
                };
            };
        };
    };
    cohorts_list: {
        parameters: {
            query?: {
                /** @description Return a basic payload that omits the heavy `filters`, `query`, and `groups` fields. Useful for pickers that only need id/name/count. */
                basic?: boolean;
                /** @description Set true to exclude behavioral (event-based) cohorts, which can't be used in feature flags or batch workflow audiences. */
                hide_behavioral_cohorts?: boolean;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description Optional. Match against cohort `name`. Returns exact (case-insensitive substring) matches only; if no exact match exists, returns similar (fuzzy trigram — typos, transpositions, prefix-as-you-type) matches instead. Each result's `search_match_type` is `exact` or `similar`. Results are ordered by relevance. When omitted, cohorts are ordered newest-first. Capped at 200 characters; longer queries return a 400 error. */
                search?: string;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedCohortList"];
                };
            };
        };
    };
    cohorts_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Cohort"];
                "application/x-www-form-urlencoded": components["schemas"]["Cohort"];
                "multipart/form-data": components["schemas"]["Cohort"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Cohort"];
                };
            };
        };
    };
    cohorts_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this cohort. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Cohort"];
                };
            };
        };
    };
    cohorts_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this cohort. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    cohorts_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this cohort. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedCohort"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedCohort"];
                "multipart/form-data": components["schemas"]["PatchedCohort"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Cohort"];
                };
            };
        };
    };
    dashboards_list: {
        parameters: {
            query?: {
                /** @description Optional. Return only dashboards filed directly in this project-tree folder, e.g. 'Unfiled/Dashboards'. An empty string matches dashboards at the project root. Nested sub-folders are not included. */
                folder?: string;
                format?: "json" | "txt";
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description Optional. Match against dashboard `name`, `description`, and tag names. Returns exact (case-insensitive substring) matches only; if no exact match exists, returns similar (fuzzy trigram — typos, transpositions, prefix-as-you-type) matches instead. Results are then ordered by relevance, then pinned status, then name; each result's `search_match_type` is `exact` or `similar`. When omitted, dashboards are ordered by pinned status then alphabetical name. Capped at 200 characters; longer queries return a 400 error. */
                search?: string;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedDashboardBasicList"];
                    "text/event-stream": components["schemas"]["PaginatedDashboardBasicList"];
                };
            };
        };
    };
    dashboards_create: {
        parameters: {
            query?: {
                format?: "json" | "txt";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Dashboard"];
                "application/x-www-form-urlencoded": components["schemas"]["Dashboard"];
                "multipart/form-data": components["schemas"]["Dashboard"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dashboard"];
                    "text/event-stream": components["schemas"]["Dashboard"];
                };
            };
        };
    };
    dashboards_retrieve: {
        parameters: {
            query?: {
                /** @description Object (or pre-encoded JSON string) to override dashboard filters for this request only (not persisted). Top-level keys replace; nested values are not deep-merged — pass the complete value for any key you override. Accepts the same keys as the dashboard filters schema (e.g., `date_from`, `date_to`, `properties`). Ignored when accessed via a sharing token. */
                filters_override?: string;
                format?: "json" | "txt";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
                /** @description Object (or pre-encoded JSON string) to override dashboard variables for this request only (not persisted). Format: {"<variable_id>": {"code_name": "<code_name>", "variableId": "<variable_id>", "value": <new_value>}}. Each entry must include `code_name` — partial entries are silently dropped. The simplest workflow is to call `dashboard-get` first, copy the matching entry from the response, and mutate `value`. Top-level keys replace; nested values are not deep-merged. Ignored when accessed via a sharing token. */
                variables_override?: string;
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this dashboard. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dashboard"];
                    "text/event-stream": components["schemas"]["Dashboard"];
                };
            };
        };
    };
    dashboards_update: {
        parameters: {
            query?: {
                format?: "json" | "txt";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this dashboard. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Dashboard"];
                "application/x-www-form-urlencoded": components["schemas"]["Dashboard"];
                "multipart/form-data": components["schemas"]["Dashboard"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dashboard"];
                    "text/event-stream": components["schemas"]["Dashboard"];
                };
            };
        };
    };
    dashboards_destroy: {
        parameters: {
            query?: {
                format?: "json" | "txt";
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this dashboard. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    dashboards_partial_update: {
        parameters: {
            query?: {
                format?: "json" | "txt";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description A unique integer value identifying this dashboard. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedPatchedDashboardOpenApi"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedPatchedDashboardOpenApi"];
                "multipart/form-data": components["schemas"]["PatchedPatchedDashboardOpenApi"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dashboard"];
                    "text/event-stream": components["schemas"]["Dashboard"];
                };
            };
        };
    };
    endpoints_list: {
        parameters: {
            query?: {
                created_by?: number;
                is_active?: boolean;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedEndpointResponseList"];
                };
            };
        };
    };
    endpoints_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["EndpointRequest"];
                "application/x-www-form-urlencoded": components["schemas"]["EndpointRequest"];
                "multipart/form-data": components["schemas"]["EndpointRequest"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EndpointResponse"];
                };
            };
        };
    };
    endpoints_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EndpointVersionResponse"];
                };
            };
        };
    };
    endpoints_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["EndpointRequest"];
                "application/x-www-form-urlencoded": components["schemas"]["EndpointRequest"];
                "multipart/form-data": components["schemas"]["EndpointRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EndpointResponse"];
                };
            };
        };
    };
    endpoints_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    endpoints_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedEndpointRequest"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedEndpointRequest"];
                "multipart/form-data": components["schemas"]["PatchedEndpointRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EndpointResponse"];
                };
            };
        };
    };
    environments_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this environment (aka team). */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"];
                };
            };
        };
    };
    environments_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this environment (aka team). */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedTeam"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedTeam"];
                "multipart/form-data": components["schemas"]["PatchedTeam"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"];
                };
            };
        };
    };
    event_definitions_list: {
        parameters: {
            query?: {
                /** @description When true, omit events that have been explicitly hidden by a team admin (Enterprise only). */
                exclude_hidden?: boolean;
                /** @description When true, omit events whose last ingested occurrence is older than 30 days. Events that have never been seen (`last_seen_at` is null) are kept so newly-defined events remain discoverable. Default false. If a search returns zero results with this filter on, retry with `exclude_stale=false` and tell the user the matches are stale. */
                exclude_stale?: boolean;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedEnterpriseEventDefinitionList"];
                };
            };
        };
    };
    event_definitions_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnterpriseEventDefinition"];
                "application/x-www-form-urlencoded": components["schemas"]["EnterpriseEventDefinition"];
                "multipart/form-data": components["schemas"]["EnterpriseEventDefinition"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnterpriseEventDefinition"];
                };
            };
        };
    };
    event_definitions_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this event definition. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnterpriseEventDefinition"];
                };
            };
        };
    };
    event_definitions_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this event definition. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    event_definitions_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this event definition. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedEnterpriseEventDefinition"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedEnterpriseEventDefinition"];
                "multipart/form-data": components["schemas"]["PatchedEnterpriseEventDefinition"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnterpriseEventDefinition"];
                };
            };
        };
    };
    event_schemas_list: {
        parameters: {
            query?: {
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedEventSchemaList"];
                };
            };
        };
    };
    event_schemas_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventSchema"];
                "application/x-www-form-urlencoded": components["schemas"]["EventSchema"];
                "multipart/form-data": components["schemas"]["EventSchema"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSchema"];
                };
            };
        };
    };
    event_schemas_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this event schema. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    experiment_holdouts_list: {
        parameters: {
            query?: {
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedExperimentHoldoutList"];
                };
            };
        };
    };
    experiment_holdouts_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExperimentHoldout"];
                "application/x-www-form-urlencoded": components["schemas"]["ExperimentHoldout"];
                "multipart/form-data": components["schemas"]["ExperimentHoldout"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentHoldout"];
                };
            };
        };
    };
    experiment_holdouts_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment holdout. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentHoldout"];
                };
            };
        };
    };
    experiment_holdouts_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment holdout. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    experiment_holdouts_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment holdout. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedExperimentHoldout"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedExperimentHoldout"];
                "multipart/form-data": components["schemas"]["PatchedExperimentHoldout"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentHoldout"];
                };
            };
        };
    };
    experiment_saved_metrics_list: {
        parameters: {
            query?: {
                /** @description Filter to shared metrics whose query references this event name. Matches events used directly in metric queries as well as events behind any actions those metrics reference. Use this for reuse discovery (find a metric by what it measures); distinct from 'search', which matches the metric's own name/description/tags. */
                event?: string;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedExperimentSavedMetricList"];
                };
            };
        };
    };
    experiment_saved_metrics_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExperimentSavedMetric"];
                "application/x-www-form-urlencoded": components["schemas"]["ExperimentSavedMetric"];
                "multipart/form-data": components["schemas"]["ExperimentSavedMetric"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentSavedMetric"];
                };
            };
        };
    };
    experiment_saved_metrics_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment saved metric. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentSavedMetric"];
                };
            };
        };
    };
    experiment_saved_metrics_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment saved metric. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    experiment_saved_metrics_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment saved metric. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedExperimentSavedMetric"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedExperimentSavedMetric"];
                "multipart/form-data": components["schemas"]["PatchedExperimentSavedMetric"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExperimentSavedMetric"];
                };
            };
        };
    };
    experiments_list: {
        parameters: {
            query?: {
                /** @description Filter by archived state. Defaults to non-archived experiments only. */
                archived?: boolean;
                /** @description Filter to experiments created by the given user(s). Accepts a single user ID, or a JSON-encoded / comma-separated list of user IDs to match any of them. */
                created_by_id?: string;
                /** @description Filter to experiments whose metrics reference this event name. Matches events used directly in metric queries as well as events behind any actions those metrics reference. */
                event?: string;
                /** @description Filter to experiments linked to the given feature flag ID. */
                feature_flag_id?: number;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description Field to order by. Prefix with '-' for descending. Allowlisted fields include name, created_at, updated_at, start_date, end_date, duration, and status. */
                order?: string;
                /** @description Filter to experiments created from an LLM prompt with this name. Matches experiments whose parameters.prompt_metadata.name equals the given value. */
                prompt_name?: string;
                /** @description Free-text search applied to the experiment name (case-insensitive). */
                search?: string;
                /** @description Filter by experiment status. "running", "paused", and "exposure_frozen" are mutually exclusive: "running" returns launched experiments with an active feature flag, "paused" returns launched experiments whose feature flag is deactivated, and "exposure_frozen" returns launched experiments whose exposure was frozen to the already-enrolled cohort while metrics keep flowing. "complete" is an alias for "stopped". "all" disables status filtering. */
                status?: "all" | "complete" | "draft" | "exposure_frozen" | "paused" | "running" | "stopped";
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedExperimentBasicList"];
                };
            };
        };
    };
    experiments_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExperimentWrite"];
                "application/x-www-form-urlencoded": components["schemas"]["ExperimentWrite"];
                "multipart/form-data": components["schemas"]["ExperimentWrite"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    experiments_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedExperimentWrite"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedExperimentWrite"];
                "multipart/form-data": components["schemas"]["PatchedExperimentWrite"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_archive_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ArchiveExperiment"];
                "application/x-www-form-urlencoded": components["schemas"]["ArchiveExperiment"];
                "multipart/form-data": components["schemas"]["ArchiveExperiment"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_end_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["EndExperiment"];
                "application/x-www-form-urlencoded": components["schemas"]["EndExperiment"];
                "multipart/form-data": components["schemas"]["EndExperiment"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_launch_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_pause_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_resume_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    experiments_unarchive_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this experiment. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Experiment"];
                };
            };
        };
    };
    feature_flags_list: {
        parameters: {
            query?: {
                active?: "STALE" | "false" | "true";
                /** @description Filter by archived state. When omitted, archived flags are excluded. */
                archived?: "false" | "true";
                /** @description Filter by the user(s) who created the feature flag. Accepts a single user ID, or a JSON-encoded / comma-separated list of user IDs to match any of them. */
                created_by_id?: string;
                /** @description When 'true', only return flags that can back an experiment: multivariate with 2-20 variants. Any other value is ignored. */
                eligible_for_experiment?: "true";
                /** @description Filter feature flags by their evaluation runtime. */
                evaluation_runtime?: "all" | "client" | "server";
                /** @description JSON-encoded list of feature flag keys to exclude from the results. */
                excluded_properties?: string;
                /** @description JSON-encoded list of tag names to exclude. Flags carrying any of these tags are filtered out. */
                excluded_tags?: string;
                /** @description Filter feature flags by presence of evaluation contexts. 'true' returns only flags with at least one evaluation context, 'false' returns only flags without. */
                has_evaluation_contexts?: "false" | "true";
                /** @description Filter by exact feature flag key match. Case insensitive. */
                key?: string;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description Search by feature flag key or name. Case insensitive. */
                search?: string;
                /** @description JSON-encoded list of tag names to filter feature flags by. */
                tags?: string;
                type?: "boolean" | "experiment" | "multivariant" | "remote_config";
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedFeatureFlagList"];
                };
            };
        };
    };
    feature_flags_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["FeatureFlagCreateRequestSchema"];
                "application/x-www-form-urlencoded": components["schemas"]["FeatureFlagCreateRequestSchema"];
                "multipart/form-data": components["schemas"]["FeatureFlagCreateRequestSchema"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureFlag"];
                };
            };
        };
    };
    feature_flags_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this feature flag. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureFlag"];
                };
            };
        };
    };
    feature_flags_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this feature flag. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FeatureFlag"];
                "application/x-www-form-urlencoded": components["schemas"]["FeatureFlag"];
                "multipart/form-data": components["schemas"]["FeatureFlag"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureFlag"];
                };
            };
        };
    };
    feature_flags_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this feature flag. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    feature_flags_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this feature flag. */
                id: number;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedFeatureFlagPartialUpdateRequestSchema"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedFeatureFlagPartialUpdateRequestSchema"];
                "multipart/form-data": components["schemas"]["PatchedFeatureFlagPartialUpdateRequestSchema"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureFlag"];
                };
            };
        };
    };
    insights_list: {
        parameters: {
            query?: {
                /** @description Return basic insight metadata only (no results, faster). */
                basic?: boolean;
                /** @description JSON-encoded array of user IDs. Only returns insights whose `created_by` is in the list, e.g. `[1,42]`. */
                created_by?: string;
                /** @description Filter by `created_at > created_date_from`. Accepts absolute or relative dates. */
                created_date_from?: string;
                /** @description Filter by `created_at < created_date_to`. Accepts absolute or relative dates. */
                created_date_to?: string;
                /** @description JSON-encoded array of dashboard IDs. Returns insights attached to every listed dashboard (AND). */
                dashboards?: string;
                /** @description Filter by `last_modified_at > date_from`. Accepts absolute dates (`2025-04-23`) or relative strings (`-7d`, `-1m`). */
                date_from?: string;
                /** @description Filter by `last_modified_at < date_to`. Accepts absolute dates or relative strings. */
                date_to?: string;
                /** @description Include this parameter (any value) to restrict results to insights marked as favorited. */
                favorited?: boolean;
                format?: "csv" | "json";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
                /** @description Restrict to a single insight type. `JSON` matches non-wrapper query insights; `SQL` matches HogQL queries. */
                insight?: "FUNNELS" | "JSON" | "LIFECYCLE" | "PATHS" | "RETENTION" | "SQL" | "STICKINESS" | "TRENDS";
                /** @description Filter by `last_viewed_at > last_viewed_date_from`. Accepts absolute or relative dates. */
                last_viewed_date_from?: string;
                /** @description Filter by `last_viewed_at < last_viewed_date_to`. Accepts absolute or relative dates. */
                last_viewed_date_to?: string;
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /**
                 * @description Whether to refresh the retrieved insights, how aggressively, and if sync or async:
                 *     - `'force_cache'` - return cached data or a cache miss; always completes immediately as it never calculates
                 *     - `'blocking'` - calculate synchronously (returning only when the query is done), UNLESS there are very fresh results in the cache
                 *     - `'async'` - kick off background calculation (returning immediately with a query status), UNLESS there are very fresh results in the cache
                 *     - `'lazy_async'` - kick off background calculation, UNLESS there are somewhat fresh results in the cache
                 *     - `'force_blocking'` - calculate synchronously, even if fresh results are already cached
                 *     - `'force_async'` - kick off background calculation, even if fresh results are already cached
                 *     Background calculation can be tracked using the `query_status` response field.
                 */
                refresh?: "async" | "async_except_on_cache_miss" | "blocking" | "force_async" | "force_blocking" | "force_cache" | "lazy_async";
                /** @description When truthy, restricts results to insights that are saved (or attached to a visible dashboard). When falsy, only unsaved insights. */
                saved?: boolean;
                /** @description Search term matched across name, derived_name, description, and tag names. Returns exact (case-insensitive substring) matches only; if no exact match exists, returns similar (fuzzy trigram) matches instead. Each result's `search_match_type` is `exact` or `similar`. */
                search?: string;
                short_id?: string;
                /** @description JSON-encoded array of tag names. Returns insights with any of the listed tags. */
                tags?: string;
                /** @description Include this parameter (any value) to restrict results to insights created by the authenticated user. */
                user?: boolean;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedInsightList"];
                    "text/csv": components["schemas"]["PaginatedInsightList"];
                };
            };
        };
    };
    insights_create: {
        parameters: {
            query?: {
                format?: "csv" | "json";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Insight"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                    "text/csv": components["schemas"]["Insight"];
                };
            };
        };
    };
    insights_retrieve: {
        parameters: {
            query?: {
                /** @description Object (or pre-encoded JSON string) to override the insight's filters for this request only (not persisted). Top-level keys replace; nested values are not deep-merged — pass the complete value for any key you override. Accepts the same keys as the dashboard filters schema (e.g., `date_from`, `date_to`, `properties`). Ignored when accessed via a sharing token. */
                filters_override?: string;
                format?: "csv" | "json";
                /**
                 * @description Only if loading an insight in the context of a dashboard: The relevant dashboard's ID.
                 *     When set, the specified dashboard's filters and date range override will be applied.
                 */
                from_dashboard?: number;
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
                /**
                 * @description Whether to refresh the insight, how aggresively, and if sync or async:
                 *     - `'force_cache'` - return cached data or a cache miss; always completes immediately as it never calculates
                 *     - `'blocking'` - calculate synchronously (returning only when the query is done), UNLESS there are very fresh results in the cache
                 *     - `'async'` - kick off background calculation (returning immediately with a query status), UNLESS there are very fresh results in the cache
                 *     - `'lazy_async'` - kick off background calculation, UNLESS there are somewhat fresh results in the cache
                 *     - `'force_blocking'` - calculate synchronously, even if fresh results are already cached
                 *     - `'force_async'` - kick off background calculation, even if fresh results are already cached
                 *     Background calculation can be tracked using the `query_status` response field.
                 */
                refresh?: "async" | "async_except_on_cache_miss" | "blocking" | "force_async" | "force_blocking" | "force_cache" | "lazy_async";
                /** @description Object (or pre-encoded JSON string) to override the insight's HogQL variables for this request only (not persisted). Format: {"<variable_id>": {"code_name": "<code_name>", "variableId": "<variable_id>", "value": <new_value>}}. Each entry must include `code_name` — partial entries are silently dropped. The simplest workflow is to call `insight-get` first, copy the matching entry from the response, and mutate `value`. Top-level keys replace; nested values are not deep-merged. Ignored when accessed via a sharing token. */
                variables_override?: string;
            };
            header?: never;
            path: {
                /** @description Numeric primary key or 8-character `short_id` (for example `AaVQ8Ijw`) identifying the insight. */
                id: number | string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                    "text/csv": components["schemas"]["Insight"];
                };
            };
        };
    };
    insights_update: {
        parameters: {
            query?: {
                format?: "csv" | "json";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description Numeric primary key or 8-character `short_id` (for example `AaVQ8Ijw`) identifying the insight. */
                id: number | string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Insight"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                    "text/csv": components["schemas"]["Insight"];
                };
            };
        };
    };
    insights_destroy: {
        parameters: {
            query?: {
                format?: "csv" | "json";
            };
            header?: never;
            path: {
                /** @description Numeric primary key or 8-character `short_id` (for example `AaVQ8Ijw`) identifying the insight. */
                id: number | string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            405: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    insights_partial_update: {
        parameters: {
            query?: {
                format?: "csv" | "json";
                /** @description Opt in to receiving the deprecated `dashboards` field in insight payloads. Once opt-in enforcement is enabled, API-token callers stop receiving it by default; use `dashboard_tiles` instead. */
                include_dashboards?: boolean;
            };
            header?: never;
            path: {
                /** @description Numeric primary key or 8-character `short_id` (for example `AaVQ8Ijw`) identifying the insight. */
                id: number | string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedInsight"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                    "text/csv": components["schemas"]["Insight"];
                };
            };
        };
    };
    schema_property_groups_list: {
        parameters: {
            query?: {
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
            };
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedSchemaPropertyGroupList"];
                };
            };
        };
    };
    schema_property_groups_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SchemaPropertyGroup"];
                "application/x-www-form-urlencoded": components["schemas"]["SchemaPropertyGroup"];
                "multipart/form-data": components["schemas"]["SchemaPropertyGroup"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemaPropertyGroup"];
                };
            };
        };
    };
    schema_property_groups_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this schema property group. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemaPropertyGroup"];
                };
            };
        };
    };
    schema_property_groups_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this schema property group. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    schema_property_groups_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this schema property group. */
                id: string;
                /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
                project_id: components["parameters"]["ProjectIdPath"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedSchemaPropertyGroup"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedSchemaPropertyGroup"];
                "multipart/form-data": components["schemas"]["PatchedSchemaPropertyGroup"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemaPropertyGroup"];
                };
            };
        };
    };
}
