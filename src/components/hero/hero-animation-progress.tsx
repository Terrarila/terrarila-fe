"use client";

import { useEffect, useRef } from "react";
import { STAGES, stageAt } from "./stages";
import type { Timeline } from "./timeline";

export function HeroStageProgressLabel({ timeline }: { timeline: Timeline }) {
  const label = useRef<HTMLSpanElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = () => {
      const { progress } = timeline.read();
      if (label.current) label.current.textContent = STAGES[stageAt(progress)].label;
      if (percent.current) percent.current.textContent = `${Math.round(progress * 100)}%`;
    };
    update();
    return timeline.subscribe(update);
  }, [timeline]);
  return <div className="caption"><span ref={label}>{STAGES[0].label}</span><span ref={percent}>0%</span></div>;
}

export function HeroAnimationProgressBar({ timeline }: { timeline: Timeline }) {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = () => { if (bar.current) bar.current.style.transform = `scaleX(${timeline.read().progress})`; };
    update();
    return timeline.subscribe(update);
  }, [timeline]);
  return <div className="progress" aria-hidden="true"><span ref={bar} /></div>;
}
