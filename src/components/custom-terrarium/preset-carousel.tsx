"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./preset-carousel.module.css";

export default function PresetCarousel({
  items,
}: {
  items: { id: string; content: ReactNode }[];
}) {
  const [viewport, api] = useEmblaCarousel({ align: "start", loop: false });
  const [navigation, setNavigation] = useState({
    previous: false,
    next: false,
    index: 0,
  });
  useEffect(() => {
    if (!api) return;
    const sync = () =>
      setNavigation({
        previous: api.canScrollPrev(),
        next: api.canScrollNext(),
        index: api.selectedScrollSnap(),
      });
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);
  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Bể mẫu đã làm"
    >
      <div
        className={styles.viewport}
        ref={viewport}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            api?.scrollPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            api?.scrollNext();
          }
        }}
      >
        <div className={styles.track}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${items.length}`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          disabled={!navigation.previous}
          onClick={() => api?.scrollPrev()}
          aria-label="Bể mẫu trước"
        >
          ← Trước
        </button>
        <span aria-live="polite">
          Mẫu {navigation.index + 1} / {items.length}
        </span>
        <button
          type="button"
          disabled={!navigation.next}
          onClick={() => api?.scrollNext()}
          aria-label="Bể mẫu sau"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
