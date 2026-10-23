import { backend, apiFailure, sameOrigin } from "@/lib/terrala-api";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try { return Response.json(await backend("/v1/auth/challenge", { method: "POST" }), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiFailure(error); }
}
