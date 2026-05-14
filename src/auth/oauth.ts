import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { AddressInfo } from "node:net";
import { OAUTH_REDIRECT_PORTS, OAUTH_SCOPES } from "./clients.js";

export type OAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix seconds
  scope: string;
  tokenType: string;
};

export type LoginOptions = {
  host: string;
  clientId: string;
  // How long to wait for the callback before giving up. Default 360s.
  timeoutMs?: number;
  // Called with the URL the user should open in their browser. Defaults to
  // launching the system browser.
  openUrl?: (url: string) => void;
};

export class OAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthError";
  }
}

export async function performOAuthFlow(opts: LoginOptions): Promise<OAuthTokens> {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  const state = base64url(randomBytes(16));

  const { server, port } = await bindLoopback();
  const redirectUri = `http://localhost:${port}/callback`;

  const authorizeUrl = new URL(`${opts.host}/oauth/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", opts.clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("scope", OAUTH_SCOPES);
  authorizeUrl.searchParams.set("state", state);

  console.error(`Opening browser for PostHog login: ${authorizeUrl.toString()}`);
  if (opts.openUrl) {
    opts.openUrl(authorizeUrl.toString());
  } else {
    openBrowser(authorizeUrl.toString());
  }

  let code: string;
  try {
    code = await waitForCallback(server, state, opts.timeoutMs ?? 360_000);
  } finally {
    server.close();
  }

  return exchangeCode({
    host: opts.host,
    clientId: opts.clientId,
    code,
    verifier,
    redirectUri,
  });
}

export async function refreshAccessToken(
  refreshToken: string,
  host: string,
  clientId: string,
): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });
  const response = await fetch(`${host}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: body.toString(),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new OAuthError(
      `Token refresh failed: ${response.status} ${response.statusText}\n${text}`,
    );
  }
  return parseTokenResponse(text, refreshToken);
}

async function exchangeCode(args: {
  host: string;
  clientId: string;
  code: string;
  verifier: string;
  redirectUri: string;
}): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: args.code,
    redirect_uri: args.redirectUri,
    client_id: args.clientId,
    code_verifier: args.verifier,
  });
  const response = await fetch(`${args.host}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: body.toString(),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new OAuthError(
      `Token exchange failed: ${response.status} ${response.statusText}\n${text}`,
    );
  }
  return parseTokenResponse(text);
}

function parseTokenResponse(text: string, fallbackRefresh?: string): OAuthTokens {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new OAuthError(`Token endpoint returned non-JSON: ${text.slice(0, 200)}`);
  }
  const accessToken = parsed.access_token;
  const refreshToken = parsed.refresh_token ?? fallbackRefresh;
  const expiresIn = parsed.expires_in;
  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new OAuthError("Token response missing access_token.");
  }
  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    throw new OAuthError("Token response missing refresh_token.");
  }
  if (typeof expiresIn !== "number" || expiresIn <= 0) {
    throw new OAuthError("Token response missing expires_in.");
  }
  return {
    accessToken,
    refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
    scope: typeof parsed.scope === "string" ? parsed.scope : "",
    tokenType: typeof parsed.token_type === "string" ? parsed.token_type : "Bearer",
  };
}

async function bindLoopback(): Promise<{ server: Server; port: number }> {
  for (const port of OAUTH_REDIRECT_PORTS) {
    try {
      const server = await listenOn(port);
      return { server, port };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") continue;
      throw err;
    }
  }
  throw new OAuthError(
    `Could not bind any of the loopback ports ${OAUTH_REDIRECT_PORTS.join(", ")}. ` +
      `Free one of them and try again.`,
  );
}

function listenOn(port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    const onError = (err: NodeJS.ErrnoException): void => {
      server.removeListener("listening", onListening);
      reject(err);
    };
    const onListening = (): void => {
      server.removeListener("error", onError);
      const addr = server.address() as AddressInfo | null;
      if (!addr || addr.port !== port) {
        server.close();
        reject(new Error(`Bound to wrong port: expected ${port}, got ${addr?.port ?? "null"}`));
        return;
      }
      resolve(server);
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port, "127.0.0.1");
  });
}

function waitForCallback(
  server: Server,
  expectedState: string,
  timeoutMs: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.removeListener("request", handler);
      reject(new OAuthError(`Timed out waiting for OAuth callback after ${timeoutMs}ms.`));
    }, timeoutMs);

    const handler = (req: IncomingMessage, res: ServerResponse): void => {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname !== "/callback") {
        res.statusCode = 404;
        res.end("Not Found");
        return;
      }
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (error) {
        respondHtml(res, 400, "Login failed", `PostHog returned an error: ${escapeHtml(error)}.`);
        clearTimeout(timer);
        server.removeListener("request", handler);
        reject(new OAuthError(`OAuth error: ${error}`));
        return;
      }
      if (!code || !state) {
        respondHtml(res, 400, "Login failed", "Missing code or state parameter.");
        clearTimeout(timer);
        server.removeListener("request", handler);
        reject(new OAuthError("Callback missing code or state."));
        return;
      }
      if (state !== expectedState) {
        respondHtml(res, 400, "Login failed", "State mismatch — possible CSRF.");
        clearTimeout(timer);
        server.removeListener("request", handler);
        reject(new OAuthError("State mismatch in OAuth callback."));
        return;
      }
      respondHtml(res, 200, "Logged in", "You can close this tab and return to your terminal.");
      clearTimeout(timer);
      server.removeListener("request", handler);
      resolve(code);
    };

    server.on("request", handler);
  });
}

function respondHtml(res: ServerResponse, status: number, title: string, body: string): void {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f6f6f6;color:#222}main{max-width:480px;padding:32px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);text-align:center}h1{margin-top:0}</style>
</head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p></main></body></html>`;
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function openBrowser(url: string): void {
  const platform = process.platform;
  const cmd = platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  const args = platform === "win32" ? ["", url] : [url];
  try {
    const child = spawn(cmd, args, {
      stdio: "ignore",
      detached: true,
      shell: platform === "win32",
    });
    child.on("error", () => {
      // Browser launcher missing — the URL is already printed to stderr.
    });
    child.unref();
  } catch {
    // Already logged the URL; user can copy it manually.
  }
}
