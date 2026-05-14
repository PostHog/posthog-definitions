#!/usr/bin/env bash
# Smoke test for the posthog-definitions CLI.
#
# Round-trips the apply/pull pipeline against a real PostHog project:
#
#   1. Reset:    apply empty tree with --prune to wipe iac-managed rows.
#   2. Seed:     write a small set of definitions and apply them.
#   3. Pull:     pull everything back into a scratch dir.
#   4. Verify:   apply --dry-run on the pulled tree → must report no changes.
#   5. Edit:     change a definition.
#   6. Apply:    apply the edit.
#   7. Verify:   apply --dry-run → must report no changes.
#   8. Cleanup:  prune again to leave the project clean.
#
# Requires POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID in the env (or
# direnv-loaded .envrc). Uses jq for JSON parsing.
#
#   ./scripts/smoke.sh
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

# Unique key suffix so reruns don't collide with leftover rows on the server.
# We don't prune — the smoke is read-mostly verification and leaving uniquely-
# keyed rows behind is acceptable for the dev project this runs against.
STAMP="$(date +%s)-$$"
FLAG_KEY="smoke-flag-${STAMP}"
COHORT_KEY="smoke-cohort-${STAMP}"
ENDPOINT_KEY="smoke-endpoint-${STAMP}"

cleanup() {
  echo
  echo "smoke: deleting smoke-created server rows"
  pnpm --silent exec tsx "$REPO_ROOT/scripts/smoke-cleanup.ts" \
    "--flag=${FLAG_KEY:-}" \
    "--cohort=${COHORT_KEY:-}" \
    "--endpoint=${ENDPOINT_KEY:-}" \
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

# Expect dry-run apply to find no work to do for the targeted kinds.
# Pass `--prune` so orphans surface too: that's how we catch a pull that
# silently missed rows present on the server. Scoped to the smoke's kinds
# because the project carries unrelated iac-tagged rows we don't want
# polluting the no-op assertion.
expect_no_changes() {
  local dir="$1"
  local output
  output=$($CLI apply --dir "$dir" --dry-run --prune --json)
  local create update orphans
  # Limit the assertion to the resource kinds the smoke touches; the project
  # has leftover iac state in other kinds that we're not pulling here.
  local kinds_filter='.plan.byResource | map(select(.resource == "feature-flags" or .resource == "cohorts" or .resource == "endpoints"))'
  create=$(echo  "$output" | jq "[$kinds_filter | .[].create]   | add // 0")
  update=$(echo  "$output" | jq "[$kinds_filter | .[].update]   | add // 0")
  orphans=$(echo "$output" | jq "[$kinds_filter | .[].orphans]  | add // 0")
  if [[ "$create" != "0" || "$update" != "0" || "$orphans" != "0" ]]; then
    echo "smoke: expected no changes in $dir, got create=$create update=$update orphans=$orphans" >&2
    echo "$output" >&2
    exit 1
  fi
  echo "smoke: dry-run on $dir (with prune) is a no-op ✓"
}

# Pull JSON exposes write counts under .totals.written; assert it matches.
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
step "1. Seed unique definitions for this run (suffix=${STAMP})"

mkdir -p "$SEED_DIR/feature-flags" "$SEED_DIR/cohorts" "$SEED_DIR/endpoints"

# Names match keys so the slug pull produces from `name` matches the original
# key — that keeps the apply-on-seed round-trip identity-preserving.
cat > "$SEED_DIR/feature-flags/smoke-flag.ts" <<EOF
import { featureFlag } from "@posthog/definitions";
export default featureFlag({
  key: "${FLAG_KEY}",
  name: "${FLAG_KEY}",
  active: true,
  filters: { groups: [{ properties: [], rollout_percentage: 50 }] },
});
EOF

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

cat > "$SEED_DIR/endpoints/smoke-endpoint.ts" <<EOF
import { endpoint } from "@posthog/definitions";
export default endpoint({
  key: "${ENDPOINT_KEY}",
  name: "${ENDPOINT_KEY}",
  query: { kind: "HogQLQuery", query: "select 1 as smoke" },
});
EOF

# Apply the seed (using --dir to scope to JUST the smoke definitions). Without
# --prune so existing iac-tagged rows in the project stay intact.
$CLI apply --dir "$SEED_DIR" --json | jq '{totals, byResource}'

# ---- 2. Pull ------------------------------------------------------------
# Limit pull to the resource kinds the seed touched. Without --kind, pull
# fetches every iac-managed row in the project, which is slow and surfaces
# leftover state from prior runs.
step "2. Pull (scoped to feature-flags, cohorts, endpoints)"
PULL_JSON="$WORK_DIR/pull.json"
$CLI pull \
  --dir "$PULL_DIR" \
  --kind feature-flags,cohorts,endpoints \
  --all-rows \
  --json > "$PULL_JSON"
jq '{totals, byResource: (.byResource | map_values({written: (.written | length), tagged}))}' "$PULL_JSON"
assert_pull_wrote_at_least "$PULL_JSON" 3

# ---- 3. Verify pull = server state -------------------------------------
step "3. apply --dry-run on the pulled tree (must be a no-op)"
expect_no_changes "$PULL_DIR"

# ---- 4. Edit ------------------------------------------------------------
# Edit happens on the PULL tree (not the seed), because pull's tag-back
# stamps the server with hashes derived from the pulled spec — those hashes
# diverge from the seed-spec hashes whenever pull writes fields the seed
# omits (defaults, descriptions, etc.). The pull tree is the canonical
# "what's on the server" view post-step-2.
PULLED_FLAG_FILE="$PULL_DIR/feature-flags/${FLAG_KEY}.ts"
if [[ ! -f "$PULLED_FLAG_FILE" ]]; then
  echo "smoke: expected pulled flag at $PULLED_FLAG_FILE" >&2
  exit 1
fi
step "4. Edit a definition in the pulled tree (toggle the flag off)"
# `sed -i ''` portable form for macOS bsd-sed.
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
step "6. apply --dry-run on the pull tree (must be a no-op after re-apply)"
expect_no_changes "$PULL_DIR"

# Note: no cleanup-prune. The smoke leaves its uniquely-keyed rows in place;
# they're harmless and reruns won't collide thanks to ${STAMP}.

echo
echo "smoke: all checks passed ✓"
