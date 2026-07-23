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
# ---------------------------------------------------------------------------
# Adding a resource is one fixture file plus one registry entry:
#
#   1. Drop a template at scripts/smoke-fixtures/<kind>.ts.tmpl. Use
#      @@<TOKEN>@@ placeholders where a per-run key belongs (they are
#      substituted from the registry below); cross-reference another
#      fixture by its fixed on-disk path (e.g. ../insights/smoke-insight.js).
#   2. Add one row to SMOKE_RESOURCES: "<kind>|<key-prefix>|<TOKEN>|<cleanup-flag>".
#
# The seed dir, the fixture filename (<key-prefix>.ts), the --kind list, the
# key substitutions, and the smoke-cleanup arguments are all derived from
# that row — there is nothing else to touch. Order the rows dependents-first;
# cleanup deletes in registry order (a dependent must drop before its deps).
# ---------------------------------------------------------------------------
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
FIXTURES_DIR="$REPO_ROOT/scripts/smoke-fixtures"

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

# ---- Resource registry --------------------------------------------------
# One row per seeded resource: "<kind>|<key-prefix>|<TOKEN>|<cleanup-flag>".
#   kind         seed dir + --kind slug (plural, matches src/resources name)
#   key-prefix   fixture filename and key stem; the key is <key-prefix>-${STAMP}
#   TOKEN        the @@TOKEN@@ placeholder substituted in the fixture template
#   cleanup-flag the --<flag>=<key> argument passed to smoke-cleanup.ts
# Ordered dependents-first: cleanup drops rows in this order so a resource
# never outlives something that references it.
SMOKE_RESOURCES=(
  "experiments|smoke-experiment|EXPERIMENT_KEY|experiment"
  "feature-flags|smoke-flag|FLAG_KEY|feature-flag"
  "experiment-holdouts|smoke-holdout|HOLDOUT_KEY|experiment-holdout"
  "experiment-saved-metrics|smoke-metric|SAVED_METRIC_KEY|experiment-saved-metric"
  "dashboards|smoke-dashboard|DASHBOARD_KEY|dashboard"
  "insights|smoke-insight|INSIGHT_KEY|insight"
  "event-definitions|smoke-event|EVENT_DEFINITION_KEY|event-definition"
  "actions|smoke-action|ACTION_KEY|action"
  "property-groups|smoke-pg|PROPERTY_GROUP_KEY|property-group"
  "cohorts|smoke-cohort|COHORT_KEY|cohort"
  "endpoints|smoke-endpoint|ENDPOINT_KEY|endpoint"
)

# The per-run key for a given kind slug (e.g. key_for feature-flags).
key_for() {
  local want="$1" row kind prefix
  for row in "${SMOKE_RESOURCES[@]}"; do
    IFS='|' read -r kind prefix _ _ <<<"$row"
    if [[ "$kind" == "$want" ]]; then
      echo "${prefix}-${STAMP}"
      return 0
    fi
  done
  echo "smoke: no registry entry for kind '$want'" >&2
  return 1
}

# Resource kinds we'll seed and pull, derived from the registry. Used both in
# --kind for pull and in the no-op assertion's filter (we don't want unrelated
# kinds dirtying it).
SMOKE_KINDS=""
for row in "${SMOKE_RESOURCES[@]}"; do
  IFS='|' read -r kind _ _ _ <<<"$row"
  SMOKE_KINDS="${SMOKE_KINDS:+$SMOKE_KINDS,}$kind"
done

# sed program that maps every @@TOKEN@@ to its per-run key. Keys are
# [a-z0-9-] only, so no sed-metacharacter escaping is needed.
SUBST_SED="$WORK_DIR/subst.sed"
: >"$SUBST_SED"
for row in "${SMOKE_RESOURCES[@]}"; do
  IFS='|' read -r _ prefix token _ <<<"$row"
  printf 's/@@%s@@/%s/g\n' "$token" "${prefix}-${STAMP}" >>"$SUBST_SED"
done

cleanup() {
  echo
  echo "smoke: deleting smoke-created server rows"
  local args=()
  for row in "${SMOKE_RESOURCES[@]}"; do
    IFS='|' read -r _ prefix _ flag <<<"$row"
    args+=("--${flag}=${prefix}-${STAMP}")
  done
  pnpm --silent exec tsx "$REPO_ROOT/scripts/smoke-cleanup.ts" "${args[@]}" \
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

# Render every fixture template into its seed dir. The filename is
# <key-prefix>.ts so cross-fixture imports (which reference that fixed path)
# resolve.
for row in "${SMOKE_RESOURCES[@]}"; do
  IFS='|' read -r kind prefix _ _ <<<"$row"
  template="$FIXTURES_DIR/$kind.ts.tmpl"
  if [[ ! -f "$template" ]]; then
    echo "smoke: missing fixture template $template" >&2
    exit 1
  fi
  mkdir -p "$SEED_DIR/$kind"
  sed -f "$SUBST_SED" "$template" >"$SEED_DIR/$kind/$prefix.ts"
done

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
FLAG_KEY="$(key_for feature-flags)"
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
