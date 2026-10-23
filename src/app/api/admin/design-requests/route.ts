import { backend, apiFailure } from "@/lib/terrala-api";
import { adminAuthorization } from "@/lib/admin-session";
export async function GET(request: Request) {
  try {
    const cursor = new URL(request.url).searchParams.get("cursor");
    return Response.json(await backend(`/v1/admin/design-requests?limit=24${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`, { headers: await adminAuthorization() }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiFailure(error); }
}
