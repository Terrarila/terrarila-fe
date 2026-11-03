export type ProductImage = { url: string; alt: string };
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: ProductImage[];
  highlightImageUrl: string | null;
  priceVnd: number | null;
  availability: "available" | "unavailable" | "inquiry";
};
export type PortfolioEntry = Pick<
  Product,
  "id" | "slug" | "name" | "description" | "images" | "highlightImageUrl"
> & {
  sourceProductId: string | null;
};
export type TerrariumItem = {
  id: string;
  name: string;
  description: string;
  href?: string;
  price?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  highlightImageUrl?: string | null;
};
