import "server-only";
import { cache } from "react";
import { loadBackendPages } from "./backend-pages";
import { ApiError, backend } from "./terrala-api";
import type { PortfolioEntry, Product } from "./product-types";

export const loadProducts = cache(() => loadBackendPages<Product>("/v1/products"));
export const loadPortfolio = cache(() =>
  loadBackendPages<PortfolioEntry>("/v1/portfolio"),
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
