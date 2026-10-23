"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { createAssembly } from "./assembly-animation";
import { prepareMaterials } from "./model-materials";
import type { Timeline } from "../hero/timeline";

export function TerrariumModel({ timeline, onReady }: { timeline: Timeline; onReady: () => void }) {
  const gltf = useGLTF("/assets/terrarium-current.glb");
  const invalidate = useThree((state) => state.invalidate);
  const last = useRef(-1);
  const model = useMemo(() => {
    // This GLB has no skin. Clone nodes, share immutable geometry/texture assets.
    const root = gltf.scene.clone(true);
    const disposeMaterials = prepareMaterials(root);
    const assembly = createAssembly(root, gltf.animations);
    return { root, assembly, disposeMaterials };
  }, [gltf]);
  useEffect(() => {
    model.assembly.seek(timeline.read().progress);
    onReady();
    invalidate();
    return timeline.subscribe(() => {
      if (timeline.read().visible) invalidate();
    });
  }, [timeline, invalidate, model, onReady]);
  useEffect(() => () => { model.assembly.dispose(); model.disposeMaterials(); }, [model]);
  useFrame(() => {
    const { progress } = timeline.read();
    if (progress !== last.current) {
      model.assembly.seek(progress);
      last.current = progress;
    }
  });
  // Blender's glTF exporter already converts Z-up -> Y-up. No rotation here.
  // The exported Terrarium node has scale .1; compensate ONCE at this wrapper.
  return <group scale={10}><primitive object={model.root} dispose={null} /></group>;
}
