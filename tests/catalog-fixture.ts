import type { ApiMaterial, BuilderCatalog, CategoryRule } from "../src/lib/builder-catalog.ts";
export function material(category: string, legacyId: string, patch: Partial<ApiMaterial> = {}): ApiMaterial {
  return {id:`${category}-${legacyId}`,legacyId,category,name:legacyId,description:"",imageUrl:null,sortOrder:0,priceVnd:null,unit:null,availability:"inquiry",...patch};
}
export function category(code: string, patch: Partial<CategoryRule> = {}): CategoryRule {
  return {code,name:code,description:"",selectionMode:code === "glass" ? "single":"multiple",minSelections:code === "glass" ? 1:0,maxSelections:code === "glass" ? 1:null,sortOrder:0,...patch};
}
export const fixtureCatalog: BuilderCatalog = {
  ready:true,presetsReady:true,presets:[],pricing:{labourBps:5000,quantityMode:"per_selection",configured:true},
  categories:[category("glass"),category("gravel"),category("soil"),category("moss",{maxSelections:3}),category("plants")],
  materials:[material("glass","vertical-rectangle"),material("glass","cubic-square"),material("gravel","natural"),material("soil","potting"),material("soil","binding"),...["co","cushion","quyenba","wepping"].map(id=>material("moss",id)),material("plants","cam-nhung")],
};
