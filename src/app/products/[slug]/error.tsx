"use client";
import Link from "next/link";
import styles from "@/components/products/product-details.module.css";
export default function ProductError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section className={styles.state}>
      <h1>Chưa tải được thông tin bể.</h1>
      <p>Kết nối đang gián đoạn. Vui lòng thử lại hoặc quay về bộ sưu tập.</p>
      <button className={styles.retry} type="button" onClick={retry}>
        Thử lại
      </button>
      <Link className={styles.textLink} href="/#collection">
        Về bộ sưu tập →
      </Link>
    </section>
  );
}
