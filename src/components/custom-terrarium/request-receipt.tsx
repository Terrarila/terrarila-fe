"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./terrarium-builder.module.css";
export type Receipt = { id: string; number: string; status: "pending" | "contacted" | "closed"; selection: { id: string; name: string }[]; createdAt: string };
const statusLabels = { pending: "Chờ shop xác nhận", contacted: "Shop đã liên hệ tư vấn", closed: "Yêu cầu đã kết thúc" };
export function RequestReceipt({ id, contacts, initialReceipt, initialError }: { id: string; contacts: { label: string; href: string }[]; initialReceipt: Receipt | null; initialError: string }) {
  const [receipt, setReceipt] = useState<Receipt | null>(initialReceipt);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  async function load(signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/design-requests/${id}`, { cache: "no-store", signal });
      if (!response.ok) throw new Error(response.status === 404 || response.status === 401 ? "Không tìm thấy yêu cầu trên trình duyệt này. Vui lòng gửi mã yêu cầu cho shop nếu bạn đổi thiết bị hoặc đã xoá cookie." : "Chưa tải được trạng thái. Bạn có thể thử lại.");
      setReceipt(await response.json());
    } catch (cause) { if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "Chưa tải được yêu cầu."); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  return <main className={styles.receipt}>
    <Link href="/" className={styles.brand}>terralá</Link>
    <p className={styles.eyebrow}>THIẾT KẾ THEO YÊU CẦU</p>
    <h1>{receipt ? "Shop đã nhận thiết kế của bạn." : "Yêu cầu của bạn"}</h1>
    {loading ? <p role="status">Đang kiểm tra trạng thái…</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {receipt ? <>
      <p className={styles.receiptCode}>Mã yêu cầu: <strong>{receipt.number}</strong></p>
      <p role="status" className={styles.receiptStatus}>{statusLabels[receipt.status]}</p>
      <h2>Những gì bạn đã chọn</h2><ul>{receipt.selection.map(item => <li key={item.id}>{item.name}</li>)}</ul>
      <p>Shop sẽ liên hệ để thống nhất bố cục, vật liệu, giá cuối cùng, phí giao và ngày nhận. Bạn chưa cần đặt cọc ở bước này.</p>
      <p>Lưu mã yêu cầu để trao đổi với shop. Bạn có thể xem lại trang này trên cùng trình duyệt trong 90 ngày nếu vẫn giữ cookie.</p>
      <div className={styles.contacts}>{contacts.map(contact => <a key={contact.label} href={contact.href} target="_blank" rel="noopener noreferrer">Trao đổi qua {contact.label} ↗</a>)}</div>
    </> : null}
    <button className={styles.reset} disabled={loading} onClick={() => { setLoading(true); setError(""); void load(); }}>Cập nhật trạng thái</button>
    <p><Link href="/lam-theo-yeu-cau">← Về bản thiết kế đã lưu</Link></p>
  </main>;
}
