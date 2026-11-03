import "server-only";
import { cache } from "react";
import { ApiError, backend } from "./terrala-api";
import type { PortfolioEntry, Product } from "./product-types";

async function loadEntries<T>(path: "/v1/products" | "/v1/portfolio") {
  const entries: T[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const page: { items: T[]; nextCursor: string | null } = await backend(
      `${path}?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
    );
    entries.push(...page.items);
    cursor = page.nextCursor;
    if (cursor && cursors.has(cursor))
      throw new Error("Repeated catalog cursor");
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return entries;
}
export const loadProducts = cache(() => loadEntries<Product>("/v1/products"));
export const loadPortfolio = cache(() =>
  loadEntries<PortfolioEntry>("/v1/portfolio"),
);
// Deduplicate page + metadata reads within a request; backend fetch remains no-store.
export const loadProduct = cache(
  async (slug: string): Promise<Product | null> => {
    try {
      return await backend<Product>(`/v1/products/${encodeURIComponent(slug)}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
);
