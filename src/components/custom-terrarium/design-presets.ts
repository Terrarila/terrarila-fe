import type { ApiDesignPreset, BuilderCatalog } from "../../lib/builder-catalog.ts";
import { createEmptySelection, materialKeys, buildSteps, type TerrariumSelection } from "./material-catalog.ts";

// Reject the entire recipe when the API and current form cannot represent it.
export function presetSelection(preset: ApiDesignPreset, catalog: BuilderCatalog): TerrariumSelection | null {
  if (!catalog.ready || !preset.selectable || !preset.materials.length) return null;
  const steps = buildSteps(catalog);
  const selection = createEmptySelection();
  const seen = new Set<string>();
  for (const material of preset.materials) {
    const step = steps.find(item => item.key === material.category);
    const current = catalog.materials.flatMap(item => [item, ...(item.sizes ?? [])]).find(item => item.id === material.id);
    const shape = current?.parentMaterialId ? catalog.materials.find(item => item.id === current.parentMaterialId) : current;
    if (!step || !current || current.availability === "unavailable" || current.category !== material.category || current.legacyId !== material.legacyId || seen.has(material.id) || !shape || !step.options.some(option => option.id === shape.legacyId)) return null;
    seen.add(material.id);
    if (step.key === "glass") {
      if (selection.glass) return null;
      selection.glass = shape.legacyId;
      if (current.parentMaterialId) selection.glassSize = current.legacyId;
    } else selection[step.key].push(material.legacyId);
  }
  if (!selection.glass) return null;
  for (const category of catalog.categories) {
    const step = steps.find(item => item.key === category.code);
    const count = step ? (step.key === "glass" ? Number(!!selection.glass) : selection[step.key].length) : 0;
    if (count < category.minSelections || (category.maxSelections !== null && count > category.maxSelections)) return null;
  }
  return selection;
}
export function sameSelection(left: TerrariumSelection, right: TerrariumSelection) {
  return (left.glassSize ?? "") === (right.glassSize ?? "") && materialKeys.every(key => key === "glass" ? left.glass === right.glass : left[key].length === right[key].length && left[key].every(id => right[key].includes(id)));
}
