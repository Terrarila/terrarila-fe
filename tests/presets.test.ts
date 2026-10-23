import { material, category } from "./catalog-fixture.ts";
import assert from "node:assert/strict";
import test from "node:test";
import { presetSelection, sameSelection } from "../src/components/custom-terrarium/design-presets.ts";
import { applyPreset, changeNote, chooseMaterial, designReducer, rememberSubmission } from "../src/store/design-slice.ts";
import type { ApiDesignPreset, BuilderCatalog } from "../src/lib/builder-catalog.ts";
const materials: BuilderCatalog["materials"] = [
  material("glass","vertical-rectangle",{id:"glass",name:"Bể đứng",priceVnd:200000,unit:"bể",availability:"available"}),
  material("moss","co",{id:"moss",name:"Rêu cỏ",priceVnd:30000,unit:"phần",availability:"available"}),
];
const catalog: BuilderCatalog = { materials, ready:true,presets:[],presetsReady:true,categories:[category("glass"),category("moss",{maxSelections:3})],pricing:{labourBps:5000,quantityMode:"per_selection",configured:true} };
const preset: ApiDesignPreset = {id:"preset",slug:"demo",name:"Demo",description:"",imageUrl:"/assets/products/attempt-1.jpg",isDemo:true,materials,selectable:true};
test("applying a preset replaces the entire selection, keeps the note, clears the request identity and remains editable", () => {
  let state = designReducer(undefined, chooseMaterial({key:"glass",id:"cubic-square",max:1}));
  state = designReducer(state, chooseMaterial({key:"plants",id:"fern",max:null}));
  state = designReducer(state, changeNote("Giữ ghi chú này"));
  state = designReducer(state, rememberSubmission({key:"11111111-1111-4111-8111-111111111111",fingerprint:"a".repeat(64)}));
  const recipe = presetSelection(preset,catalog)!;
  state = designReducer(state, applyPreset(recipe));
  assert.equal(state.note,"Giữ ghi chú này");
  assert.deepEqual(state.selection,{glass:"vertical-rectangle",gravel:[],soil:[],moss:["co"],plants:[]});
  assert.equal(state.submissionKey,null);assert.equal(state.submissionFingerprint,null);
  assert.equal(sameSelection(state.selection,recipe),true);
  state = designReducer(state, chooseMaterial({key:"moss",id:"co",max:3}));
  assert.equal(sameSelection(state.selection,recipe),false);
});
test("an unavailable, missing, unknown or over-limit material rejects the whole preset rather than partially filling it", () => {
  const excessMoss = ["co","quyenba","cushion","thuidium"].map((legacyId,index) => ({...materials[1],id:`moss-${index}`,legacyId}));
  assert.equal(presetSelection({...preset,materials:[materials[0],...excessMoss]},{...catalog,materials:[materials[0],...excessMoss],categories:[catalog.categories[0],category("moss",{maxSelections:4})]})?.moss.length,4);
  assert.equal(presetSelection({...preset,selectable:false},catalog),null);
  assert.equal(presetSelection(preset,{...catalog,materials:materials.slice(0,1)}),null);
  assert.equal(presetSelection(preset,{...catalog,materials:[materials[0],{...materials[1],availability:"unavailable"}]}),null);
  assert.equal(presetSelection({...preset,materials:[materials[0],{...materials[1],legacyId:"unknown"}]},catalog),null);
  assert.equal(presetSelection({...preset,materials:[materials[0],materials[0]]},catalog),null);
  assert.equal(presetSelection(preset,{...catalog,categories:[...catalog.categories.slice(0,1),category("moss",{maxSelections:0})]}),null);
});

test("a preset can use a newly added API material without a FE catalog change", () => {
  const added=material("moss","new-api-moss",{availability:"available"});
  assert.deepEqual(presetSelection({...preset,materials:[materials[0],added]},{...catalog,materials:[...materials,added]})?.moss,["new-api-moss"]);
});
