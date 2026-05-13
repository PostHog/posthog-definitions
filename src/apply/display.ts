export type DisplayValue =
  | { kind: "scalar"; value: string }
  | { kind: "object"; entries: Array<[string, DisplayValue]> }
  | { kind: "array"; items: DisplayValue[] };

export function scalar(value: unknown): DisplayValue {
  return { kind: "scalar", value: JSON.stringify(value) };
}

export function obj(entries: Array<[string, DisplayValue]>): DisplayValue {
  return { kind: "object", entries };
}

export function arr(items: DisplayValue[]): DisplayValue {
  return { kind: "array", items };
}

export function displayJson(value: unknown): DisplayValue {
  if (value === null || value === undefined) return scalar(null);
  if (typeof value !== "object") return scalar(value);
  if (Array.isArray(value)) return arr(value.map(displayJson));
  const entries: Array<[string, DisplayValue]> = [];
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    entries.push([k, displayJson(v)]);
  }
  return obj(entries);
}

export function renderLines(value: DisplayValue, indent = 0): string[] {
  const pad = "  ".repeat(indent);
  if (value.kind === "scalar") return [`${pad}${value.value}`];
  if (value.kind === "object") {
    if (value.entries.length === 0) return [`${pad}{}`];
    const lines: string[] = [];
    for (const [k, v] of value.entries) {
      if (v.kind === "scalar") lines.push(`${pad}${k}: ${v.value}`);
      else {
        lines.push(`${pad}${k}:`);
        lines.push(...renderLines(v, indent + 1));
      }
    }
    return lines;
  }
  if (value.items.length === 0) return [`${pad}[]`];
  const lines: string[] = [];
  for (const item of value.items) {
    if (item.kind === "scalar") lines.push(`${pad}- ${item.value}`);
    else {
      const sub = renderLines(item, indent + 1);
      if (sub.length > 0) sub[0] = `${pad}- ${sub[0]!.trimStart()}`;
      lines.push(...sub);
    }
  }
  return lines;
}

export function isManagedTag(tag: string): boolean {
  return tag.startsWith("iac:");
}

export function filterUserTags(tags: string[] | undefined): string[] {
  return (tags ?? []).filter((t) => !isManagedTag(t));
}
