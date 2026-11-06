export async function ensureGuestSession() {
  const response = await fetch("/api/design-requests/session", { method: "POST", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Chưa kết nối được. Vui lòng thử lại.");
}
