import "server-only";
import { cookies } from "next/headers";
import { ApiError, apiFailure, backend, sameOrigin } from "./terrala-api";

export async function guestSubmission(request: Request, path: "/v1/feedback" | "/v1/design-requests/track") {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const token = (await cookies()).get("terrala_guest")?.value;
    if (!token) throw new ApiError(401, "GUEST_SESSION_REQUIRED");
    if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ApiError(415, "JSON_REQUIRED");
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 24000) throw new ApiError(413, "BODY_TOO_LARGE");
    let body: unknown;
    try { body = JSON.parse(text); } catch { throw new ApiError(400, "INVALID_INPUT"); }
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    if (path === "/v1/feedback") headers["Idempotency-Key"] = request.headers.get("idempotency-key") ?? "";
    return Response.json(await backend(path, { method: "POST", body: JSON.stringify(body), headers }), {
      status: path === "/v1/feedback" ? 201 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) { return apiFailure(error); }
}
