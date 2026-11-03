import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductGallery } from "../../src/components/products/product-gallery";
import { ProductInfo } from "../../src/components/products/product-info";
import { TerrariumCard } from "../../src/components/products/terrarium-card";
import {
  availableRelatedProducts,
  portfolioCard,
  productCard,
  productGallery,
} from "../../src/lib/product-presentation";
import type { PortfolioEntry, Product } from "../../src/lib/product-types";

vi.mock("@/components/shared/shop-contact-actions", () => ({
  ContactActions: () => (
    <div>
      <button>Messenger</button>
      <button>Zalo</button>
    </div>
  ),
}));
vi.mock("next/image", () => ({
  default: ({
    fill,
    preload,
    unoptimized,
    ...props
  }: React.ComponentProps<"img"> & {
    fill?: boolean;
    preload?: boolean;
    unoptimized?: boolean;
  }) => {
    void fill;
    void preload;
    void unoptimized;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));
const product: Product = {
  id: "product-1",
  slug: "vuon-nho",
  name: "Vườn nhỏ",
  description: "Dòng một\nDòng hai",
  priceVnd: null,
  availability: "inquiry",
  images: [
    { url: "/one.webp", alt: "Góc trước" },
    { url: "/two.webp", alt: "Góc bên" },
  ],
  highlightImageUrl: "/highlight.webp",
};
describe("Chi tiết sản phẩm", () => {
  it("links product-sourced portfolio entries without inventing routes for manual entries", () => {
    const entry: PortfolioEntry = { ...product, sourceProductId: product.id };
    expect(portfolioCard(entry).href).toBe("/products/vuon-nho");
    expect(
      portfolioCard({ ...entry, sourceProductId: null }).href,
    ).toBeUndefined();
    expect(productCard({ ...product, slug: "bể xanh" }).href).toBe(
      "/products/b%E1%BB%83%20xanh",
    );
  });
  it("excludes current, unavailable and inquiry products from related items", () => {
    const products = [
      product,
      ...["available", "unavailable", "inquiry", "available"].map(
        (availability, index) => ({
          ...product,
          id: `other-${index}`,
          availability: availability as Product["availability"],
        }),
      ),
    ];
    expect(
      availableRelatedProducts(products, product.id).map((p) => p.id),
    ).toEqual(["other-0", "other-3"]);
    expect(availableRelatedProducts(products, product.id, 1)).toHaveLength(1);
  });
  it("switches gallery images by thumbnail without adding duplicate highlight images", async () => {
    const images = productGallery(product);
    expect(images).toHaveLength(3);
    expect(
      productGallery({ ...product, highlightImageUrl: "/one.webp" }),
    ).toHaveLength(2);
    render(<ProductGallery name={product.name} images={images} />);
    expect(screen.getByAltText("Góc trước")).toHaveAttribute(
      "src",
      "/one.webp",
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Xem ảnh 2: Góc bên" }));
    expect(screen.getByAltText("Góc bên")).toHaveAttribute("src", "/two.webp");
    expect(screen.getByText("Ảnh 2 / 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Xem ảnh 2: Góc bên" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
  it("handles missing images and uses the product name for missing alt", () => {
    expect(
      productGallery({
        ...product,
        images: [{ url: "/one.webp", alt: "" }],
        highlightImageUrl: null,
      })[0].alt,
    ).toBe(product.name);
    render(<ProductGallery name={product.name} images={[]} />);
    expect(
      screen.getByText("Ảnh sản phẩm đang được cập nhật."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("keeps unconfirmed price unset and displays API availability accurately", () => {
    const { rerender } = render(<ProductInfo product={product} />);
    expect(screen.getByText("Shop xác nhận giá")).toBeInTheDocument();
    expect(screen.getByText("Liên hệ để xác nhận")).toBeInTheDocument();
    rerender(
      <ProductInfo
        product={{ ...product, priceVnd: 280000, availability: "unavailable" }}
      />,
    );
    expect(screen.getByText("280.000 ₫")).toBeInTheDocument();
    expect(screen.getByText("Hiện chưa có sẵn")).toBeInTheDocument();
    expect(screen.queryByText("Có sẵn")).not.toBeInTheDocument();
  });
  it("keeps contact buttons outside the card detail link", () => {
    render(<TerrariumCard item={productCard(product)} />);
    const link = screen.getByRole("link", { name: "Xem chi tiết Vườn nhỏ" });
    expect(link).toHaveAttribute("href", "/products/vuon-nho#top");
    expect(link.querySelector("button")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Messenger" }),
    ).toBeInTheDocument();
  });
});
