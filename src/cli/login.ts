import enquirer from "enquirer";
import { resolveClientId } from "../auth/clients.js";
import { OAuthError, performOAuthFlow, refreshAccessToken } from "../auth/oauth.js";
import { clearStore, readStore, storePath, writeStore, type StoredAuth } from "../auth/store.js";
import type { LoginArgs, LogoutArgs } from "./args.js";

type Project = { id: number; name: string };

const DEFAULT_HOST = "https://us.posthog.com";
const HOST_CHOICES: ReadonlyArray<{ label: string; value: string }> = [
  { label: "US Cloud (https://us.posthog.com)", value: DEFAULT_HOST },
  { label: "EU Cloud (https://eu.posthog.com)", value: "https://eu.posthog.com" },
];

export async function runLogin(args: LoginArgs): Promise<number> {
  const existing = safeReadStore();

  if (args.switchProject) {
    if (!existing) {
      console.error("error: no stored credentials. Run `posthog-definitions login` first.");
      return 3;
    }
    const refreshed = await ensureFreshToken(existing);
    const projects = await fetchProjects(refreshed);
    const picked = await pickProject(projects, existing.projectId);
    if (!picked) return 3;
    writeStore({ ...refreshed, projectId: String(picked.id) });
    console.error(`Selected project: ${picked.name} (${picked.id}).`);
    console.error(`Saved to ${storePath()}.`);
    return 0;
  }

  const host = args.host ?? (await pickHost(existing?.host));
  const clientId = resolveClientId(host);

  let tokens;
  try {
    tokens = await performOAuthFlow({ host, clientId });
  } catch (err) {
    if (err instanceof OAuthError) {
      console.error(`error: ${err.message}`);
      return 3;
    }
    throw err;
  }

  const partial: StoredAuth = {
    host,
    projectId: existing?.projectId ?? "",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
    clientId,
  };

  let projects: Project[];
  try {
    projects = await fetchProjects(partial);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`error: failed to list projects: ${msg}`);
    return 1;
  }

  if (projects.length === 0) {
    console.error("error: your account has no accessible projects on this host.");
    return 1;
  }

  const picked = await pickProject(projects, existing?.projectId);
  if (!picked) return 3;

  writeStore({ ...partial, projectId: String(picked.id) });
  console.error(`Logged in. Project: ${picked.name} (${picked.id}).`);
  console.error(`Saved to ${storePath()}.`);
  return 0;
}

export async function runLogout(_: LogoutArgs): Promise<number> {
  const removed = clearStore();
  if (removed) {
    console.error(`Cleared ${storePath()}.`);
  } else {
    console.error("No stored credentials to clear.");
  }
  return 0;
}

async function pickHost(currentHost: string | undefined): Promise<string> {
  const choices = HOST_CHOICES.map((c) => ({ name: c.value, message: c.label }));
  choices.push({ name: "__custom__", message: "Custom URL…" });
  const defaultName = currentHost ?? DEFAULT_HOST;
  const initialIndex = Math.max(
    0,
    choices.findIndex((c) => c.name === defaultName),
  );

  let answer: { host: string };
  try {
    answer = await enquirer.prompt<{ host: string }>({
      type: "select",
      name: "host",
      message: "PostHog host",
      choices,
      initial: initialIndex,
    } as Parameters<typeof enquirer.prompt>[0]);
  } catch {
    throw new Error("Host selection aborted.");
  }

  if (answer.host !== "__custom__") return answer.host;

  let custom: { url: string };
  try {
    custom = await enquirer.prompt<{ url: string }>({
      type: "input",
      name: "url",
      message: "Custom host URL",
      initial: currentHost ?? "https://",
    } as Parameters<typeof enquirer.prompt>[0]);
  } catch {
    throw new Error("Host entry aborted.");
  }
  return custom.url.replace(/\/$/, "");
}

async function pickProject(
  projects: Project[],
  currentId: string | undefined,
): Promise<Project | undefined> {
  const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name));
  const choices = sorted.map((p) => ({
    name: String(p.id),
    message: p.name || `(untitled #${p.id})`,
    hint: `#${p.id}`,
  }));
  const initialIndex = currentId
    ? Math.max(
        0,
        choices.findIndex((c) => c.name === currentId),
      )
    : 0;

  try {
    const answer = await enquirer.prompt<{ project: string }>({
      type: "autocomplete",
      name: "project",
      message: `Select a project (${projects.length} total)`,
      limit: 15,
      choices,
      initial: initialIndex,
      footer: "type to search · enter to confirm",
    } as Parameters<typeof enquirer.prompt>[0]);
    return sorted.find((p) => String(p.id) === answer.project);
  } catch {
    return undefined;
  }
}

async function fetchProjects(store: StoredAuth): Promise<Project[]> {
  // /api/projects/ is not in the codegen filter, so issue raw fetches here.
  type Page = { next: string | null; results: Project[] };
  const all: Project[] = [];
  let url: string | null = `${store.host}/api/projects/`;
  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${store.accessToken}`, Accept: "application/json" },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body}`);
    }
    const page = (await response.json()) as Page;
    for (const p of page.results) all.push({ id: p.id, name: p.name });
    url = page.next;
  }
  return all;
}

async function ensureFreshToken(store: StoredAuth): Promise<StoredAuth> {
  const now = Math.floor(Date.now() / 1000);
  if (store.expiresAt - 60 > now) return store;
  const next = await refreshAccessToken(store.refreshToken, store.host, store.clientId);
  const updated: StoredAuth = {
    ...store,
    accessToken: next.accessToken,
    refreshToken: next.refreshToken,
    expiresAt: next.expiresAt,
  };
  writeStore(updated);
  return updated;
}

function safeReadStore(): StoredAuth | undefined {
  try {
    return readStore();
  } catch (err) {
    console.error(`warning: could not read stored credentials (${(err as Error).message}).`);
    return undefined;
  }
}
