import Link from "next/link";
import styles from "@/components/products/product-details.module.css";
export default function ProductNotFound() {
  return (
    <section className={styles.state}>
      <p className={styles.eyebrow}>PETITE TERRE</p>
      <h1>Không tìm thấy chiếc bể này.</h1>
      <p>Bể có thể đã được gỡ khỏi bộ sưu tập hoặc đường dẫn chưa chính xác.</p>
      <Link className={styles.textLink} href="/#collection">
        Khám phá những bể khác →
      </Link>
    </section>
  );
}
