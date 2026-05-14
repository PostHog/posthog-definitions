import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { Cohort } from "./sdk.js";
import {
  COHORT_IDENTITY_PREFIX,
  cohortHash,
  cohortHashFromServer,
  cohortKeyFromServer,
  displayCohort,
  displayCohortFromServer,
  looksLikeCohort,
  pruneCohort,
  runCohortOp,
  validateCohorts,
} from "./pipeline.js";
import { listManagedCohorts, type ServerCohort } from "./client.js";

export { cohort } from "./sdk.js";
export type { Cohort, CohortFilters, CohortType } from "./sdk.js";

export const cohortResource: CollectionResourceModule<Cohort, ServerCohort> = {
  kind: "collection",
  name: "cohorts",
  displayName: "cohort",
  identityPrefix: COHORT_IDENTITY_PREFIX,

  isSpec: looksLikeCohort,
  specKey: (spec) => spec.key,

  list: listManagedCohorts,
  keyFromServer: (server) => cohortKeyFromServer(server),
  hashFromServer: (server) => cohortHashFromServer(server),

  hash: cohortHash,
  validate: (specs) => validateCohorts(specs),
  executeOp: runCohortOp,
  prune: pruneCohort,

  displaySpec: (spec, _ctx: ApplyContext) => displayCohort(spec),
  displayServer: (server, _ctx: ApplyContext) => displayCohortFromServer(server),
};
