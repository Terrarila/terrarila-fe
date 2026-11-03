import styles from "@/components/products/product-details.module.css";
export default function ProductLoading() {
  return (
    <div className={styles.loading} role="status">
      Đang tải thông tin chiếc bể…
    </div>
  );
}
