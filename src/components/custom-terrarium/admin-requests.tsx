"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "./terrarium-builder.module.css";
type Entry = { id: string; number: string; status: string; revision: number; selection: { id: string; name: string }[]; contact: { recipientName: string; phone: string; area: string; preferredDate: string; note: string } };
type GoogleIdentity = { initialize: (config: { client_id: string; nonce: string; callback: (value: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void };
export function AdminRequests({ clientId }: { clientId: string | null }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const button = useRef<HTMLDivElement>(null);
  async function list(next?: string) {
    setPending(true); setError("");
    try {
      const response = await fetch(`/api/admin/design-requests${next ? `?cursor=${encodeURIComponent(next)}` : ""}`, { cache: "no-store" });
      if (response.status === 401 || response.status === 403) { setAuthenticated(false); throw new Error("Đăng nhập tài khoản quản trị để xem yêu cầu."); }
      if (!response.ok) throw new Error("Chưa tải được yêu cầu. Hãy thử lại.");
      const data = await response.json(); setAuthenticated(true); setEntries(old => next ? [...old, ...data.items] : data.items); setCursor(data.nextCursor);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Chưa tải được dữ liệu."); }
    finally { setPending(false); }
  }
  useEffect(() => {
    let active = true;
    void fetch("/api/admin/session", { cache: "no-store" }).then(async response => {
      if (active && response.ok) await list();
    }).catch(() => { if (active) setError("Chưa kiểm tra được phiên đăng nhập."); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!scriptReady || !clientId || authenticated || !button.current) return;
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/challenge", { method: "POST" });
        if (!response.ok) throw new Error("Chưa kết nối được đăng nhập Google.");
        const challenge = await response.json();
        if (!active || !button.current) return;
        const google = (window as unknown as { google: { accounts: { id: GoogleIdentity } } }).google.accounts.id;
        google.initialize({ client_id: clientId, nonce: challenge.nonce, callback: async ({ credential }) => {
          const login = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: credential, challengeId: challenge.challengeId }) }).catch(() => null);
          if (!login?.ok) { setError("Không đăng nhập được. Kiểm tra tài khoản admin rồi tải lại trang để thử lại."); return; }
          await list();
        } });
        button.current.replaceChildren(); google.renderButton(button.current, { theme: "outline", size: "large" });
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : "Chưa đăng nhập được."); }
    })();
    return () => { active = false; };
  }, [scriptReady, clientId, authenticated]);
  async function review(entry: Entry, status: string) {
    setPending(true); setError("");
    try {
      const response = await fetch(`/api/admin/design-requests/${entry.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "If-Match": String(entry.revision) }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error(response.status === 409 ? "Yêu cầu đã thay đổi ở nơi khác. Hãy tải lại danh sách." : "Chưa lưu được trạng thái.");
      const changed = await response.json(); setEntries(rows => rows.map(row => row.id === entry.id ? { ...row, ...changed } : row));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Chưa lưu được."); }
    finally { setPending(false); }
  }
  return <main className={styles.receipt}>
    <h1>Yêu cầu thiết kế</h1><p>Liên hệ khách để tư vấn và báo giá. Trạng thái ở đây theo dõi việc tiếp nhận; đơn hàng và thanh toán được quản lý riêng sau khi chốt.</p>
    {!authenticated ? <>
      {clientId ? <><Script src="https://accounts.google.com/gsi/client" onReady={() => setScriptReady(true)} onError={() => setError("Chưa tải được Google. Hãy tải lại trang để thử lại.")} /><div ref={button} /></> : <p>Chưa cấu hình Google Client ID cho đăng nhập quản trị.</p>}
    </> : <>
      <button className={styles.reset} onClick={async () => { await fetch("/api/admin/session", { method: "DELETE" }); setAuthenticated(false); setEntries([]); }}>Đăng xuất</button>
      <button className={styles.reset} disabled={pending} onClick={() => void list()}>Tải lại danh sách</button>
      {entries.map(entry => <article key={entry.id} className={styles.adminCard}>
        <h2>{entry.contact.recipientName}</h2><p className={styles.receiptCode}>{entry.number}</p>
        <p><a href={`tel:${entry.contact.phone}`}>{entry.contact.phone}</a> · {entry.contact.area}</p>
        {entry.contact.preferredDate ? <p>Ngày mong muốn: {entry.contact.preferredDate}</p> : null}
        <ul>{entry.selection.map(item => <li key={item.id}>{item.name}</li>)}</ul>
        <p>{entry.contact.note}</p><label>Trạng thái <select disabled={pending} value={entry.status} onChange={event => void review(entry, event.target.value)}><option value="pending">Chờ xác nhận</option><option value="contacted">Đã liên hệ tư vấn</option><option value="closed">Đã kết thúc yêu cầu</option></select></label>
      </article>)}
      {!entries.length && !pending ? <p>Chưa có yêu cầu.</p> : null}
      {cursor ? <button disabled={pending} className={styles.reset} onClick={() => void list(cursor)}>Xem thêm</button> : null}
    </>}
    {pending ? <p role="status">Đang xử lý…</p> : null}{error ? <p role="alert">{error}</p> : null}
  </main>;
}
