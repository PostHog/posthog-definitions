import type { ApplyContext, SingletonResourceModule } from "../types.js";
import type { ErrorTrackingSettings } from "./sdk.js";
import {
  diffErrorTrackingSettings,
  displayErrorTrackingSettings,
  displayErrorTrackingSettingsFromServer,
  looksLikeErrorTrackingSettings,
  runErrorTrackingSettingsOp,
  validateErrorTrackingSettings,
} from "./pipeline.js";
import { getErrorTrackingSettings, type ServerErrorTrackingSettings } from "./client.js";
import { renderToFile } from "./codegen.js";

export { errorTrackingSettings } from "./sdk.js";
export type { ErrorTrackingSettings } from "./sdk.js";

export const errorTrackingSettingsResource: SingletonResourceModule<
  ErrorTrackingSettings,
  ServerErrorTrackingSettings
> = {
  kind: "singleton",
  name: "error-tracking-settings",
  displayName: "error tracking settings",

  isSpec: looksLikeErrorTrackingSettings,

  fetchOne: getErrorTrackingSettings,
  diffFields: diffErrorTrackingSettings,

  validate: (specs) => validateErrorTrackingSettings(specs),
  executeOp: runErrorTrackingSettingsOp,

  displaySpec: (spec, _ctx: ApplyContext) => displayErrorTrackingSettings(spec),
  displayServer: (server, _ctx: ApplyContext) => displayErrorTrackingSettingsFromServer(server),

  renderToFile,
};
