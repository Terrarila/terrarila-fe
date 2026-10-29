import type { Metadata } from "next";
import { cookies } from "next/headers";
import { backend } from "@/lib/terrala-api";
import { RequestReceipt, type Receipt } from "@/components/custom-terrarium/request-receipt";
import { shopContacts } from "@/lib/shop-contacts";
export const metadata: Metadata = { title: "Yêu cầu của bạn · Petite Terre", robots: { index: false, follow: false }, referrer: "same-origin" };
export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let receipt: Receipt | null = null;
  let error = "";
  try {
    const token = (await cookies()).get("terrala_guest")?.value;
    if (!token || !/^[0-9a-f-]{36}$/i.test(id)) throw new Error();
    receipt = await backend<Receipt>(`/v1/design-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch { error = "Chưa xem được yêu cầu. Hãy thử cập nhật trạng thái trên trình duyệt bạn đã dùng để gửi, hoặc gửi mã yêu cầu cho shop."; }
  return <RequestReceipt id={id} contacts={shopContacts()} initialReceipt={receipt} initialError={error} />;
}
