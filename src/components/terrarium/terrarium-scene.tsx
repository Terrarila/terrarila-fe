"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { Suspense, useCallback, useEffect, useState } from "react";
import { TerrariumModel } from "./terrarium-model";
import { TerrariumSceneFallback } from "../hero/terrarium-scene-fallback";
import type { Timeline } from "../hero/timeline";

function TerrariumCamera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(size.width < 500 ? 4.2 : 3.7, 3.1, size.width < 500 ? 6.6 : 5.6);
    camera.lookAt(0, 0.7, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

function TerrariumModelLoading() {
  const { progress } = useProgress();
  return <TerrariumSceneFallback message={`Đang tải bể mới… ${Math.round(progress)}%`} />;
}

export default function TerrariumScene({ timeline }: { timeline: Timeline }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    let lastVisible = true;
    const update = () => {
      const nextVisible = timeline.read().visible;
      if (nextVisible !== lastVisible) {
        lastVisible = nextVisible;
        setVisible(nextVisible);
      }
    };
    update();
    return timeline.subscribe(update);
  }, [timeline]);
  if (failed) return <TerrariumSceneFallback complete message="WebGL đã dừng. Bạn có thể xem ảnh bể hoàn thiện bên dưới." />;
  return <div className="scene-shell" data-model-ready={ready} data-render-mode={visible ? "demand" : "never"}>
    {!ready ? <TerrariumModelLoading /> : null}
    <Canvas
      className={ready ? "canvas-ready" : "canvas-loading"}
      aria-label="Bể kính 3D được lấp đầy theo vị trí cuộn"
      role="img"
      dpr={[1, 1.5]}
      frameloop={visible ? "demand" : "never"}
      camera={{ fov: 35, near: 0.1, far: 50, position: [3.7, 3.1, 5.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={<TerrariumSceneFallback complete message="Trình duyệt chưa hỗ trợ WebGL. Đây là ảnh bể hoàn thiện." />}
      onCreated={({ gl }) => {
        gl.setClearColor(0xf5f2e9, 0);
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); setFailed(true); }, { once: true });
      }}
    >
      <TerrariumCamera />
      <hemisphereLight args={[0xf7ffec, 0x756746, 2.2]} />
      <directionalLight color={0xffe4be} intensity={3} position={[-3, 6, 4]} />
      <directionalLight color={0xc9e8b0} intensity={1} position={[3, 3, -2]} />
      <Suspense fallback={null}>
        {/* Generated locally once, no remote HDR/texture request or live capture. */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={1.5} color="#f8f4e9" position={[0, 5, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 5, 1]} />
          <Lightformer form="rect" intensity={1} color="#e8efde" position={[-4, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} />
          {/* A narrow studio strip reflects in the front glass, beside the plants. */}
          <Lightformer
            form="rect"
            intensity={5}
            color="#fff8ed"
            position={[-5, -1.8, 4.5]}
            target={[0, 0, 0]}
            scale={[0.65, 5, 1]}
          />
        </Environment>
        <TerrariumModel timeline={timeline} onReady={onReady} />
      </Suspense>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.65, 0.09, 2.65]} />
        <meshStandardMaterial color={0xc7b48a} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[3.3, 3.3]} />
        <meshBasicMaterial color={0x32402c} transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </Canvas>
  </div>;
}
