import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadProduct } from "@/lib/product-catalog";
import { productGallery } from "@/lib/product-presentation";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { RelatedProducts } from "@/components/products/related-products";
import styles from "@/components/products/product-details.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  return product
    ? {
        title: `${product.name} | Petite Terre`,
        description: product.description || undefined,
      }
    : { title: "Không tìm thấy bể | Petite Terre", robots: { index: false } };
}
export default async function ProductPage({ params }: Props) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();
  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="Đường dẫn trang">
        <ol>
          <li>
            <Link href="/">Trang chủ</Link>
          </li>
          <li>
            <Link href="/#collection">Bể có sẵn</Link>
          </li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className={styles.details}>
        <ProductGallery
          key={product.id}
          images={productGallery(product)}
          name={product.name}
        />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts currentId={product.id} />
    </>
  );
}
