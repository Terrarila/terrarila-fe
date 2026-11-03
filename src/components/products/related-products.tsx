import Link from "next/link";
import type { TerrariumItem } from "@/lib/product-types";
import { loadProducts } from "@/lib/product-catalog";
import {
  availableRelatedProducts,
  productCard,
} from "@/lib/product-presentation";
import { TerrariumGrid } from "./terrarium-card";
import styles from "./product-details.module.css";

export async function RelatedProducts({ currentId }: { currentId: string }) {
  let items: TerrariumItem[] = [];
  let failed = false;
  try {
    items = availableRelatedProducts(await loadProducts(), currentId).map(
      productCard,
    );
  } catch {
    failed = true;
  }
  return (
    <section className={styles.related} aria-labelledby="related-title">
      <div className={styles.relatedHeading}>
        <div>
          <p className={styles.eyebrow}>THÊM MỘT GÓC XANH</p>
          <h2 id="related-title">Những bể có sẵn khác</h2>
        </div>
        <Link href="/#collection" className={styles.textLink}>
          Xem bộ sưu tập →
        </Link>
      </div>
      {items.length ? (
        <TerrariumGrid items={items} />
      ) : (
        <p className={styles.muted}>
          {failed
            ? "Chưa tải được các bể liên quan. Bạn có thể quay lại bộ sưu tập hoặc thử lại sau."
            : "Hiện chưa có bể có sẵn khác. Bạn có thể nhắn shop hoặc thiết kế một bể theo ý mình."}
        </p>
      )}
    </section>
  );
}
