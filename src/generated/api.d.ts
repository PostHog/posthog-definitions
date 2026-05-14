export interface paths {
    "/api/environments/{environment_id}/endpoints/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @deprecated
         * @description List all endpoints for the team.
         */
        get: operations["environments_endpoints_list"];
        put?: never;
        /**
         * @deprecated
         * @description Create a new endpoint.
         */
        post: operations["environments_endpoints_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/environments/{environment_id}/endpoints/{name}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @deprecated
         * @description Retrieve an endpoint, or a specific version via ?version=N.
         */
        get: operations["environments_endpoints_retrieve"];
        /**
         * @deprecated
         * @description Update an existing endpoint. Parameters are optional. Pass version in body or ?version=N query param to target a specific version.
         */
        put: operations["environments_endpoints_update"];
        post?: never;
        /**
         * @deprecated
         * @description Delete an endpoint and clean up materialized query.
         */
        delete: operations["environments_endpoints_destroy"];
        options?: never;
        head?: never;
        /**
         * @deprecated
         * @description Update an existing endpoint.
         */
        patch: operations["environments_endpoints_partial_update"];
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
        /** ActionConversionGoal */
        ActionConversionGoal: {
            /** Actionid */
            actionId: number;
        };
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["PersonPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"])[] | null;
            /**
             * Kind
             * @default ActorsQuery
             * @constant
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
            properties: (components["schemas"]["PersonPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"])[] | components["schemas"]["PropertyGroupFilterValue"] | null;
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
        };
        /**
         * AggregationAxisFormat
         * @enum {string}
         */
        AggregationAxisFormat: "numeric" | "duration" | "duration_ms" | "percentage" | "percentage_scaled" | "currency" | "short";
        /**
         * AggregationPropertyType1
         * @enum {string}
         */
        AggregationPropertyType1: "event" | "person" | "data_warehouse";
        /**
         * AggregationType
         * @enum {string}
         */
        AggregationType: "count" | "sum" | "avg";
        /**
         * BaseMathType
         * @enum {string}
         */
        BaseMathType: "total" | "dau" | "weekly_active" | "monthly_active" | "unique_session" | "first_time_for_user" | "first_matching_event_for_user";
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
        ChartDisplayType: "Auto" | "ActionsLineGraph" | "ActionsBar" | "ActionsUnstackedBar" | "ActionsStackedBar" | "ActionsAreaGraph" | "ActionsLineGraphCumulative" | "BoldNumber" | "ActionsPie" | "ActionsBarValue" | "ActionsTable" | "WorldMap" | "CalendarHeatmap" | "TwoDimensionalHeatmap" | "BoxPlot";
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
         * CurrencyCode
         * @enum {string}
         */
        CurrencyCode: "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLP" | "CNY" | "COP" | "CRC" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LTL" | "LVL" | "LSL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRU" | "MTL" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SRD" | "SSP" | "STN" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "UYU" | "UZS" | "VES" | "VND" | "VUV" | "WST" | "XAF" | "XCD" | "XOF" | "XPF" | "YER" | "ZAR" | "ZMW";
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
        };
        DashboardTileBasic: {
            readonly id: number;
            readonly dashboard_id: number;
            deleted?: boolean | null;
        };
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
            } | components["schemas"]["Response"] | components["schemas"]["Response1"] | components["schemas"]["Response2"] | components["schemas"]["Response3"] | components["schemas"]["Response4"] | components["schemas"]["Response5"] | components["schemas"]["Response6"] | components["schemas"]["Response8"] | components["schemas"]["Response9"] | components["schemas"]["Response10"] | components["schemas"]["Response11"] | components["schemas"]["Response12"] | components["schemas"]["Response13"] | components["schemas"]["Response14"] | components["schemas"]["Response15"] | components["schemas"]["Response16"] | components["schemas"]["Response18"] | components["schemas"]["Response19"] | components["schemas"]["Response20"] | components["schemas"]["Response21"] | components["schemas"]["Response22"] | components["schemas"]["Response23"] | components["schemas"]["Response24"] | components["schemas"]["Response25"] | components["schemas"]["Response26"] | null;
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
            source: components["schemas"]["EventsNode"] | components["schemas"]["EventsQuery"] | components["schemas"]["PersonsNode"] | components["schemas"]["ActorsQuery"] | components["schemas"]["GroupsQuery"] | components["schemas"]["HogQLQuery"] | components["schemas"]["WebOverviewQuery"] | components["schemas"]["WebStatsTableQuery"] | components["schemas"]["WebExternalClicksTableQuery"] | components["schemas"]["WebGoalsQuery"] | components["schemas"]["WebVitalsQuery"] | components["schemas"]["WebVitalsPathBreakdownQuery"] | components["schemas"]["SessionAttributionExplorerQuery"] | components["schemas"]["SessionsQuery"] | components["schemas"]["RevenueAnalyticsGrossRevenueQuery"] | components["schemas"]["RevenueAnalyticsMetricsQuery"] | components["schemas"]["RevenueAnalyticsMRRQuery"] | components["schemas"]["RevenueAnalyticsOverviewQuery"] | components["schemas"]["RevenueAnalyticsTopCustomersQuery"] | components["schemas"]["RevenueExampleEventsQuery"] | components["schemas"]["RevenueExampleDataWarehouseTablesQuery"] | components["schemas"]["MarketingAnalyticsTableQuery"] | components["schemas"]["MarketingAnalyticsAggregatedQuery"] | components["schemas"]["NonIntegratedConversionsTableQuery"] | components["schemas"]["ErrorTrackingQuery"] | components["schemas"]["ErrorTrackingIssueCorrelationQuery"] | components["schemas"]["ExperimentFunnelsQuery"] | components["schemas"]["ExperimentTrendsQuery"] | components["schemas"]["TracesQuery"] | components["schemas"]["TraceQuery"] | components["schemas"]["EndpointsUsageTableQuery"];
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
        /**
         * @description * `is_date_exact` - is_date_exact
         *     * `is_date_before` - is_date_before
         *     * `is_date_after` - is_date_after
         * @enum {string}
         */
        DateOperatorEnum: "is_date_exact" | "is_date_before" | "is_date_after";
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
             * Explicitdate
             * @description Whether the date_from and date_to should be used verbatim. Disables rounding to the start and end of period.
             * @default false
             */
            explicitDate: boolean | null;
        };
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
            /** @description Relative API path to execute this endpoint (e.g. /api/environments/{team_id}/endpoints/{name}/run). */
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
            /** @description Relative API path to execute this endpoint (e.g. /api/environments/{team_id}/endpoints/{name}/run). */
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
             * Kind
             * @default EndpointsUsageTableQuery
             * @constant
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
             * Kind
             * @default ErrorTrackingIssueCorrelationQuery
             * @constant
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
             * Kind
             * @default ErrorTrackingQuery
             * @constant
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
             * @description Pending fingerprint issue state updates UNIONed into the fingerprint issue state subquery (V3 only). The backend caps the list at 50 entries; extras are dropped silently.
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
             * @description Use V2 query path (ClickHouse postgres connector join instead of separate Postgres queries)
             * @default null
             */
            useQueryV2: boolean | null;
            /**
             * Usequeryv3
             * @description Use V3 query path (denormalized ClickHouse table, no Postgres joins)
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["PropertyGroupFilter"] | components["schemas"]["PropertyGroupFilterValue"] | components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default EventsQuery
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
        };
        /**
         * @description * `is_set` - is_set
         *     * `is_not_set` - is_not_set
         * @enum {string}
         */
        ExistenceOperatorEnum: "is_set" | "is_not_set";
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default ExperimentDataWarehouseNode
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[];
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
             * Metric Type
             * @default funnel
             * @constant
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
             * Kind
             * @default ExperimentFunnelsQuery
             * @constant
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
             * @default null
             */
            lower_bound_percentile: number | null;
            /**
             * Metric Type
             * @default mean
             * @constant
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
             * Upper Bound Percentile
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
            metric: components["schemas"]["ExperimentMeanMetric"] | components["schemas"]["ExperimentFunnelMetric"] | components["schemas"]["ExperimentRatioMetric"] | components["schemas"]["ExperimentRetentionMetric"] | null;
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
             * Metric Type
             * @default ratio
             * @constant
             */
            metric_type: "ratio";
            /**
             * Name
             * @default null
             */
            name: string | null;
            /** Numerator */
            numerator: components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["ExperimentDataWarehouseNode"];
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
             * Metric Type
             * @default retention
             * @constant
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
             * Kind
             * @default ExperimentTrendsQuery
             * @constant
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
        };
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
            readonly experiment_set_metadata: {
                [key: string]: unknown;
            }[];
            readonly surveys: {
                [key: string]: unknown;
            };
            readonly features: {
                [key: string]: unknown;
            };
            performed_rollback?: boolean | null;
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
            /** @description Organizational tags for this feature flag. */
            tags?: string[];
            /** @description Evaluation contexts that control where this flag evaluates at runtime. */
            evaluation_contexts?: string[];
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
            /** @description Additional super condition groups used by experiments. */
            super_groups?: {
                [key: string]: unknown;
            }[];
            /** @description Whether this flag has early access feature enrollment enabled. When true, the flag is evaluated against the person property $feature_enrollment/{flag_key}. */
            feature_enrollment?: boolean | null;
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
            funnelCorrelationPropertyValues: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Funnelfromstep */
            funnelFromStep: number;
            /** Funneltostep */
            funnelToStep: number;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Funnelfromstep */
            funnelFromStep: number;
            /** Funneltostep */
            funnelToStep: number;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /** Id Field */
            id_field: string;
            /**
             * Kind
             * @default FunnelsDataWarehouseNode
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            /** @default vertical */
            layout: components["schemas"]["FunnelLayout"] | null;
            /**
             * Resultcustomizations
             * @description Customizations for the appearance of result datasets.
             * @default null
             */
            resultCustomizations: {
                [key: string]: components["schemas"]["ResultCustomizationByValue"];
            } | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
            series: (components["schemas"]["GroupNode"] | components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["FunnelsDataWarehouseNode"])[];
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default GroupNode
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
             * Kind
             * @default GroupsQuery
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
             * @description Optional direct external data source id for running against a specific source
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
             * Kind
             * @default HogQLQuery
             * @constant
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
            /** @default null */
            personsArgMaxVersion: components["schemas"]["PersonsArgMaxVersion"] | null;
            /** @default null */
            personsJoinMode: components["schemas"]["PersonsJoinMode"] | null;
            /** @default null */
            personsOnEventsMode: components["schemas"]["PersonsOnEventsMode"] | null;
            /** @default null */
            propertyGroupsMode: components["schemas"]["PropertyGroupsMode"] | null;
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
             * @description DEPRECATED. Will be removed in a future release. Use dashboard_tiles instead.
             *             A dashboard ID for each of the dashboards that this insight is displayed on.
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
            /** Format: date-time */
            readonly last_viewed_at: string | null;
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
        IntegrationKind: "slack" | "slack-posthog-code" | "salesforce" | "hubspot" | "google-pubsub" | "google-cloud-service-account" | "google-cloud-storage" | "google-ads" | "google-sheets" | "linkedin-ads" | "snapchat" | "stripe" | "intercom" | "email" | "twilio" | "linear" | "github" | "gitlab" | "meta-ads" | "clickup" | "reddit-ads" | "databricks" | "tiktok-ads" | "bing-ads" | "vercel" | "azure-blob" | "firebase" | "jira" | "pinterest-ads" | "customerio-app" | "customerio-webhook" | "customerio-track";
        /**
         * IntervalType
         * @enum {string}
         */
        IntervalType: "second" | "minute" | "hour" | "day" | "week" | "month";
        /**
         * Key10
         * @enum {string}
         */
        Key10: "tag_name" | "text" | "href" | "selector";
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /** Id */
            id: string;
            /**
             * Kind
             * @default LifecycleDataWarehouseNode
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
             * Showlegend
             * @default false
             */
            showLegend: boolean | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
             * Kind
             * @default MarketingAnalyticsAggregatedQuery
             * @constant
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
             * Kind
             * @default MarketingAnalyticsTableQuery
             * @constant
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
             * Kind
             * @default NonIntegratedConversionsTableQuery
             * @constant
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
        };
        NullEnum: null;
        /**
         * OrderDirection2
         * @enum {string}
         */
        OrderDirection2: "ASC" | "DESC";
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
        /** @description Serializer mixin that handles tags for objects. */
        PatchedDashboard: {
            readonly id?: number;
            name?: string | null;
            description?: string;
            pinned?: boolean;
            /** Format: date-time */
            readonly created_at?: string;
            readonly created_by?: components["schemas"]["UserBasic"];
            /** Format: date-time */
            last_accessed_at?: string | null;
            /** Format: date-time */
            readonly last_viewed_at?: string | null;
            readonly is_shared?: boolean;
            deleted?: boolean;
            readonly creation_mode?: components["schemas"]["CreationModeEnum"];
            readonly filters?: {
                [key: string]: unknown;
            };
            readonly variables?: {
                [key: string]: unknown;
            } | null;
            /** @description Custom color mapping for breakdown values. */
            breakdown_colors?: unknown;
            /** @description ID of the color theme used for chart visualizations. */
            data_color_theme_id?: number | null;
            tags?: unknown[];
            restriction_level?: components["schemas"]["RestrictionLevelEnum"];
            readonly effective_restriction_level?: components["schemas"]["EffectivePrivilegeLevelEnum"];
            readonly effective_privilege_level?: components["schemas"]["EffectivePrivilegeLevelEnum"];
            /** @description The effective access level the user has for this object */
            readonly user_access_level?: string | null;
            readonly access_control_version?: string;
            /** Format: date-time */
            last_refresh?: string | null;
            readonly persisted_filters?: {
                [key: string]: unknown;
            } | null;
            readonly persisted_variables?: {
                [key: string]: unknown;
            } | null;
            readonly team_id?: number;
            /** @description List of quick filter IDs associated with this dashboard */
            quick_filter_ids?: string[] | null;
            readonly tiles?: {
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
        PatchedFeatureFlagPartialUpdateRequestSchema: {
            /** @description Feature flag key. */
            key?: string;
            /** @description Feature flag description (stored in the `name` field for backwards compatibility). */
            name?: string;
            /** @description Feature flag targeting configuration. */
            filters?: components["schemas"]["FeatureFlagFiltersSchema"];
            /** @description Whether the feature flag is active. */
            active?: boolean;
            /** @description Organizational tags for this feature flag. */
            tags?: string[];
            /** @description Evaluation contexts that control where this flag evaluates at runtime. */
            evaluation_contexts?: string[];
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
             * @description DEPRECATED. Will be removed in a future release. Use dashboard_tiles instead.
             *             A dashboard ID for each of the dashboards that this insight is displayed on.
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
            /** Format: date-time */
            readonly last_viewed_at?: string | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
            fixedProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default PersonsNode
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            values: (components["schemas"]["PropertyGroupFilterValue"] | components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[];
        };
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
        };
        /** Response26 */
        Response26: {
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
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Usedpreaggregatedtables
             * @default null
             */
            usedPreAggregatedTables: boolean | null;
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
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Usedpreaggregatedtables
             * @default null
             */
            usedPreAggregatedTables: boolean | null;
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
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            aggregationPropertyType: components["schemas"]["AggregationPropertyType1"] | null;
            /**
             * @description The aggregation type to use for retention
             * @default count
             */
            aggregationType: components["schemas"]["AggregationType"] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
             * Kind
             * @default RevenueAnalyticsGrossRevenueQuery
             * @constant
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
        };
        /** RevenueAnalyticsMRRQuery */
        RevenueAnalyticsMRRQuery: {
            /** Breakdown */
            breakdown: components["schemas"]["RevenueAnalyticsBreakdown"][];
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            interval: components["schemas"]["SimpleIntervalType"];
            /**
             * Kind
             * @default RevenueAnalyticsMRRQuery
             * @constant
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
             * Kind
             * @default RevenueAnalyticsMetricsQuery
             * @constant
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
             * Kind
             * @default RevenueAnalyticsOverviewQuery
             * @constant
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
             * Kind
             * @default RevenueAnalyticsTopCustomersQuery
             * @constant
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
             * Kind
             * @default RevenueExampleDataWarehouseTablesQuery
             * @constant
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
        };
        /** RevenueExampleEventsQuery */
        RevenueExampleEventsQuery: {
            /**
             * Kind
             * @default RevenueExampleEventsQuery
             * @constant
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
        /** SessionAttributionExplorerQuery */
        SessionAttributionExplorerQuery: {
            /** @default null */
            filters: components["schemas"]["Filters"] | null;
            /** Groupby */
            groupBy: components["schemas"]["SessionAttributionGroupBy"][];
            /**
             * Kind
             * @default SessionAttributionExplorerQuery
             * @constant
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
            eventProperties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            fixedProperties: (components["schemas"]["PropertyGroupFilter"] | components["schemas"]["PropertyGroupFilterValue"] | components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Kind
             * @default SessionsQuery
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
        TaxonomicFilterGroupType: "metadata" | "actions" | "cohorts" | "cohorts_with_all" | "data_warehouse" | "data_warehouse_properties" | "data_warehouse_person_properties" | "elements" | "events" | "internal_events" | "internal_event_properties" | "event_properties" | "event_feature_flags" | "event_metadata" | "numerical_event_properties" | "person_properties" | "pageview_urls" | "pageview_events" | "screens" | "screen_events" | "email_addresses" | "autocapture_events" | "custom_events" | "wildcard" | "groups" | "persons" | "feature_flags" | "insights" | "experiments" | "plugins" | "dashboards" | "name_groups" | "session_properties" | "hogql_expression" | "notebooks" | "log_entries" | "error_tracking_issues" | "logs" | "log_attributes" | "log_resource_attributes" | "spans" | "span_attributes" | "span_resource_attributes" | "replay" | "replay_saved_filters" | "revenue_analytics_properties" | "resources" | "error_tracking_properties" | "activity_log_properties" | "max_ai_context" | "workflow_variables" | "suggested_filters" | "recent_filters" | "pinned_filters" | "empty";
        /**
         * TextMatching
         * @enum {unknown}
         */
        TextMatching: "contains" | "exact" | "regex" | null;
        /**
         * TimeWindowMode
         * @enum {string}
         */
        TimeWindowMode: "strict_calendar_dates" | "24_hour_windows";
        /** TraceQuery */
        TraceQuery: {
            /** @default null */
            dateRange: components["schemas"]["DateRange"] | null;
            /**
             * Kind
             * @default TraceQuery
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
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
             * Kind
             * @default TracesQuery
             * @constant
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | null;
            /**
             * Randomorder
             * @description Use random ordering instead of timestamp DESC. Useful for representative sampling to avoid recency bias.
             * @default null
             */
            randomOrder: boolean | null;
            /** @default null */
            response: components["schemas"]["TracesQueryResponse"] | null;
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
        };
        /** TrendsFilter */
        TrendsFilter: {
            /** @default numeric */
            aggregationAxisFormat: components["schemas"]["AggregationAxisFormat"] | null;
            /**
             * Aggregationaxispostfix
             * @default null
             */
            aggregationAxisPostfix: string | null;
            /**
             * Aggregationaxisprefix
             * @default null
             */
            aggregationAxisPrefix: string | null;
            /**
             * Breakdown Histogram Bin Count
             * @default null
             */
            breakdown_histogram_bin_count: number | null;
            /**
             * Confidencelevel
             * @default null
             */
            confidenceLevel: number | null;
            /**
             * Decimalplaces
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
            properties: (components["schemas"]["EventPropertyFilter"] | components["schemas"]["PersonPropertyFilter"] | components["schemas"]["ElementPropertyFilter"] | components["schemas"]["EventMetadataPropertyFilter"] | components["schemas"]["SessionPropertyFilter"] | components["schemas"]["CohortPropertyFilter"] | components["schemas"]["RecordingPropertyFilter"] | components["schemas"]["LogEntryPropertyFilter"] | components["schemas"]["GroupPropertyFilter"] | components["schemas"]["FeaturePropertyFilter"] | components["schemas"]["FlagPropertyFilter"] | components["schemas"]["HogQLPropertyFilter"] | components["schemas"]["EmptyPropertyFilter"] | components["schemas"]["DataWarehousePropertyFilter"] | components["schemas"]["DataWarehousePersonPropertyFilter"] | components["schemas"]["ErrorTrackingIssueFilter"] | components["schemas"]["LogPropertyFilter"] | components["schemas"]["SpanPropertyFilter"] | components["schemas"]["RevenueAnalyticsPropertyFilter"] | components["schemas"]["WorkflowVariablePropertyFilter"])[] | components["schemas"]["PropertyGroupFilter"] | null;
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
            series: (components["schemas"]["GroupNode"] | components["schemas"]["EventsNode"] | components["schemas"]["ActionsNode"] | components["schemas"]["DataWarehouseNode"])[];
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
             * Kind
             * @default WebExternalClicksTableQuery
             * @constant
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
             * Kind
             * @default WebGoalsQuery
             * @constant
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
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Usedpreaggregatedtables
             * @default null
             */
            usedPreAggregatedTables: boolean | null;
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
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Usedpreaggregatedtables
             * @default null
             */
            usedPreAggregatedTables: boolean | null;
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
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Usedpreaggregatedtables
             * @default null
             */
            usedPreAggregatedTables: boolean | null;
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
             * Kind
             * @default WebVitalsPathBreakdownQuery
             * @constant
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
            /**
             * @description Query status indicates whether next to the provided data, a query is still running.
             * @default null
             */
            query_status: components["schemas"]["QueryStatus"] | null;
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
             * Kind
             * @default WebVitalsQuery
             * @constant
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
         * _InsightQuerySchema
         * @description The query definition for this insight. The `kind` field determines the query type:
         *     - `InsightVizNode` — product analytics (trends, funnels, retention, paths, stickiness, lifecycle)
         *     - `DataVisualizationNode` — SQL insights using HogQL
         *     - `DataTableNode` — raw data tables
         *     - `HogQuery` — Hog language queries
         */
        _InsightQuerySchema: components["schemas"]["InsightVizNode"] | components["schemas"]["DataTableNode"] | components["schemas"]["DataVisualizationNode"] | components["schemas"]["HogQuery"];
    };
    responses: never;
    parameters: {
        /** @description Project ID of the project you're trying to access. To find the ID of the project, make a call to /api/projects/. */
        ProjectIdPath: string;
        /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
        EnvironmentIdPath: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    environments_endpoints_list: {
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
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
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
    environments_endpoints_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
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
    environments_endpoints_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
                name: string;
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
    environments_endpoints_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
                name: string;
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
    environments_endpoints_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
                name: string;
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
    environments_endpoints_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Deprecated. Use /api/projects/{project_id}/ instead. */
                environment_id: components["parameters"]["EnvironmentIdPath"];
                name: string;
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
    dashboards_list: {
        parameters: {
            query?: {
                format?: "json" | "txt";
                /** @description Number of results to return per page. */
                limit?: number;
                /** @description The initial index from which to return the results. */
                offset?: number;
                /** @description Optional. Fuzzy match against dashboard `name` and `description` using Postgres trigram word similarity (handles typos, transpositions, and prefix-as-you-type). `name` matches rank above `description` matches. Results are ordered by relevance, then pinned status, then name. When omitted, dashboards are ordered by pinned status then alphabetical name. Capped at 200 characters; longer queries return a 400 error. */
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
                "application/json": components["schemas"]["PatchedDashboard"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedDashboard"];
                "multipart/form-data": components["schemas"]["PatchedDashboard"];
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
    event_definitions_list: {
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
    feature_flags_list: {
        parameters: {
            query?: {
                active?: "STALE" | "false" | "true";
                /** @description The User ID which initially created the feature flag. */
                created_by_id?: string;
                /** @description Filter feature flags by their evaluation runtime. */
                evaluation_runtime?: "both" | "client" | "server";
                /** @description JSON-encoded list of feature flag keys to exclude from the results. */
                excluded_properties?: string;
                /** @description Filter feature flags by presence of evaluation contexts. 'true' returns only flags with at least one evaluation context, 'false' returns only flags without. */
                has_evaluation_contexts?: "false" | "true";
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
                /** @description Case-insensitive substring match across name, derived_name, description, and tag names. */
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
