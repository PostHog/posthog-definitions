import type { ClientConfig } from "./config.js";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly method: string,
    public readonly url: string,
    public readonly body: string,
    public readonly retryAfterMs: number | undefined,
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

const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const POST_RETRYABLE_STATUSES = new Set([408, 425, 429]);

export async function request<T>(
  config: ClientConfig,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const debug = options.verbose || isDebugEnv();
  const maxAttempts = retryMaxAttempts();

  for (let attempt = 1; ; attempt++) {
    try {
      return await attemptOnce<T>(config, path, options);
    } catch (err) {
      const verdict = classify(err, method);
      if (verdict.kind === "fatal" || attempt >= maxAttempts) {
        throw err;
      }
      const delayMs = verdict.retryAfterMs ?? backoffDelay(attempt);
      if (debug) {
        console.error(
          `[http] retry ${attempt + 1}/${maxAttempts} in ${delayMs}ms — ${reason(err)}`,
        );
      }
      await sleep(delayMs);
    }
  }
}

async function attemptOnce<T>(
  config: ClientConfig,
  path: string,
  options: RequestOptions,
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
      const note = isTimeoutError(err) ? ` (hit ${timeoutMs}ms timeout)` : "";
      console.error(`[http] ✗ ${method} ${url.toString()} after ${elapsed}ms — ${reason(err)}${note}`);
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
    throw new ApiError(
      response.status,
      method,
      url.toString(),
      text,
      parseRetryAfterMs(response.headers.get("Retry-After")),
    );
  }
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

type Verdict = { kind: "fatal" } | { kind: "retryable"; retryAfterMs: number | undefined };

function classify(err: unknown, method: string): Verdict {
  if (err instanceof ApiError) {
    const allowed = method === "POST" ? POST_RETRYABLE_STATUSES : RETRYABLE_STATUSES;
    if (allowed.has(err.status)) {
      return { kind: "retryable", retryAfterMs: err.retryAfterMs };
    }
    return { kind: "fatal" };
  }
  if (isTimeoutError(err) || isNetworkError(err)) {
    if (method === "POST") {
      return { kind: "fatal" };
    }
    return { kind: "retryable", retryAfterMs: undefined };
  }
  return { kind: "fatal" };
}

function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === "TypeError" && err.message.toLowerCase().includes("fetch failed")) return true;
  const code = (err as { code?: string }).code;
  if (typeof code === "string") {
    return [
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "EAI_AGAIN",
      "ENOTFOUND",
      "ENETUNREACH",
      "EPIPE",
      "UND_ERR_SOCKET",
    ].includes(code);
  }
  return false;
}

function reason(err: unknown): string {
  if (err instanceof ApiError) {
    const after = err.retryAfterMs !== undefined ? ` (Retry-After ${err.retryAfterMs}ms)` : "";
    return `${err.status}${after}`;
  }
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

function parseRetryAfterMs(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(Math.round(seconds * 1000), retryMaxDelayMs());
  }
  const httpDateMs = Date.parse(raw);
  if (!Number.isNaN(httpDateMs)) {
    const delta = httpDateMs - Date.now();
    if (delta > 0) return Math.min(delta, retryMaxDelayMs());
  }
  return undefined;
}

function backoffDelay(attempt: number): number {
  const base = retryBaseDelayMs();
  const max = retryMaxDelayMs();
  const exp = Math.min(max, base * 2 ** (attempt - 1));
  const jitter = exp * 0.3 * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(exp + jitter));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDebugEnv(): boolean {
  const d = process.env.DEBUG;
  const p = process.env.POSTHOG_DEBUG;
  return d === "1" || d === "true" || p === "1" || p === "true";
}

function requestTimeoutMs(): number {
  return readPositiveInt("POSTHOG_API_TIMEOUT_MS", 5 * 60 * 1000);
}

function retryMaxAttempts(): number {
  return readPositiveInt("POSTHOG_API_MAX_ATTEMPTS", 4);
}

function retryBaseDelayMs(): number {
  return readPositiveInt("POSTHOG_API_RETRY_BASE_MS", 500);
}

function retryMaxDelayMs(): number {
  return readPositiveInt("POSTHOG_API_RETRY_MAX_MS", 10_000);
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallback;
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
