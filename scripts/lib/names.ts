/** Convert kebab-case or snake_case to PascalCase. */
export function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join("");
}

/** Convert kebab-case or snake_case to camelCase. */
export function toCamelCase(name: string): string {
  const pascal = toPascalCase(name);
  return pascal[0]!.toLowerCase() + pascal.slice(1);
}
