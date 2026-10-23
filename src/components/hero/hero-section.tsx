"use client";

import dynamic from "next/dynamic";
import { Component, useRef, useState, type ReactNode } from "react";
import { createTimeline } from "./timeline";
import { useHeroTimeline } from "./use-hero-timeline";
import { HeroAnimationControls } from "./hero-animation-controls";
import { HeroAnimationProgressBar, HeroStageProgressLabel } from "./hero-animation-progress";
import { TerrariumSceneFallback } from "./terrarium-scene-fallback";

const TerrariumScene = dynamic(() => import("../terrarium/terrarium-scene"), {
  ssr: false,
  loading: () => <TerrariumSceneFallback message="Đang chuẩn bị bể kính…" />,
});

class TerrariumSceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <TerrariumSceneFallback complete message="Không thể tải cảnh 3D. Bạn có thể xem ảnh bể và ảnh concept bên dưới." /> : this.props.children;
  }
}

export function HeroSection({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const [timeline] = useState(createTimeline);
  useHeroTimeline(timeline, section);
  return <section className="relative journey" id="journey" ref={section} aria-label="Một khu rừng thành hình">
    <div className="container sticky">
      <div className="copy">{children}<HeroAnimationControls timeline={timeline} /></div>
      <div className="visual">
        <TerrariumSceneErrorBoundary><TerrariumScene timeline={timeline} /></TerrariumSceneErrorBoundary>
        <HeroStageProgressLabel timeline={timeline} />
      </div>
    </div>
    <div className="sticky">
      <HeroAnimationProgressBar timeline={timeline} />
    </div>
  </section>;
}
