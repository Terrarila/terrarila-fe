import "server-only";
import { backend } from "./terrala-api";

export async function loadBackendPages<T>(path: string): Promise<T[]> {
  const all: T[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const page: { items: T[]; nextCursor: string | null } = await backend(
      `${path}?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
    );
    all.push(...page.items);
    cursor = page.nextCursor;
    if (cursor && seenCursors.has(cursor))
      throw new Error("Repeated catalog cursor");
    if (cursor) seenCursors.add(cursor);
  } while (cursor);
  return all;
}
