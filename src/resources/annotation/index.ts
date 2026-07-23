import type { ApplyContext, CollectionResourceModule } from "../types.js";
import { insightResource } from "../insight/index.js";
import { dashboardResource } from "../dashboard/index.js";
import type { Annotation } from "./sdk.js";
import {
  ANNOTATION_IDENTITY_PREFIX,
  annotationHash,
  annotationHashFromServer,
  annotationKeyFromServer,
  displayAnnotation,
  displayAnnotationFromServer,
  looksLikeAnnotation,
  pruneAnnotation,
  runAnnotationOp,
  validateAnnotations,
} from "./pipeline.js";
import { getAnnotation, listAnnotations, listManagedAnnotations, type ServerAnnotation } from "./client.js";
import {
  pullDependencies,
  pullFilter,
  pullLabel,
  renderToFile,
  serverIdOf,
  tagOnServer,
} from "./codegen.js";

export { annotation } from "./sdk.js";
export type { Annotation, AnnotationScope, AnnotationCreationType } from "./sdk.js";

export const annotationResource: CollectionResourceModule<Annotation, ServerAnnotation> = {
  kind: "collection",
  name: "annotations",
  displayName: "annotation",
  identityPrefix: ANNOTATION_IDENTITY_PREFIX,
  dependsOn: [insightResource, dashboardResource],

  isSpec: looksLikeAnnotation,
  specKey: (spec) => spec.key,

  list: listManagedAnnotations,
  keyFromServer: (server) => annotationKeyFromServer(server),
  hashFromServer: (server) => annotationHashFromServer(server),

  hash: annotationHash,
  validate: (specs, state) => validateAnnotations(specs, state),
  executeOp: runAnnotationOp,
  prune: pruneAnnotation,

  displaySpec: (spec, _ctx: ApplyContext) => displayAnnotation(spec),
  displayServer: (server, ctx: ApplyContext) => displayAnnotationFromServer(server, ctx),

  listAll: listAnnotations,
  getById: (config, id, options) => getAnnotation(config, Number(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  pullDependencies,
  renderToFile,
  tagOnServer,
};
