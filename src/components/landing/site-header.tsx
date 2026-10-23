"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./site-header.module.css";

const navigation = [
  { href: "#collection", label: "Bể có sẵn" },
  { href: "#portfolio", label: "Bể đã làm" },
  { href: "#story", label: "Về chúng tôi" },
];

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return navigation.map(({ href, label }) => <a key={href} href={href} onClick={onNavigate}>{label}</a>);
}

function MenuIcon({ close = false }: { close?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d={close ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
  </svg>;
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const [open, setOpen] = useState(false);

  const restoreScroll = useCallback(() => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }, []);

  const closeDrawer = useCallback(() => {
    restoreScroll();
    dialogRef.current?.close();
    setOpen(false);
  }, [restoreScroll]);

  function openDrawer() {
    if (!dialogRef.current || dialogRef.current.open) return;
    dialogRef.current.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setOpen(true);
  }

  useEffect(() => {
    let anchor = window.scrollY;
    let frame = 0;
    const updateVisibility = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y <= 16 || dialogRef.current?.open) {
        headerRef.current?.setAttribute("data-hidden", "false");
        anchor = y;
      } else if (Math.abs(y - anchor) >= 8) {
        headerRef.current?.setAttribute("data-hidden", String(y > anchor));
        anchor = y;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateVisibility); };
    const desktop = window.matchMedia("(min-width: 1001px)");
    const onResize = () => { if (desktop.matches) closeDrawer(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onResize);
      cancelAnimationFrame(frame);
      restoreScroll();
    };
  }, [closeDrawer, restoreScroll]);

  return <header ref={headerRef} className={styles.header} data-hidden="false">
    <div className={`container ${styles.headerContent}`}>
      <a className={styles.brand} href="#top" aria-label="terralá — về đầu trang">
        <span className={styles.leaf} aria-hidden="true" />terralá
      </a>
      <nav className={styles.desktopNav} aria-label="Điều hướng chính"><NavigationLinks /></nav>
      <Link className={styles.customLink} href="/lam-theo-yeu-cau">Đặt theo yêu cầu →</Link>
      <button type="button" className={styles.menuButton} aria-label="Mở menu" aria-expanded={open} aria-controls="mobile-menu" onClick={openDrawer}>
        <MenuIcon />
      </button>
    </div>
    <dialog id="mobile-menu" ref={dialogRef} className={styles.drawer} aria-labelledby="mobile-menu-title" onCancel={closeDrawer} onClose={() => { restoreScroll(); setOpen(false); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDrawer();
    }}>
      <div className={styles.drawerHeading}>
        <span id="mobile-menu-title" className={styles.drawerTitle}>Khám phá Terralá</span>
        <button type="button" className={styles.closeButton} aria-label="Đóng menu" onClick={closeDrawer} autoFocus><MenuIcon close /></button>
      </div>
      <nav className={styles.mobileNav} aria-label="Điều hướng mobile"><NavigationLinks onNavigate={closeDrawer} /></nav>
      <Link className={styles.drawerCustomLink} href="/lam-theo-yeu-cau" onClick={closeDrawer}>Đặt theo yêu cầu →</Link>
    </dialog>
  </header>;
}
