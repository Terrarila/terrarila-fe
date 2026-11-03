import type { BuilderCatalog } from "../../lib/builder-catalog.ts";

export const materialKeys = ["glass", "gravel", "soil", "moss", "plants"] as const;
export type MaterialKey = typeof materialKeys[number];
export type MaterialOption = { id: string; name: string; detail: string; src?: string };
export type TerrariumSelection = { glass: string; glassSize?: string; gravel: string[]; soil: string[]; moss: string[]; plants: string[] };
export type MaterialStep = { key: MaterialKey; title: string; description: string; selectionMode: "single" | "multiple"; minSelections: number; maxSelections: number | null; options: MaterialOption[] };
export function isMaterialKey(value: string): value is MaterialKey {
  return materialKeys.some(key => key === value);
}
export function createEmptySelection(): TerrariumSelection {
  return { glass: "", gravel: [], soil: [], moss: [], plants: [] };
}
export function buildSteps(catalog: BuilderCatalog): MaterialStep[] {
  if (!catalog.ready) return [];
  return [...catalog.categories].sort((a,b) => a.sortOrder-b.sortOrder || a.code.localeCompare(b.code)).filter(category => isMaterialKey(category.code)).map(category => ({
    key: category.code as MaterialKey, title: category.name, description: category.description,
    selectionMode: category.selectionMode, minSelections: category.minSelections, maxSelections: category.maxSelections,
    options: catalog.materials.filter(material => material.category === category.code).sort((a,b) => a.sortOrder-b.sortOrder || a.id.localeCompare(b.id)).map(material => ({ id: material.legacyId, name: material.name, detail: material.description, ...(material.imageUrl ? { src: material.imageUrl } : {}) })),
  }));
}
export function isSelected(selection: TerrariumSelection, key: MaterialKey, id: string) {
  return key === "glass" ? selection.glass === id : (selection[key] ?? []).includes(id);
}

export function selectedGlassSize(selection: TerrariumSelection, catalog: BuilderCatalog) {
  return catalog.materials.find(item => item.category === "glass" && item.legacyId === selection.glass)?.sizes?.find(size => size.legacyId === selection.glassSize);
}
export function selectedApiMaterials(selection: TerrariumSelection, catalog: BuilderCatalog) {
  if (!catalog.ready || !selection.glass) return null;
  const result: BuilderCatalog["materials"] = [];
  for (const category of materialKeys) {
    const value = selection[category];
    for (const legacyId of typeof value === "string" ? [value] : value) {
      const item = catalog.materials.find(material => material.category === category && material.legacyId === legacyId);
      if (!item) return null;
      if (category === "glass" && (item.requiresSize || item.sizes?.length)) {
        const size = selectedGlassSize(selection, catalog);
        if (!size || item.availability === "unavailable" || size.availability === "unavailable") return null;
        result.push(size);
      } else result.push(item);
    }
  }
  return result;
}
