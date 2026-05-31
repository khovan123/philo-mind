function encodeQueryValue(value: string): string {
  return encodeURIComponent(value);
}

function stringifyQueryValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    const sortedEntries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return JSON.stringify(Object.fromEntries(sortedEntries));
  }

  return String(value);
}

export function buildCacheKey(
  baseUrl: string,
  path: string,
  query: Record<string, unknown>,
): string {
  const sortedQuery = Object.entries(query)
    .flatMap(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      const values = Array.isArray(value) ? value : [value];
      return values.map(
        (item) => `${encodeQueryValue(key)}=${encodeQueryValue(stringifyQueryValue(item))}`,
      );
    })
    .sort()
    .join("&");

  return `cache:api:${baseUrl}${path}${sortedQuery ? `?${sortedQuery}` : ""}`;
}
