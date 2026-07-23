import { z } from "zod";
import type { ClientConfig } from "../../client/config.js";
import type { components } from "../../generated/api.js";
import { createApiClient, followPagination, type Paginated } from "../../client/typed.js";

const MANAGED_DESCRIPTION_PREFIX = "<!-- iac:product-tours:";

export const ServerProductTourSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(""),
    content: z.record(z.string(), z.unknown()).nullable().optional(),
    auto_launch: z.boolean().nullable().optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    archived: z.boolean().nullable().optional(),
  })
  .loose();

export type ServerProductTour = z.infer<typeof ServerProductTourSchema>;

export type ProductTourCreate = {
  name: string;
  description: string;
  content: Record<string, unknown>;
  auto_launch?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  archived?: boolean;
};

export type ProductTourUpdate = Partial<ProductTourCreate>;

type ProductTourBody = components["schemas"]["ProductTourSerializerCreateUpdateOnly"];
type PatchedProductTourBody = components["schemas"]["PatchedProductTourSerializerCreateUpdateOnly"];
type GeneratedPaginatedList = components["schemas"]["PaginatedProductTourList"];

function paginatedFrom(raw: GeneratedPaginatedList): Paginated<unknown> {
  return {
    count: raw.count,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    results: raw.results ?? [],
  };
}

export async function listProductTours(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerProductTour[]> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/product_tours/", {
    params: { path: { project_id: config.projectId }, query: { limit: 100 } },
  });
  const firstPage = paginatedFrom(data!);
  const allRaw = await followPagination<unknown>(config, firstPage, { verbose: options.verbose });
  return allRaw.map((row) => ServerProductTourSchema.parse(row));
}

export async function listManagedProductTours(
  config: ClientConfig,
  options: { verbose?: boolean } = {},
): Promise<ServerProductTour[]> {
  const all = await listProductTours(config, options);
  return all.filter((row) => (row.description ?? "").includes(MANAGED_DESCRIPTION_PREFIX));
}

export async function getProductTour(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<ServerProductTour> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.GET("/api/projects/{project_id}/product_tours/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
  return ServerProductTourSchema.parse(data);
}

export async function createProductTour(
  config: ClientConfig,
  payload: ProductTourCreate,
  options: { verbose?: boolean } = {},
): Promise<ServerProductTour> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.POST("/api/projects/{project_id}/product_tours/", {
    params: { path: { project_id: config.projectId } },
    body: payload as unknown as ProductTourBody,
  });
  return ServerProductTourSchema.parse(data);
}

export async function updateProductTour(
  config: ClientConfig,
  id: string,
  payload: ProductTourUpdate,
  options: { verbose?: boolean } = {},
): Promise<ServerProductTour> {
  const api = createApiClient(config, { verbose: options.verbose });
  const { data } = await api.PATCH("/api/projects/{project_id}/product_tours/{id}/", {
    params: { path: { project_id: config.projectId, id } },
    body: payload as unknown as PatchedProductTourBody,
  });
  return ServerProductTourSchema.parse(data);
}

/** Product tours support a real DELETE (204). */
export async function deleteProductTour(
  config: ClientConfig,
  id: string,
  options: { verbose?: boolean } = {},
): Promise<void> {
  const api = createApiClient(config, { verbose: options.verbose });
  await api.DELETE("/api/projects/{project_id}/product_tours/{id}/", {
    params: { path: { project_id: config.projectId, id } },
  });
}
