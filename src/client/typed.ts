import createClient, { type Client } from "openapi-fetch";
import type { paths } from "../generated/api.js";
import type { ClientConfig } from "./config.js";

export type ApiClient = Client<paths>;

/**
 * Thrown by the typed PostHog client when the API returns a non-2xx
 * response after retries are exhausted, or when retries terminate without
 * a usable response.
 */
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

export class DeadlineExceededError extends Error {
  constructor(method: string, path: string, attempts: number) {
    super(`Deadline exceeded for ${method} ${path} after ${attempts} attempt(s).`);
    this.name = "DeadlineExceededError";
  }
}

export type ApiClientOptions = {
  verbose?: boolean;
};

export function createApiClient(config: ClientConfig, options: ApiClientOptions = {}): ApiClient {
  const client = createClient<paths>({
    baseUrl: config.host,
    headers: { Authorization: `Bearer ${config.apiKey}` },
    fetch: makeRetriedFetch({ verbose: options.verbose }),
  });

  // openapi-fetch returns { data, error, response }. We escalate non-ok responses
  // to thrown ApiError here so resource modules can rely on `data` being present
  // when no exception is thrown — same contract the old request<T>() helper had.
  client.use({
    async onResponse({ response, request }) {
      if (!response.ok) {
        const text = await response.clone().text();
        throw new ApiError(
          response.status,
          request.method,
          response.url,
          text,
          parseRetryAfterMs(response.headers.get("Retry-After")),
        );
      }
      return response;
    },
  });

  return client;
}

/**
 * Iterate `next` links from a paginated response. The first page is fetched by
 * the caller (so the path-level type is preserved); subsequent pages are
 * fetched as raw URLs through the same retried fetch impl.
 */
export type Paginated<T> = {
  count?: number;
  next: string | null;
  previous?: string | null;
  results: T[];
};

export async function followPagination<T>(
  config: ClientConfig,
  firstPage: Paginated<T>,
  options: ApiClientOptions = {},
): Promise<T[]> {
  const all = [...firstPage.results];
  const fetchImpl = makeRetriedFetch({ verbose: options.verbose });
  let next = firstPage.next;
  while (next) {
    const response = await fetchImpl(next, {
      method: "GET",
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(
        response.status,
        "GET",
        response.url,
        text,
        parseRetryAfterMs(response.headers.get("Retry-After")),
      );
    }
    const page = (await response.json()) as Paginated<T>;
    all.push(...page.results);
    next = page.next;
  }
  return all;
}

// ---------------------------------------------------------------------------
// retried fetch — preserves the retry/timeout/Retry-After semantics from
// the legacy http.ts so callers see the same behavior under load.
// ---------------------------------------------------------------------------

const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const POST_RETRYABLE_STATUSES = new Set([408, 425, 429]);

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

function makeRetriedFetch(opts: { verbose?: boolean }): typeof fetch {
  return async function retriedFetch(input: FetchInput, init?: FetchInit) {
    const method = (init?.method ?? "GET").toUpperCase();
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const debug = opts.verbose || isDebugEnv();
    const deadlineMs = Date.now() + overallTimeoutMs();

    for (let attempt = 1; ; attempt++) {
      const remaining = Math.max(0, deadlineMs - Date.now());
      if (remaining === 0) throw new DeadlineExceededError(method, url, attempt - 1);

      const timeoutMs = Math.min(attemptTimeoutMs(), remaining);
      const startedAt = Date.now();
      if (debug) console.error(`[http] → ${method} ${url} (timeout ${timeoutMs}ms)`);

      let response: Response;
      try {
        response = await fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      } catch (err) {
        const verdict = classifyNetworkError(err, method);
        if (verdict.kind === "fatal") throw err;
        const delayMs = backoffDelay(attempt);
        if (deadlineMs - Date.now() - delayMs <= 0) {
          if (debug) {
            console.error(
              `[http] giving up after ${attempt} attempt(s) — next backoff ${delayMs}ms would exceed deadline (${reason(err)})`,
            );
          }
          throw err;
        }
        if (debug) {
          console.error(`[http] retry ${attempt + 1} in ${delayMs}ms — ${reason(err)}`);
        }
        await sleep(delayMs);
        continue;
      }

      const elapsed = Date.now() - startedAt;
      if (debug) {
        console.error(
          `[http] ← ${method} ${url} ${response.status} ${response.statusText} ${elapsed}ms`,
        );
      }

      const verdict = classifyHttpStatus(response.status, method);
      if (verdict.kind === "ok") return response;

      const retryAfterMs = parseRetryAfterMs(response.headers.get("Retry-After"));
      const delayMs = retryAfterMs ?? backoffDelay(attempt);
      if (deadlineMs - Date.now() - delayMs <= 0) {
        if (debug) {
          console.error(
            `[http] giving up after ${attempt} attempt(s) — next backoff ${delayMs}ms would exceed deadline (HTTP ${response.status})`,
          );
        }
        return response; // hand back the non-ok response; middleware will throw.
      }
      // Drain body to release the connection before retrying.
      await response.arrayBuffer().catch(() => undefined);
      if (debug) console.error(`[http] retry ${attempt + 1} in ${delayMs}ms — HTTP ${response.status}`);
      await sleep(delayMs);
    }
  };
}

type HttpVerdict = { kind: "ok" } | { kind: "retry" };

function classifyHttpStatus(status: number, method: string): HttpVerdict {
  if (status < 400) return { kind: "ok" };
  const allowed = method === "POST" ? POST_RETRYABLE_STATUSES : RETRYABLE_STATUSES;
  if (allowed.has(status)) return { kind: "retry" };
  return { kind: "ok" }; // not actually ok, but not retryable — let the middleware turn it into ApiError
}

type NetworkVerdict = { kind: "fatal" } | { kind: "retry" };

function classifyNetworkError(err: unknown, method: string): NetworkVerdict {
  if (isTimeoutError(err) || isNetworkError(err)) {
    return method === "POST" ? { kind: "fatal" } : { kind: "retry" };
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

function overallTimeoutMs(): number {
  return readPositiveInt("POSTHOG_API_TIMEOUT_MS", 5 * 60 * 1000);
}

function attemptTimeoutMs(): number {
  return readPositiveInt("POSTHOG_API_ATTEMPT_TIMEOUT_MS", 30_000);
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
