import { cookies } from "next/headers";
import { backend, apiFailure, sameOrigin, ApiError } from "@/lib/terrala-api";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const token = (await cookies()).get("terrala_guest")?.value;
    if (!token) throw new ApiError(401, "GUEST_SESSION_REQUIRED");
    const text = await request.text();
    if (text.length > 16000) throw new ApiError(413, "BODY_TOO_LARGE");
    let input: unknown;
    try { input = JSON.parse(text); } catch { throw new ApiError(400, "INVALID_INPUT"); }
    const result = await backend("/v1/design-requests", { method: "POST", body: JSON.stringify(input), headers: {
      Authorization: `Bearer ${token}`, "Idempotency-Key": request.headers.get("idempotency-key") ?? "",
    } });
    return Response.json(result, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiFailure(error); }
}
