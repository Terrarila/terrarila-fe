"use client";
import { useRef, useState } from "react";
import { ensureGuestSession } from "@/lib/public-form-client";
import type { TrackedRequest } from "@/lib/request-tracking";
import { RequestSummary } from "./request-summary";
import styles from "../shared/public-forms.module.css";

export function RequestTracker({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<TrackedRequest | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setPending(true); setError(""); setResult(null);
    try {
      await ensureGuestSession();
      const response = await fetch("/api/design-requests/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code.trim().toUpperCase() }), signal: AbortSignal.timeout(15000), cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 404 ? "Không tìm thấy yêu cầu. Bạn kiểm tra lại mã nhé." : response.status === 400 ? "Mã chưa đúng định dạng. Nhập mã 8 ký tự hoặc mã TL cũ." : response.status === 429 ? "Bạn đã tra cứu nhiều lần. Vui lòng thử lại sau 15 phút." : "Chưa tải được trạng thái. Vui lòng thử lại.");
      setResult(await response.json());
    } catch (cause) { setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Kết nối bị gián đoạn. Vui lòng thử lại."); }
    finally { lock.current = false; setPending(false); }
  }
  return <>
    <form className={styles.form} onSubmit={submit} aria-label="Tra cứu yêu cầu">
      <label htmlFor="tracking-code">Mã yêu cầu</label>
      <div className={styles.searchRow}><input id="tracking-code" name="code" value={code} onChange={event => { setCode(event.target.value); setResult(null); setError(""); }} required maxLength={45} autoCapitalize="characters" spellCheck={false} autoComplete="off" placeholder="Ví dụ: A1B2C3D4" disabled={pending} aria-describedby="tracking-hint" /><button type="submit" className={styles.primary} disabled={pending}>{pending ? "Đang tra cứu…" : "Tra cứu"}</button></div>
      <p id="tracking-hint" className={styles.hint}>Dùng mã trên trang xác nhận. Mã cũ bắt đầu bằng TL- vẫn tra cứu được.</p>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
    </form>
    {result ? <RequestSummary request={result} /> : null}
  </>;
}
