"use client";
import { useRef, useState } from "react";
import { ensureGuestSession } from "@/lib/public-form-client";
import styles from "../shared/public-forms.module.css";

export function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const submission = useRef<{ body: string; key: string } | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const body = JSON.stringify({ email: email.trim().toLowerCase(), message: message.trim() });
    if (!submission.current || submission.current.body !== body) submission.current = { body, key: crypto.randomUUID() };
    lock.current = true; setPending(true); setError("");
    try {
      await ensureGuestSession();
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": submission.current.key }, body, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(response.status === 429 ? "Bạn đã gửi nhiều góp ý gần đây. Vui lòng thử lại sau." : response.status === 400 ? "Vui lòng kiểm tra email và nhập nội dung từ 5 đến 4.000 ký tự." : "Chưa xác nhận gửi thành công. Nội dung vẫn được giữ để bạn thử lại.");
      setSent(true);
    } catch (cause) { setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Kết nối bị gián đoạn. Bạn có thể gửi lại cùng nội dung."); }
    finally { lock.current = false; setPending(false); }
  }
  if (sent) return <section className={styles.success} role="status"><h2>Cảm ơn bạn đã góp ý.</h2><p>Ý kiến đã được lưu để Petite Terre đọc và cải thiện website.</p><button type="button" className={styles.secondary} onClick={() => { setSent(false); setMessage(""); submission.current = null; }}>Gửi góp ý khác</button></section>;
  return <form className={styles.form} onSubmit={submit} aria-label="Gửi góp ý" onChange={() => setError("")}>
    <fieldset disabled={pending}>
      <label htmlFor="feedback-email">Email của bạn <span aria-hidden="true">*</span></label>
      <input id="feedback-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} aria-describedby="feedback-privacy" />
      <label htmlFor="feedback-message">Ý kiến của bạn <span aria-hidden="true">*</span></label>
      <textarea id="feedback-message" required minLength={5} maxLength={4000} rows={7} value={message} onChange={event => setMessage(event.target.value)} placeholder="Điều gì còn khó dùng, hoặc bạn muốn website cải thiện điều gì?" />
      <p id="feedback-privacy" className={styles.hint}>Email và nội dung chỉ hiển thị cho người quản lý website. Vui lòng không gửi mật khẩu hoặc thông tin thanh toán.</p>
      <button type="submit" className={styles.primary}>{pending ? "Đang gửi…" : "Gửi góp ý →"}</button>
    </fieldset>
    {error ? <p role="alert" className={styles.error}>{error}</p> : null}
  </form>;
}
