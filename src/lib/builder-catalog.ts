import "server-only";
import { backend } from "./terrala-api";
import { loadBackendPages } from "./backend-pages";
export type ApiMaterial = { sizes?: ApiMaterial[]; requiresSize?: boolean; parentMaterialId?: string | null; sizeLabel?: string | null; id: string; legacyId: string; category: string; name: string; description: string; imageUrl: string | null; sortOrder: number; priceVnd: number | null; unit: string | null; availability: "available" | "unavailable" | "inquiry" };
export type CategoryRule = { code: string; name: string; description: string; selectionMode: "single" | "multiple"; minSelections: number; maxSelections: number | null; sortOrder: number };
export type ApiDesignPreset = { id: string; slug: string; name: string; description: string; imageUrl: string; isDemo: boolean; configured?: boolean; materials: ApiMaterial[]; selectable: boolean };
export type BuilderCatalog = { materials: ApiMaterial[]; categories: CategoryRule[]; presets: ApiDesignPreset[]; presetsReady: boolean; pricing: { labourBps: number | null; quantityMode: string | null; configured: boolean }; ready: boolean };
export async function loadBuilderCatalog(): Promise<BuilderCatalog> {
  try {
    const [categories, pricing, materials, presets] = await Promise.all([
      backend<CategoryRule[]>("/v1/material-categories"),
      backend<BuilderCatalog["pricing"]>("/v1/pricing"),
      loadBackendPages<ApiMaterial>("/v1/materials"),
      loadBackendPages<ApiDesignPreset>("/v1/portfolio-templates").then(items => ({ items, ready: true })).catch(() => ({ items: [], ready: false })),
    ]);
    return { categories, pricing, materials, presets: presets.items, presetsReady: presets.ready, ready: true };
  } catch {
    return { categories: [], materials: [], presets: [], presetsReady: false, pricing: { labourBps: null, quantityMode: null, configured: false }, ready: false };
  }
}
