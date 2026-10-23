"use client";

import { useEffect, type RefObject } from "react";
import { clampProgress, type Timeline } from "./timeline";
import { stageAt } from "./stages";

export function useHeroTimeline(timeline: Timeline, sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const sticky = section.querySelector<HTMLElement>(".sticky")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let expectedScroll: number | undefined;
    let lastStage = -1;
    const extent = () => Math.max(1, section.offsetHeight - sticky.offsetHeight);
    const sectionTop = () => section.getBoundingClientRect().top + window.scrollY;
    const writeScroll = (progress: number) => {
      expectedScroll = sectionTop() + progress * extent();
      window.scrollTo({ top: expectedScroll, behavior: "instant" });
    };
    const unsubscribeScroll = timeline.bindScroll(writeScroll);
    const readScroll = () => {
      if (timeline.read().reduced) return;
      // Programmatic movement is an output of the timeline, not a second input.
      if (expectedScroll !== undefined && Math.abs(window.scrollY - expectedScroll) < 2) return;
      expectedScroll = undefined;
      timeline.scroll(clampProgress((window.scrollY - sectionTop()) / extent()));
    };
    const interrupt = () => { expectedScroll = undefined; timeline.pause(); };
    const interruptKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input,button,a")) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) interrupt();
    };
    const renderPlayback = (now: number) => {
      frame = 0;
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 0;
      previousTime = now;
      timeline.tick(delta);
      if (timeline.read().playing && !frame) frame = requestAnimationFrame(renderPlayback);
      else if (!timeline.read().playing) previousTime = 0;
    };
    const update = () => {
      const { progress, playing, reduced } = timeline.read();
      section.dataset.progress = progress.toFixed(4);
      section.dataset.playing = String(playing);
      section.dataset.reduced = String(reduced);
      const stage = stageAt(progress);
      if (stage !== lastStage) {
        section.querySelectorAll<HTMLElement>("[data-stage-copy]").forEach((copy) => {
          copy.hidden = Number(copy.dataset.stageCopy) !== stage;
        });
        lastStage = stage;
      }
      if (playing && !frame) frame = requestAnimationFrame(renderPlayback);
      if (!playing && frame) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    };
    const changeMotion = () => { timeline.setReduced(media.matches); if (!media.matches) readScroll(); };
    const resize = () => {
      if (timeline.read().reduced) return;
      // Keep controls and the new scroll extent in agreement after rotation.
      if (timeline.read().visible) writeScroll(timeline.read().progress);
      else { expectedScroll = undefined; readScroll(); }
    };
    const observer = new IntersectionObserver(([entry]) => timeline.setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(sticky);
    const onVisibility = () => { if (document.hidden) timeline.pause(); };
    const unsubscribe = timeline.subscribe(update);
    changeMotion();
    update();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", interruptKey);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener("change", changeMotion);
    return () => {
      unsubscribe(); unsubscribeScroll(); observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", interruptKey);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", changeMotion);
    };
  }, [timeline, sectionRef]);
}
