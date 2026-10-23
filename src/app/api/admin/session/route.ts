import { cookies } from "next/headers";
import { backend, apiFailure, ApiError, sameOrigin } from "@/lib/terrala-api";
import { adminAuthorization } from "@/lib/admin-session";
export async function GET() {
  try { return Response.json(await backend("/v1/auth/me", { headers: await adminAuthorization() }), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiFailure(error); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 16000) throw new ApiError(413, "BODY_TOO_LARGE");
    const result = await backend<{ accessToken: string; expiresAt: string; user: { role: string } }>("/v1/auth/google", { method: "POST", body });
    if (result.user.role !== "admin") {
      await backend("/v1/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${result.accessToken}` } });
      throw new ApiError(403, "ADMIN_REQUIRED");
    }
    (await cookies()).set("terrala_admin", result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", expires: new Date(result.expiresAt) });
    return Response.json({ user: result.user }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiFailure(error); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try { await backend("/v1/auth/logout", { method: "POST", headers: await adminAuthorization() }); }
  catch { /* Remove the browser session even when the upstream is unavailable. */ }
  (await cookies()).delete("terrala_admin");
  return Response.json({ loggedOut: true });
}
