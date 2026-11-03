import "server-only";
export class ApiError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export async function backend<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.TERRALA_API_URL;
  if (!base) throw new ApiError(503, "API_NOT_CONFIGURED");
  try {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (process.env.TERRALA_API_BYPASS_SECRET) headers.set("x-vercel-protection-bypass", process.env.TERRALA_API_BYPASS_SECRET);
    const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      ...init, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10000),
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, typeof error.code === "string" ? error.code : "API_ERROR");
    }
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(503, "API_UNAVAILABLE");
  }
}
export function apiFailure(error: unknown) {
  const known = error instanceof ApiError ? error : new ApiError(500, "INTERNAL_ERROR");
  return Response.json({ code: known.code }, { status: known.status, headers: { "Cache-Control": "no-store" } });
}
// Next normalizes the internal URL to localhost in development; use the actual
// Host for the browser origin, or an explicit canonical origin behind a proxy.
export function sameOrigin(request: Request) {
  try {
    const url = new URL(request.url);
    const expected = process.env.TERRALA_SITE_ORIGIN || `${url.protocol}//${request.headers.get("host") ?? url.host}`;
    return request.headers.get("origin") === new URL(expected).origin;
  } catch { return false; }
}
