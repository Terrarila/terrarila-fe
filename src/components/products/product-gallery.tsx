"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/product-types";
import styles from "./product-gallery.module.css";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const currentIndex = selected < images.length ? selected : 0;
  const current = images[currentIndex];
  return (
    <section aria-label={`Hình ảnh ${name}`} className={styles.gallery}>
      <div className={styles.mainImage}>
        {current ? (
          <Image
            src={current.url}
            alt={current.alt || name}
            fill
            sizes="(max-width: 760px) 90vw, 48vw"
            unoptimized={/^https?:\/\//.test(current.url)}
            className={styles.image}
            preload={currentIndex === 0}
          />
        ) : (
          <p>Ảnh sản phẩm đang được cập nhật.</p>
        )}
      </div>
      {images.length > 1 ? (
        <>
          <p className={styles.counter} aria-live="polite">
            Ảnh {currentIndex + 1} / {images.length}
          </p>
          <div className={styles.thumbnails} aria-label="Chọn ảnh sản phẩm">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                className={styles.thumbnail}
                aria-pressed={index === currentIndex}
                aria-label={`Xem ảnh ${index + 1}: ${image.alt || name}`}
                onClick={() => setSelected(index)}
              >
                <Image
                  src={image.url}
                  alt=""
                  width={88}
                  height={100}
                  loading="lazy"
                  unoptimized={/^https?:\/\//.test(image.url)}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
