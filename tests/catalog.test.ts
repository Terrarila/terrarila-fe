import assert from "node:assert/strict";
import test from "node:test";
import { buildSteps } from "../src/components/custom-terrarium/material-catalog.ts";
import { fixtureCatalog, material, category } from "./catalog-fixture.ts";
test("step labels, descriptions, images, order and new options come only from the API", () => {
  const catalog={...fixtureCatalog,categories:[category("moss",{name:"Tên API đã đổi",description:"Mô tả API",sortOrder:2,maxSelections:4}),category("glass",{sortOrder:0})],materials:[material("moss","new-api-moss",{name:"Rêu mới từ API",description:"Chi tiết mới",imageUrl:"/assets/new-moss.png",sortOrder:0}),material("glass","new-api-glass",{name:"Bể mới",sortOrder:1}),material("moss","co",{sortOrder:3})]};
  const steps=buildSteps(catalog);
  assert.deepEqual(steps.map(step=>step.key),["glass","moss"]);
  assert.equal(steps[1].title,"Tên API đã đổi");assert.equal(steps[1].description,"Mô tả API");assert.equal(steps[1].maxSelections,4);
  assert.deepEqual(steps[1].options[0],{id:"new-api-moss",name:"Rêu mới từ API",detail:"Chi tiết mới",src:"/assets/new-moss.png"});
  assert.deepEqual(steps[0].options.map(option=>option.id),["new-api-glass"]);
  assert.deepEqual(buildSteps({...catalog,ready:false}),[]);
  assert.deepEqual(buildSteps({...catalog,materials:[]})[1].options,[]);
});
