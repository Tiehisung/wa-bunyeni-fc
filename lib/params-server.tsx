export function buildQueryStringServer(
  searchParams: Record<string, string | string[] | boolean | undefined>,
) {
  if (!searchParams) return "";

  const query = new URLSearchParams(
    Object.entries(searchParams).filter(([_, v]) => v !== undefined) as [
      string,
      string,
    ][],
  ).toString();

  return query ? `?${query}` : "";
}