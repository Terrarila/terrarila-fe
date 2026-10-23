"use client";

import { useEffect, useRef } from "react";
import { STAGES, stageAt } from "./stages";
import type { Timeline } from "./timeline";

export function HeroAnimationControls({ timeline }: { timeline: Timeline }) {
  const root = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => {
      const { progress, playing, reduced } = timeline.read();
      if (slider.current) {
        slider.current.value = String(Math.round(progress * 1000));
        slider.current.disabled = reduced;
        slider.current.setAttribute("aria-valuetext", `${Math.round(progress * 100)}% · ${STAGES[stageAt(progress)].button}`);
      }
      if (play.current) {
        play.current.textContent = playing ? "Tạm dừng" : progress > 0 && progress < 1 ? "Phát tiếp" : "Phát lại";
        play.current.disabled = reduced;
      }
      root.current?.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button, i) => {
        button.classList.toggle("active", i === stageAt(progress));
        button.setAttribute("aria-pressed", String(i === stageAt(progress)));
        button.disabled = reduced;
      });
    };
    update();
    return timeline.subscribe(update);
  }, [timeline]);
  return (
    <div ref={root}>
      {/* <div className="steps" role="group" aria-label="Các lớp của bể">
        {STAGES.map((stage, index) => <button key={stage.button} data-step={index} type="button" aria-pressed={index === 0} className={index === 0 ? "active" : ""} onClick={() => timeline.seek(stage.progress)}>{stage.button}</button>)}
      </div>
      <div className="trial-controls">
        <button ref={play} type="button" onClick={() => timeline.togglePlay()}>Phát lại</button>
        <input ref={slider} type="range" min="0" max="1000" defaultValue="0" aria-label="Tiến trình vật liệu rơi" onChange={(event) => timeline.seek(Number(event.target.value) / 1000)} />
      </div>
      <span className="hint motion-hint">↓ Cuộn chậm để khám phá · kéo lên để xem lại</span>
      <span className="hint reduced-hint">Đang hiển thị bể hoàn thiện theo cài đặt giảm chuyển động.</span> */}
    </div>
  );
}
