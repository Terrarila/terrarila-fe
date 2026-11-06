import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { RequestTracker } from "../../src/components/requests/request-tracker";
import { RequestCode } from "../../src/components/requests/request-code";
import { FeedbackForm } from "../../src/components/feedback/feedback-form";

const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
const receipt = { number: "A1B2C3D4", status: "contacted", selection: [{ id: "glass", name: "Bể kính đứng · 10×10×20 cm" }], createdAt: "2026-11-06T08:00:00Z", events: [{ status: "contacted", createdAt: "2026-11-06T09:00:00Z" }] };

it("copies the exact request code and reports clipboard denial", async () => {
  const user = userEvent.setup();
  const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  render(<RequestCode code="A1B2C3D4" />);
  await user.click(screen.getByRole("button", { name: "Sao chép mã yêu cầu" }));
  expect(copy).toHaveBeenCalledWith("A1B2C3D4");
  expect(screen.getByRole("status")).toHaveTextContent("Đã sao chép");
  copy.mockRejectedValueOnce(new Error("denied"));
  await user.click(screen.getByRole("button", { name: "Sao chép mã yêu cầu" }));
  expect(screen.getByRole("status")).toHaveTextContent("sao chép thủ công");
});

it("tracks using only a code, displays material snapshot/history and clears stale results", async () => {
  const user = userEvent.setup();
  const fetch = vi.fn().mockResolvedValueOnce(response({ ready: true })).mockResolvedValueOnce(response(receipt)).mockResolvedValueOnce(response({ ready: true })).mockResolvedValueOnce(response({},404));
  vi.stubGlobal("fetch", fetch);
  render(<RequestTracker />);
  await user.type(screen.getByLabelText("Mã yêu cầu"), "a1b2c3d4");
  await user.click(screen.getByRole("button", { name: "Tra cứu" }));
  expect(await screen.findByText("Bể kính đứng · 10×10×20 cm")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Lịch sử cập nhật" })).toBeInTheDocument();
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ code: "A1B2C3D4" });
  expect(screen.queryByLabelText(/điện thoại/i)).not.toBeInTheDocument();
  await user.clear(screen.getByLabelText("Mã yêu cầu"));
  expect(screen.queryByText("Bể kính đứng · 10×10×20 cm")).not.toBeInTheDocument();
  await user.type(screen.getByLabelText("Mã yêu cầu"), "FFFFFFFF");
  await user.click(screen.getByRole("button", { name: "Tra cứu" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Không tìm thấy yêu cầu");
});

it("tracking explains rate limits and preserves the entered code", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({},429)));
  const user = userEvent.setup();
  render(<RequestTracker initialCode="A1B2C3D4" />);
  await user.click(screen.getByRole("button", { name: "Tra cứu" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("15 phút");
  expect(screen.getByLabelText("Mã yêu cầu")).toHaveValue("A1B2C3D4");
});

it("feedback preserves text and the same idempotency key after a failed response", async () => {
  const user = userEvent.setup();
  const fetch = vi.fn().mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({},503)).mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({ id:"saved" },201));
  vi.stubGlobal("fetch", fetch);
  render(<FeedbackForm />);
  await user.type(screen.getByLabelText(/Email của bạn/), "CUSTOMER@example.com");
  await user.type(screen.getByLabelText(/Ý kiến của bạn/), "Mong trải nghiệm xem ảnh tốt hơn.");
  await user.click(screen.getByRole("button", { name: "Gửi góp ý →" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Nội dung vẫn được giữ");
  expect(screen.getByLabelText(/Ý kiến của bạn/)).toHaveValue("Mong trải nghiệm xem ảnh tốt hơn.");
  await user.click(screen.getByRole("button", { name: "Gửi góp ý →" }));
  await screen.findByRole("heading", { name: "Cảm ơn bạn đã góp ý." });
  expect(fetch.mock.calls[1][1].headers["Idempotency-Key"]).toBe(fetch.mock.calls[3][1].headers["Idempotency-Key"]);
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ email:"customer@example.com", message:"Mong trải nghiệm xem ảnh tốt hơn." });
});

it("feedback blocks duplicate submits while in flight", async () => {
  const user = userEvent.setup();
  let finish!: (value: Response) => void;
  const fetch = vi.fn().mockResolvedValueOnce(response({})).mockImplementationOnce(() => new Promise<Response>(resolve => { finish=resolve; }));
  vi.stubGlobal("fetch", fetch);
  render(<FeedbackForm />);
  await user.type(screen.getByLabelText(/Email của bạn/), "a@example.com");
  await user.type(screen.getByLabelText(/Ý kiến của bạn/), "Góp ý trải nghiệm website.");
  await user.click(screen.getByRole("button", { name:"Gửi góp ý →" }));
  await waitFor(() => expect(screen.getByRole("button", { name:"Đang gửi…" })).toBeDisabled());
  expect(fetch).toHaveBeenCalledTimes(2);
  finish(response({id:"saved"},201));
  await screen.findByRole("heading", { name:"Cảm ơn bạn đã góp ý." });
});
