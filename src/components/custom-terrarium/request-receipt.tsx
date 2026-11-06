"use client";
import Link from "next/link";
import { useState } from "react";
import { RequestSummary } from "@/components/requests/request-summary";
import type { TrackedRequest } from "@/lib/request-tracking";
import styles from "./terrarium-builder.module.css";
export type Receipt = TrackedRequest & { id: string };
export function RequestReceipt({ id, contacts, initialReceipt, initialError }: { id: string; contacts: { label: string; href: string }[]; initialReceipt: Receipt | null; initialError: string }) {
  const [receipt, setReceipt] = useState<Receipt | null>(initialReceipt);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  async function load(signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/design-requests/${id}`, { cache: "no-store", signal });
      if (!response.ok) throw new Error(response.status === 404 || response.status === 401 ? "Không tìm thấy yêu cầu trên trình duyệt này. Bạn có thể nhập mã ở trang tra cứu yêu cầu." : "Chưa tải được trạng thái. Bạn có thể thử lại.");
      setReceipt(await response.json());
    } catch (cause) { if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "Chưa tải được yêu cầu."); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  return <main className={styles.receipt}>
    <Link href="/" className={styles.brand}><span className={styles.brandLogo} aria-hidden="true" />Petite Terre</Link>
    <p className={styles.eyebrow}>THIẾT KẾ THEO YÊU CẦU</p>
    <h1>{receipt ? "Shop đã nhận thiết kế của bạn." : "Yêu cầu của bạn"}</h1>
    {loading ? <p role="status">Đang kiểm tra trạng thái…</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {receipt ? <>
      <RequestSummary request={receipt} />
      <p>Shop sẽ liên hệ để thống nhất bố cục, vật liệu, giá cuối cùng, phí giao và ngày nhận. Bạn chưa cần đặt cọc ở bước này.</p>
      <p>Lưu mã để trao đổi với shop hoặc tra cứu trên thiết bị khác. Trang tra cứu chỉ hiển thị trạng thái và bể, vật liệu đã chọn.</p>
      <p><Link href={`/tra-cuu?ma=${encodeURIComponent(receipt.number)}`}>Tra cứu yêu cầu bằng mã →</Link></p>
      <div className={styles.contacts}>{contacts.map(contact => <a key={contact.label} href={contact.href} target="_blank" rel="noopener noreferrer">Trao đổi qua {contact.label} ↗</a>)}</div>
    </> : null}
    <button className={styles.reset} disabled={loading} onClick={() => { setLoading(true); setError(""); void load(); }}>Cập nhật trạng thái</button>
    <p><Link href="/lam-theo-yeu-cau">← Về bản thiết kế đã lưu</Link></p>
    <p><Link href="/tra-cuu">Tra cứu yêu cầu</Link> · <Link href="/gop-y">Góp ý trải nghiệm website</Link></p>
  </main>;
}
