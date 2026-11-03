import Link from "next/link";
import type { Product } from "@/lib/product-types";
import { formatProductPrice } from "@/lib/product-presentation";
import { ContactActions } from "@/components/shared/shop-contact-actions";
import styles from "./product-details.module.css";

const availabilityLabels: Record<Product["availability"], string> = {
  available: "Có sẵn",
  unavailable: "Hiện chưa có sẵn",
  inquiry: "Liên hệ để xác nhận",
};
export function ProductInfo({ product }: { product: Product }) {
  return (
    <section className={styles.info} aria-labelledby="product-title">
      <p className={styles.eyebrow}>MỘT GÓC THIÊN NHIÊN, DÀNH CHO BẠN</p>
      <h1 id="product-title" className={styles.title}>
        {product.name}
      </h1>
      <span className={styles.availability}>
        {availabilityLabels[product.availability]}
      </span>
      <p className={styles.price}>{formatProductPrice(product.priceVnd)}</p>
      <div className={styles.description}>
        <h2>Về chiếc bể này</h2>
        <p>
          {product.description || "Shop đang cập nhật mô tả cho chiếc bể này."}
        </p>
      </div>
      <div className={styles.contact}>
        <h2>
          {product.availability === "available"
            ? "Bạn thích chiếc bể này?"
            : "Trao đổi cùng Petite Terre"}
        </h2>
        <p>Nhắn shop kèm tên bể để xác nhận tình trạng và thông tin đặt mua.</p>
        <ContactActions product={product.name} />
      </div>
      <Link className={styles.customLink} href="/lam-theo-yeu-cau">
        Muốn một bố cục riêng? Thiết kế bể của bạn →
      </Link>
    </section>
  );
}
