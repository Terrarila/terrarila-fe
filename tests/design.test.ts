import { fixtureCatalog, material } from "./catalog-fixture.ts";
import assert from "node:assert/strict";
import test from "node:test";
import { persistStore } from "redux-persist";
import { makeStore } from "../src/store/store.ts";
import { chooseMaterial, applyPreset, changeNote, resetDesign, sanitizeDraft, rememberSubmission } from "../src/store/design-slice.ts";
import { estimateSelection } from "../src/components/custom-terrarium/estimate.ts";

test("Redux Persist restores choices and notes across store recreation; reset persists", async () => {
  const values = new Map<string,string>();
  const storage = { async getItem(key:string) { return values.get(key) ?? null; }, async setItem(key:string,value:string) { values.set(key,value); }, async removeItem(key:string) { values.delete(key); } };
  const catalog = {...fixtureCatalog,materials:[...fixtureCatalog.materials,material("moss","new-api-moss")]};
  const first = makeStore(storage, catalog);
  let persistence = persistStore(first); await new Promise<void>(resolve => { if (persistence.getState().bootstrapped) resolve(); else { const unsubscribe = persistence.subscribe(() => { if (persistence.getState().bootstrapped) { unsubscribe(); resolve(); } }); } });
  first.dispatch(applyPreset({glass:"vertical-rectangle",gravel:["natural"],soil:["potting","binding"],moss:[],plants:["cam-nhung"]}));
  first.dispatch(chooseMaterial({ key:"moss",id:"new-api-moss",max:3 }));
  first.dispatch(changeNote("Một góc rừng"));
  first.dispatch(rememberSubmission({key:"11111111-1111-4111-8111-111111111111",fingerprint:"a".repeat(64)})); await persistence.flush(); persistence.pause();
  const second = makeStore(storage, catalog); persistence = persistStore(second);
  await new Promise<void>(resolve => { if(persistence.getState().bootstrapped) resolve(); else { const unsubscribe = persistence.subscribe(() => { if(persistence.getState().bootstrapped) { unsubscribe(); resolve(); } }); } });
  assert.equal(second.getState().design.selection.glass,"vertical-rectangle");
  assert.deepEqual(second.getState().design.selection.moss,["new-api-moss"]);
  assert.equal(second.getState().design.note,"Một góc rừng");
  assert.equal(second.getState().design.submissionKey,"11111111-1111-4111-8111-111111111111");
  assert.equal(second.getState().design.submissionFingerprint,"a".repeat(64));
  const serialized = values.get("persist:terrala-design")!;
  assert.ok(!serialized.includes("phone")); assert.ok(!serialized.includes("accessToken"));
  second.dispatch(resetDesign()); await persistence.flush(); persistence.pause();
  assert.equal(JSON.parse(JSON.parse(values.get("persist:terrala-design")!).selection).glass, "");
});
test("corrupt or stale persisted drafts cannot introduce unknown IDs or duplicate/excess moss", () => {
  assert.equal(sanitizeDraft(null).selection.glass, "");
  const restored = sanitizeDraft({ selection:{glass:"removed",moss:["co","co","cushion","quyenba","wepping","bad"]}, note:123 },fixtureCatalog);
  assert.equal(restored.selection.glass, ""); assert.deepEqual(restored.selection.moss,["co","cushion","quyenba"]); assert.equal(restored.note,"");
});
test("unconfirmed prices and quantity-based units never produce a made-up estimate", () => {
  const selection = sanitizeDraft({selection:{glass:"cubic-square"}}).selection;
  const catalog = { ready:true,categories:[],presets:[],presetsReady:true,pricing:{labourBps:5000,quantityMode:"per_selection",configured:true},materials:[material("glass","cubic-square",{name:"Bể",priceVnd:100001,unit:"bể",availability:"available"})] };
  assert.equal(estimateSelection(selection,catalog),150002);
  assert.equal(estimateSelection(selection,{...catalog,pricing:{...catalog.pricing,quantityMode:"quantity"}}),null);
  assert.equal(estimateSelection(selection,{...catalog,materials:[{...catalog.materials[0],priceVnd:null}]}),null);
});

test("offline hydration keeps IDs absent from any old FE list; live catalog removes stale IDs and updates limits", () => {
  const raw = {selection:{glass:"vertical-rectangle",gravel:[],soil:[],moss:["new-api-moss","co","quyenba","cushion"],plants:[]},note:"Giữ khi mất mạng",submissionKey:"11111111-1111-4111-8111-111111111111",submissionFingerprint:"a".repeat(64)};
  const offline = sanitizeDraft(raw,{...fixtureCatalog,ready:false,materials:[],categories:[]});
  assert.equal(offline.note,raw.note); assert.deepEqual(offline.selection,raw.selection);
  assert.equal(offline.submissionKey,raw.submissionKey);
  const liveCatalog = {...fixtureCatalog,materials:[...fixtureCatalog.materials,material("moss","new-api-moss")],categories:fixtureCatalog.categories.map(item=>item.code === "moss" ? {...item,maxSelections:4}:item)};
  assert.deepEqual(sanitizeDraft(offline,liveCatalog).selection.moss,raw.selection.moss);
  const outOfStock = {...liveCatalog,materials:liveCatalog.materials.map(item => ({...item,availability:"unavailable" as const}))};
  assert.deepEqual(sanitizeDraft(offline,outOfStock).selection,raw.selection);
  assert.equal(sanitizeDraft(offline,outOfStock).submissionKey,raw.submissionKey);
  const reduced = sanitizeDraft(offline,{...liveCatalog,categories:liveCatalog.categories.map(item=>item.code === "moss" ? {...item,maxSelections:2}:item)});
  assert.deepEqual(reduced.selection.moss,["new-api-moss","co"]); assert.equal(reduced.submissionKey,null);
  assert.equal(reduced.note,raw.note);
});
