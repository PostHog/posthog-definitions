# Example dashboards

Used to smoke-test the `apply` loop against a dev PostHog project.

From the repo root, after setting up `.envrc`:

```
pnpm dev apply --dir examples/posthog --dry-run
pnpm dev apply --dir examples/posthog
```

The growth dashboard defines two `trends` insights (`weekly-signups`,
`weekly-active`) and a text tile, all tagged `iac:dashboards:growth` /
`iac:insights:<key>` on the server. Re-running `apply` should report
everything as `unchanged`; edit a name or query and the next run should
report exactly one `update`.
