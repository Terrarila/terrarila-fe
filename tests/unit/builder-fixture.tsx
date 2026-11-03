import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import type { BuilderCatalog } from "../../src/lib/builder-catalog";
import { makeStore } from "../../src/store/store";
import { chooseGlassSize, chooseMaterial } from "../../src/store/design-slice";
import { category, material } from "../catalog-fixture";

// Small API-shaped catalog: prices and limits belong to this fixture only.
export function builderCatalog(): BuilderCatalog {
  const size = material("glass", "vertical-25x10x18", {
    id: "size-uuid", parentMaterialId: "shape-uuid", sizeLabel: "25×10×18 cm",
    priceVnd: 150000, unit: "bể", availability: "available",
  });
  return {
    ready: true, presetsReady: true, presets: [],
    pricing: { configured: true, labourBps: 5000, quantityMode: "per_selection" },
    categories: [category("glass", { name: "Bể kính", sortOrder: 0 }), category("moss", { name: "Rêu", maxSelections: 2, sortOrder: 1 })],
    materials: [
      material("glass", "vertical", { id: "shape-uuid", name: "Bể đứng", requiresSize: true, availability: "available", sizes: [size, { ...size, id: "sold-out-size", legacyId: "vertical-10x10x20", sizeLabel: "10×10×20 cm", availability: "unavailable" }] }),
      material("glass", "cubic", { name: "Bể vuông", requiresSize: true, availability: "available", sizes: [material("glass", "cubic-10", { id: "cubic-size-uuid", sizeLabel: "10×10 cm", priceVnd: 60000, unit: "bể", availability: "available" })] }),
      ...["Rêu A", "Rêu B", "Rêu C"].map((name, index) => material("moss", `moss-${index}`, { name, priceVnd: 10000, unit: "phần", availability: "available" })),
      material("moss", "sold-out", { name: "Rêu hết hàng", availability: "unavailable" }),
    ],
  };
}

export function renderWithDesign(ui: ReactNode, selected = false) {
  const store = makeStore();
  if (selected) {
    store.dispatch(chooseMaterial({ key: "glass", id: "vertical", max: 1 }));
    store.dispatch(chooseGlassSize({ glass: "vertical", id: "vertical-25x10x18" }));
  }
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
}
