import "server-only";
import { backend } from "./terrala-api";
export type ApiMaterial = { sizes?: ApiMaterial[]; requiresSize?: boolean; parentMaterialId?: string | null; sizeLabel?: string | null; id: string; legacyId: string; category: string; name: string; description: string; imageUrl: string | null; sortOrder: number; priceVnd: number | null; unit: string | null; availability: "available" | "unavailable" | "inquiry" };
export type CategoryRule = { code: string; name: string; description: string; selectionMode: "single" | "multiple"; minSelections: number; maxSelections: number | null; sortOrder: number };
export type ApiDesignPreset = { id: string; slug: string; name: string; description: string; imageUrl: string; isDemo: boolean; materials: ApiMaterial[]; selectable: boolean };
export type BuilderCatalog = { materials: ApiMaterial[]; categories: CategoryRule[]; presets: ApiDesignPreset[]; presetsReady: boolean; pricing: { labourBps: number | null; quantityMode: string | null; configured: boolean }; ready: boolean };
async function loadPages<T>(path: string): Promise<T[]> {
  const all: T[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const page: { items: T[]; nextCursor: string | null } = await backend(`${path}?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
    all.push(...page.items); cursor = page.nextCursor;
    if (cursor && seenCursors.has(cursor)) throw new Error("Repeated catalog cursor");
    if (cursor) seenCursors.add(cursor);
  } while (cursor);
  return all;
}
export async function loadBuilderCatalog(): Promise<BuilderCatalog> {
  try {
    const [categories, pricing, materials, presets] = await Promise.all([
      backend<CategoryRule[]>("/v1/material-categories"),
      backend<BuilderCatalog["pricing"]>("/v1/pricing"),
      loadPages<ApiMaterial>("/v1/materials"),
      loadPages<ApiDesignPreset>("/v1/design-presets").then(items => ({ items, ready: true })).catch(() => ({ items: [], ready: false })),
    ]);
    return { categories, pricing, materials, presets: presets.items, presetsReady: presets.ready, ready: true };
  } catch {
    return { categories: [], materials: [], presets: [], presetsReady: false, pricing: { labourBps: null, quantityMode: null, configured: false }, ready: false };
  }
}
