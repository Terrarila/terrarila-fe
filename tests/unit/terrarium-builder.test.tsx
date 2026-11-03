import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TerrariumBuilder } from "../../src/components/custom-terrarium/terrarium-builder";
import { builderCatalog, renderWithDesign } from "./builder-fixture";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

function setup(catalog = builderCatalog()) {
  return { user: userEvent.setup(), ...renderWithDesign(<TerrariumBuilder contacts={[]} catalog={catalog} />) };
}
const send = () => screen.getByRole("button", { name: /Gửi thiết kế để shop/ });

describe("Trang làm theo yêu cầu — lựa chọn thiết kế", () => {
  it("khóa vật liệu và gửi yêu cầu cho đến khi chọn bể, rồi yêu cầu chọn size", async () => {
    const { user } = setup();
    expect(screen.getByRole("checkbox", { name: "Rêu A" })).toBeDisabled();
    expect(send()).toBeDisabled();
    expect(screen.queryByRole("radio", { name: "25×10×18 cm" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Bể đứng" }));
    expect(screen.getByRole("checkbox", { name: "Rêu A" })).toBeEnabled();
    expect(send()).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "25×10×18 cm" }));
    expect(send()).toBeEnabled();
    expect(screen.getByText(/225[.]000/)).toBeInTheDocument();
    await user.click(send());
    expect(screen.getByRole("form", { name: "Shop liên hệ với bạn qua đâu?" })).toBeInTheDocument();
  });

  it("đổi bể xóa size cũ và đóng form đang mở", async () => {
    const { user, store } = setup();
    await user.click(screen.getByRole("radio", { name: "Bể đứng" }));
    await user.click(screen.getByRole("radio", { name: "25×10×18 cm" }));
    await user.click(send());
    await user.click(screen.getByRole("radio", { name: "Bể vuông" }));
    expect(store.getState().design.selection.glassSize).toBeUndefined();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "25×10×18 cm" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "10×10 cm" })).not.toBeChecked();
    expect(send()).toBeDisabled();
  });

  it("không cho chọn size hoặc vật liệu hết hàng", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("radio", { name: "Bể đứng" }));
    expect(screen.getByRole("radio", { name: "10×10×20 cm" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /Rêu hết hàng/ })).toBeDisabled();
  });

  it("áp dụng giới hạn rêu từ API và mở lại lựa chọn khi bỏ một loại", async () => {
    const { user, store } = setup();
    await user.click(screen.getByRole("radio", { name: "Bể đứng" }));
    await user.click(screen.getByRole("checkbox", { name: "Rêu A" }));
    await user.click(screen.getByRole("checkbox", { name: "Rêu B" }));
    expect(screen.getByRole("checkbox", { name: "Rêu C" })).toBeDisabled();
    expect(screen.getByText("Đã chọn 2/2 loại rêu.")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Rêu A" }));
    await user.click(screen.getByRole("checkbox", { name: "Rêu C" }));
    expect(store.getState().design.selection.moss).toEqual(["moss-1", "moss-2"]);
  });

  it("reset xóa lựa chọn, size và ghi chú rồi khóa lại gửi yêu cầu", async () => {
    const { user, store } = setup();
    await user.click(screen.getByRole("radio", { name: "Bể đứng" }));
    await user.click(screen.getByRole("radio", { name: "25×10×18 cm" }));
    await user.type(screen.getByLabelText("Bạn muốn thêm điều gì?"), "Góc rừng nhỏ");
    await user.click(screen.getByRole("button", { name: "Bắt đầu lại" }));
    expect(store.getState().design.selection).toEqual({ glass: "", gravel: [], soil: [], moss: [], plants: [] });
    expect(screen.getByLabelText("Bạn muốn thêm điều gì?")).toHaveValue("");
    expect(send()).toBeDisabled();
  });

  it("mất kết nối danh mục vẫn giữ ghi chú và không cho gửi", () => {
    const { store } = setup({ ...builderCatalog(), ready: false });
    fireEvent.change(screen.getByLabelText("Bạn muốn thêm điều gì?"), { target: { value: "Giữ bản nháp" } });
    expect(store.getState().design.note).toBe("Giữ bản nháp");
    expect(send()).toBeDisabled();
    expect(screen.getByText(/Chưa tải được danh mục vật liệu/)).toBeInTheDocument();
  });

  it("áp dụng bể mẫu giữ ghi chú, điền size và vẫn chỉnh được vật liệu", async () => {
    const catalog = builderCatalog();
    catalog.presets = [{ id: "demo", slug: "demo", name: "Bể mẫu", description: "Mẫu kiểm thử", imageUrl: "/demo.png", isDemo: true, selectable: true, materials: [catalog.materials[0].sizes![0]] }];
    const { user, store } = setup(catalog);
    // Use the real note input so Redux and the rendered field stay in sync.
    fireEvent.change(screen.getByLabelText("Bạn muốn thêm điều gì?"), { target: { value: "Giữ ghi chú" } });
    await user.click(screen.getByRole("button", { name: /Bể mẫu/ }));
    expect(store.getState().design.note).toBe("Giữ ghi chú");
    expect(screen.getByRole("radio", { name: "25×10×18 cm" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Rêu A" }));
    expect(store.getState().design.selection.moss).toEqual(["moss-0"]);
    expect(send()).toBeEnabled();
  });
});
