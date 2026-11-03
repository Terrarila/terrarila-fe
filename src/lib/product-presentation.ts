import type {
  PortfolioEntry,
  Product,
  ProductImage,
  TerrariumItem,
} from "./product-types";

export function productPath(slug: string) {
  return `/products/${encodeURIComponent(slug)}`;
}
export function formatProductPrice(price: number | null) {
  return price === null
    ? "Shop xác nhận giá"
    : `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
}
export function entryCard(
  entry: Pick<
    Product,
    "id" | "name" | "description" | "images" | "highlightImageUrl"
  >,
): TerrariumItem {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    imageUrl: entry.images[0]?.url ?? null,
    imageAlt: entry.images[0]?.alt || entry.name,
    highlightImageUrl: entry.highlightImageUrl ?? null,
  };
}
export function productCard(product: Product): TerrariumItem {
  return {
    ...entryCard(product),
    href: productPath(product.slug),
    price: formatProductPrice(product.priceVnd),
  };
}
export function portfolioCard(entry: PortfolioEntry): TerrariumItem {
  return {
    ...entryCard(entry),
    ...(entry.sourceProductId ? { href: productPath(entry.slug) } : {}),
  };
}
export function availableRelatedProducts(
  products: Product[],
  currentId: string,
  limit = 4,
) {
  return products
    .filter(
      (product) =>
        product.id !== currentId && product.availability === "available",
    )
    .slice(0, limit);
}
export function productGallery(product: Product): ProductImage[] {
  const images = product.images
    .filter((image) => image.url)
    .map((image) => ({ ...image, alt: image.alt || product.name }));
  if (
    product.highlightImageUrl &&
    !images.some((image) => image.url === product.highlightImageUrl)
  ) {
    images.push({
      url: product.highlightImageUrl,
      alt: `${product.name} — ảnh chi tiết`,
    });
  }
  return images;
}
