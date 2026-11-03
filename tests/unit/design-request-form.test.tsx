import { webcrypto } from "node:crypto";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DesignRequestForm } from "../../src/components/custom-terrarium/design-request-form";
import { changeNote, chooseMaterial } from "../../src/store/design-slice";
import { builderCatalog, renderWithDesign } from "./builder-fixture";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeEach(() => vi.stubGlobal("crypto", webcrypto));

function setup(selected = true) {
  const result = renderWithDesign(<DesignRequestForm catalog={builderCatalog()} onClose={() => {}} />, selected);
  fireEvent.change(screen.getByLabelText(/Tên của bạn/), { target: { value: "  An Nguyễn  " } });
  fireEvent.change(screen.getByLabelText(/Zalo \/ Facebook/), { target: { value: "090 123 4567" } });
  fireEvent.change(screen.getByLabelText(/Khu vực nhận hàng/), { target: { value: "  Thủ Đức  " } });
  return { ...result, user: userEvent.setup() };
}
const form = () => screen.getByRole("form", { name: "Shop liên hệ với bạn qua đâu?" });
const submit = () => fireEvent.submit(form());
const response = (status = 201, body = { id: "request-123" }) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("Trang làm theo yêu cầu — gửi yêu cầu tư vấn", () => {
  it("gửi UUID của size, chuẩn hóa liên hệ, tạo session trước và chuyển tới trang yêu cầu", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response()).mockResolvedValueOnce(response());
    vi.stubGlobal("fetch", fetchMock);
    const { store } = setup();
    act(() => {
      store.dispatch(changeNote("  Làm góc rừng  "));
      store.dispatch(chooseMaterial({ key: "moss", id: "moss-0", max: 2 }));
    });
    submit();
    await waitFor(() => expect(push).toHaveBeenCalledWith("/yeu-cau/request-123"));
    expect(fetchMock.mock.calls[0]).toEqual(["/api/design-requests/session", { method: "POST" }]);
    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe("/api/design-requests");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ materialIds: ["size-uuid", "moss-moss-0"], recipientName: "An Nguyễn", phone: "0901234567", area: "Thủ Đức", note: "Làm góc rừng" });
    expect(options.headers["Idempotency-Key"]).toBe(store.getState().design.submissionKey);
    expect(store.getState().design.submissionFingerprint).toMatch(/^[a-f0-9]{64}$/);
  });

  it("thiếu size không gọi API và báo lỗi ngay trên form", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { store } = setup(false);
    act(() => store.dispatch(chooseMaterial({ key: "glass", id: "vertical", max: 1 })));
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/Vui lòng chọn kích thước/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("session thất bại thì không gửi yêu cầu và vẫn giữ thiết kế", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(503));
    vi.stubGlobal("fetch", fetchMock);
    const { store } = setup();
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/Chưa thiết lập được phiên/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(store.getState().design.selection.glassSize).toBe("vertical-25x10x18");
    expect(push).not.toHaveBeenCalled();
  });

  it.each([
    [400, /Thông tin hoặc vật liệu chưa hợp lệ/],
    [422, /Thông tin hoặc vật liệu chưa hợp lệ/],
    [409, /Nội dung gửi đã thay đổi/],
    [429, /Bạn đã gửi nhiều yêu cầu/],
    [500, /Chưa xác nhận gửi thành công/],
  ])("HTTP %s hiển thị lỗi phù hợp và cho phép thử lại", async (status, message) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response()).mockResolvedValueOnce(response(status)));
    setup();
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.getByRole("button", { name: /Gửi yêu cầu cho shop/ })).toBeEnabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("chặn submit trùng khi đang gửi", async () => {
    let finishSession!: (value: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(resolve => { finishSession = resolve; })).mockResolvedValueOnce(response());
    vi.stubGlobal("fetch", fetchMock);
    setup();
    submit();
    submit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("button", { name: "Đang gửi yêu cầu…" })).toBeDisabled();
    finishSession(response());
    await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("timeout rồi gửi lại dùng cùng idempotency key; sửa liên hệ tạo key mới", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response()).mockRejectedValueOnce(new DOMException("Timed out", "TimeoutError"))
      .mockResolvedValueOnce(response()).mockResolvedValueOnce(response(500))
      .mockResolvedValueOnce(response()).mockResolvedValueOnce(response());
    vi.stubGlobal("fetch", fetchMock);
    const { user } = setup();
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/Kết nối bị gián đoạn/);
    const firstKey = fetchMock.mock.calls[1][1].headers["Idempotency-Key"];
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/Chưa xác nhận gửi thành công/);
    expect(fetchMock.mock.calls[3][1].headers["Idempotency-Key"]).toBe(firstKey);
    await user.clear(screen.getByLabelText(/Tên của bạn/));
    await user.type(screen.getByLabelText(/Tên của bạn/), "Bình Nguyễn");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    submit();
    await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[5][1].headers["Idempotency-Key"]).not.toBe(firstKey);
  });
});
