import assert from 'node:assert/strict';
import test from 'node:test';
import { material, category } from './catalog-fixture.ts';
import type { BuilderCatalog } from '../src/lib/builder-catalog.ts';
import { designReducer, chooseMaterial, chooseGlassSize, sanitizeDraft, rememberSubmission } from '../src/store/design-slice.ts';
import { selectedApiMaterials } from '../src/components/custom-terrarium/material-catalog.ts';
import { estimateSelection } from '../src/components/custom-terrarium/estimate.ts';
import { presetSelection } from '../src/components/custom-terrarium/design-presets.ts';
const size=material('glass','vertical-25x10x18',{id:'size-uuid',parentMaterialId:'shape-uuid',sizeLabel:'25×10×18 cm (D×R×C)',priceVnd:150000,unit:'bể',availability:'available'});
const shape=material('glass','vertical-rectangle',{id:'shape-uuid',requiresSize:true,sizes:[size]});
const catalog:BuilderCatalog={ready:true,presetsReady:true,presets:[],categories:[category('glass')],materials:[shape,material('glass','cubic-square',{requiresSize:true,sizes:[]})],pricing:{labourBps:5000,quantityMode:'per_selection',configured:true}};
test('size selection sends the leaf material UUID, prices the selected size and resets on shape change',()=>{
 let state=designReducer(undefined,chooseMaterial({key:'glass',id:'vertical-rectangle',max:1}));
 assert.equal(selectedApiMaterials(state.selection,catalog),null);assert.equal(estimateSelection(state.selection,catalog),null);
 state=designReducer(state,chooseGlassSize({glass:'vertical-rectangle',id:size.legacyId}));
 assert.deepEqual(selectedApiMaterials(state.selection,catalog)?.map(x=>x.id),['size-uuid']);assert.equal(estimateSelection(state.selection,catalog),225000);
 state=designReducer(state,rememberSubmission({key:'11111111-1111-4111-8111-111111111111',fingerprint:'a'.repeat(64)}));
 state=designReducer(state,chooseMaterial({key:'glass',id:'cubic-square',max:1}));assert.equal(state.selection.glassSize,undefined);assert.equal(state.submissionKey,null);assert.equal(selectedApiMaterials(state.selection,catalog),null);
});
test('restored drafts keep a valid size but reject a size from another shape or a removed size',()=>{
 const selection={glass:'vertical-rectangle',glassSize:size.legacyId};
 assert.equal(sanitizeDraft({selection},catalog).selection.glassSize,size.legacyId);
 assert.equal(sanitizeDraft({selection:{...selection,glass:'cubic-square'}},catalog).selection.glassSize,undefined);
 assert.equal(sanitizeDraft({selection},{...catalog,materials:[{...shape,sizes:[]}]}).selection.glassSize,undefined);
 assert.equal(sanitizeDraft({selection},{...catalog,ready:false}).selection.glassSize,size.legacyId);
 assert.equal(sanitizeDraft({selection:{glass:'vertical-rectangle'}},catalog).selection.glassSize,undefined);
});
test('old presets require an explicit size, and a size-specific preset restores only its matching shape',()=>{
 const preset={id:'demo',slug:'demo',name:'Demo',description:'',imageUrl:'/assets/demo.webp',isDemo:true,selectable:true,materials:[shape]};
 const old=presetSelection(preset,catalog)!;assert.equal(old.glass,'vertical-rectangle');assert.equal(old.glassSize,undefined);assert.equal(selectedApiMaterials(old,catalog),null);
 const exact=presetSelection({...preset,materials:[size]},catalog)!;assert.equal(exact.glass,'vertical-rectangle');assert.equal(exact.glassSize,size.legacyId);
 assert.equal(presetSelection({...preset,materials:[size]},{...catalog,materials:[{...shape,sizes:[]}]}),null);
});
