"use client";

import { useId, useRef, type ReactNode } from "react";
import styles from "./landing-sections.module.css";

type ActionVariant = "outline" | "forest" | "light" | "clay";
type ModalActionProps = {
  label: string;
  title: string;
  children: ReactNode;
  variant?: ActionVariant;
};

export function ModalAction({ label, title, children, variant = "outline" }: ModalActionProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return <>
    <button className={`${styles.action} ${styles[variant]}`} type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{label}</button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} onClick={(event) => {
      if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
      }
    }}>
      <div className={styles.dialogHeader}>
        <h2 id={titleId}>{title}</h2>
        <button type="button" className={styles.close} aria-label="Đóng cửa sổ" onClick={() => dialog.current?.close()}>×</button>
      </div>
      {children}
    </dialog>
  </>;
}

export function ContactAction({ channel, href, variant = "forest", product }: {
  channel: "Messenger" | "Zalo";
  href?: string;
  variant?: ActionVariant;
  product?: string;
}) {
  const label = `${channel} →`;
  if (href) return <a className={`${styles.action} ${styles[variant]}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={product ? `Hỏi mua ${product} qua ${channel}` : `Liên hệ Petite Terre qua ${channel}`}>{label}</a>;

  return <ModalAction label={label} title={`Liên hệ qua ${channel}`} variant={variant}>
    <p className={styles.dialogText}>Thông tin liên hệ của Petite Terre đang được cập nhật. Vui lòng quay lại sau.</p>
  </ModalAction>;
}
