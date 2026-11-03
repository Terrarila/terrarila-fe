import type { ReactNode } from "react";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/landing-sections";
import styles from "@/components/products/product-details.module.css";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="top" className={styles.page}>
        <div className={styles.content}>{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
