import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ProductPage, {
  generateMetadata,
} from "../../src/app/products/[slug]/page";
import ProductError from "../../src/app/products/[slug]/error";
import { RelatedProducts } from "../../src/components/products/related-products";
import { loadProduct, loadProducts } from "../../src/lib/product-catalog";
import type { Product } from "../../src/lib/product-types";

vi.mock("@/lib/product-catalog", () => ({
  loadProduct: vi.fn(),
  loadProducts: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_404");
  },
}));
vi.mock("@/components/shared/shop-contact-actions", () => ({
  ContactActions: () => <span>Liên hệ</span>,
}));
const product: Product = {
  id: "current",
  slug: "current",
  name: "Bể thử",
  description: "Mô tả API",
  images: [],
  highlightImageUrl: null,
  priceVnd: 300000,
  availability: "available",
};
const params = Promise.resolve({ slug: "current" });
it("renders not-found only when the catalog reports a missing product", async () => {
  vi.mocked(loadProduct).mockResolvedValue(null);
  await expect(ProductPage({ params })).rejects.toThrow("NEXT_404");
  expect(await generateMetadata({ params })).toMatchObject({
    robots: { index: false },
  });
});
it("lets API outages reach the error boundary instead of showing a false 404", async () => {
  vi.mocked(loadProduct).mockRejectedValue(new Error("API_UNAVAILABLE"));
  await expect(ProductPage({ params })).rejects.toThrow("API_UNAVAILABLE");
});
it("uses the actual product for page metadata", async () => {
  vi.mocked(loadProduct).mockResolvedValue(product);
  expect(await generateMetadata({ params })).toEqual({
    title: "Bể thử | Petite Terre",
    description: "Mô tả API",
  });
});
it("renders a useful related empty state when only the current product exists", async () => {
  vi.mocked(loadProducts).mockResolvedValue([product]);
  render(await RelatedProducts({ currentId: product.id }));
  expect(screen.getByText(/Hiện chưa có bể có sẵn khác/)).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Xem chi tiết/ }),
  ).not.toBeInTheDocument();
});
it("keeps the main page usable when the related catalog fails", async () => {
  vi.mocked(loadProducts).mockRejectedValue(new Error("API_UNAVAILABLE"));
  render(await RelatedProducts({ currentId: product.id }));
  expect(
    screen.getByText(/Chưa tải được các bể liên quan/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Xem bộ sưu tập →" }),
  ).toHaveAttribute("href", "/#collection");
});
it("offers a working retry action for API errors", async () => {
  const retry = vi.fn();
  render(<ProductError error={new Error("API_UNAVAILABLE")} retry={retry} />);
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Thử lại" }));
  expect(retry).toHaveBeenCalledOnce();
});
