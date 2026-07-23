#!/usr/bin/env bash
# Smoke test for the posthog-definitions CLI.
#
# Round-trips the apply/pull pipeline against a real PostHog project. The
# seed covers one of each collection resource with the cross-resource
# dependency graph fully wired up:
#
#   insight                  ← dashboard
#   property-group           ← event-definition
#   feature-flag             ↘
#   experiment-holdout       → experiment
#   experiment-saved-metric  ↗
#   cohort   (independent)
#   endpoint (independent)
#
# project-settings (singleton) is intentionally skipped: applying it would
# mutate a project-wide row we can't restore.
#
# Steps:
#   1. Seed:    write the fixture and apply it.
#   2. Pull:    pull the same kinds back into a scratch dir.
#   3. Verify:  apply --dry-run --prune on the pulled tree → must be a no-op.
#   4. Edit:    flip one definition in the pulled tree.
#   5. Apply:   re-apply the pulled tree (expect exactly one update).
#   6. Verify:  dry-run again, must be a no-op.
#   7. Cleanup: delete every smoke-created server row (script trap).
#
# Requires POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID and `jq`.
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "smoke: jq is required but not installed" >&2
  exit 1
fi
if [[ -z "${POSTHOG_PERSONAL_API_KEY:-}" || -z "${POSTHOG_PROJECT_ID:-}" ]]; then
  echo "smoke: POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID must be set" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="pnpm --silent exec tsx $REPO_ROOT/src/cli/index.ts"

# Work dirs live inside the repo so that files referencing `@posthog/definitions`
# resolve via the workspace's own node_modules (the package self-imports through
# its own exports).
WORK_DIR="$REPO_ROOT/.smoke-work"
SEED_DIR="$WORK_DIR/seed"
PULL_DIR="$WORK_DIR/pull"
rm -rf "$WORK_DIR"
mkdir -p "$SEED_DIR" "$PULL_DIR"

# Unique key suffix per run. Reruns don't collide because of ${STAMP}; the
# trap cleanup nukes the rows we created.
STAMP="$(date +%s)-$$"
INSIGHT_KEY="smoke-insight-${STAMP}"
DASHBOARD_KEY="smoke-dashboard-${STAMP}"
PROPERTY_GROUP_KEY="smoke-pg-${STAMP}"
EVENT_DEFINITION_KEY="smoke-event-${STAMP}"
ACTION_KEY="smoke-action-${STAMP}"
FLAG_KEY="smoke-flag-${STAMP}"
HOLDOUT_KEY="smoke-holdout-${STAMP}"
SAVED_METRIC_KEY="smoke-metric-${STAMP}"
EXPERIMENT_KEY="smoke-experiment-${STAMP}"
COHORT_KEY="smoke-cohort-${STAMP}"
ENDPOINT_KEY="smoke-endpoint-${STAMP}"
ANNOTATION_KEY="smoke-annotation-${STAMP}"

# Names that round-trip cleanly through pull's slug-from-name. We use the
# event-definition `name` as both the spec key AND the on-the-wire event
# name; the suffix keeps event catalogues uncluttered.
EVENT_NAME="${EVENT_DEFINITION_KEY}"

# Resource kinds we'll seed and pull. Used both in --kind for pull and in
# the no-op assertion's filter (we don't want unrelated kinds dirtying it).
SMOKE_KINDS="insights,dashboards,property-groups,event-definitions,actions,feature-flags,experiment-holdouts,experiment-saved-metrics,experiments,cohorts,endpoints,annotations"

cleanup() {
  echo
  echo "smoke: deleting smoke-created server rows"
  pnpm --silent exec tsx "$REPO_ROOT/scripts/smoke-cleanup.ts" \
    "--experiment=${EXPERIMENT_KEY}" \
    "--feature-flag=${FLAG_KEY}" \
    "--experiment-holdout=${HOLDOUT_KEY}" \
    "--experiment-saved-metric=${SAVED_METRIC_KEY}" \
    "--dashboard=${DASHBOARD_KEY}" \
    "--insight=${INSIGHT_KEY}" \
    "--event-definition=${EVENT_DEFINITION_KEY}" \
    "--action=${ACTION_KEY}" \
    "--property-group=${PROPERTY_GROUP_KEY}" \
    "--cohort=${COHORT_KEY}" \
    "--endpoint=${ENDPOINT_KEY}" \
    "--annotation=${ANNOTATION_KEY}" \
    || echo "smoke: cleanup hit an error (continuing)"
  echo "smoke: removing workdir $WORK_DIR"
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

echo "=== 0. Rebuild dist (self-import resolves through exports) ==="
pnpm --silent build >/dev/null

step() {
  echo
  echo "=== $* ==="
}

# Expect dry-run apply to find no work to do for the smoke's kinds. We pass
# --prune so orphans surface too — that catches a pull that silently missed
# rows. Scoped to SMOKE_KINDS to ignore leftover iac state in other kinds.
expect_no_changes() {
  local dir="$1"
  local output
  output=$($CLI apply --dir "$dir" --dry-run --prune --json)
  # Build a `select($kind == X or ...)` filter dynamically from SMOKE_KINDS.
  local sel
  sel=$(echo "$SMOKE_KINDS" \
    | tr ',' '\n' \
    | awk 'NR>1{printf " or "} {printf ".resource == \"%s\"", $0}')
  local kinds_filter=".plan.byResource | map(select($sel))"
  local create update orphans
  create=$(echo  "$output" | jq "[$kinds_filter | .[].create]   | add // 0")
  update=$(echo  "$output" | jq "[$kinds_filter | .[].update]   | add // 0")
  orphans=$(echo "$output" | jq "[$kinds_filter | .[].orphans]  | add // 0")
  if [[ "$create" != "0" || "$update" != "0" || "$orphans" != "0" ]]; then
    echo "smoke: expected no changes in $dir, got create=$create update=$update orphans=$orphans" >&2
    echo "$output" >&2
    exit 1
  fi
  echo "smoke: dry-run on $dir (scoped to smoke kinds, with prune) is a no-op ✓"
}

assert_pull_wrote_at_least() {
  local pull_json_file="$1"
  local min="$2"
  local written
  written=$(jq '.totals.written // 0' "$pull_json_file")
  if (( written < min )); then
    echo "smoke: expected pull to write at least $min files, got $written" >&2
    cat "$pull_json_file" >&2
    exit 1
  fi
}

# ---- 1. Seed ------------------------------------------------------------
step "1. Seed one definition per kind (suffix=${STAMP})"

mkdir -p \
  "$SEED_DIR/insights" \
  "$SEED_DIR/dashboards" \
  "$SEED_DIR/property-groups" \
  "$SEED_DIR/event-definitions" \
  "$SEED_DIR/actions" \
  "$SEED_DIR/feature-flags" \
  "$SEED_DIR/experiment-holdouts" \
  "$SEED_DIR/experiment-saved-metrics" \
  "$SEED_DIR/experiments" \
  "$SEED_DIR/cohorts" \
  "$SEED_DIR/endpoints" \
  "$SEED_DIR/annotations"

# Insight — referenced by the dashboard tile below.
cat > "$SEED_DIR/insights/smoke-insight.ts" <<EOF
import { hogql, insight } from "@posthog/definitions";
export default insight({
  key: "${INSIGHT_KEY}",
  name: "${INSIGHT_KEY}",
  query: hogql("SELECT 1 AS smoke"),
});
EOF

# Dashboard — references the insight by import.
cat > "$SEED_DIR/dashboards/smoke-dashboard.ts" <<EOF
import { dashboard, text } from "@posthog/definitions";
import smokeInsight from "../insights/smoke-insight.js";
export default dashboard({
  key: "${DASHBOARD_KEY}",
  name: "${DASHBOARD_KEY}",
  description: "Smoke fixture dashboard",
  tiles: [
    { insight: smokeInsight, layout: { x: 0, y: 0, w: 6, h: 4 } },
    text({ body: "smoke note", layout: { x: 6, y: 0, w: 6, h: 4 } }),
  ],
});
EOF

# Property group — referenced by the event-definition.
cat > "$SEED_DIR/property-groups/smoke-pg.ts" <<EOF
import { propertyGroup } from "@posthog/definitions";
export default propertyGroup({
  key: "${PROPERTY_GROUP_KEY}",
  description: "Smoke fixture property group",
  properties: {
    plan: { type: "String", required: true, description: "Subscription plan" },
    seats: { type: "Numeric" },
  },
});
EOF

# Event definition — links to the property group above.
cat > "$SEED_DIR/event-definitions/smoke-event.ts" <<EOF
import { eventDefinition } from "@posthog/definitions";
import smokePg from "../property-groups/smoke-pg.js";
export default eventDefinition({
  key: "${EVENT_DEFINITION_KEY}",
  name: "${EVENT_NAME}",
  description: "Smoke fixture event",
  propertyGroups: [smokePg],
});
EOF

# Feature flag — referenced by the experiment.
cat > "$SEED_DIR/feature-flags/smoke-flag.ts" <<EOF
import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "${FLAG_KEY}",
  name: "${FLAG_KEY}",
  active: true,
  filters: {
    groups: [{ properties: [], rollout_percentage: 100 }],
    // Multivariate — experiment validation requires control + ≥1 test.
    multivariate: {
      variants: [
        { key: "control", rollout_percentage: 50 },
        { key: "test", rollout_percentage: 50 },
      ],
    },
  },
});
EOF

# Experiment holdout — referenced by the experiment.
cat > "$SEED_DIR/experiment-holdouts/smoke-holdout.ts" <<EOF
import { experimentHoldout } from "@posthog/definitions";
export default experimentHoldout({
  key: "${HOLDOUT_KEY}",
  name: "${HOLDOUT_KEY}",
  filters: [{ properties: [], rollout_percentage: 10 }],
});
EOF

# Experiment saved metric — referenced by the experiment.
cat > "$SEED_DIR/experiment-saved-metrics/smoke-metric.ts" <<EOF
import { experimentSavedMetric } from "@posthog/definitions";
export default experimentSavedMetric({
  key: "${SAVED_METRIC_KEY}",
  name: "${SAVED_METRIC_KEY}",
  query: {
    kind: "ExperimentMetric",
    metric_type: "mean",
    source: { kind: "EventsNode", event: "${EVENT_NAME}" },
  },
});
EOF

# Experiment — pulls in flag + holdout + saved metric.
cat > "$SEED_DIR/experiments/smoke-experiment.ts" <<EOF
import { experiment } from "@posthog/definitions";
import smokeFlag from "../feature-flags/smoke-flag.js";
import smokeHoldout from "../experiment-holdouts/smoke-holdout.js";
import smokeMetric from "../experiment-saved-metrics/smoke-metric.js";
export default experiment({
  key: "${EXPERIMENT_KEY}",
  name: "${EXPERIMENT_KEY}",
  featureFlag: smokeFlag,
  holdout: smokeHoldout,
  primarySavedMetrics: [smokeMetric],
});
EOF

# Cohort — independent.
cat > "$SEED_DIR/cohorts/smoke-cohort.ts" <<EOF
import { cohort } from "@posthog/definitions";
export default cohort({
  key: "${COHORT_KEY}",
  name: "${COHORT_KEY}",
  filters: {
    properties: {
      type: "OR",
      values: [
        {
          type: "OR",
          values: [
            { key: "email", value: "smoke@example.com", operator: "exact", type: "person" },
          ],
        },
      ],
    },
  },
});
EOF

# Action — independent.
cat > "$SEED_DIR/actions/smoke-action.ts" <<EOF
import { action } from "@posthog/definitions";
export default action({
  key: "${ACTION_KEY}",
  name: "${ACTION_KEY}",
  description: "Smoke fixture action",
  steps: [
    { event: "${EVENT_NAME}" },
  ],
});
EOF

# Endpoint — independent.
cat > "$SEED_DIR/endpoints/smoke-endpoint.ts" <<EOF
import { endpoint } from "@posthog/definitions";
export default endpoint({
  key: "${ENDPOINT_KEY}",
  name: "${ENDPOINT_KEY}",
  query: { kind: "HogQLQuery", query: "select 1 as smoke" },
});
EOF

# Annotation — independent. Project-scoped hidden deploy marker. Content is the
# key itself: annotations have no `name`, so pull derives the spec key by
# slugifying `content` — keeping content == key makes the pulled key round-trip
# (so the trap cleanup, which deletes by key, finds the row).
cat > "$SEED_DIR/annotations/smoke-annotation.ts" <<EOF
import { annotation } from "@posthog/definitions";
export default annotation({
  key: "${ANNOTATION_KEY}",
  content: "${ANNOTATION_KEY}",
  dateMarker: "2026-08-01T00:00:00Z",
  scope: "project",
  hidden: true,
});
EOF

# Apply the seed (no --prune so unrelated iac-tagged rows stay intact).
$CLI apply --dir "$SEED_DIR" --json | jq '{totals, byResource}'

# ---- 2. Pull ------------------------------------------------------------
step "2. Pull (scoped to the smoke's resource kinds)"
PULL_JSON="$WORK_DIR/pull.json"
$CLI pull \
  --dir "$PULL_DIR" \
  --kind "$SMOKE_KINDS" \
  --all-rows \
  --json > "$PULL_JSON"
jq '{totals, byResource: (.byResource | map_values({written: (.written | length), tagged}))}' "$PULL_JSON"
assert_pull_wrote_at_least "$PULL_JSON" 10

# ---- 3. Verify pull = server state -------------------------------------
step "3. apply --dry-run --prune on the pulled tree (must be a no-op)"
expect_no_changes "$PULL_DIR"

# ---- 4. Edit ------------------------------------------------------------
# Edit happens on the PULL tree — pull's tag-back stamps the server with
# hashes derived from the pulled spec, which diverge from seed-spec hashes
# whenever pull writes fields the seed omitted.
PULLED_FLAG_FILE="$PULL_DIR/feature-flags/${FLAG_KEY}.ts"
if [[ ! -f "$PULLED_FLAG_FILE" ]]; then
  echo "smoke: expected pulled flag at $PULLED_FLAG_FILE" >&2
  exit 1
fi
step "4. Edit a definition in the pulled tree (toggle the flag off)"
sed -i '' 's/active: true/active: false/' "$PULLED_FLAG_FILE"
grep -q 'active: false' "$PULLED_FLAG_FILE" || {
  echo "smoke: edit did not land" >&2
  exit 1
}

# ---- 5. Apply the edit --------------------------------------------------
step "5. Apply the edit on the pull tree (expect exactly one update)"
EDIT_JSON="$WORK_DIR/edit.json"
$CLI apply --dir "$PULL_DIR" --json > "$EDIT_JSON"
jq '{totals, byResource}' "$EDIT_JSON"
edit_created=$(jq '.totals.created // 0' "$EDIT_JSON")
edit_updated=$(jq '.totals.updated // 0' "$EDIT_JSON")
if [[ "$edit_created" != "0" || "$edit_updated" != "1" ]]; then
  echo "smoke: expected exactly one update, got created=$edit_created updated=$edit_updated" >&2
  exit 1
fi

# ---- 6. Verify second apply is clean -----------------------------------
step "6. apply --dry-run --prune on the pull tree (must be a no-op)"
expect_no_changes "$PULL_DIR"

echo
echo "smoke: all checks passed ✓"
