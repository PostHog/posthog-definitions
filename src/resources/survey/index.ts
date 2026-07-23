import type { ApplyContext, CollectionResourceModule } from "../types.js";
import { featureFlagResource } from "../feature-flag/index.js";
import type { Survey } from "./sdk.js";
import {
  displaySurvey,
  displaySurveyFromServer,
  SURVEY_IDENTITY_PREFIX,
  surveyHash,
  surveyHashFromServer,
  surveyKeyFromServer,
  looksLikeSurvey,
  pruneSurvey,
  runSurveyOp,
  validateSurveys,
} from "./pipeline.js";
import { getSurvey, listSurveys, listManagedSurveys, type ServerSurvey } from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { survey } from "./sdk.js";
export type {
  Survey,
  SurveyType,
  SurveyStatus,
  SurveyQuestion,
  SurveyConditions,
  SurveyAppearance,
  OpenQuestion,
  LinkQuestion,
  RatingQuestion,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
} from "./sdk.js";

function flagKeyByServerId(ctx: ApplyContext): Map<number, string> {
  const inv = new Map<number, string>();
  for (const [key, id] of ctx.featureFlagIdByKey) inv.set(id, key);
  return inv;
}

export const surveyResource: CollectionResourceModule<Survey, ServerSurvey> = {
  kind: "collection",
  name: "surveys",
  displayName: "survey",
  identityPrefix: SURVEY_IDENTITY_PREFIX,
  dependsOn: [featureFlagResource],

  isSpec: looksLikeSurvey,
  specKey: (spec) => spec.key,

  list: listManagedSurveys,
  keyFromServer: (server) => surveyKeyFromServer(server),
  hashFromServer: (server) => surveyHashFromServer(server),

  hash: surveyHash,
  validate: (specs, state) => validateSurveys(specs, state),
  executeOp: runSurveyOp,
  prune: pruneSurvey,

  displaySpec: (spec, _ctx: ApplyContext) => displaySurvey(spec),
  displayServer: (server, ctx: ApplyContext) => displaySurveyFromServer(server, flagKeyByServerId(ctx)),

  listAll: listSurveys,
  getById: (config, id, options) => getSurvey(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
