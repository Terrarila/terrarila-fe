import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DesignPresets } from "@/components/custom-terrarium/design-presets-section";
import { builderCatalog } from "./builder-fixture";
import { createEmptySelection } from "@/components/custom-terrarium/material-catalog";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));
vi.mock("next/dynamic", () => ({
  default: () =>
    function Carousel({
      items,
    }: {
      items: { id: string; content: React.ReactNode }[];
    }) {
      return (
        <div role="region" aria-label="Bể mẫu đã làm">
          {items.map((item) => (
            <div key={item.id}>{item.content}</div>
          ))}
        </div>
      );
    },
}));
describe("Portfolio template selection", () => {
  function setup(count = 1) {
    const catalog = builderCatalog();
    catalog.presets = Array.from({ length: count }, (_, i) => ({
      id: `source-${i}`,
      slug: `source-${i}`,
      name: `Bể đã làm ${i + 1}`,
      description: "Từ Portfolio",
      imageUrl: "/assets/source.webp",
      isDemo: false,
      selectable: true,
      configured: true,
      materials: [catalog.materials[0].sizes![0]],
    }));
    return catalog;
  }
  it("applies the exact configured size, with no inferred material additions", async () => {
    const onApply = vi.fn();
    render(
      <DesignPresets
        catalog={setup()}
        selection={createEmptySelection()}
        onApply={onApply}
      />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: /Bể đã làm 1/ }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        glass: "vertical",
        glassSize: "vertical-25x10x18",
        moss: [],
      }),
      "Bể đã làm 1",
    );
  });
  it("shows but disables unconfigured templates instead of inventing a recipe", () => {
    const catalog = setup();
    catalog.presets[0] = {
      ...catalog.presets[0],
      configured: false,
      selectable: false,
      materials: [],
    };
    render(
      <DesignPresets
        catalog={catalog}
        selection={createEmptySelection()}
        onApply={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Bể đã làm 1/ })).toBeDisabled();
    expect(
      screen.getByText(/Shop đang chuẩn bị công thức vật liệu/),
    ).toBeInTheDocument();
  });
  it.each([3, 4, 6])("uses a carousel for %i API templates", (count) => {
    render(
      <DesignPresets
        catalog={setup(count)}
        selection={createEmptySelection()}
        onApply={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Bể mẫu đã làm" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(count);
  });
  it.each([1, 2])("keeps %i API templates in the grid", (count) => {
    render(
      <DesignPresets
        catalog={setup(count)}
        selection={createEmptySelection()}
        onApply={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("region", { name: "Bể mẫu đã làm" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(count);
  });
  it("keeps material selection available when the template API is unavailable", () => {
    const catalog = { ...setup(), presetsReady: false, presets: [] };
    render(
      <DesignPresets
        catalog={catalog}
        selection={createEmptySelection()}
        onApply={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Chưa tải được bể mẫu",
    );
  });
});
