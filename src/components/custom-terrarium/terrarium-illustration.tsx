"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import styles from "./terrarium-builder.module.css";

import { type MaterialOption, type TerrariumSelection } from "./material-catalog";

export function TerrariumIllustration({ selection, options, thumbnail = false }: { selection: TerrariumSelection; options: MaterialOption[]; thumbnail?: boolean }) {
  const glass = options.find((option) => option.id === selection.glass);
  if (!glass) return <p className={styles.emptyPreview}>Chọn một dáng bể kính để bắt đầu.</p>;
  if (!glass.src) return <p className={styles.emptyPreview}>{glass.name}<br />Chưa có ảnh minh hoạ.</p>;
  return <div key={glass.id} className={styles.imageStage}>
    <Image
      src={glass.src}
      alt={thumbnail ? "" : glass.name}
      fill
      loading="eager"
      unoptimized={/^https?:\/\//.test(glass.src)}
      sizes={thumbnail ? "68px" : "(max-width: 760px) 44vw, (max-width: 1200px) 30vw, 450px"}
      className={styles.illustration}
    />
  </div>;
}

// A single thumbnail renderer is shared by options and the selected-material list.
export function MaterialThumbnail({ option, sizes = "68px" }: { option: MaterialOption; sizes?: string }) {
  return <span className={styles.materialImage} aria-hidden="true">
    {option.src ? <Image src={option.src} alt="" fill unoptimized={/^https?:\/\//.test(option.src)} sizes={sizes} className={styles.illustration} /> : <span className={styles.missingImage}>Chưa có ảnh</span>}
  </span>;
}

// One dialog serves every preview button; the larger image loads only when opened.
export function MaterialImageDialog({ option, onClose }: { option: MaterialOption | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);

  useEffect(() => {
    if (!option) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [option]);

  return <dialog ref={dialogRef} className={styles.imageDialog} aria-labelledby={titleId} onClose={onClose} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current?.close();
  }}>
    <div className={styles.imageDialogHeader}>
      <h2 id={titleId}>{option?.name}</h2>
      <button type="button" className={styles.dialogClose} aria-label="Đóng ảnh xem trước" onClick={() => dialogRef.current?.close()} autoFocus>×</button>
    </div>
    {option?.src ? <div className={styles.expandedImage}>
      {loadedSource !== option.src || failedSource === option.src ? <p className={styles.imageLoading} role="status">{failedSource === option.src ? "Không thể tải ảnh. Vui lòng đóng và mở lại." : "Đang tải ảnh…"}</p> : null}
      <Image key={option.src} src={option.src} alt={option.name} fill unoptimized={/^https?:\/\//.test(option.src)} loading="eager" sizes="(max-width: 760px) calc(94vw - 32px), (max-width: 1024px) calc(94vw - 48px), 912px" className={styles.illustration}
        onLoad={() => { setLoadedSource(option.src ?? null); setFailedSource(null); }}
        onError={() => setFailedSource(option.src ?? null)}
      />
    </div> : null}
  </dialog>;
}
