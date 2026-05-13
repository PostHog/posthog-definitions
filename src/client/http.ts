import type { ClientConfig } from "./config.js";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly method: string,
    public readonly url: string,
    public readonly body: string,
  ) {
    super(`${method} ${url} → ${status}\n${body}`);
    this.name = "ApiError";
  }
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  verbose?: boolean;
};

export async function request<T>(
  config: ClientConfig,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const url = new URL(path, `${config.host}/`);
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    Accept: "application/json",
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const debug = options.verbose || isDebugEnv();
  const timeoutMs = requestTimeoutMs();

  if (debug) {
    console.error(`[http] → ${method} ${url.toString()} (timeout ${timeoutMs}ms)`);
  }

  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const elapsed = Date.now() - startedAt;
    if (debug) {
      const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      const note = isTimeoutError(err) ? ` (hit ${timeoutMs}ms timeout)` : "";
      console.error(`[http] ✗ ${method} ${url.toString()} after ${elapsed}ms — ${reason}${note}`);
    }
    throw err;
  }

  const text = await response.text();
  const elapsed = Date.now() - startedAt;
  if (debug) {
    console.error(
      `[http] ← ${method} ${url.toString()} ${response.status} ${response.statusText} ${elapsed}ms (${text.length}B)`,
    );
  }
  if (!response.ok) {
    throw new ApiError(response.status, method, url.toString(), text);
  }
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

function isDebugEnv(): boolean {
  const d = process.env.DEBUG;
  const p = process.env.POSTHOG_DEBUG;
  return d === "1" || d === "true" || p === "1" || p === "true";
}

function requestTimeoutMs(): number {
  const raw = process.env.POSTHOG_API_TIMEOUT_MS;
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 5 * 60 * 1000;
}

export type Paginated<T> = {
  count?: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function paginate<T>(
  config: ClientConfig,
  path: string,
  options: RequestOptions = {},
): Promise<T[]> {
  const collected: T[] = [];
  let page = await request<Paginated<T>>(config, path, options);
  collected.push(...page.results);
  while (page.next) {
    const nextUrl = new URL(page.next);
    const nextPath = `${nextUrl.pathname}${nextUrl.search}`;
    page = await request<Paginated<T>>(config, nextPath, { verbose: options.verbose });
    collected.push(...page.results);
  }
  return collected;
}
