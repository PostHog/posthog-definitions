# API parity plan

Bring posthog-definitions to parity with the PostHog API: every IaC-viable
resource in the prod OpenAPI spec becomes a supported resource module, or is
explicitly excluded with a reason.

**Spec snapshot:** `https://us.posthog.com/api/schema/` fetched 2026-07-23 —
1224 paths, ~100 full-CRUD collections (list + create at the collection root,
partial_update at the detail route). 12 resource types shipped today.

This doc is the progress tracker. Flip checkboxes as commits land; add notes
inline when an implementation decision diverges from the guess recorded here.
`docs/resources.md` stays the user-facing support matrix; this file is the
working plan and dies when parity is reached.

## Commit protocol

One resource = one commit series, following `.claude/skills/add-resource`
(or `add-singleton-resource` for singletons):

1. `chore(codegen): expose <resource> operations` — add operationIds to
   `openapi-filter.yaml`, regenerate `src/generated/api.d.ts`. Separate
   commit because the generated diff is large and reviewers should be able
   to skip it.
2. `feat(<resource>): SDK factory + pipeline` — the module directory
   (`sdk.ts`, `client.ts`, `pipeline.ts`, `index.ts`), registry entry,
   unit tests, examples, README scopes, `docs/resources.md` row flip.
3. `feat(<resource>): pull codegen` — pull rendering support, if not
   trivially covered by the generic path. Fold into 2 when small.
4. `test(smoke): seed <resource>` — smoke fixture + `SMOKE_KINDS` entry.

Tooling and refactors that unblock a wave land as their own `chore`/`docs`/
`test` commits, never bundled into a feature commit.

## Identity decision tree

Almost none of the remaining resources have a `tags` field. Pick the identity
carrier in this order:

1. **`tags` field** → `iac:<resources>:<key>` tag (dashboards pattern).
2. **Natural unique key the API enforces** (e.g. `code_name`, warehouse view
   `name`) → use it directly as the key; hash marker still needs a home
   (description if present, else a state-comparison diff without hash
   short-circuit).
3. **Free-text field the API round-trips** (`description`, `content`) →
   trailing HTML-comment marker (endpoints pattern).
4. **None of the above** → design per-resource before starting; record the
   decision here. Candidates: annotations, alerts, subscriptions, view links,
   error-tracking rules.

## Phase 0 — loop infrastructure

- [x] `docs: refresh resources.md against 2026-07-23 prod spec` — add rows for
      API surface that did not exist at the 2026-05-13 refresh: logs
      (views / alerts / metric rules / sampling rules), error tracking
      bypass rules + spike detection, LLM analytics (score definitions,
      evaluations, review queues, provider keys), vision scanners, data
      catalog metrics, tracing views, signals scout configs, pulse brief
      configs, customer profile configs / journeys, accounts & relationship
      definitions, datasets, tasks, product tours moved out of beta, etc.
- [x] `docs: add parity plan` — this file.
- [x] `skill(add-resource): document codegen-filter step, smoke fixture step,
      and the identity decision tree` — the skill currently omits
      `openapi-filter.yaml`/`pnpm codegen` and the smoke seed, both required
      for every resource.
- [x] `test(smoke): table-driven seed registry` — smoke.sh currently hardcodes
      one env var + fixture + cleanup arg per resource; with ~25 resources
      incoming, derive seeded kinds from a fixture registry so a new resource
      is one fixture file + one entry.
- [x] `fix(spec): migrate to current prod spec` — a plain codegen refresh is
      blocked: since the last regeneration the spec moved endpoints from the
      `environments/` router to `projects/` (operationIds renamed), renamed
      write schemas (`PatchedDashboard` → `PatchedPatchedDashboardOpenApi`,
      `PatchedExperiment` → `PatchedExperimentWrite`), and reduced the
      experiment list serializer to `PaginatedExperimentBasicList`. One PR:
      update `openapi-filter.yaml`, regenerate `api.d.ts`, migrate the
      endpoint / dashboard / experiment clients, verify with live smoke.
      Hard prerequisite for every subsequent codegen commit.
- [x] `feat(action): pull codegen` — discovered during Phase 0: actions was
      the only resource without pull support, breaking `pull --kind actions`
      and the smoke gate.
- [x] `feat(apply): --kind scoping for plan and prune` — discovered in Wave 1:
      `apply --prune` has no kind filter, so on a shared project a prune pass
      deletes every orphan of every kind (a global prune against the shared
      dev project would have swept ~500 rows belonging to other sessions).
      Add `--kind` to `apply` (mirroring `pull --kind`) so scoped prune is
      expressible; until then `--prune` is unsafe outside throwaway projects.
- [x] `fix(dashboard): persist tiles via insight linkage` — discovered during
      Phase 0: the server made `Dashboard.tiles` read-only, so inline tile
      writes were silently ignored. Insight tiles now persist via the
      insight's `dashboards` field (its designated replacement
      `dashboard_tiles` is read-only upstream — no API path for insight-tile
      layout/color, so those fields left the SDK; text tiles keep full
      fidelity via the tile endpoints; dashboards gained `insightLayout`).
      Upstream gap worth a posthog issue: the deprecation message points at
      a read-only field.

## Wave 1 — product config, identity carrier exists

High-value resources whose identity story is already solved by an existing
pattern.

- [x] **Surveys** — `projects/{id}/surveys`. Description marker. Lifecycle
      endpoints (`launch`, `stop`) — declarative `status` like experiments.
      References feature flags (`linked_flag`, `targeting_flag`): resolve by
      key at execute time, exclude ids from hash. Scope `survey:read/write`.
- [x] **Early access features** — `projects/{id}/early_access_feature`.
      Description marker. References a feature flag; `stage` transitions.
- [ ] **Insight variables** — `environments/{id}/insight_variables`.
      ⛔ **Deferred, blocked on upstream.** No field can carry an ownership
      marker: `code_name` is read-only (server-slugified from `name`), and
      `description`/`tags`/`metadata` are silently dropped by the create
      serializer (live-verified). Without a marker the CLI cannot distinguish
      managed from hand-built variables — natural-key-as-ownership would let
      apply adopt or prune hand-built rows, violating the safety invariant.
      Revisit if PostHog round-trips a metadata field, or if we accept an
      `iac_`-prefixed `code_name` namespace (user-visible in HogQL as
      `{variables.iac_*}`) as the marker.
- [x] **Dashboard templates** — `projects/{id}/dashboard_templates`. Has
      `tags` — plain dashboards pattern. Shipped (#86): `team`-scope only;
      template tiles are an inline passthrough bag (upstream serializer
      schema omits tiles/variables/dashboard_filters but they round-trip);
      soft-delete via PATCH; needs its own `dashboard_template:*` API scope.
- [x] **Session recording playlists** — `projects/{id}/session_recording_playlists`.
      Description marker. Filter-based (dynamic) playlists only; pinned-recording
      (static) membership is runtime data, same treatment as static cohorts.
      Shipped (#87): addressed by `short_id`; updates must resend `filters`;
      soft-delete via PATCH (DELETE → 405); synthetic/collection rows skipped.
- [ ] **Data color themes** — `environments/{id}/data_color_themes`.
      ⛔ **Deferred.** Only possible identity carrier is a marker embedded in
      `name`, which is the visible label in the theme picker (UI pollution on
      a cosmetic resource), and `name` is not unique-enforced so it can't be
      a bare natural key either (live-verified). Stays 🟡 (referenced by
      `dataColorThemeKey`, unsynced) until a cleaner carrier appears.
- [x] **Hog functions** — `environments/{id}/hog_functions`. Shipped (#89).
      Description marker. Establishes the secrets convention:
      `secret("ENV_VAR")` — value from env at create/rotation, never in
      files, excluded from hash; explicit `rotate` token forces re-send.
      Template-based only (custom raw hog deferred); templateId drift errors
      loudly; soft-delete via PATCH.
- [x] **Hog flows** — `environments/{id}/hog_flows`. Shipped (#90).
      Description marker. Writable model is `actions`+`edges` (top-level
      `trigger` is a derived read-only view); node ids are author-controlled;
      order preserved; validation enforces one trigger + edge integrity.
- [x] **Messaging templates** — `environments/{id}/messaging_templates`.
      Shipped (#91). Description marker; `content.email` passthrough bag;
      DELETE 405s despite an advertised destroy op → soft-delete via PATCH;
      no dedicated scope — rides `hog_flow:write`.
- [x] **Product tours** — `projects/{id}/product_tours`. Shipped (#92).
      Description marker; lifecycle is directly-writable schedule fields
      (no launch/stop endpoints, no status abstraction); draft workflow and
      server-managed targeting flags left read-only; real DELETE.

**Wave 1 complete: 8 shipped, 2 deferred (insight variables, data color
themes — both blocked on identity carriers, see above).**

Retrospective lessons now baked into the guidance below:
- The description marker is the *default* identity carrier (6 of 8 shipped
  used it; only 2 had `tags`). Wave 2+ should assume marker-or-composite.
- Generated types are a floor, not a contract: 3 of 8 resources had the
  OpenAPI schema omit writable fields that round-trip at runtime. Always
  live-probe the create→GET round-trip before designing the hash.
- Delete verb variance is unguessable from the schema (PATCH-soft-delete
  with DELETE→403 or 405 vs real DELETE→204, distribution roughly 50/50) —
  probe it live per resource.
- Nested blobs accumulate server-computed noise (bytecode, timestamps,
  order fields) — every marker resource with a nested blob needed a
  canonical strip before hashing.
- The secrets convention (env-ref `secret("VAR")`, hash-excluded,
  create-only + rotate token) established in #89 is the standard for all
  masked-field resources (Wave 3 warehouse/batch exports).
- `pull --all-rows` tags pre-existing rows (that's its job) — on a shared
  project, isolate the kind or expect to restore collateral.

## Wave 2 — identity design required

No `tags`, no free-text field, or ordering semantics. Each needs a short
identity design recorded here before its codegen commit.

- [ ] **Annotations** — `projects/{id}/annotations`. ✅ Investigated,
      buildable: `content` round-trips a trailing marker (live-verified);
      soft-delete via PATCH; optional dashboard/insight refs resolve by key.
- [ ] **Alerts (insight alerts)** — `environments/{id}/alerts`.
      ⛔ **Deferred.** Only marker home is `name`, which appears in
      notification emails and Slack subject lines — a marker there leaks
      into every "Alert 'X' triggered" message. A markerless composite key
      `(insight, name)` cannot satisfy the safety invariant (would adopt
      hand-built alerts). Revisit if the API grows a description field.
- [ ] **Subscriptions** — `environments/{id}/subscriptions`. ✅ Investigated,
      buildable: `title` round-trips a marker (low UI prominence, absent
      from delivery payloads); soft-delete via PATCH; insight-or-dashboard
      ref resolves by key; Slack `integration_id` is environment-specific.
- [ ] **Error tracking assignment rules** — `environments/{id}/error_tracking/assignment_rules`.
- [ ] **Error tracking grouping rules** — has `description` → marker.
- [ ] **Error tracking suppression rules**.
- [ ] **Error tracking bypass rules** — new since May.
- [x] **Error tracking settings** — singleton, shipped (#93). Field-scoped
      PATCH via `retrieve_settings`/`update_settings`.
- [ ] **Spike detection config** — 🚫 **Excluded.** Its write endpoint
      rejects personal API key access entirely (no write path for CLI
      auth); GET schema also declares an array but returns an object.
      Upstream issue candidate.
- [ ] **Logs views** — `environments/{id}/logs/views`. Has `name`.
- [ ] **Logs alerts** — `environments/{id}/logs/alerts`
      (`LogsAlertConfiguration`). Destinations reference integrations —
      possibly partial support (webhook/email only) at first.
- [ ] **Logs metric rules** — `environments/{id}/logs/metric_rules`.
- [ ] **Logs sampling rules** — `environments/{id}/logs/sampling_rules`.
      Server-side `order` matters — diff must be order-aware (first
      order-sensitive collection; may need a small pipeline extension).

## Wave 3 — warehouse & pipelines (secrets involved)

Declarative fit is good but create payloads can carry credentials the API
never echoes back. Convention to establish in the first of these: secret
fields come from env-var references in the spec, are excluded from hash, and
are only sent on create (or when explicitly rotated).

- [ ] **Warehouse saved queries** — `environments/{id}/warehouse_saved_queries`.
      Natural key: `name` (it is the view name in HogQL). Has `description`
      for the hash marker. Materialization (`sync_frequency`) declarative;
      `run`/`cancel` stay imperative.
- [ ] **Warehouse tables** — `environments/{id}/warehouse_tables`. Natural
      key: `name`. External-source credentials → secret convention above.
- [ ] **Warehouse view links (joins)** — `environments/{id}/warehouse_view_links`.
      Composite natural key `(source_table, joining_table, field_name)`.
- [ ] **Batch exports** — `environments/{id}/batch_exports`. Destination
      configs hold secrets (masked on read) → secret convention. `pause`/
      `unpause` → declarative `paused` field.
- [ ] **Group types** — `projects/{id}/groups_types`. PATCH-only metadata
      (display names, default columns) keyed by `group_type_index` — a
      fixed-slot singleton family; needs a minor variant of the singleton
      pattern.
- [ ] **Notebooks** — `projects/{id}/notebooks`. Content is a rich-text JSON
      doc; IaC value unclear (runbooks-as-code?). Last in the wave; drop if
      it stays unclear.

## Watchlist — new products, API may still be moving

Revisit once the wave above ships; add to a wave when the API looks stable
(two consecutive schema refreshes without breaking shape changes).

Custom property definitions & sources · data catalog metrics · LLM analytics
score definitions / evaluations · vision scanners · signals scout configs ·
taggers · pulse brief configs · tracing views · quick filters · links ·
loops · mcp_server_installations · customer profile configs.

## Upstream issues worth filing against PostHog/posthog

Live-verified API gaps found during this campaign; each blocks or constrains
an IaC capability. Collected here for the maintainer to file.

1. **Dashboard tile writes**: `Dashboard.tiles` and the insight-side
   `dashboard_tiles` are read-only, while the only working insight↔dashboard
   link field (`insights.dashboards`) is deprecated *in favor of the
   read-only field*. There is no API path at all for insight-tile
   layout/color.
2. **Insight variables**: `code_name` is not settable (server-slugified from
   `name`), and unknown create fields (`description`, `tags`, `metadata`)
   are silently dropped instead of rejected — leaving no round-tripped
   field for external tools to carry identity metadata.
3. **Spike detection config**: the `update_config` endpoint rejects
   personal API key access on PATCH and POST, so the resource cannot be
   managed by any API-key-authenticated tool; its GET schema also declares
   an array response but returns a single object.
4. **Insight alerts**: no description/metadata field — the only free-text
   field is `name`, which surfaces in notification subject lines, so
   external tools have no clean place for identity metadata.

## Excluded (with reasons)

- **Runtime / user-generated data** — events, persons, sessions, recordings,
  comments, tickets, tasks, conversations, user interviews, elements,
  uploaded media, dataset items, spike events, alert events. Not declarative
  state.
- **UI state** — file system / shortcuts / persisted folders, desktop file
  system, notebook shortcuts, web analytics achievements.
- **Secret material** — project secret API keys, LLM provider keys, identity
  provider configs. Secrets don't belong in definition files; env-var
  indirection inside a resource (Wave 3) is as far as we go.
- **Org administration** — members, invites, domains, roles, approval
  policies, announcements. Different blast radius, different owners; out of
  scope per the original charter.
- **Imperative operations** — scheduled changes, managed migrations, batch
  export backfills, change requests. Point-in-time actions, not desired
  state. Scheduled changes additionally *conflict* with apply (a scheduled
  flag change will fight the declared state) — worth a docs warning under
  feature flags instead.
- **Agent/internal platforms** — agent applications, sandbox environments &
  custom images, streamlit apps, stamphog, visual review, wizard sessions,
  live debugger breakpoints. Internal or session-bound tooling.
- **Web experiments** — edited via the toolbar against live DOM; authoring
  them in TypeScript has no workflow fit today.

## Definition of done (per resource)

Matches the add-resource skill verification flow: typecheck; examples load
under `apply --dry-run`; apply → re-apply no-op (hash projection correct);
edit → single update; orphan listing; hand-built row untouched (safety
invariant); smoke seed passes; matrix row flipped; scopes documented.
