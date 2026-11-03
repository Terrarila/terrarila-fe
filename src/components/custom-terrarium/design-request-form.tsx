"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDesignDispatch, useDesignSelector } from "@/store/design-provider";
import { rememberSubmission } from "@/store/design-slice";
import type { BuilderCatalog } from "@/lib/builder-catalog";
import { selectedApiMaterials } from "./material-catalog";
import styles from "./terrarium-builder.module.css";
export function DesignRequestForm({ catalog, onClose }: { catalog: BuilderCatalog; onClose: () => void }) {
  const draft = useDesignSelector(state => state.design);
  const dispatch = useDesignDispatch();
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setPending(true); setError("");
    const fields = new FormData(event.currentTarget);
    const selected = selectedApiMaterials(draft.selection, catalog);
    if (!selected) { setError("Vui lòng chọn kích thước phù hợp với bể và kiểm tra lại danh mục trước khi gửi."); setPending(false); lock.current = false; return; }
    const materialIds = selected.map(item => item.id);
    const payload = {
      materialIds, recipientName: String(fields.get("recipientName")).trim(), phone: String(fields.get("phone")).replace(/[\s().-]/g, ""),
      area: String(fields.get("area")).trim(), ...(fields.get("preferredDate") ? { preferredDate: fields.get("preferredDate") } : {}), note: draft.note.trim(),
    };
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
      const fingerprint = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
      const key = draft.submissionFingerprint === fingerprint && draft.submissionKey ? draft.submissionKey : crypto.randomUUID();
      dispatch(rememberSubmission({ key, fingerprint }));
      const session = await fetch("/api/design-requests/session", { method: "POST" });
      if (!session.ok) throw new Error("Chưa thiết lập được phiên gửi yêu cầu. Bạn thử lại nhé.");
      const response = await fetch("/api/design-requests", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) throw new Error("Nội dung gửi đã thay đổi. Hãy kiểm tra lại thông tin rồi gửi yêu cầu mới.");
        if (response.status === 429) throw new Error("Bạn đã gửi nhiều yêu cầu gần đây. Vui lòng thử lại sau hoặc nhắn shop.");
        if (response.status === 400 || response.status === 422) throw new Error("Thông tin hoặc vật liệu chưa hợp lệ. Hãy kiểm tra số điện thoại và lựa chọn, hoặc tải lại trang để cập nhật danh mục.");
        throw new Error("Chưa xác nhận gửi thành công. Lựa chọn vẫn được giữ; bạn có thể bấm gửi lại.");
      }
      router.push(`/yeu-cau/${data.id}`);
    } catch (cause) { setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Kết nối bị gián đoạn. Hãy gửi lại để kiểm tra cùng yêu cầu; hệ thống sẽ tránh tạo trùng."); }
    finally { setPending(false); lock.current = false; }
  }
  return <form className={styles.requestForm} onSubmit={submit} onChange={() => setError("")} aria-labelledby="request-form-title">
    <h3 id="request-form-title">Shop liên hệ với bạn qua đâu?</h3>
    <p>Không cần tạo tài khoản. Shop sẽ trao đổi bố cục, vật liệu, ngày nhận và báo giá trước khi bạn đặt cọc.</p>
    <fieldset disabled={pending}>
      <label htmlFor="recipientName">
        Tên của bạn <span className={styles.requiredField}>*</span>
      </label>
      <input autoFocus id="recipientName" name="recipientName" required minLength={2} maxLength={120} autoComplete="name" />
      <label htmlFor="phone">
        Zalo / Facebook <span className={styles.requiredField}>*</span>
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        pattern="(0|\+84)[0-9 ()\.\-]{9,16}"
        maxLength={22}
        placeholder="09xxxxxxxx"
      />
      <label htmlFor="area">
        Khu vực nhận hàng tại TP.HCM <span className={styles.requiredField}>*</span>
      </label>
      <input id="area" name="area" required minLength={2} maxLength={160} placeholder="Ví dụ: Thủ Đức, hoặc nhận tại shop" />
      <button className={styles.primaryAction} type="submit">
        {pending ? "Đang gửi yêu cầu…" : "Gửi yêu cầu cho shop →"}
      </button>
    </fieldset>
    {error ? <p role="alert" className={styles.formError}>{error}</p> : null}
  </form>;
}
