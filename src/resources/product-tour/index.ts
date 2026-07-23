import type { ApplyContext, CollectionResourceModule } from "../types.js";
import type { ProductTour } from "./sdk.js";
import {
  displayProductTour,
  displayProductTourFromServer,
  PRODUCT_TOUR_IDENTITY_PREFIX,
  productTourHash,
  productTourHashFromServer,
  productTourKeyFromServer,
  looksLikeProductTour,
  pruneProductTour,
  runProductTourOp,
  validateProductTours,
} from "./pipeline.js";
import {
  getProductTour,
  listManagedProductTours,
  listProductTours,
  type ServerProductTour,
} from "./client.js";
import { pullFilter, pullLabel, renderToFile, serverIdOf, tagOnServer } from "./codegen.js";

export { productTour } from "./sdk.js";
export type { ProductTour, TourContent } from "./sdk.js";

export const productTourResource: CollectionResourceModule<ProductTour, ServerProductTour> = {
  kind: "collection",
  name: "product-tours",
  displayName: "product tour",
  identityPrefix: PRODUCT_TOUR_IDENTITY_PREFIX,

  isSpec: looksLikeProductTour,
  specKey: (spec) => spec.key,

  list: listManagedProductTours,
  keyFromServer: (server) => productTourKeyFromServer(server),
  hashFromServer: (server) => productTourHashFromServer(server),

  hash: productTourHash,
  validate: (specs) => validateProductTours(specs),
  executeOp: runProductTourOp,
  prune: pruneProductTour,

  displaySpec: (spec, _ctx: ApplyContext) => displayProductTour(spec),
  displayServer: (server, _ctx: ApplyContext) => displayProductTourFromServer(server),

  listAll: listProductTours,
  getById: (config, id, options) => getProductTour(config, String(id), options),
  pullFilter,
  pullLabel,
  serverIdOf,
  renderToFile,
  tagOnServer,
};
