import type { ApplyContext, SingletonResourceModule } from "../types.js";
import type { ProjectSettings } from "./sdk.js";
import {
  diffProjectSettings,
  displayProjectSettings,
  displayProjectSettingsFromServer,
  looksLikeProjectSettings,
  runProjectSettingsOp,
  validateProjectSettings,
} from "./pipeline.js";
import { getProjectSettings, type ServerProjectSettings } from "./client.js";
import { renderToFile } from "./codegen.js";

export { projectSettings } from "./sdk.js";
export type { ProjectSettings } from "./sdk.js";

export const projectSettingsResource: SingletonResourceModule<ProjectSettings, ServerProjectSettings> = {
  kind: "singleton",
  name: "project-settings",
  displayName: "project settings",

  isSpec: looksLikeProjectSettings,

  fetchOne: getProjectSettings,
  diffFields: diffProjectSettings,

  validate: (specs) => validateProjectSettings(specs),
  executeOp: runProjectSettingsOp,

  displaySpec: (spec, _ctx: ApplyContext) => displayProjectSettings(spec),
  displayServer: (server, _ctx: ApplyContext) => displayProjectSettingsFromServer(server),

  renderToFile,
};
