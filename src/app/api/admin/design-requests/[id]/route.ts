import { backend, apiFailure, sameOrigin, ApiError } from "@/lib/terrala-api";
import { adminAuthorization } from "@/lib/admin-session";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const { id } = await context.params;
    if (!/^[a-f0-9-]{36}$/i.test(id)) throw new ApiError(404, "NOT_FOUND");
    const body = await request.text();
    if (body.length>1000) throw new ApiError(413, "BODY_TOO_LARGE");
    return Response.json(await backend(`/v1/admin/design-requests/${id}`, { method: "PATCH", body, headers: { ...await adminAuthorization(), "If-Match": request.headers.get("if-match") ?? "" } }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiFailure(error); }
}
