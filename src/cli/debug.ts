export type DebugFn = (message: string, meta?: Record<string, unknown>) => void;

const start = Date.now();

export function createDebug(enabled: boolean): DebugFn {
  if (!enabled) return () => {};
  return (message, meta) => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(3);
    const suffix = meta && Object.keys(meta).length > 0 ? ` ${formatMeta(meta)}` : "";
    process.stderr.write(`[+${elapsed}s] ${message}${suffix}\n`);
  };
}

export function debugEnabled(verbose: boolean): boolean {
  if (verbose) return true;
  return isTruthy(process.env.DEBUG) || isTruthy(process.env.POSTHOG_DEBUG);
}

function isTruthy(value: string | undefined): boolean {
  return value === "1" || value === "true";
}

function formatMeta(meta: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(meta)) {
    parts.push(`${k}=${formatValue(v)}`);
  }
  return parts.join(" ");
}

function formatValue(v: unknown): string {
  if (typeof v === "string")
    return v.length > 80 ? JSON.stringify(v.slice(0, 77) + "…") : JSON.stringify(v);
  if (v instanceof Error) return JSON.stringify(v.message);
  return JSON.stringify(v);
}
