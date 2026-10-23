import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { sameOrigin } from "@/lib/terrala-api";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  const jar = await cookies();
  if (!/^[a-f0-9]{64}$/.test(jar.get("terrala_guest")?.value ?? "")) jar.set("terrala_guest", randomBytes(32).toString("hex"), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 90,
  });
  return Response.json({ ready: true }, { headers: { "Cache-Control": "no-store" } });
}
