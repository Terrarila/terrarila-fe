import type { TerrariumSelection } from "./material-catalog.ts";
import type { BuilderCatalog } from "../../lib/builder-catalog.ts";
export function estimateSelection(selection: TerrariumSelection, catalog: BuilderCatalog): number | null {
  if (!selection.glass || !catalog.ready || !catalog.pricing.configured || catalog.pricing.quantityMode !== "per_selection" || catalog.pricing.labourBps === null) return null;
  let subtotal = 0;
  for (const [category, selectionValue] of Object.entries(selection)) {
    for (const legacyId of typeof selectionValue === "string" ? [selectionValue] : selectionValue) {
      const item = catalog.materials.find(material => material.category === category && material.legacyId === legacyId);
      if (!item || item.priceVnd === null || !item.unit || item.availability !== "available") return null;
      subtotal += item.priceVnd;
    }
  }
  const total = subtotal + Math.ceil(subtotal * catalog.pricing.labourBps / 10000);
  return Number.isSafeInteger(total) ? total : null;
}
export const formatVnd = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
