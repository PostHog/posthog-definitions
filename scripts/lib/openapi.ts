import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type OpenAPISchema = {
  type?: string;
  format?: string;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  enum?: unknown[];
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  additionalProperties?: boolean | OpenAPISchema;
  allOf?: OpenAPISchema[];
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  $ref?: string;
  description?: string;
  default?: unknown;
  maxLength?: number;
};

export type OpenAPIDoc = {
  openapi: string;
  components: { schemas: Record<string, OpenAPISchema> };
  paths: Record<string, Record<string, OpenAPIOperation>>;
};

export type OpenAPIOperation = {
  parameters?: unknown[];
  requestBody?: {
    content: Record<string, { schema: OpenAPISchema }>;
  };
  responses: Record<
    string,
    { content?: Record<string, { schema: OpenAPISchema }> }
  >;
};

const DEFAULT_OPENAPI_PATH = "../posthog/frontend/tmp/openapi.json";

export function loadOpenAPI(path?: string): OpenAPIDoc {
  const resolved = resolve(process.cwd(), path ?? DEFAULT_OPENAPI_PATH);
  const raw = readFileSync(resolved, "utf8");
  return JSON.parse(raw) as OpenAPIDoc;
}

/** Resolve a `$ref` string like `#/components/schemas/Foo`. */
export function resolveRef(doc: OpenAPIDoc, ref: string): OpenAPISchema {
  const parts = ref.replace(/^#\//, "").split("/");
  let cur: unknown = doc;
  for (const part of parts) {
    if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[part];
    }
  }
  if (!cur) throw new Error(`Cannot resolve $ref: ${ref}`);
  return cur as OpenAPISchema;
}

/** Resolve a schema one level — if it's a $ref or a wrapping allOf around a $ref, unwrap once. */
export function unwrap(doc: OpenAPIDoc, schema: OpenAPISchema): OpenAPISchema {
  if (schema.$ref) return resolveRef(doc, schema.$ref);
  if (schema.allOf && schema.allOf.length === 1 && schema.allOf[0]?.$ref) {
    return resolveRef(doc, schema.allOf[0].$ref);
  }
  return schema;
}

export type FieldInfo = {
  name: string;
  schema: OpenAPISchema;
  readOnly: boolean;
  writeOnly: boolean;
  nullable: boolean;
  required: boolean;
};

/** Flatten a component's properties into a list of field infos. */
export function componentFields(
  doc: OpenAPIDoc,
  componentName: string,
): FieldInfo[] {
  const component = doc.components.schemas[componentName];
  if (!component) {
    throw new Error(`OpenAPI component not found: ${componentName}`);
  }
  const props = component.properties ?? {};
  const required = new Set(component.required ?? []);
  return Object.entries(props).map(([name, schema]) => ({
    name,
    schema,
    readOnly: schema.readOnly === true,
    writeOnly: schema.writeOnly === true,
    nullable: schema.nullable === true,
    required: required.has(name),
  }));
}

/** Find the response/request component names for a list endpoint path. */
export function findEndpointComponents(
  doc: OpenAPIDoc,
  listPath: string,
): {
  responseComponent?: string;
  paginatedComponent?: string;
  createRequestComponent?: string;
} {
  const ops = doc.paths[listPath];
  if (!ops) return {};
  const getResp = ops.get?.responses?.["200"]?.content?.["application/json"]?.schema;
  const postReq = ops.post?.requestBody?.content?.["application/json"]?.schema;

  let paginatedComponent: string | undefined;
  let responseComponent: string | undefined;
  if (getResp?.$ref) {
    paginatedComponent = refTail(getResp.$ref);
    const paginated = resolveRef(doc, getResp.$ref);
    const items = paginated.properties?.results?.items;
    if (items?.$ref) responseComponent = refTail(items.$ref);
  }

  let createRequestComponent: string | undefined;
  if (postReq?.$ref) createRequestComponent = refTail(postReq.$ref);

  return { responseComponent, paginatedComponent, createRequestComponent };
}

function refTail(ref: string): string {
  const parts = ref.split("/");
  return parts[parts.length - 1] ?? ref;
}
