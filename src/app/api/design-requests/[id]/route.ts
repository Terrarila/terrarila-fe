import { cookies } from "next/headers";
import { backend, apiFailure, ApiError } from "@/lib/terrala-api";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError(404, "NOT_FOUND");
    const token = (await cookies()).get("terrala_guest")?.value;
    if (!token) throw new ApiError(404, "NOT_FOUND");
    return Response.json(await backend(`/v1/design-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiFailure(error); }
}
