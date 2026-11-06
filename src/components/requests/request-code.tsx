"use client";
import { useState } from "react";
import styles from "../shared/public-forms.module.css";

export function RequestCode({ code }: { code: string }) {
  const [copied, setCopied] = useState("");
  const [error, setError] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(code); setError(false); }
    catch { setError(true); }
  }
  return <div className={styles.codeBlock}>
    <span>Mã yêu cầu</span>
    <div className={styles.codeRow}><strong className={styles.code}>{code}</strong>
      <button type="button" className={styles.copy} aria-label="Sao chép mã yêu cầu" onClick={() => void copy()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" /></svg>
      </button>
    </div>
    <span role="status" className={styles.hint}>{error ? "Chưa sao chép được. Bạn có thể chọn mã để sao chép thủ công." : copied === code ? "Đã sao chép mã." : "Lưu mã này để tra cứu và trao đổi với shop."}</span>
  </div>;
}
