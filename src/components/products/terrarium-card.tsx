import Image from "next/image";
import Link from "next/link";
import type { TerrariumItem } from "@/lib/product-types";
import { ContactActions } from "@/components/shared/shop-contact-actions";
import styles from "@/components/landing/landing-sections.module.css";

export function TerrariumCard({ item }: { item: TerrariumItem }) {
  const image = item.imageUrl;
  const content = (
    <>
      <div className={styles.cardImage}>
        {image ? (
          <Image
            src={image}
            unoptimized={/^https?:\/\//.test(image)}
            loading="lazy"
            alt={item.imageAlt || item.name}
            width={1920}
            height={2560}
            className={styles.baseImage}
          />
        ) : (
          <p>Ảnh đang được cập nhật.</p>
        )}
        {image && item.highlightImageUrl ? (
          <Image
            src={item.highlightImageUrl}
            unoptimized={/^https?:\/\//.test(item.highlightImageUrl)}
            loading="lazy"
            alt=""
            className={styles.hoverImage}
            sizes="(max-width: 760px) 80vw, 20vw"
            fill
          />
        ) : null}
      </div>
      <div className={styles.cardTitle}>
        <h3>{item.name}</h3>
        {item.price ? <span className={styles.price}>{item.price}</span> : null}
      </div>
      <p className={styles.cardDescription}>{item.description}</p>
    </>
  );
  return (
    <article
      className={`${styles.card} ${item.price ? styles.productCard : styles.portfolioCard}`}
    >
      {item.href ? (
        <Link
          className={styles.cardDetails}
          href={`${item.href}#top`}
          aria-label={`Xem chi tiết ${item.name}`}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      {item.price ? <ContactActions product={item.name} /> : null}
    </article>
  );
}
export function TerrariumGrid({
  items,
  gallery = false,
}: {
  items: TerrariumItem[];
  gallery?: boolean;
}) {
  return (
    <div className={`${styles.cardGrid} ${gallery ? styles.gallery : ""}`}>
      {items.map((item) => (
        <TerrariumCard key={item.id} item={item} />
      ))}
    </div>
  );
}
