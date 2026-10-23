import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createAssembly } from "../src/components/terrarium/assembly-animation.ts";

async function geometryOnlyModel() {
  const file = await readFile(new URL("../public/assets/terrarium-current.glb", import.meta.url));
  const length = file.readUInt32LE(12);
  const json = JSON.parse(file.subarray(20, 20 + length).toString());
  // CPU test uses the real node/geometry/animation data. Texture rendering is
  // checked in the browser; removing textures avoids needing a DOM in Node.
  delete json.images; delete json.textures; delete json.materials;
  for (const mesh of json.meshes) for (const primitive of mesh.primitives) delete primitive.material;
  const chunk = Buffer.from(JSON.stringify(json).padEnd(Math.ceil(JSON.stringify(json).length / 4) * 4, " "));
  const binary = file.subarray(20 + length);
  const output = Buffer.alloc(20 + chunk.length + binary.length);
  output.writeUInt32LE(0x46546c67, 0); output.writeUInt32LE(2, 4); output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(chunk.length, 12); output.writeUInt32LE(0x4e4f534a, 16);
  chunk.copy(output, 20); binary.copy(output, 20 + chunk.length);
  return new GLTFLoader().parseAsync(output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength), "");
}

test("real GLB stays fixed size while falling, hides before entry and seeks backwards after completion", async () => {
  const model = await geometryOnlyModel();
  const assembly = createAssembly(model.scene, model.animations);
  assert.equal(assembly.duration, 10);
  const pebble = model.scene.getObjectByName("Pebble_000")!;
  assert.ok(pebble);
  const size = pebble.scale.clone();
  assembly.seek(0);
  assert.equal(pebble.visible, false);
  assembly.seek(0.15);
  const falling = pebble.position.clone();
  assert.deepEqual(pebble.scale.toArray(), size.toArray());
  assert.equal(pebble.visible, true);
  assembly.seek(1);
  const resting = pebble.position.clone();
  assert.ok(falling.y > resting.y, "the real pebble translation falls downward");
  assembly.seek(0.15);
  assert.deepEqual(pebble.position.toArray(), falling.toArray());
  assert.deepEqual(pebble.scale.toArray(), size.toArray());
  assembly.seek(0);
  assert.equal(pebble.visible, false);
  // React Strict Mode re-runs effect setup after cleanup in development.
  assembly.dispose();
  assembly.seek(1);
  assert.equal(pebble.visible, true);
  assert.deepEqual(pebble.position.toArray(), resting.toArray());
  assembly.dispose();
});
