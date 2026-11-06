export type RequestStatus = "pending" | "contacted" | "closed";
export type TrackedRequest = {
  number: string;
  status: RequestStatus;
  selection: { id: string; name: string; category?: string }[];
  createdAt: string;
  updatedAt?: string;
  events?: { status: RequestStatus; createdAt: string }[];
};
export const requestStatusLabels: Record<RequestStatus, string> = {
  pending: "Chờ shop xác nhận",
  contacted: "Shop đã liên hệ tư vấn",
  closed: "Yêu cầu đã kết thúc",
};
export function requestDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}
